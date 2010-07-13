	//PDB is only global object that we have
	var postdatabase = function(){
		var globalName = "postdatabase";
		
		var serverDomain = "http://localhost:9999";
		//var serverDomain = "http://postdatabase.appspot.com";
		
		var wallArray = [];
		var mainObject = {
			enableLog: false,
			getWall: function(wallId){
				var originalWall = wallArray[wallId];
				return {
						//Getters
						getPageSize:function(){return originalWall.pageSize;},
						getPostCount:function(){return originalWall.postCount;},
						getPageCount:function(){return originalWall.pageCount;},
						getCurrentPage:function(){return originalWall.currentPage;},
						
						getNickLabel:function(){return originalWall.nickLabel;},
						getNick2Label:function(){return originalWall.nick2Label;},
						getPostAreaLabel:function(){return originalWall.postAreaLabel;},
						getPostButtonLabel:function(){return originalWall.postButtonLabel;},
						getResetButtonLabel:function(){return originalWall.resetButtonLabel;},
						getFormWidth:function(){return originalWall.formWidth;},
						getFormHeight:function(){return originalWall.formHeight;},
						
						getWallStyle:function(){return originalWall.wallStyle;},
						getPostStyle:function(){return originalWall.postStyle;},
						getDateStyle:function(){return originalWall.dateStyle;},
						//Setters
						setPageSize:function(value){originalWall.pageSize = value;},
						setPostCount:function(value){originalWall.postCount = value;},
						setPageCount:function(value){originalWall.pageCount = value;},
						setCurrentPage:function(value){originalWall.currentPage = value;},
						
						setNickLabel:function(value){originalWall.nickLabel = value;},
						setNick2Label:function(value){originalWall.nick2Label = value;},
						setPostAreaLabel:function(value){originalWall.postAreaLabel = value;},
						setPostButtonLabel:function(value){originalWall.postButtonLabel = value;},
						setResetButtonLabel:function(value){originalWall.resetButtonLabel = value;},
						setFormWidth:function(value){originalWall.formWidth = value;},
						setFormHeight:function(value){originalWall.formHeight = value;},
						
						setWallStyle:function(value){originalWall.wallStyle = value;},
						setPostStyle:function(value){originalWall.postStyle = value;},
						setDateStyle:function(value){originalWall.dateStyle = value;},
						
						addReadyEventListener: function(e){originalWall.readyEventArray.push(e);},
			
						clearPosts:	function(){originalWall.postsArray = [];},
						addPost:function(post){
							var originalPost = {
								id: post.id,
								nick:post.nick,
								nick2:post.nick2,
								date:post.date,
								value:post.value
							}
							originalWall.postsArray.push(originalPost);
						},
						refreshPosts:	function(){originalWall.printPosts(originalWall.currentPage,originalWall.pageSize)},
						
						submitFormValues:function(nick, nick2, post){originalWall.submitFormValues(nick,nick2,post);},
						clearForm:function(){originalWall.clearForm();},
						_completeInitilization:function(){originalWall.initWallCallback();},
						_completeGetPostRequest:function(){originalWall.printPostsCallback();},
						_completeSubmitFormValues:function(){originalWall.submitFormValues_callback();},
						_reportServerError:function(message){originalWall.reportServerError(message);}
						};
			},//getWall
			
			/**
		 * Initializes a new wall. Creates a new connection object and wall object. stores wall object in database
		 * divId (String) = id of div that wall will be place into.
		 * wallId(Number) = id of wall that will be used.
		 * connectionObject(Connection object) = connection object that will be used to connect to server
		 * 				if this value is not provided default connection object will be used.
		 **/
			init: function(divId, wallId, connectionObject){
				//initialize logger if it is not already initialized
				var logger = {
					loggedFunctionArray: [],
					log: function(message){
						if (mainObject.enableLog === true && window.console != undefined) {
							var prefix = "";
							for (var i = 1; i < this.loggedFunctionArray.length; i++) 
								prefix += "\t";
							console.log(prefix + "wall[" + wallId + "]" + " - " + this.loggedFunctionArray[this.loggedFunctionArray.length - 1] + " : ", message);
						}
					},//log
					startLog: function(functionName){
						this.loggedFunctionArray.push(functionName);
						this.log("Start");
					},//startLog
					endLog: function(){
						//var loggedFunction = this.loggedFunctionArray[this.loggedFunctionArray.length-1];
						this.log("End");
						this.loggedFunctionArray.pop();
					},//startLog
				};//logger
				//utility functions
				//text that will semi colons will replace with
				var semicolontext = "$pdb?replace!sc";
				var replacesc = function(text){
					return text.replace(/;/g, semicolontext);
				};
				var replaceBacksc = function(text){
					return text.replace(/\$pdb\?replace!sc/g, ';');
				};
				
				/**
			 * Connection Object is an object that is used to comunicate with server.
			 * connection object must have  three methods getWallObject,initWallObject,post
			 */
				var connection = null;
				if (connectionObject != undefined) 
					//connection object is provided
					connection = connectionObject;
				else 
					connection = {
						bufferId: "pdbBuffer",
						postBufferId: "pdbPostBuffer",
						bufferObject: null,
						postBufferObject: null,
						bufferCounter: 0,
						pdb: this,
						//get posts from server
						getPosts: function(pagesize, pagenumber){
							logger.startLog("connection.getPosts");
							this.bufferCounter++;
							var url = serverDomain + '/post/get?type=client&id=' + wallId + '&mainObject=' + globalName + '&request=' + this.bufferCounter;
							if (pagesize) {
								url += '&pagesize=' + pagesize;
							};
							if (pagenumber) {
								url += '&pagenumber=' + pagenumber;
							};
							logger.log('url = ' + url);
							var script = document.createElement('script');
							script.setAttribute('type', 'text/javascript');
							script.setAttribute('src', url);
							script.setAttribute('id', this.bufferId + this.bufferCounter);
							//remove old script if it is exist in dom
							if (this.bufferObject) {
								document.getElementsByTagName('head')[0].removeChild(this.bufferObject);
							}
							//Insert <script> into DOM
							document.getElementsByTagName('head')[0].appendChild(script);
							this.bufferObject = script;
							logger.endLog();
						},//getPosts
						//initializes wall
						initWall: function(){
							logger.startLog("connection.initWall");
							this.bufferCounter++;
							//prepare url
							var url = serverDomain + '/wall/init?id=' + wallId + '&mainObject=' + globalName + '&request=' + this.bufferCounter;
							logger.log("url = " + url);
							var script = document.createElement('script');
							script.setAttribute('type', 'text/javascript');
							script.setAttribute('src', url);
							script.setAttribute('id', this.bufferId + this.bufferCounter);
							if (this.bufferObject) {
								document.getElementsByTagName('head')[0].removeChild(this.bufferObject);
							}
							//Insert <script> into DOM
							document.getElementsByTagName('head')[0].appendChild(script);
							this.bufferObject = script;
							logger.endLog();
						},//initWallObject
						//posts a new value							    					
						post: function(nick, nick2,postValue){
							logger.startLog("connection.post");
							//prepare url
							var url = serverDomain + '/post/save?type=client&id=' + wallId +'&mainObject=' + globalName +'&request=' + this.bufferCounter;
							if (postValue) {
								url += '&post=' + encodeURI(postValue);
							}
							if (nick) {
								url += '&nick=' + encodeURI(nick);
							}
							if (nick2) {
								url += '&nick2=' + encodeURI(nick2);
							}
							logger.log("url = " + url);
							var script = document.createElement('script');
							script.setAttribute('type', 'text/javascript');
							script.setAttribute('src', url);
							script.setAttribute('id', this.postBufferId + this.bufferCounter++);
							if (this.postBufferObject) {
								document.getElementsByTagName('head')[0].removeChild(this.postBufferObject);
							}
							// Insert <script> into DOM
							document.getElementsByTagName('head')[0].appendChild(script);
							this.postBufferObject = script;
							logger.endLog();
						},//post
					};//PDBConnection
				//create wall object
				var wall = {
					domObject: null,
					topDivId: null,
					topDiv: null,
					bottomDivId: null,
					bottomDiv: null,
					formDiv:null,
					postDiv:null,
					
					pageSize: 20,
					postCount:0,
					pageCount:0,
					currentPage:0,
					
					wallStyle:1,
					postStyle:1,
					dateStyle:1,
					postButtonLabel:null,
					nickLabel:null,
					nick2Label:null,
					postAreaLabel:null,
					postButtonLabel:null,
					resetButtonLabel:null,
					formWidth:null,
					formHeight:null,
					
					reportServerError:function(message){
						alert(message);
					},
					//ready event listner structure
					readyEventArray: [],
					fireReadyEvents: function(){
						for (i in this.readyEventArray) 
							this.readyEventArray[i].apply(this);
					},
					formReadyEventArray:[],
					
					postsArray:[],
					
					initWall: function(){
						logger.startLog("wall.initWall");
						//locate domObject
						this.domObject = document.getElementById(divId);
						//Create Divs on the page
						if (!this.topDivId) {
							this.topDivId = 'pdbTopDiv' + wallId;
							this.topDiv = document.createElement('div');
							this.topDiv.setAttribute('id', this.topDivId);
							this.domObject.appendChild(this.topDiv);
						}//if
						if (!this.bottomDivId) {
							this.bottomDivId = 'pdbBottomDiv' + wallId;
							this.bottomDiv = document.createElement('div');
							this.bottomDiv.setAttribute('id', this.bottomDivId);
							this.domObject.appendChild(this.bottomDiv);
						}//if
						connection.initWall(globalName + '.getWall(' + wallId + ')', 'initWallCallback');
						logger.endLog();
					},//initWall
					initWallPlaceComponents: function(){
						switch(this.wallStyle){
						case 1:
							this.formDiv = this.topDiv;
							this.postDiv = this.bottomDiv;
							break;
						case 2:
							this.formDiv = this.topDiv;
							break;
						case 3:
							this.postDiv = this.bottomDiv;
							break;
						case 4:
							this.postDiv = this.topDiv;
							this.formDiv = this.bottomDiv;
							break;
						}
					},
					initWallCallback: function(){
						this.initWallPlaceComponents();
						if(this.formDiv) this.printForm();
						if(this.postDiv) this.printPosts();
						this.fireReadyEvents();
					},//initWallCallback
					getDateString: function(date){
						var dateTxt = null;
						switch(this.dateStyle){
						case 1:
							dateTxt = '[' + date.toLocaleDateString() + ' - ' + date.toLocaleTimeString() + ']';
							break;
						case 2:
							dateTxt = date.toLocaleDateString()+' - ' +date.toLocaleTimeString();
							break;
						case 3:
							dateTxt = '['+date.toLocaleDateString()+']';
							break;
						case 4:
							dateTxt = date.toLocaleDateString();
							break;
						case 5:
							dateTxt = '['+date.toString+']';
							break;
						case 6:
							dateTxt = date.toString();
							break;
						case 7:
							var txt = '';
							var minute = 1000 * 60;
							var hour = minute * 60;
							var day = hour * 24;
							var year = day * 365;
							var interval = new Date() - date;
							var iMinute = 0;
							var iHour = 0;
							var iDay = 0;
							var iYear = 0;
							if (interval>year){
								iYear = (interval / year).toFixed(0);
								interval = interval - iYear*year;
								txt += iYear.toString() + 'years ';
							}
							if (interval>day){
								iDay = (interval / day).toFixed(0);
								interval = interval - iDay*day;
								txt += iDay.toString() + 'days ';
							}
							if (interval>hour){
								iHour = (interval / hour).toFixed(0);
								interval = interval - iHour*hour;
								txt += iHour.toString() + 'hours ';
							}
							if(interval>minute){
								iMinute = (interval / minute).toFixed(0);
								interval = interval - iMinute*minute;
								txt += iMinute.toString() + 'minutes '
							}
							if (txt == ''){
								txt += 'Less then a minute ';
							}
							txt += 'ago';
							dateTxt = '['+txt+']';
							break;
						case 8:
							var txt = '';
							var minute = 1000 * 60;
							var hour = minute * 60;
							var day = hour * 24;
							var year = day * 365;
							var interval = new Date() - date;
							var iMinute = 0;
							var iHour = 0;
							var iDay = 0;
							var iYear = 0;
							if (interval>year){
								iYear = (interval / year).toFixed(0);
								interval = interval - iYear*year;
								txt += iYear.toString() + 'years ';
							}
							if (interval>day){
								iDay = (interval / day).toFixed(0);
								interval = interval - iDay*day;
								txt += iDay.toString() + 'days ';
							}
							if (interval>hour){
								iHour = (interval / hour).toFixed(0);
								interval = interval - iHour*hour;
								txt += iHour.toString() + 'hours ';
							}
							if(interval>minute){
								iMinute = (interval / minute).toFixed(0);
								interval = interval - iMinute*minute;
								txt += iMinute.toString() + 'minutes '
							}
							if (txt == ''){
								txt += 'Less then a minute ';
							}
							txt += 'ago';
							dateTxt = txt;
							break;
						}
						return dateTxt;
					},//getDateString
					getPostString: function(id, nick, nick2, date, value, order){
						var txt = null;
						switch(this.postStyle){
						case 1:
							txt = '<tr><th> ' + nick + ' </th><th> ' + nick2 + ' </th><td style="font-size: 70%">' + this.getDateString(date) + '</td></tr>';
							txt += '<tr></tr><tr><td colspan="3">' + value + '</td></tr><tr><td colspan="3"><hr></td></tr>';
							break;
						case 2:
							txt = '<tr><td>'+ value +'</td></tr>';
							break;
						case 3:
							txt = '<br><tr><td>'+ value +'</td></tr><tr><td><hr></td></tr>';
							break;
						case 4:
							txt ='<tr><th align="center"> '+ nick +' </th></tr>';
							txt += '<br><tr><td colspan="3">'+ value +'</td></tr><tr><td colspan="3"><hr></td></tr>';
							break;
						case 5:
							txt ='<tr><table>';
							txt += '<tr><td> '+ this.nickLabel +' : '+ nick +' </td></tr>';
							txt += '<tr><td> '+ this.nick2Label +' : '+ nick2 +' </td></tr>';
							txt += '<tr><td style="font-size: 70%">' + this.getDateString(date) +'</td></tr>';
							txt += '<tr><td>'+ value +'</td></tr></table></tr><br><hr>';
							break;
						case 6:
							txt ='<div align="right" class="pdbDate">' + this.getDateString(date) +'</div>';
							txt += '<br>'+ value+'<br><hr>';
							break;
						case 7:
							txt = '<br>'+ value+'<br>'; 
							txt +='<div align="right" class="pdbDate">' + this.getDateString(date) +'</div><hr>';
							break;
						}
						return txt;
					},//getPostString
					getPageList: function(){
						if (this.pageCount == 1) {
							return '';
						}
						var startPage = this.currentPage - 5;
						if (startPage < 1) {
							startPage = 1;
						}
						else 
							if (startPage + 9 > this.pageCount) {
								startPage = this.pageCount - 9;
								if (startPage < 1) {
									startPage = 1;
								}
							}
						var pageList = '';
						for (var i = startPage; i < startPage + 10 && i <= this.pageCount; i++) {
							if (this.currentPage != i) {
								pageList = pageList + '<a href="javascript:(function(){var wall =' + globalName + '.getWall(' + wallId + ');wall.setCurrentPage('+i+');wall.refreshPosts();})();"> ' + i + ' </a>';
							}
							else {
								pageList = pageList + i;
							}
						}
						return pageList;
					}, //getPageList										
					getPrePostString: function(){
						return '<table><tr><td>' + this.getPageList() + '</td><tr>';
					}, // getPrePostString
					getPostPostString: function(){
						return '<tr><td>' + this.getPageList() + '</td><tr></table>';
					}, // getPostPostString
					printPosts: function(pageNumber, pageSize){
						logger.startLog("wall.printPosts");
						if (pageNumber == undefined) {
							var pageNumber = this.pageNumber;
						}
						else {
							this.pageNumber = pageNumber;
						}
						if (pageSize == undefined) {
							var pageSize = this.pageSize;
						}
						else {
							this.pageSize = pageSize;
						}
						this.postDiv.innerHTML = 'Loading...';
						connection.getPosts(pageSize, pageNumber);
						logger.endLog();
					}, //printPosts
					printPostsCallback: function(){
						logger.startLog("wall.printPostsCallback");
						var txt = '';
						txt += this.getPrePostString();
						for (i = 0; i < this.postsArray.length; i++) {
							txt += this.getPostString(this.postsArray[i].id, replaceBacksc(this.postsArray[i].nick), replaceBacksc(this.postsArray[i].nick2), this.postsArray[i].date, replaceBacksc(this.postsArray[i].value), i);
						};//for
						txt += this.getPostPostString();
						this.postDiv.innerHTML = txt;
						logger.endLog();
					},//printPostListCallback											
					printForm: function(){
						//set postButtonLbl
						var postButtonLbl = 'Post';
						
						
						if (this.postButtonLabel) {
							postButtonLbl = this.postButtonLabel;
						}
						var resetButtonLbl = 'Clear Form';
						if (this.resetButtonLabel) {
							resetButtonLbl = this.resetButtonLabel;
						}
						//set PostLbl
						var txt = "<table>";
						if (this.nickLabel != null) {
							txt += '<tr><td>' + this.nickLabel + '</td><td><input type="text" class="pdbText pdbNick" id="pdbNick_' + wallId + '" maxlength="50"></td></tr>';
						}
						if (this.nick2Label != null) {
							txt += '<tr><td>' + this.nick2Label + '</td><td><input type="text" class="pdbText pdbNick2" id="pdbNick2_' + wallId + '" maxlength="50"></td></tr>';
						}
						txt += "</table>";
						if (this.postAreaLabel != '') {
							txt += this.postAreaLabel + '<br>';
						}
						txt += '<TEXTAREA cols="' + this.formWidth + '" rows="' + this.formHeight + '" id="pdbPost_' + wallId  + '" class="pdbText pdbTextArea" ></TEXTAREA><br>';
						txt += '<button class="pdbButton pdbSubmitButton" id="pdbSubmitButton'+ wallId +'" onclick=\"javascript:' + globalName + '.getWall(' + wallId + ').submitFormValues(document.getElementById(\'pdbNick_' + wallId + '\').value,document.getElementById(\'pdbNick2_' + wallId + '\').value,document.getElementById(\'pdbPost_' + wallId + '\').value)\">' + postButtonLbl + '</button>';
						txt += '<button class="pdbButton pdbClearButton" id="pdbClearButton'+ wallId +'" onclick=\"javascript:' + globalName + '.getWall(' + wallId + ').clearForm();">' + resetButtonLbl + '</button>';
						this.formDiv.innerHTML = txt;
					},//printForm						
					submitFormValues: function(nick, nick2, post){
						logger.startLog("wall.submitFormValues");
						var postValue = replacesc(post);
						logger.log("postValue = " + postValue);
						var nickValue = replacesc(nick);
						logger.log("nickValue =" + nickValue);
						var nick2Value = replacesc(nick2);
						logger.log("nick2Value =" + nick2Value);
						connection.post(nickValue, nick2Value,postValue);
						logger.endLog();
					},
					submitFormValues_callback: function(){
						logger.startLog("wall.submitFormValues_callback");
						this.clearForm();
						if (this.wallStyle != 2) {
							this.printPosts(this.pageNumber, this.pageSize);
						}
						logger.endLog();
					},//function submitFormValues_callback
					clearForm: function(){
						logger.startLog("wall.clearForm");
						var pdbNick = document.getElementById('pdbNick_'+wallId);
						if (pdbNick) {
							pdbNick.value = '';
						};
						var pdbNick2 = document.getElementById('pdbNick2_'+wallId);
						if (pdbNick2) {
							pdbNick2.value = '';
						};
						var pdbPost = document.getElementById('pdbPost_'+wallId);
						pdbPost.value = '';
						logger.endLog();
					}
					
				}//wall			
				wallArray[wallId] = wall;
				wall.initWall();
			}//init
		};//mainObject
		return mainObject;
	}();//context of main object;