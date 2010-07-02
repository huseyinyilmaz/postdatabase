import cgi
from google.appengine.api import users
import wsgiref.handlers
from google.appengine.ext import webapp
import os
from google.appengine.ext.webapp import template
from appdbmodel import *

class InitWallHandler(webapp.RequestHandler):
    def replaceChars(self,text):
        result = text
        result = result.replace('\\','\\\\')
        result = result.replace('\'','\\\'')
        return result 
    #handles cross domain initilizations
    def get(self):
        try:
            wallId_tx = cgi.escape(self.request.get('id'))
            mainObject= cgi.escape(self.request.get('mainObject'))
            requestId= cgi.escape(self.request.get('request'))
            #callbackFunction = cgi.escape(self.request.get('callbackfunction'))
            if wallId_tx:
                wallId = int(wallId_tx)
            else:
                raise Exception

            wall = Wall.get_by_id(wallId)
            if not wall and not mainObject and not requestId:
                raise Exception
            
            templateValues = {'wall'  : wall,
                              'mainObject':mainObject,
                              'requestId':requestId}
            path = os.path.join(os.path.dirname(__file__),'templates','initWall.js')
            self.response.headers['Content-Type'] = 'text/javascript'
            self.response.out.write(template.render(path, templateValues))
        except Exception:
            #TODO: implement a fail strateg
            self.response.out.write(mainObject+'._reportServerError("Wall initilization error");')
    #handles ajax initilizations
    def post(self):
        try:
            wallId_tx = cgi.escape(self.request.get('id'))
            callbackObject= cgi.escape(self.request.get('callbackobject'))
            callbackFunction = cgi.escape(self.request.get('callbackfunction'))
            if wallId_tx:
                wallId = int(wallId_tx)
            else:
                raise Exception

            wall = Wall.get_by_id(wallId)

            if not wall and not callbackObject and not callbackFunction:
                raise Exception
            
            templateValues = {'wall'  : wall,
                               'callbackObject':callbackObject,
                               'callbackFunction':callbackFunction}
            path = os.path.join(os.path.dirname(__file__),'templates','initWallJson.js')
            self.response.headers['Content-Type'] = 'text/javascript'
            self.response.out.write(template.render(path, templateValues))
 
        except Exception:
            self.response.out.write(callbackObject+'.'+callbackFunction + '(None)')

class CreateWallHandler(webapp.RequestHandler):
    def get(self):
        user = users.get_current_user()
        #get this users wall list
        wallsQuery = Wall.all()
        wallsQuery.filter('owner = ',user)
        wallsQuery.order('name')
        walls= wallsQuery.fetch(1000)
      
        templateValues = {'walls'  :walls,
                           'actionUrl':'/wall/create'}
        path = os.path.join(os.path.dirname(__file__),'templates','create_wall.html')
        self.response.out.write(template.render(path, templateValues))
    def post(self):
        #get required data
        user = users.get_current_user()
        wallName=self.request.get('wallName')
        postsPerPage_tx =self.request.get('pageSize')
        allowEntry =self.request.get('allowEntry')
        allowRead =self.request.get('allowRead')
        allowHtml =self.request.get('allowHtml')
        wallStyle = int(self.request.get('wallStyle'))
        postStyle = int(self.request.get('postStyle'))
        dateStyle = int(self.request.get('dateStyle'))
        nickLabel=self.request.get('nickLabel')
        nick2Label=self.request.get('nick2Label')
        postAreaLabel=self.request.get('postAreaLabel')
        postButtonLabel=self.request.get('postButtonLabel')
        resetButtonLabel=self.request.get('resetButtonLabel')
        lastSavedFirst=self.request.get('lastSavedFirst')
        formHeight_tx=self.request.get('formHeight')
        formWidth_tx=self.request.get('formWidth')
        emailOnSubmit=self.request.get('emailOnSubmit')
        #check if form height/width is number
        if formHeight_tx:
            formHeight = int(formHeight_tx)
        else:
            self.redirect('/settings?error=form height must be a number.Wall was not created.')
            return
        if formWidth_tx:
            formWidth = int(formWidth_tx)
        else:
            self.redirect('/settings?error=form width must be a number.Wall was not created.')
            return
        
        #check if same name is exist in database
        if postsPerPage_tx:
            postsPerPage = int(postsPerPage_tx)
        else:
            self.redirect('/settings?error=posts per page is not defined.Wall was not created.')
            return
        if not wallName.isalnum():
            self.redirect('/settings?error=Wall name has to contain only letters and numbers and can not be empty string')
            return
        same_query = Wall.all()
        same_query.filter('owner =',user)
        same_query.filter('name =',wallName)
        same_named_wall = same_query.get()
        if same_named_wall :
            self.redirect('/settings?error=Wall name '+ wallName + ' is already exist. Wall was not created')
        else:
            #create a new wall entry
            wall = Wall(name = wallName,
                        owner=user,
                        pageSize=postsPerPage,
                        allowEntry=allowEntry == 'True',
                        allowRead = allowRead == 'True',
                        allowHtml = allowHtml =='True',
                        wallStyle=wallStyle,
                        postStyle=postStyle,
                        dateStyle=dateStyle,
                        nickLabel=nickLabel,
                        nick2Label=nick2Label,
                        postAreaLabel=postAreaLabel,
                        postButtonLabel=postButtonLabel,
                        resetButtonLabel=resetButtonLabel,
                        lastSavedFirst=lastSavedFirst =='True',
                        formWidth=formWidth,
                        formHeight=formHeight,
                        infoBackgroundColor='Yellow',
                        infoForegroundColor='Red',
                        emailOnSubmit = emailOnSubmit=='True'
                        )
            wall.put()
            self.redirect('/settings');

class EditWallHandler(webapp.RequestHandler):
    def get(self):
        user = users.get_current_user()
        wall_id=int(cgi.escape(self.request.get('id')))
        #create template values send them to view model.
        wall = Wall.get_by_id(wall_id)
        """ 
        walls_query = Wall.all()
        walls_query.filter('owner = ',user)
        walls_query.filter('name != ',wall.name)
        walls_query.order('name')
        walls= walls_query.fetch(1000)
        """
        postQuery = Post.all()
        postQuery.filter('wall =',wall)
        postCount = postQuery.count()
        templateValues = {'wall' : wall,
                          'postCount' : postCount,
                          'url':'/wall/edit'}
        path = os.path.join(os.path.dirname(__file__),'templates','wall.html')
        self.response.out.write(template.render(path, templateValues))
    def post(self):
        wallName=self.request.get('wallName')
        pageSize=int(self.request.get('pageSize'))
        wall_id=int(self.request.get('id'))
        allowEntry =self.request.get('allowEntry')
        allowRead =self.request.get('allowRead')
        allowHtml =self.request.get('allowHtml')
        wallStyle = int(self.request.get('wallStyle'))
        postStyle = int(self.request.get('postStyle'))
        dateStyle = int(self.request.get('dateStyle'))
        nickLabel=self.request.get('nickLabel')
        nick2Label=self.request.get('nick2Label')
        postAreaLabel=self.request.get('postAreaLabel')
        postButtonLabel=self.request.get('postButtonLabel')
        resetButtonLabel=self.request.get('resetButtonLabel')
        lastSavedFirst=self.request.get('lastSavedFirst')
        formWidth = int(self.request.get('formWidth'))
        formHeight = int(self.request.get('formHeight'))
        emailOnSubmit=self.request.get('emailOnSubmit')
        wall = Wall.get_by_id(wall_id)
        wall.name = wallName
        wall.pageSize = pageSize
        wall.allowEntry = allowEntry =='True'
        wall.allowRead = allowRead =='True'
        wall.allowHtml = allowHtml =='True'
        wall.wallStyle = wallStyle
        wall.postStyle = postStyle
        wall.dateStyle = dateStyle
        wall.nickLabel = nickLabel
        wall.nick2Label = nick2Label
        wall.postAreaLabel = postAreaLabel
        wall.postButtonLabel = postButtonLabel
        wall.resetButtonLabel = resetButtonLabel
        wall.lastSavedFirst = lastSavedFirst =='True'
        wall.formWidth = formWidth
        wall.formHeight = formHeight
        wall.emailOnSubmit = emailOnSubmit =='True'
        wall.put()
        self.redirect('/settings')

class DeleteWallHandler(webapp.RequestHandler):
    def get(self):
        wall_id=int(cgi.escape(self.request.get('id')))
        wall = Wall.get_by_id(wall_id)
        wall.delete()
        self.redirect('/settings');

class ClearWallHandler(webapp.RequestHandler):
    def get(self):
        wall_id=int(cgi.escape(self.request.get('id')))
        wall = Wall.get_by_id(wall_id)
        while True:
            post_query = Post.all()
            post_query.filter('wall =',wall)
            posts = post_query.fetch(1000)
            if len(posts) == 0:
                break;
            else:
                db.delete(posts);
        self.redirect('/settings');

def main():
    application = webapp.WSGIApplication([('/wall/init', InitWallHandler),
                                          ('/wall/create', CreateWallHandler),
                                          ('/wall/edit', EditWallHandler),
                                          ('/wall/delete', DeleteWallHandler),
                                          ('/wall/clear', ClearWallHandler)],
                                       debug=True)
    wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
    main()