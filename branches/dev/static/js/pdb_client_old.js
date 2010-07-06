	/**
	 * Consturctor for Post Databse Connection object. This object used
	 * to retrive data from postdatabase server.
	 * @param {Int} wallid id of the wall connection object should retrive data
	 * for.
	 */
	function PDBConnection(wallid){
	    this.domain = 'http://localhost:9999';
	    //this.domain = 'http://postdatabase.appspot.com';
	    this.wallid = wallid;

	    function getWallObject(callback,pagesize,pagenumber) {
	        var url = this.domain + '/post/get?type=client&id='+ wallid + '&callback=' + callback;
			if(pagesize){
				url +='&pagesize=' + pagesize; 
			}
			if(pagenumber){
				url +='&pagenumber=' + pagenumber; 
			}
			var script_id = null;
	        var script = document.createElement('script');
	        script.setAttribute('type', 'text/javascript');
	        script.setAttribute('src', url);
	        script.setAttribute('id', 'pdbBuffer');
	        script_id = document.getElementById('pdbBuffer');
	        if(script_id){
	            document.getElementsByTagName('head')[0].removeChild(script_id);
	        }
	        //Insert <script> into DOM
	        document.getElementsByTagName('head')[0].appendChild(script);
	    }
		this.getWallObject = getWallObject;

	    function initWallObject(callbackObject,callbackFunction) {
	        var url = this.domain + '/wall/init?id= '+ wallid + '&callbackobject=' + callbackObject + '&callbackfunction='+callbackFunction;
	        var script_id = null;
	        var script = document.createElement('script');
	        script.setAttribute('type', 'text/javascript');
	        script.setAttribute('src', url);
	        script.setAttribute('id', 'pdbBuffer');
	        script_id = document.getElementById('pdbBuffer');
	        if(script_id){
	            document.getElementsByTagName('head')[0].removeChild(script_id);
	        }
	        //Insert <script> into DOM
	        document.getElementsByTagName('head')[0].appendChild(script);
	    }
		this.initWallObject = initWallObject;
		
		function post(callback,postValue,nick,nick2){
			var url = this.domain + '/post/save?type=client&id=' + this.wallid
			if(callback){
				url += '&callback=' + callback; 
			}
			if(postValue){
				url += '&post=' + encodeURI(postValue); 
			}
			if(nick){
				url += '&nick=' + encodeURI(nick); 
			}
			if(nick2){
				url += '&nick2=' + encodeURI(nick2); 
			}
			var script_id = null;
	        var script = document.createElement('script');
	        script.setAttribute('type', 'text/javascript');
	        script.setAttribute('src', url);
	        script.setAttribute('id', 'pdbPostBuffer');
	        script_id = document.getElementById('pdbPostBuffer');
	        if(script_id){
	            document.getElementsByTagName('head')[0].removeChild(script_id);
	        }
	        // Insert <script> into DOM
	        document.getElementsByTagName('head')[0].appendChild(script);
		}
		this.post=post;
	}//PDBConnection

	/**
	 * Constructor for Post Database wizard object.
	 * This object used to print postlist and form
	 * @param {PDBConnection} pDBConnection Object 
	 * that this object should retrive data from 
	 * @param {String} variableName Name of the variable
	 * that holds the PDBWizard object. We use that variable name
	 * to find our object after response comes back from server.
	 * @see PDBConnection
	 */
	function PDBWizard( pDBConnection , variableName,pdbDiv){
		this.pDBConnection = pDBConnection;
		this.variableName = variableName;
		this.pageNumber = 1;
		this.pageSize = 20;
		this.pdbDiv = pdbDiv;
		function runInit(){
			this.formDiv = this.pdbTopDiv;
			this.postDiv = this.pdbBottomDiv;
			this.printForm.call(this);
			this.printPosts.call(this);
		}
		this.runInit = runInit
		
		function initWallCallback(initObject){
			initObject.initFunction.call(initObject.caller);
			this.runInit.call(initObject.caller);
		}
		this.initWallCallback = initWallCallback;
		
		function initWall(){
			//Create Divs on the page
			if(!this.pdbTopDivId){ 
				this.pdbTopDivId = 'pdbTopDiv'+this.pDBConnection.wallid;
				this.pdbTopDiv = document.createElement('div');
				this.pdbTopDiv.setAttribute('id',this.pdbTopDivId);
				this.pdbDiv.appendChild(this.pdbTopDiv);
			}//if
			if(!this.pdbBottomDivId){ 
				this.pdbBottomDivId = 'pdbBottomDiv'+this.pDBConnection.wallid;
				this.pdbBottomDiv = document.createElement('div');
				this.pdbBottomDiv.setAttribute('id',this.pdbBottomDivId);
				this.pdbDiv.appendChild(this.pdbBottomDiv);
			}//if
			
			pDBConnection.initWallObject(this.variableName , 'initWallCallback');
		}
		this.initWall = initWall;

		function getDateString(date){
			return '['+date.toLocaleDateString()+' - ' +date.toLocaleTimeString()+']';
		}
		this.getDateString = getDateString;
		function getPostString(id,nick,nick2,date,value,order){
			var txt ='<tr><th> '+ nick +' </th><th> '+ nick2 +' </th><td style="font-size: 70%">' + this.getDateString(date) +'</td></tr>';
			txt += '<br><tr><td colspan="3">'+ value +'</td></tr><tr><td colspan="3"><hr></td></tr>';
			return txt;
		}
		this.getPostString = getPostString;
		
		function getPageList(wall){
			if (wall.pageNumber == 1){
				return '';
			}
			var startPage = wall.currentPage - 5;
			if (startPage<1){
				startPage=1;
			}else if(startPage+9>wall.pageNumber){
				startPage = wall.pageNumber - 9;
				if(startPage<1){
					startPage=1;
				}
			}
			var pageList = '';
			for(var i = startPage;i<startPage+10 && i<=wall.pageNumber;i++){
				if (wall.currentPage != i){
					pageList = pageList + '<a href="javascript:' +variableName + '.printPosts('+i +','+wall.postsPerPage +');"> '+ i +' </a>';
				}else{
					pageList = pageList + i;
				}
			}
			return pageList;
		}
		this.getPageList = getPageList;
		
		function getPrePostString(wall){
			return '<table><tr><td>' + getPageList(wall) + '</td><tr>';
		}
		this.getPrePostString = getPrePostString;
		
		function getPostPostString(wall){
			return '<tr><td>' + getPageList(wall) + '</td><tr></table>';
		}
		this.getPostPostString = getPostPostString;
		
		function printPostsCallback(wall){
			var txt = '';
			if(wall){
			this.wall = wall;
			this.wall.getbyid=function(id){
				for (i = 0 ; i<postArray.length ; i++){
					if(postArray[i].id==id){return postArray[i]};
				};//for
			}
			var postArray = wall.posts;
				txt += this.getPrePostString(wall);
				for (i = 0 ; i<postArray.length ; i++){
					txt += this.getPostString(postArray[i].id,replaceBacksc(postArray[i].nick),replaceBacksc(postArray[i].nick2),postArray[i].date,replaceBacksc(postArray[i].value),i);
				};//for
				txt +=this.getPostPostString(wall);
				//txt = txt.replace(/\n/g,"<br>");
			}//end if
			this.postDiv.innerHTML = txt;
		}//printPostListCallback
		this.printPostsCallback = printPostsCallback;


		function printPosts(pageNumber,pageSize){
			if(pageNumber == undefined){
				var pageNumber = this.pageNumber;
			}else{
				this.pageNumber = pageNumber;
			}
			if(pageSize == undefined){
				var pageSize = this.pageSize;
			}else{
				this.pageSize = pageSize;
			}
			this.postDiv.innerHTML = 'Loading...';
			pDBConnection.getWallObject(variableName + '.printPostsCallback',pageSize,pageNumber);
		}//printPostList
		this.printPosts = printPosts;
		
		function printForm(){
			//set postButtonLbl
			var postButtonLbl = 'Post';
			if (this.postButtonLabel){
				postButtonLbl = this.postButtonLabel;
			}
			var resetButtonLbl = 'Clear Form';
			if (this.resetButtonLabel){
				resetButtonLbl = this.resetButtonLabel;
			}
			//set PostLbl
			var txt = '<form id="pdbForm_'+this.pDBConnection.wallid+'">';
			if(this.nickLabel != null){
				txt += this.nickLabel + ' <input type="text" name="pdbNick" maxlength="50"><br>';
			}
			if( this.nick2Label !=null){
				txt += this.nick2Label + ' <input type="text" name="pdbNick2" maxlength="50"><br>';
			}
			if(this.postAreaLabel != ''){
				txt += this.postAreaLabel + '<br>';
			}
			txt +='<TEXTAREA cols="'+this.formWidth+'" rows="'+this.formHeight+'" name="pdbPost" ></TEXTAREA><br>';
			txt +='<input type="button" name="pdbSubmitButton" value="'+ postButtonLbl +'" onclick=\"javascript:'+ this.variableName +'.submitFormValues(document.getElementById(\'pdbForm_'+this.pDBConnection.wallid+'\').pdbNick.value,document.getElementById(\'pdbForm_'+this.pDBConnection.wallid+'\').pdbNick2.value,document.getElementById(\'pdbForm_'+this.pDBConnection.wallid+'\').pdbPost.value)\"/>';
			txt +='<input type="button" name="reset" value="'+ resetButtonLbl +'" onclick=\"javascript:'+this.variableName+'.clearForm();"/>';
			txt +='</form>';
			this.formDiv.innerHTML = txt;
			this.pdbForm = document.getElementById('pdbForm_'+this.pDBConnection.wallid);
		}	
		this.printForm = printForm;
		var semicolontext='$pdb?replace!sc';
		function replacesc(text){
			return text.replace(/;/g,semicolontext);
		}
		this.replacesc = replacesc;
		function replaceBacksc(text){
			return text.replace(/\$pdb\?replace!sc/g,';');
		}		
		
		
		function submitFormValues(nick,nick2,post){
    		this.pDBConnection.post(variableName+'.submitFormValues_callback',replacesc(post),replacesc(nick),replacesc(nick2));
    	}
    	
		this.submitFormValues = submitFormValues;
		
		function submitFormValues_callback(result){
			if(!result){
				alert('Server Error:Wall is read only!');
				return;
			}
			this.clearForm();
			if (this.wallStyle !=2){
				this.printPosts(this.pageNumber,this.pageSize);
			}
		}//function submitFormValues_callback
		this.submitFormValues_callback = submitFormValues_callback;
		
		function clearForm(){
			if(this.pdbForm.pdbNick){this.pdbForm.pdbNick.value='';};
			if(this.pdbForm.pdbNick2){this.pdbForm.pdbNick2.value='';};
			this.pdbForm.pdbPost.value='';
		}
		this.clearForm = clearForm;
	}//PDBWizard
	
	function pdbinit(wallid){
		document.writeln('<div id="pdbDiv'+wallid+'"></div>');
		eval( 'this.pdbConnection_'+ wallid +' = new PDBConnection('+ wallid +');')
		eval( 'this.pdbWizard_'+ wallid +' = new PDBWizard(pdbConnection_'+ wallid +',"pdbWizard_'+ wallid+'",document.getElementById("pdbDiv'+wallid+'"));');
		var w = eval( 'this.pdbWizard_'+ wallid);
		w.initWall();
	}
