(function(){
	var wall = {{mainObject}}.getWall({{wall.key.id}});
	wall.setPageSize({{wall.pageSize}});
	wall.setNickLabel("{{wall.nickLabel}}");
	wall.setNick2Label("{{wall.nick2Label}}");
	wall.setPostAreaLabel("{{wall.postAreaLabel}}");
	wall.setPostButtonLabel("{{wall.postButtonLabel}}");
	wall.setResetButtonLabel("{{wall.resetButtonLabel}}");
	wall.setFormWidth({{wall.formWidth}});
	wall.setFormHeight({{wall.formHeight}});
	wall.setWallStyle({{wall.wallStyle}});
	wall.setPostStyle({{wall.postStyle}});
	wall.postStyle
	wall._completeInitilization();
})();
