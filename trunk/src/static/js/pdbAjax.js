	/**
	 * Consturctor for Post Databse Connection object. This object used
	 * to retrive data from postdatabase server.
	 * @param {Int} wallid id of the wall connection object should retrive data
	 * for.
	 */
	function PDBAjaxConnection(wallid){
	    //this.domain = 'http://localhost';
	    //this.domain = 'http://localhost:8080';
	    this.domain = '';
	    //this.domain = 'http://postdatabase.appspot.com';
		
	    this.wallid = wallid;
//**********************************************
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

//****************************************
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
	    		    if (status == 200){
	    		    	if (request.responseText){
	    		    		eval(callback + "(eval('('+request.responseText+')'))");
	    		    	}else{
	    		    		eval(callback + "()");
	    		    	}
	    		    	request.onreadystatechange = function() {};
	    		    }
	    		}//main if
	    	}//function	
	    	//open connection
	    	request.open(type, url, true);
	    	if (type == 'POST') {
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
	    this.downloadURL=downloadURL;
//*********************************************************************	    
	    function getWallObject(callback,pagesize,pagenumber) {
	    	var url = '/post/get';
			var data= '';
	        if(pagesize){
	        	data +='pagesize=' + pagesize; 
			}
			if(pagenumber){
		        if (data != ''){
		        	data += '&';
		        }
				data +='pagenumber=' + pagenumber; 
			}
			if(pagenumber){
		        if (data != ''){
		        	data += '&';
		        }
				data +='id=' + this.wallid; 
			}

			downloadURL(url,'POST',callback,data)
	    }
		this.getWallObject = getWallObject;
//************************************************************		
		function deletePost(callback,postId){
			downloadURL('/post/delete','POST',callback,'id='+postId);
		}
		this.deletePost = deletePost;
//************************************************************		
		function movePost(callback,postId,targetOffset){
			downloadURL('/post/move','POST',callback,'id='+postId+'&targetoffset='+targetOffset);
		}
		this.movePost = movePost;
//*************************************************************		
		function post(callback,postValue,nick,nick2){
			var url = '/post/save'
			var data = 'id='+this.wallid;

			if(postValue){
				data += '&post=' + encodeURI(postValue); 
			}
			if(nick){
				data += '&nick=' + encodeURI(nick); 
			}
			if(nick2){
				data += '&nick2=' + encodeURI(nick2); 
			}
			downloadURL(url,'POST',callback,data);
		}
		this.post=post;
//***********************************************************8
	    function initWallObject(callbackObject,callbackFunction) {
	        var url = '/wall/init?id= '+ wallid + '&callbackobject=' + callbackObject + '&callbackfunction='+callbackFunction;
	        var data = 'id= '+ wallid + '&callbackobject=' + callbackObject + '&callbackfunction='+callbackFunction;
	        downloadURL(url,'POST',callbackObject + '.' + callbackFunction,data);
	    }
		this.initWallObject = initWallObject;

	}//PDBConnection