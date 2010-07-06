import cgi
from google.appengine.api import users
import wsgiref.handlers
from google.appengine.ext import webapp
import os
from google.appengine.ext.webapp import template
from appdbmodel import *
##############isWallExist####################
class isWallExist(webapp.RequestHandler):    
    def isExist(self,email,wall_name):
        owner = users.User(email=email)
        #get users wall list
        wall_query = Wall.all()
        wall_query.filter('owner = ',owner)
        wall_query.filter('name =',wall_name)
        wall= wall_query.get()
        if wall:
            result='Y'
        else:
            result='N'
        return result
    def get(self):
        wall_name = cgi.escape(self.request.get('name'))
        owner_email = cgi.escape(self.request.get('owner'))
        error = None
        if not wall_name or not owner_email:
            result = 'N'
        else:
            result = self.isExist(owner_email,wall_name)
        self.response.out.write(result)  
################main##############################  
def main():
    application = webapp.WSGIApplication([('/tools/isWallExist', isWallExist)],
                                       debug=True)
    wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
    main()
