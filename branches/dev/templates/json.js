{% ifnotequal postNumber 0 %}{
	"postNumber":"{{ postNumber }}",
	"pageNumber" : "{{ pageNumber }}",
	"postsPerPage":"{{ postsPerPage }}",
	"currentPage":"{{ currentPage }}",
	"posts":[{% for post in posts %}{%if not forloop.first %},{% endif %}
	         {"id":"{{ post.key.id }}","nick":decodeURI("{{ post.nick }}"),"nick2":decodeURI("{{ post.nick2 }}"),"date":new Date("{{ post.date|date:"Y/m/d H:i:s \G\M\T O"}}"),"value":decodeURI("{{ post.value }}")}{% endfor %}
	        ]
}{% endifnotequal %}