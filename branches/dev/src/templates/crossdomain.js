//{{ callback }}({% ifnotequal postNumber 0 %}{"postNumber":"{{ postNumber }}","pageNumber" : "{{ pageNumber }}","postsPerPage":"{{ postsPerPage }}","currentPage":"{{ currentPage }}","posts":[{% for post in posts %}{%if not forloop.first %},{% endif %}{"id":"{{ post.key.id }}","nick":decodeURI("{{ post.nick }}"),"nick2":decodeURI("{{ post.nick2 }}"),"date":new Date("{{ post.date|date:"Y/m/d H:i:s \G\M\T O"}}"),"value":{% if wall.allowHtml %} decodeURI("{{ post.value }}") {%else%} decodeURI("{{ post.value }}").replace(/\n/g,"<br>") {% endif %} }{% endfor %}]}{% endifnotequal %});
function {{mainObject}}InitwallTemp_{{requestId}}(){
	var wall = {{mainObject}}.getWall({{wall.key.id}});
	wall.setPostCount({{postCount}});
	wall.setPageCount({{pageCount}});
	wall.setCurrentPage({{currentPage}});
	wall.setPageSize({{postsPerPage}});

	wall.clearPosts();
{% for post in posts %}
	wall.addPost(
	{	"id":"{{ post.key.id }}",
	 	"nick":decodeURI("{{ post.nick }}"),
		"nick2":decodeURI("{{ post.nick2 }}"),
		"date":new Date("{{ post.date|date:"Y/m/d H:i:s \G\M\T O"}}"),
		"value":{% if wall.allowHtml %} decodeURI("{{ post.value }}") {%else%} decodeURI("{{ post.value }}").replace(/\n/g,"<br>") {% endif %} 
	});
{% endfor %}
	wall._completeGetPostRequest();
};
{{mainObject}}InitwallTemp_{{requestId}}();
delete {{mainObject}}InitwallTemp_{{requestId}};