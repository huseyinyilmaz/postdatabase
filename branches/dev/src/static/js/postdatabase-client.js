	//PDB is only global object that we have
	var postdatabase = {
			//serverDomain : "http://localhost:9999",
			serverDomain : "http://postdatabase.appspot.com",
			globalName:	"postdatabase",
			//initalizes walls
			wallArray: [],
			log:	function(message){
						if(console){
							console.log(message);
						}
					},//log
			getWall:	function(wallId){
				return this.wallArray[wallId];
			},//getWall
			init :function(divId,wallId,connectionObject){
					var connection = null;
					if(connectionObject != undefined)
						connection = connectionObject;
					else
						connection = {
									bufferId: "pdbBuffer",
									postBufferId:"pdbPostBuffer",
									bufferObject:null,
									postBufferObject:null,
									bufferCounter: 0,
									pdb:this,
									getWallObject: 	function(callback,pagesize,pagenumber){
			        									this.pdb.log("connection.getWallObject - start");
														//prepare url
														var url = this.pdb.serverDomain + '/post/get?type=client&id='+ wallId + '&callback=' + callback + '&request=' + this.bufferCounter;
			        									if(pagesize){
			        										url +='&pagesize=' + pagesize; 
			        									}
			        									if(pagenumber){
			        										url +='&pagenumber=' + pagenumber; 
			        									}
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
			    									},//getWallObject
			    					initWallObject: function(callbackObject,callbackFunction) {
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
			    									}//post
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
											connection.initWallObject(this.pdb.globalName +'.getWall('+wallId+')' , 'initWallCallback');
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
											connection.getWallObject(this.pdb.globalName+'.getWall('+ wallId+').printPostsCallback',pageSize,pageNumber);
										}, //printPosts
												
							printPostsCallback: function(wall){
													this.pdb.log("wall.printPostsCallback-start");
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
															txt += this.getPostString(postArray[i].id,this.replaceBacksc(postArray[i].nick),this.replaceBacksc(postArray[i].nick2),postArray[i].date,this.replaceBacksc(postArray[i].value),i);
														};//for
														txt +=this.getPostPostString(wall);
														//txt = txt.replace(/\n/g,"<br>");
													}//end if
													//this.pdb.log("		wall.printPostsCallback-post content =" + txt);
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
											txt +='<input type="button" name="pdbSubmitButton" value="'+ postButtonLbl +'" onclick=\"javascript:'+ this.pdb.globalName +'.getWall('+wallId+').submitFormValues(document.getElementById(\'pdbForm_'+wallId+'\').pdbNick.value,document.getElementById(\'pdbForm_'+wallId+'\').pdbNick2.value,document.getElementById(\'pdbForm_'+wallId+'\').pdbPost.value)\"/>';
											txt +='<input type="button" name="reset" value="'+ resetButtonLbl +'" onclick=\"javascript:'+this.pdb.globalName+'.getWall('+wallId+').clearForm();"/>';
											txt +='</form>';
											this.formDiv.innerHTML = txt;
											this.form = document.getElementById('pdbForm_'+wallId);
										},//printForm						
												
							semicolontext : "$pdb?replace!sc",
							replacesc: function(text){
											return text.replace(/;/g,this.semicolontext);
										},
							replaceBacksc:	function(text){
												return text.replace(/\$pdb\?replace!sc/g,';');
											},		
							submitFormValues:	function(nick,nick2,post){
													this.pdb.log("wall.submitFormValues-start");
													var callback = this.pdb.globalName+'.getWall('+ wallId +').submitFormValues_callback';
													this.pdb.log("		wall.submitFormValues-callback = " + callback);
													var postValue = this.replacesc(post);
													this.pdb.log("		wall.submitFormValues-postValue = " + postValue);
													var nickValue = this.replacesc(nick);
													this.pdb.log("		wall.submitFormValues-nickValue =" + nickValue);
													var nick2Value = this.replacesc(nick2);
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
