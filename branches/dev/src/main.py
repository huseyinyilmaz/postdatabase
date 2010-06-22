import os
from google.appengine.api import users
from google.appengine.ext.webapp import template
import wsgiref.handlers
from google.appengine.ext import webapp
#main handler for main page
class MainHandler(webapp.RequestHandler):
	def get(self):
		user = users.get_current_user()
		if user:
			login_url = users.create_logout_url(self.request.uri)
			login_link = 'logout'
			user_email = user.email()
		else:
			login_url = users.create_login_url(self.request.uri)
			login_link = 'login'
			user_email = None
		path = os.path.join(os.path.dirname(__file__),'templates','main.html')
		self.response.out.write(template.render(path,{'login_url':login_url,'login_link':login_link,'user_email':user_email}))
#handler for googlehostedservice
class GoogleHandler(webapp.RequestHandler):

	def get(self):
		self.response.out.write('googleffffffffb7d3e2c6')


def main():
	application = webapp.WSGIApplication([('/', MainHandler),('/googlehostedservice.html',GoogleHandler)],debug=True)
	wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
	main()
