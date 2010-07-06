import cgi
from google.appengine.api import users
import wsgiref.handlers
from google.appengine.ext import webapp
import os
from google.appengine.ext.webapp import template
from appdbmodel import *

class MainHandler(webapp.RequestHandler):
    def get(self):
        user = users.get_current_user()
        #get user info and get email+logout url
        user_email = user.email()
        logout_url = users.create_logout_url('')
        #get this users wall list
        walls_query = Wall.all()
        walls_query.order('owner')
        walls= walls_query.fetch(1000)
        #create template values send them to view model.
        template_values = {'user_email' : user_email,
                           'logout_url' : logout_url,
                           'walls'      : walls}
        path = os.path.join(os.path.dirname(__file__),'templates','admin_main.html')
        self.response.out.write(template.render(path, template_values))

        
def main():
  application = webapp.WSGIApplication([('/admin', MainHandler)],debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
