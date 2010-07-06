import logging
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
        self.response.headers['Content-Type'] = 'text/javascript'
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
            self.response.out.write(template.render(path, templateValues))
        except Exception:
            self.response.out.write(callbackObject+'.'+callbackFunction + '(None)')

class CreateWallHandler(webapp.RequestHandler):
    def get(self):
        logging.info('CreateWallHandler.post')
        templateValues = {'url':'/wall/create'}
        path = os.path.join(os.path.dirname(__file__),'templates','wall.html')
        self.response.out.write(template.render(path, templateValues))
    def post(self):
        self.response.headers['Content-Type'] = 'text/javascript'
        try:
            logging.info('CreateWallHandler.get')
            #get required data
            user = users.get_current_user()
            wallName=self.request.get('name')
            pageSize=int(self.request.get('pageSize'))
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
            if not wallName.isalnum():
                raise Exception('Wall name has to contain only letters and numbers and can not be empty string')
            same_query = Wall.all()
            same_query.filter('owner =',user)
            same_query.filter('name =',wallName)
            same_named_wall = same_query.get()
            if same_named_wall :
                raise Exception('Wall name '+ wallName + ' is already exist. Wall was not created')
            else:
                #create a new wall entry
                wall = Wall(name = wallName,
                            owner=user,
                            pageSize=pageSize,
                            allowEntry=allowEntry == 'true',
                            allowRead = allowRead == 'true',
                            allowHtml = allowHtml =='true',
                            wallStyle=wallStyle,
                            postStyle=postStyle,
                            dateStyle=dateStyle,
                            nickLabel=nickLabel,
                            nick2Label=nick2Label,
                            postAreaLabel=postAreaLabel,
                            postButtonLabel=postButtonLabel,
                            resetButtonLabel=resetButtonLabel,
                            lastSavedFirst=lastSavedFirst =='true',
                            formWidth=formWidth,
                            formHeight=formHeight,
                            infoBackgroundColor='Yellow',
                            infoForegroundColor='Red',
                            emailOnSubmit = emailOnSubmit=='true'
                            )
                wall.put()
                self.response.out.write('controller.requestOK();')        
        except Exception as e:
            self.response.out.write('controller.requestError("'+ e.__str__() +'");')        
                

class EditWallHandler(webapp.RequestHandler):
    def get(self):
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
        logging.info('EditWallHandler.post')
        wallName=self.request.get('name')
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
        wall.allowEntry = allowEntry =='true'
        wall.allowRead = allowRead =='true'
        wall.allowHtml = allowHtml =='true'
        wall.wallStyle = wallStyle
        wall.postStyle = postStyle
        wall.dateStyle = dateStyle
        wall.nickLabel = nickLabel
        wall.nick2Label = nick2Label
        wall.postAreaLabel = postAreaLabel
        wall.postButtonLabel = postButtonLabel
        wall.resetButtonLabel = resetButtonLabel
        wall.lastSavedFirst = lastSavedFirst =='true'
        wall.formWidth = formWidth
        wall.formHeight = formHeight
        wall.emailOnSubmit = emailOnSubmit =='true'
        wall.put()
        logging.info('Wall saved successfully')
        #self.redirect('/settings')
        self.response.headers['Content-Type'] = 'text/javascript'
        self.response.out.write('controller.requestOK();')        

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