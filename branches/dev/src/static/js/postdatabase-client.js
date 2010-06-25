	//PDB is only global object that we have
	var postdatabase = {
			//General Values
			serverDomain : "http://localhost:9999",
			//serverDomain : "http://postdatabase.appspot.com",
			globalName:	"postdatabase",
			log:	function(message){
						if(console){
							console.log(message);
						}
					},//log

			//wall array
			wallArray: [],
			getWall:	function(wallId){
				return this.wallArray[wallId];
			},//getWall

			/**
			 * Initializes a new wall. Creates a new connection object and wall object. stores wall object in database
			 * divId (String) = id of div that wall will be place into.
			 * wallId(Number) = id of wall that will be used.
			 * connectionObject(Connection object) = connection object that will be used to connect to server
			 * 				if this value is not provided default connection object will be used.
			 **/
			init :function(divId,wallId,connectionObject){
					//utility functions
					//text that will semi colons will replace with
					var semicolontext = "$pdb?replace!sc";
					var replacesc = function(text){
										return text.replace(/;/g,semicolontext);
					};
					var replaceBacksc =	function(text){
										return text.replace(/\$pdb\?replace!sc/g,';');
					};		

					/**
					 * Connection Object is an object that is used to comunicate with server.
					 * connection object must have  three methods getWallObject,initWallObject,post
					 */
					var connection = null;
					if(connectionObject != undefined)
						//connection object is provided
						connection = connectionObject;
					else
						connection = {
									bufferId: "pdbBuffer",
									postBufferId:"pdbPostBuffer",
									bufferObject:null,
									postBufferObject:null,
									bufferCounter: 0,
									pdb:this,
									//get posts from server
									getPosts: 	function(callback,pagesize,pagenumber){
			        									this.pdb.log("connection.getWallObject - start");
														var url = this.pdb.serverDomain + '/post/get?type=client&id='+ wallId + '&callback=' + callback + '&request=' + this.bufferCounter;
			        									if(pagesize){
			        										url +='&pagesize=' + pagesize; 
			        									};
			        									if(pagenumber){
			        										url +='&pagenumber=' + pagenumber; 
			        									};
			        									var script = document.createElement('script');
			        									script.setAttribute('type', 'text/javascript');
			        									script.setAttribute('src', url);
			        									script.setAttribute('id', this.bufferId + this.bufferCounter++);
			        									//remove old script if it is exist in dom
			        									if(this.bufferObject){
			        										document.getElementsByTagName('head')[0].removeChild(this.bufferObject);
			        									}
			        									//Insert <script> into DOM
			        									document.getElementsByTagName('head')[0].appendChild(script);
														this.bufferObject = script;
														this.pdb.log("connection.getWallObject - end");
			    									},//getPosts
			    					//initializes wall
			    					initWall: function(callbackObject,callbackFunction) {
			    										this.pdb.log("connection.initWallObject-start")
														//prepare url
			    										var url = this.pdb.serverDomain + '/wall/init?id='+ wallId + '&callbackobject=' + callbackObject + '&callbackfunction='+callbackFunction + '&request=' + this.bufferCounter;
			    										this.pdb.log("		url = " + url);
			    										var script = document.createElement('script');
			    										script.setAttribute('type', 'text/javascript');
			    										script.setAttribute('src', url);
			    										script.setAttribute('id', this.bufferId + this.bufferCounter++);
			    										if(this.bufferObject){
			    											document.getElementsByTagName('head')[0].removeChild(this.bufferObject);
			    										}
			    										//Insert <script> into DOM
			    										document.getElementsByTagName('head')[0].appendChild(script);
			    										this.bufferObject = script;
														this.pdb.log("connection.initWallObject-end");
			    									},//initWallObject
			    					//posts a new value							    					
			    					post:			function(callback,postValue,nick,nick2){
			    										this.pdb.log("connection.post-start");
														//prepare url
			    										var url = this.pdb.serverDomain + '/post/save?type=client&id=' + wallId+ '&request=' + this.bufferCounter;
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
			    										this.pdb.log("		connection.post-url = " + url);
			    										var script = document.createElement('script');
			    										script.setAttribute('type', 'text/javascript');
			    										script.setAttribute('src', url);
			    										script.setAttribute('id', this.postBufferId + this.bufferCounter++);
			    										if(this.postBufferObject){
			    											document.getElementsByTagName('head')[0].removeChild(this.postBufferObject);
			    										}
			    										// Insert <script> into DOM
			    										document.getElementsByTagName('head')[0].appendChild(script);
			    										this.postBufferObject = script;
														this.pdb.log("connection.post-end");
			    									},//post

								};//PDBConnection
				//create wall object
				var wall = {
							pageNumber : 1,
							pageSize : 20,
							domObject: null,
							topDivId: null,
							topDiv: null,
							bottomDivId: null,
							bottomDiv: null,
							pdb: this,
							//ready event listner structure
							readyEventArray:[],
							addReadyEventListener:function(e){this.readyEventArray.push(e)},
							fireReadyEvents:function(){
								for(i in this.readyEventArray)
									this.readyEventArray[i].apply(this);
							},
							initWall:	function(){
											//locate domObject
											this.domObject = document.getElementById(divId);
											//Create Divs on the page
											if(!this.topDivId){ 
												this.topDivId = 'pdbTopDiv'+wallId;
												this.topDiv = document.createElement('div');
												this.topDiv.setAttribute('id',this.topDivId);
												this.domObject.appendChild(this.topDiv);
											}//if
											if(!this.bottomDivId){ 
												this.bottomDivId = 'pdbBottomDiv'+wallId;
												this.bottomDiv = document.createElement('div');
												this.bottomDiv.setAttribute('id',this.bottomDivId);
												this.domObject.appendChild(this.bottomDiv);
											}//if
											connection.initWall(this.pdb.globalName +'.getWall('+wallId+')' , 'initWallCallback');
										},//initWall
							initWallPlaceComponents:	function(){
															this.formDiv = this.topDiv;
															this.postDiv = this.bottomDiv;
															this.printForm.call(this);
															this.printPosts.call(this);
											},	
							initWallCallback: function(initObject){
											initObject.initFunction.call(initObject.caller);
											this.initWallPlaceComponents.apply(initObject.caller);
											this.fireReadyEvents(); 
										},//initWallCallback
							getDateString: function(date){
											return '['+date.toLocaleDateString()+' - ' +date.toLocaleTimeString()+']';
										},//getDateString

										
							getPostString: function(id,nick,nick2,date,value,order){
											var txt ='<tr><th> '+ nick +' </th><th> '+ nick2 +' </th><td style="font-size: 70%">' + this.getDateString(date) +'</td></tr>';
											txt += '<tr></tr><tr><td colspan="3">'+ value +'</td></tr><tr><td colspan="3"><hr></td></tr>';
											return txt;
										},//getPostString
								
							getPageList: function(wall){
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
													pageList = pageList + '<a href="javascript:' +this.pdb.globalName + '.getWall('+wallId+').printPosts('+i +','+wall.postsPerPage +');"> '+ i +' </a>';
												}else{
													pageList = pageList + i;
												}
											}
											return pageList;
										}, //getPageList										
							
							getPrePostString:	function(wall){
													return '<table><tr><td>' + this.getPageList(wall) + '</td><tr>';
												}, // getPrePostString
										
							getPostPostString: function(wall){
													return '<tr><td>' + this.getPageList(wall) + '</td><tr></table>';
												}, // getPostPostString
							
							printPosts: function(pageNumber,pageSize){
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
											connection.getPosts(this.pdb.globalName+'.getWall('+ wallId+').printPostsCallback',pageSize,pageNumber);
										}, //printPosts
												
							printPostsCallback: function(callBackObject){
													this.pdb.log("wall.printPostsCallback-start");
													var txt = '';
													var postArray = callBackObject.posts;
													txt += this.getPrePostString(callBackObject);
													for (i = 0 ; i<postArray.length ; i++){
														txt += this.getPostString(postArray[i].id,replaceBacksc(postArray[i].nick),replaceBacksc(postArray[i].nick2),postArray[i].date,replaceBacksc(postArray[i].value),i);
													};//for
													txt +=this.getPostPostString(callBackObject);
													this.postDiv.innerHTML = txt;
													this.pdb.log("wall.printPostsCallback-end");
												},//printPostListCallback											
												
							printForm:	function(){
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
											var txt = '<form id="pdbForm_'+wallId+'">';
											txt+="<table>";
											if(this.nickLabel != null){
												txt += '<tr><td>'+this.nickLabel + '</td><td><input type="text" class="pdbText pdbNick" name="pdbNick" maxlength="50"></td></tr>';
											}
											if( this.nick2Label !=null){
												txt += '<tr><td>'+this.nick2Label + '</td><td><input type="text" class="pdbText pdbNick2" name="pdbNick2" maxlength="50"></td></tr>';
											}
											txt+="</table>";
											if(this.postAreaLabel != ''){
												txt += this.postAreaLabel + '<br>';
											}
											txt +='<TEXTAREA cols="'+this.formWidth+'" rows="'+this.formHeight+'" name="pdbPost" class="pdbText pdbTextArea" ></TEXTAREA><br>';
											txt +='<button class="pdbButton pdbSubmitButton" onclick=\"javascript:'+ this.pdb.globalName +'.getWall('+wallId+').submitFormValues(document.getElementById(\'pdbForm_'+wallId+'\').pdbNick.value,document.getElementById(\'pdbForm_'+wallId+'\').pdbNick2.value,document.getElementById(\'pdbForm_'+wallId+'\').pdbPost.value)\">'+postButtonLbl+'</button>';
											txt +='<button class="pdbButton pdbClearButton" onclick=\"javascript:'+this.pdb.globalName+'.getWall('+wallId+').clearForm();">'+resetButtonLbl+'</button>';
											txt +='</form>';
											this.formDiv.innerHTML = txt;
											this.form = document.getElementById('pdbForm_'+wallId);
										},//printForm						
	
							submitFormValues:	function(nick,nick2,post){
													this.pdb.log("wall.submitFormValues-start");
													var callback = this.pdb.globalName+'.getWall('+ wallId +').submitFormValues_callback';
													this.pdb.log("		wall.submitFormValues-callback = " + callback);
													var postValue = replacesc(post);
													this.pdb.log("		wall.submitFormValues-postValue = " + postValue);
													var nickValue = replacesc(nick);
													this.pdb.log("		wall.submitFormValues-nickValue =" + nickValue);
													var nick2Value = replacesc(nick2);
													this.pdb.log("		wall.submitFormValues-nick2Value =" + nick2Value);
													connection.post(callback,postValue,nickValue,nick2Value);
													this.pdb.log("wall.submitFormValues-end");
												},
							submitFormValues_callback:	function(result){
															this.pdb.log("wall.submitFormValues_callback-start");
															if(!result){
																alert('Server Error:Wall is read only!');
																return;
															}
															this.clearForm();
															if (this.wallStyle !=2){
																this.printPosts(this.pageNumber,this.pageSize);
															}
															this.pdb.log("wall.submitFormValues_callback-end");
														},//function submitFormValues_callback
							clearForm:	function(){
											this.pdb.log("wall.clearForm-start");
											if(this.form.pdbNick){this.form.pdbNick.value='';};
											if(this.form.pdbNick2){this.form.pdbNick2.value='';};
											this.form.pdbPost.value='';
											this.pdb.log("wall.clearForm-end");
										}										
												
							}//wall			
				//this.wallArray.push(wall);
				this.wallArray[wallId] = wall;
				wall.initWall();
			}//init
	}//PDB
