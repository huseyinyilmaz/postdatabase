this.pageSize={{wall.pageSize}};
this.nickLabel="{{wall.nickLabel}}";
this.nick2Label="{{wall.nick2Label}}";
this.postAreaLabel="{{wall.postAreaLabel}}";
this.postButtonLabel="{{wall.postButtonLabel}}";
this.resetButtonLabel="{{wall.resetButtonLabel}}";
this.formWidth="{{wall.formWidth}}";
this.formHeight="{{wall.formHeight}}";

this.wallStyle={{wall.wallStyle}};

{%ifequal wall.wallStyle 2%}
this.runInit =function(){
			this.formDiv = this.pdbTopDiv;
			this.printForm.call(this);
		}
{%endifequal%}
{%ifequal wall.wallStyle 3%}
this.runInit =function(){
			this.postDiv = this.pdbBottomDiv;
			this.printPosts.call(this);
		}
{%endifequal%}
{%ifequal wall.wallStyle 4%}
this.runInit =function(){
			this.postDiv = this.pdbTopDiv;
			this.printPosts.call(this);
			this.formDiv = this.pdbBottomDiv;
			this.printForm.call(this);
		}
{%endifequal%}

{%ifequal wall.postStyle 2%}
this.getPostString = function(id,nick,nick2,date,value,order){
	var txt = '<tr><td>'+ value +'</td></tr>';
	return txt;
}
{%endifequal%}
{%ifequal wall.postStyle 3%}
this.getPostString = function(id,nick,nick2,date,value,order){
	var txt = '<br><tr><td>'+ value +'</td></tr><tr><td><hr></td></tr>';
	return txt;
}
{%endifequal%}
{%ifequal wall.postStyle 4%}
this.getPostString = function(id,nick,nick2,date,value,order){
	var txt ='<tr><th align="center"> '+ nick +' </th></tr>';
	txt += '<br><tr><td colspan="3">'+ value +'</td></tr><tr><td colspan="3"><hr></td></tr>';
	return txt;
}
{%endifequal%}
{%ifequal wall.postStyle 5%}
this.getPostString = function(id,nick,nick2,date,value,order){
	var txt ='<tr><table>';
	txt += '<tr><td> '+ this.nickLabel +' : '+ nick +' </td></tr>';
	txt += '<tr><td> '+ this.nick2Label +' : '+ nick2 +' </td></tr>';
	txt += '<tr><td style="font-size: 70%">' + this.getDateString(date) +'</td></tr>';
	txt += '<tr><td>'+ value +'</td></tr></table></tr><br><hr>';
	return txt;
}
{%endifequal%}
{%ifequal wall.postStyle 6%}
this.getPostString = function(id,nick,nick2,date,value,order){
	var txt ='<div align="right" class="pdbDate">' + this.getDateString(date) +'</div>';
	txt += '<br>'+ value+'<br><hr>';
	return txt;
}
{%endifequal%}




{%ifequal wall.dateStyle 2%}
this.getDateString = function getDateString(date){
	return date.toLocaleDateString()+' - ' +date.toLocaleTimeString();
}
{%endifequal%}

{%ifequal wall.dateStyle 3%}
this.getDateString = function getDateString(date){
	return '['+date.toLocaleDateString()+']';
}
{%endifequal%}
{%ifequal wall.dateStyle 4%}
this.getDateString = function getDateString(date){
	return date.toLocaleDateString();
}
{%endifequal%}
{%ifequal wall.dateStyle 5%}
this.getDateString = function getDateString(date){
	return '['+date.toString+']';
}
{%endifequal%}
{%ifequal wall.dateStyle 6%}
this.getDateString = function getDateString(date){
	return date.toString();
}
{%endifequal%}
{%ifequal wall.dateStyle 7%}
this.getDateString = function getDateString(date){
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
		return '['+txt+']';
}
{%endifequal%}
{%ifequal wall.dateStyle 8%}
this.getDateString = function getDateString(date){
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
	return txt;
}
{%endifequal%}





