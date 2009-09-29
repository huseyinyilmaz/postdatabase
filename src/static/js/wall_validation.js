//check if the given word can be used as wall name
function validateword(word,validator){
	for (i = 0 ; i < word.length ; i++){
 		hh = word.charCodeAt(i);
 		if(!((hh > 47 && hh<58) || (hh > 64 && hh<91) || (hh > 96 && hh<123))){
 			return false;
 		}//if
 	}//for
 	return true;
}//validateword

//check if the given string is number
function validateNumber(number,validator){
	if(parseFloat(number)){
		return true;
	}else{
		return false;
	}
}//validateNumber	

//validates wallname.
function wallFormOnSubmit(wallForm,validator){
	var result = true;
	var wallNameAlert = "<ul>";
	var pageSizeAlert = "<ul>";
	var formWidthAlert = "<ul>";
	var formHeightAlert = "<ul>";
	
	//wallname validation
	if (wallForm.wallName.value === ""){
		wallNameAlert += "<li>Wall Name cannot be null</li>";
		result = false;
	}
	else if(!validateword(wallForm.wallName.value)){
		wallNameAlert += "<li>Wall Name has to be an alfanumeric value</li>";
		result = false;
	}
	else if(!validator.isUnique(wallForm.wallName.value)){
		wallNameAlert += "<li>Wall Name has to be unique</li>";
		result = false;
	}
	//page size
	if (!wallForm.pageSize.value){
		pageSizeAlert += "<li>Page Size cannot be null</li>";
		result = false;
	}
	else if (!validateNumber(wallForm.pageSize.value)){
		pageSizeAlert += "<li>Page Size has to be a number</li>";
		result = false;
	}


	//form width
	if (!wallForm.formWidth.value){
		formWidthAlert += "<li>Form Width cannot be null</li>";
		result = false;
	}
	else if (!validateNumber(wallForm.formWidth.value)){
		formWidthAlert += "<li>Form Width has to be a number</li>";
		result = false;
	}
	//form height
	if (!wallForm.formHeight.value){
		formWidthAlert += "<li>Form Height cannot be null</li>";
		result = false;
	}
	else if (!validateNumber(wallForm.formHeight.value)){
		formHeightAlert += "<li>Form Height has to be a number</li>";
		result = false;
	}

	
	wallNameAlert += "</ul>";
	pageSizeAlert += "</ul>";
	formWidthAlert += "</ul>";
	formHeightAlert += "</ul>";

	
	document.getElementById("wallNameAlert").innerHTML = wallNameAlert;
	document.getElementById("pageSizeAlert").innerHTML = pageSizeAlert;
	document.getElementById("formWidthAlert").innerHTML = formWidthAlert;
	document.getElementById("formHeightAlert").innerHTML = formHeightAlert;
	return result;
}	

function cancelChanges( address ){
	window.location = address;
}