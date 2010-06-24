	//PDB is only global object that we have
	var pdb2 = {
			serverDomain : "http://localhost:9999",
			//domain : "http://postdatabase.appspot.com",
			//initalizes walls
			wallArray: [],
			log:	function(message){
						if(console){
							console.log(message);
						}
					},//log
			getWall:	function(wallId){
				return wallArray[wallId];
			},//getWall
			init :function(divId,wallId){
					var connection = {
									bufferId: "pdbBuffer",
									postBufferId:"pdbPostBuffer",
									pdb:this,
									getWallObject: 	function(callback,pagesize,pagenumber){
			        									this.pdb.log("connection.getWallObject - start");
														//prepare url
														var url = this.pdb.serverDomain + '/post/get?type=client&id='+ wallId + '&callback=' + callback;
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
			        									script.setAttribute('id', pdbBuffer);
			        									PDBscript_id = document.getElementById(pdbBuffer);
			        									//remove old script if it is exist in dom
			        									if(script_id){
			        										document.getElementsByTagName('head')[0].removeChild(script_id);
			        									}
			        									//Insert <script> into DOM
			        									document.getElementsByTagName('head')[0].appendChild(script);
			    									},//getWallObject
			    					initWallObject: function(callbackObject,callbackFunction) {
			    										this.pdb.log("connection.initWallObject-start")
														//prepare url
			    										var url = this.pdb.serverDomain + '/wall/init?id='+ wallId + '&callbackobject=' + callbackObject + '&callbackfunction='+callbackFunction;
			    	
			    										var script_id = null;
			    										var script = document.createElement('script');
			    										script.setAttribute('type', 'text/javascript');
			    										script.setAttribute('src', url);
			    										script.setAttribute('id', pdbBuffer);
			    										script_id = document.getElementById(pdbBuffer);
			    										if(script_id){
			    											document.getElementsByTagName('head')[0].removeChild(script_id);
			    										}
			    										//Insert <script> into DOM
			    										document.getElementsByTagName('head')[0].appendChild(script);
			    									},//initWallObject			    					
			    					post:			function(callback,postValue,nick,nick2){
			    										//prepare url
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
			    										script.setAttribute('id', postBufferId);
			    										script_id = document.getElementById(postBufferId);
			    										if(script_id){
			    											document.getElementsByTagName('head')[0].removeChild(script_id);
			    										}
			    										// Insert <script> into DOM
			    										document.getElementsByTagName('head')[0].appendChild(script);
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
											connection.initWallObject('pdb.getWall('+wallId+')' , 'initWallCallback');
										},//initWall
							initWallCallback: function(initObject){
											initObject.initFunction.call(initObject.caller);
											var runInit = function(){
												this.formDiv = this.pdbTopDiv;
												this.postDiv = this.pdbBottomDiv;
												this.printForm.call(this);
												this.printPosts.call(this);
											};
											runInit.apply(initObject.caller); 
										},//initWallCallback
							getDateString: function(date){
											return '['+date.toLocaleDateString()+' - ' +date.toLocaleTimeString()+']';
										},//getDateString

										
							getPostString: function(id,nick,nick2,date,value,order){
											var txt ='<tr><th> '+ nick +' </th><th> '+ nick2 +' </th><td style="font-size: 70%">' + this.getDateString(date) +'</td></tr>';
											txt += '<br><tr><td colspan="3">'+ value +'</td></tr><tr><td colspan="3"><hr></td></tr>';
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
													pageList = pageList + '<a href="javascript:' +variableName + '.printPosts('+i +','+wall.postsPerPage +');"> '+ i +' </a>';
												}else{
													pageList = pageList + i;
												}
											}
											return pageList;
										}, //getPageList										
							
							getPrePostString:	function(wall){
													return '<table><tr><td>' + getPageList(wall) + '</td><tr>';
												}, // getPrePostString
										
							getPostPostString: function(wall){
													return '<tr><td>' + getPageList(wall) + '</td><tr></table>';
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
											connection.getWallObject('PDB.wallArray['+ wallId+'].printPostsCallback',pageSize,pageNumber);
										}, //printPosts
												
							printPostsCallback: function(wall){
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
											this.form = document.getElementById('pdbForm_'+this.pDBConnection.wallid);
										},//printForm						
												
							semicolontext : "$pdb?replace!sc",
							replacesc: function(text){
											return text.replace(/;/g,semicolontext);
										},
							replaceBacksc:	function(text){
												return text.replace(/\$pdb\?replace!sc/g,';');
											},		
							submitFormValues:	function(nick,nick2,post){
													this.pDBConnection.post(variableName+'.submitFormValues_callback',replacesc(post),replacesc(nick),replacesc(nick2));
												},
							submitFormValues_callback:	function(result){
															if(!result){
																alert('Server Error:Wall is read only!');
																return;
															}
															this.clearForm();
															if (this.wallStyle !=2){
																this.printPosts(this.pageNumber,this.pageSize);
															}
														},//function submitFormValues_callback
							clearForm:	function(){
											if(this.pdbForm.pdbNick){this.pdbForm.pdbNick.value='';};
											if(this.pdbForm.pdbNick2){this.pdbForm.pdbNick2.value='';};
											this.pdbForm.pdbPost.value='';
										}										
												
							}//wall			
				this.wallArray.push(wall);
				wall.initWall();
			}//init
	}//PDB
