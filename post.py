import cgi
from google.appengine.api import users
import wsgiref.handlers
from google.appengine.ext import webapp
import os
from google.appengine.ext.webapp import template
from appdbmodel import *
from google.appengine.api import mail
class ValueError(Exception):
    None;
#----------------------------------------------------------
class PostHandler(webapp.RequestHandler):
    #handles cross domain requests
    def get(self):
        try:
            self.response.headers['Content-Type'] = 'text/javascript; charset=utf-8'
            # Get data from request
            wall_id_tx = cgi.escape(self.request.get('id'))
            post_value = self.request.get('post')
            nick = cgi.escape(self.request.get('nick'))
            nick2 = cgi.escape(self.request.get('nick2'))
            mainObject = cgi.escape(self.request.get('mainObject'))
            if wall_id_tx:
                wall_id = int(wall_id_tx)
                wall = Wall.get_by_id(wall_id)
            else:
                raise ValueError
            if not (wall and post_value):
                raise ValueError
            if not wall.allowEntry:
                raise ValueError
            post = Post(wall=wall,value=post_value,nick=nick,nick2=nick2)
            post.put()
            if wall.emailOnSubmit:
                message = mail.EmailMessage(sender='siteadminaccount@gmail.com ',
                                            subject='Post Database new post notification for wall "' + wall.name +'"')
                message.to = wall.owner.email()
                path = os.path.join(os.path.dirname(__file__),'templates','email.txt')
                message.body = template.render(path, {'post' : post})
                message.send()
            self.response.out.write(mainObject+'.getWall(' + wall_id_tx + ')._completeSubmitFormValues();')
        except ValueError:
            self.response.out.write(mainObject+'.getWall(' + wall_id_tx + ')._reportServerError("An Error is occured during saving your post")')
    
    def post(self):
        try:
            wall_id_tx = cgi.escape(self.request.get('id'))
            post_id_tx = cgi.escape(self.request.get('postid'))
            post_value = self.request.get('post')
            nick = cgi.escape(self.request.get('nick'))
            nick2 = cgi.escape(self.request.get('nick2'))

            if wall_id_tx:
                wall_id = int(wall_id_tx)
                wall = Wall.get_by_id(wall_id)
            else:
                raise ValueError
            if not (wall and post_value):
                raise ValueError
            if post_id_tx:
                post_id = int(post_id_tx)
                post = Post.get_by_id(post_id)
                post.value = post_value
                post.nick = nick
                post.nick2 = nick2
            else:
                post = Post(wall=wall,value=post_value,nick=nick,nick2=nick2)
            post.put()
            self.response.out.write('true')
        except ValueError:
            self.response.out.write('false')


#----------------------------------------------------------
class pdbRequestHandler(webapp.RequestHandler):
    postCount = 0
    page_size = 0
    page_number = 0
    def replaceChars(self,text):
        result = text
        result = result.replace('\\','\\\\')
        result = result.replace('\'','\\\'')
        result = result.replace('"','\\"')
        #result = result.replace('&amp;#','&#')
        return result 
    def getPosts(self,wall,page_number = 1,page_size = 20,lastSavedFirst = True):
        self.page_size = page_size
        self.page_number = page_number
        size = page_size
        skip = (page_number-1) * page_size
        
        post_query = Post.all()
        post_query.filter('wall =',wall)
        if lastSavedFirst:
            post_query.order('-order')
        else:
            post_query.order('order')
        self.postCount = post_query.count()
        posts = post_query.fetch(size,skip)
                    
        post_list = []
        for post in posts:
            post.nick = self.replaceChars(post.nick)
            post.nick2 = self.replaceChars(post.nick2)
            line_list = post.value.splitlines()
            result = ''
            for line in line_list:
                if wall.allowHtml:
                    line = self.replaceChars(line)
                else:
                    line = cgi.escape(self.replaceChars(line))

                if result == '':
                    result = line;
                else:
                    result = result + '\\n' + line
            post.value = result
            post_list.append(post)        
        return post_list

    def get(self):
            self.response.headers['Content-Type'] = 'text/javascript; charset=utf-8'
            
            wall_id_tx = cgi.escape(self.request.get('id'))
            page_size_tx = cgi.escape(self.request.get('pagesize'))
            page_number_tx = cgi.escape(self.request.get('pagenumber'))
            mainObject= cgi.escape(self.request.get('mainObject'))
            requestId= cgi.escape(self.request.get('request'))

            if wall_id_tx:
                wall_id = int(wall_id_tx)
                wall = Wall.get_by_id(wall_id)
            else:
                self.response.out.write('could not get wallid')
                raise ValueError
            if not wall.allowRead:
                self.response.out.write('wall is read only')
                return
            if not page_number_tx:
                page_number_tx = '1'
            if not page_size_tx:
                page_size_tx = '20'
            

            posts = self.getPosts(wall,int(page_number_tx),int(page_size_tx),wall.lastSavedFirst)
                        
            pageCount = self.postCount / self.page_size
            if self.postCount % self.page_size:
                pageCount +=1
            #if there is no pages which means there is no posts
            #total page number =1 
            if not pageCount:
                pageCount = 1
        
            #create template values send them to view model.
            template_values = {'posts' : posts,
                               'wall'  : wall,
                               'mainObject':mainObject,
                               'requestId':requestId,
                               'postCount': self.postCount,
                               'pageCount': pageCount,
                               'postsPerPage': self.page_size,
                               'currentPage':self.page_number}
            path = os.path.join(os.path.dirname(__file__),'templates','crossdomain.js')
            self.response.out.write(template.render(path, template_values))

    def post(self):
        
            self.response.headers['Content-Type'] = 'text/javascript; charset=utf-8'
            wall_id_tx = self.request.get('id')
            page_size_tx = cgi.escape(self.request.get('pagesize'))
            page_number_tx = cgi.escape(self.request.get('pagenumber'))

            if wall_id_tx:
                wall_id = int(wall_id_tx)
                wall = Wall.get_by_id(wall_id)
            else:
                raise ValueError
            posts = self.getPosts(wall,int(page_number_tx),int(page_size_tx),wall.lastSavedFirst)
                        
            all_page_number = self.postCount / self.page_size
            if self.postCount % self.page_size:
                all_page_number +=1
            #if there is no pages which means there is no posts
            #total page number =1 
            if not all_page_number:
                all_page_number = 1
        
            #create template values send them to view model.
            template_values = {'posts' : posts,
                               'wall'  : wall,
                               'postNumber': self.postCount,
                               'pageNumber': all_page_number,
                               'postsPerPage': self.page_size,
                               'currentPage':self.page_number}
            path = os.path.join(os.path.dirname(__file__),'templates','json.js')           
            self.response.out.write(template.render(path, template_values))

class DeletePostHandler(webapp.RequestHandler):
    def post(self):
        try:
            post_id=int(cgi.escape(self.request.get('id')))
            post = Post.get_by_id(post_id)
            post.delete()
            self.response.out.write('true')
        except Exception:
            self.response.out.write('false')
            return
    def get(self):
        try:
            self.response.headers['Content-Type'] = 'text/javascript'
            callback = cgi.escape(self.request.get('callback'))
            post_id=int(cgi.escape(self.request.get('id')))
            post = Post.get_by_id(post_id)
            post.delete()
            self.response.out.write(callback + '(true);')
        except Exception:
            self.response.out.write(callback + '(false);')
            return

class MovePostHandler(webapp.RequestHandler):
    def post(self):
        try:
            postId=int(self.request.get('id'))
            targetOffset=int(self.request.get('targetoffset'))
            if targetOffset<1:
                raise Exception;
            post = Post.get_by_id(postId)
            wall = post.wall
            qry = Post.all()
            qry.filter('wall =',wall)
            if wall.lastSavedFirst:
                qry.order('-order')
            else:
                qry.order('order')        
            target=qry.fetch(1,targetOffset-1)[0]
            temp = target.order
            target.order = post.order
            post.order = temp
            post.put()
            target.put()
            self.response.out.write('true')
        except Exception:
            self.response.out.write('false')
            return


#----------------------------------------------------------
def main():
    application = webapp.WSGIApplication([('/post/save', PostHandler), 
                                          ('/post/delete',DeletePostHandler),
                                          ('/post/get',pdbRequestHandler),
                                          ('/post/move',MovePostHandler)],
                                          debug=True)
    wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
    main()
