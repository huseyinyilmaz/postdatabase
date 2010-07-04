var controller = function(){
	//contructs data string object from page
	function getDataString(){
		logger.startLog("getDataString");
		var dataString = '';
		//Adding general tab attributes to data string
		dataString+="id="+wall.id;
		dataString+="&name="+encodeURI($("#name").val());
		dataString+="&pageSize="+$("#pageSize").val();
		dataString+="&allowEntry="+$("#allowEntry").attr("checked");
		dataString+="&allowRead="+$("#allowRead").attr("checked");
		dataString+="&allowHtml="+$("#allowHtml").attr("checked");
		dataString+="&emailOnSubmit="+$("#emailOnSubmit").attr("checked");
		dataString+="&lastSavedFirst="+$("#lastSavedFirst").attr("checked");
		
		//Adding general style tab attributes to data string
		dataString+="&wallStyle="+$("input[name=wallStyle]:checked").val();
		
		//Adding form attributes tab to data string
		dataString+="&nickLabel="+encodeURI($("#nickLabel").val());
		dataString+="&nick2Label="+encodeURI($("#nick2Label").val());
		dataString+="&postAreaLabel="+encodeURI($("#postAreaLabel").val());
		dataString+="&postButtonLabel="+encodeURI($("#postButtonLabel").val());
		dataString+="&resetButtonLabel="+encodeURI(encodeURI($("#resetButtonLabel").val()));
		dataString+="&formHeight="+$("#formHeight").val();
		dataString+="&formWidth="+$("#formWidth").val();
		
		//Addint post style tab to data string
		dataString+="&postStyle="+$("input[name=postStyle]:checked").val();
	
		//Addint date style tab to data string
		dataString+="&dateStyle="+$("input[name=dateStyle]:checked").val();
		
		
		logger.log("Data String =[" + dataString + "]");
		logger.endLog();
		
		return dataString;
	};//getDataString()
	function setpageValues(){
		logger.startLog("setPageValues");

		logger.log("Set general tab values");
		$("#name").val(wall.name);
		$("#pageSize").val(wall.pageSize);
		$("#allowEntry").attr("checked",wall.allowEntry);
		$("#allowRead").attr("checked",wall.allowRead);
		$("#allowHtml").attr("checked",wall.allowHtml);
		$("#emailOnSubmit").attr("checked",wall.emailOnSubmit);
		$("#lastSavedFirst").attr("checked",wall.lastSavedFirst);
	
		logger.log("Set general style tab values");
		$("input[name=wallStyle]:eq("+ (wall.wallStyle-1) +")").attr("checked",true);
	
		logger.log("Set form attributes tab values");
		$("#nickLabel").val(wall.nickLabel);
		$("#nick2Label").val(wall.nick2Label);
		$("#postAreaLabel").val(wall.postAreaLabel);
		$("#postButtonLabel").val(wall.postButtonLabel);
		$("#resetButtonLabel").val(wall.resetButtonLabel);
		$("#formHeight").val(wall.formHeight);
		$("#formWidth").val(wall.formWidth);
	
		logger.log("Set post style tab values");
		$("input[name=postStyle]:eq("+ (wall.postStyle-1) +")").attr("checked",true);
	
		logger.log("Set date style tab values");
		$("input[name=dateStyle]:eq("+ (wall.dateStyle-1) +")").attr("checked",true);
	
		logger.endLog();
		
	};//setPageValues
	//controller object
	var controller = {};
	return controller;
}();//controller creator function
$(function(){
	logger.startLog("$()");

	logger.log("Initialize objects");
	$("#mainTabs").tabs();
	$("#cancelButton").button();
	$("#postCount").html(postCount);


	logger.log("set submit button action");
	$("#submitButton").button().click(function(){
		logger.startLog("submitButton.onClick");
		getDataString();

		$.ajax({
   				type: "POST",
   				datetype: "script",
				url: "{{url}}",
   				data: getDataString(),
   				
				success: function(msg){
     						alert( "Data Saved: " + msg );
   						}
 		});

		logger.endLog();
	});
	
	logger.endLog();
});