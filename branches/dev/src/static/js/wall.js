$(function(){
	logger.startLog("$()");

	logger.log("Initialize objects");
	$("#mainTabs").tabs();
	$("#submitButton").button();
	$("#cancelButton").button();
	$("#postCount").html(postCount);

	logger.log("Set values");
	$("#name").val(wall.name);
	$("#pageSize").val(wall.pageSize);
	$("#allowEntry").attr('checked',wall.allowEntry);
	$("#allowRead").attr('checked',wall.allowRead);
	$("#allowHtml").attr('checked',wall.allowHtml);
	$("#emailOnSubmit").attr('checked',wall.emailOnSubmit);
	$("#lastSavedFirst").attr('checked',wall.lastSavedFirst);
	logger.endLog();
});