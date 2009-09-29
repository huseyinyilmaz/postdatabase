/**
* Returns an XMLHttp instance to use for asynchronous
* downloading. This method will never throw an exception, but will
* return NULL if the browser does not support XmlHttp for any reason.
* @return {XMLHttpRequest|Null}
*/
function createXmlHttpRequest(){
	var xmlHttp;
	try
	  {
	  // Firefox, Opera 8.0+, Safari
	  xmlHttp=new XMLHttpRequest();
	  }
	catch (e)
	  {
	  // Internet Explorer
	  try
	    {
	    xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	    }
	  catch (e)
	    {
	    try
	      {
	      xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
	      }
	    catch (e)
	      {
	      return null;
	      }
	    }
	  }
	return xmlHttp;
}
var ajaxObject = null;

/**
* This functions wraps XMLHttpRequest open/send function.
* It lets you specify a URL and will call the callback if
* it gets a status code of 200.
* @param {String} url The URL to retrieve
* @param {Function} callback The function to call once retrieved.
*/
function downloadURL(url,type,callback,data){
	var status = -1;
	
	//create XMLHttpRequest Object
	var request = createXmlHttpRequest();
	if (!request) {
		return false;
	}//if
	
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			try {
				status = request.status;
		    } catch (e) {
		    	// Usually indicates request timed out in FF.
		    }//catch
		    if (status == 200) {
		    	callback(request.responseText);
		    	request.onreadystatechange = function() {};
		    }
		}//main if
	}//function	
	
	//open connection
	request.open(type, url, true);
	if (type == "POST") {
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.setRequestHeader("Content-length", data.length);
		request.setRequestHeader("Connection", "close"); 
	}//if
	
	 try {
		   request.send(data);
	 } catch (e) {
		 return false;
	 }//try
}//downloadURL