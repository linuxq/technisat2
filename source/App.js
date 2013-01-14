TSAddress = "http://marcel.homelinux.org:90";
TSPWMD5 = "350a7f5ee27d22dbe36698b10930ff96";
TimerID = 0;
Timers = new Array();
enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx enyo-fit",
	components: [
		{kind: "onyx.Toolbar", components: [
			{content: "Technisat Frontend"},
			{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
				{content: "Settings"},
				{kind: "onyx.Menu", floating: true, components: [
					{content: "Receiver setup"},
					{content: "Add new timer"},
					//{classes: "onyx-menu-divider"},
					//{content: "3"},
				]}
			]},
			{kind:"onyx.Button", content: "Set Timer", ontap:"buttonSetTimer"},
			{kind: "onyx.Icon", src: "assets/menu-icon-refresh.png", style: "float: right", onclick: "buttonTimers"}
			//{kind: "onyx.Checkbox", onchange: "checkboxChange"}
		]},	
		/*{kind: "GTS.DividerDrawer", showing: true, caption: "Add Timer", open: true, components: [
			//{kind: "onyx.GroupboxHeader", content: "new DVR timer"},			
			//{content:"DATE",classes:"onyx-sample-divider"},
			{classes: "onyx-toolbar-inline", components: [
				{name:"NewTimerDate", kind:"onyx.DatePicker"}
			]},
			{classes: "onyx-toolbar-inline", components: [
				{name:"NewTimerStart", kind:"onyx.TimePicker", is24HrMode:true},
				{name:"NewTimerStop", kind:"onyx.TimePicker", is24HrMode:true},
				{kind:"onyx.Button", content: "Set Timer", ontap:"buttonSetTimer"},
			]}					
		]},*/
		{kind: "GTS.DividerDrawer", showing: false, caption: "Receiver", open: false, components: [
			{classes: "onyx-toolbar-inline", components: [
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", placeholder: "IP address", name: "serverAddress", value: "http://192.168.2.48", onchange: "TSAddressChanged"}
				]},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", type:"password", name: "serverPW", placeholder: "Enter password", onchange: "TSPWChanged"}
				]}
			]},
			{kind:"onyx.Button", content: "Login", ontap:"buttonLogin"}					
		]},
		{kind: "Scroller", touch: true, fit: true, realtimeFit: true, components: [
			{kind: "Repeater", onSetupItem:"setupItem", realtimeFit: true, classes: "list-sample-pulldown-list enyo-fit", onclick: "clickPodcast", onhold: "TimerHeld", components: [
				{name: "item", classes:"list-sample-pulldown-item", style: "border: 1px solid silver; padding: 5px; font-size: 12px; font-weight: bold;", components: [
					{kind: "FittableColumns", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
							{tag: "span", name: "titel", style: "font-weight: bold; text-align: left; font-size: 16px;"},
							{tag: "span", name: "sender", style: "float: right; color: lightgrey;"},
							{tag: "br"},
							{tag: "span", name: "datum", style: "color: lightgrey;"},
							{content: "   "},
							{tag: "span", name: "time", style: "float: right; color: lightgrey;"}//,
							//{content: " - "},
							//{tag: "span", name: "stop", style: "float: right; color: lightgrey;"}
					]}
				]}
			]},
		]},				
		{name: "DelTimerConfirmPopup", classes: "onyx-sample-popup", kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", components: [
				{kind: "onyx.InputDecorator", name: "lblDelTimer", content: "Delete timer #", components: [
				]},
				{tag: "br"},
				{kind: "onyx.Button", content: "No", classes: "onyx-negative", ontap: "delTimerCancel"},
				{kind: "onyx.Button", content: "Yes", classes: "onyx-affirmative", ontap: "delTimerConfirm"}
		]},
		{name: "TimerSelPopup", classes: "onyx-sample-popup", kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", components: [
				{content: "", name:"lbltimerpopup", style: "font-size: 14px"},
				{content: "", name:"lbltimerdatumpopup", style: "font-size: 12px"},
				{kind: "onyx.Button", content: "Timer ändern", classes: "onyx-affirmative", ontap: "modTimer"},
				{tag: "br"},
				{kind: "onyx.Button", content: "Timer löschen", classes: "onyx-negative", ontap: "delTimer"},
				{tag: "br"},
				{kind: "onyx.Button", content: "Abbruch", ontap: "SelTimerClosePopup"}
		]},		
		{kind: "WebService", name:"wslogin", url: "", onResponse:"processLogin", callbackName: "callback"},
		{kind: "WebService", name:"wstimers", url: "", onResponse:"processTimers", callbackName: "callback"},
		{kind: "WebService", name:"wsdeltimer", url: "", onResponse:"processDelTimer", callbackName: "callback"},
		{kind: "WebService", name:"wsdeltimerconfirm", url: "", onResponse:"", callbackName: "callback"},
		{kind: "WebService", name:"wssettimer", url: "", onResponse:"processSTResponse2", callbackName: "callback"},
	],
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
		window.setTimeout(this.startapp(), 1);
		this.resize();		
	},
	startapp: function(inSender,inEvent){
		//console.log("StartAPP");
		this.buttonTimers();			
	},
	resize: function() {
		console.log("RESIZE!!!!!!");
			this.reflow();
			this.$.scroller.reflow();
		 	this.$.repeater.reflow();		
	},	
	setupItem: function(inSender, inEvent) {
		this.$[inSender.item].setContent("This is row number: " + inEvent.index);
	},
	buttonLogin: function(inSender) {
		console.log(this.$.serverAddress.getValue() + " - " + this.$.serverPW.getValue());
		this.$.wslogin.setUrl(TSAddress + "/index_s.html?sid=" + TSPWMD5 + "&submit=Login&detour=");
		this.$.wslogin.send();		
		
	},
	buttonTimers: function(inSender) {
		this.$.wstimers.setUrl(TSAddress + "/index_s.html?" + TSPWMD5 + "_timeroverview=Timer-%C3%9Cbersicht");
		this.$.wstimers.send();		
		
	},
	buttonDelTimer: function(inSender) {
		this.$.wsdeltimer.setUrl(TSAddress + "/index_s.html?" + TSPWMD5 + "_deletetimer_" + TimerID + "=L%C3%B6schen");
		this.$.wsdeltimer.send();		
		
	},	
	buttonSetTimer: function(inSender) {
		SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_newhddtimer=Neuer+DVR-Timer";
		this.$.wssettimer.setUrl(SetTimerUrl);
		//this.$.wssettimer.setPostBody("") ;
		this.$.wssettimer.send();			
		/*var req = new enyo.Ajax({url: SetTimerUrl});
			req.call({
			"service_1": 0,
			"date": "10.01",
			"start": "23%3A00",
			"stop": "23%3A03",
			"repeat": 0,
			"type": 6,
			"350a7f5ee27d22dbe36698b10930ff96_set_newtimer": "%C3%9Cbernehmen"			
		});	*/
		console.log("1a");
		
	/*var request = new enyo.Ajax({
		url: SetTimerUrl,
		method: "GET", //You can also use POST
		handleAs: "text"
	});*/

			/*service_1: 0,
			date: "10.01",
			start: "23%3A00",
			stop: "23%3A03",
			repeat: 0,
			type: 6,
			"350a7f5ee27d22dbe36698b10930ff96_set_newtimer": "%C3%9Cbernehmen"
			*/
	/*console.log("1b");
	request.response(enyo.bind(this, "processSetTimer")); //tells Ajax what the callback function is
	console.log("1c");
	request.go({}); //makes the Ajax call.		-
	*/
		
	
		
	},
	processDelTimer: function(inSender, inEvent)  {
		this.$.DelTimerConfirmPopup.show();
		helper = TimerID + 1;
		this.$.lblDelTimer.setContent("Delete Timer #" + helper);
	},
	processSetTimer: function(inSender, inEvent)  {
		//console.log("2");
		console.log("SetTimerSucc:" + inEvent);
		this.$.lbldebug.setContent(inEvent);
	},
	processSetTimerError: function(inSender, inEvent)  {
		//console.log("");
		console.log("SetTimerError: " + inEvent);
		this.$.lbldebug.setContent(inEvent);
	},	
	delTimerCancel: function() {
		this.$.DelTimerConfirmPopup.hide();
	},
	delTimerConfirm: function() {
		console.log("Timer gelöscht");
		this.$.wsdeltimerconfirm.setUrl(TSAddress + "/index_s.html?" + TSPWMD5 + "_confirmdelete=Ja");
		this.$.wsdeltimerconfirm.send();		
		this.$.DelTimerConfirmPopup.hide();
		this.buttonTimers();
	},	
	processLogin: function(inSender, inEvent) {
		// do something with it
		//console.log(inEvent.data);
		this.$.lbldebug.setContent(inEvent.data);//.result[1].countryCode));
	},
	processSTResponse: function(inSender, inEvent) {
		// do something with it
		//console.log(inEvent.data);
		//this.$.lbltext.setContent(inEvent.data);//.result[1].countryCode));
		//SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_set_newtimer=%C3%9Cbernehmen";
			
		
		SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_newhddtimer=Neuer+DVR-Timer";
		
		var formData = new FormData();
		formData.append("service_1", 0);
		formData.append("date", "11.01");
		formData.append("start", "23:00"); //%3A00",
		formData.append("stop", "23:03"); //%3A03",
		formData.append("repeat", 0);
		formData.append("type", 6);
		formData.append("350a7f5ee27d22dbe36698b10930ff96_set_newtimer", "Übernehmen");
		
		/*var xhr = new XMLHttpRequest();
		xhr.open('POST', SetTimerUrl, true); 
		xhr.send(formData);		
		*/
		

		
		params = {
			"service_1": 0,
			"date": "10.01",
			"start": "23:00", //%3A00",
			"stop": "23:03", //%3A03",
			"repeat": 0,
			"type": 6,
			"350a7f5ee27d22dbe36698b10930ff96_set_newtimer": "Übernehmen"			
		};
		console.log(params);
		console.log(formData);
		var request = new enyo.Ajax({
			url: SetTimerUrl,
			method: "POST",
			//handleAs: "text",
			postBody: formData
		});
		request.response(enyo.bind(this, "processSetTimer"));
		request.error(this, "processSetTimerError");
		request.go(); 	
	},
	processSTResponse2: function(inSender, inEvent) {   
	    SetTimerUrl = "http://marcel.homelinux.org:90/index_s.html?350a7f5ee27d22dbe36698b10930ff96_newhddtimer=Neuer+DVR-Timer";
	    params = {
		"service_1": 0,
		"date": "20.01",
		"start": "03:00",
		"stop": "03:03",
		"repeat": 0,
		"type": 6,
		"350a7f5ee27d22dbe36698b10930ff96_set_newtimer": "Übernehmen"                               
	    };
	    var request = new enyo.Ajax({
		    url: SetTimerUrl,
		    //handleAs: "text",
		    method: "POST"
	    });
	    request.response(this, "processSetTimer");
	    request.error(this, "processSetTimerError");
	    request.go(params);
	},
	
	processTimers: function(inSender, inEvent) {
		//console.log(inEvent.data);
		//this.$.lbltext.setContent(inEvent.data);//.result[1].countryCode));
		Timers = []; //Timerliste löschen
		helper= inEvent.data;
		//Tabelle suchen
		var strlength = helper.length;
		var Pos = helper.indexOf("</thead>", 0); //
		var i = 0;
		while (Pos >= 0)
		  {
			//Einträge suchen
			Pos = helper.indexOf("TV: ", Pos + 2); //
			if (Pos  >= 0 )
				{var Pos2 = helper.indexOf(">", Pos + 3);
					Timers[i] = new Object();
					Timers[i]["sender"] = helper.substring(Pos + 4, Pos2 -4);
					Pos3 = helper.indexOf("'center'>", Pos2);
					Pos4 = helper.indexOf("<", Pos3);
					Timers[i]["datum"] = helper.substring(Pos3 + 9, Pos4);
					Pos5 = helper.indexOf("'center'>", Pos4);
					Pos6 = helper.indexOf("<", Pos5);
					Timers[i]["start"] = helper.substring(Pos5 + 9, Pos6);
					Pos7 = helper.indexOf("'center'>", Pos6);
					Pos8 = helper.indexOf("<", Pos7);
					Timers[i]["stop"] = helper.substring(Pos7 + 9, Pos8);
					Pos9 = helper.indexOf("<td>", Pos8);
					Pos10 = helper.indexOf("</td>", Pos9);
					Timers[i]["titel"] = helper.substring(Pos9 + 4, Pos10);
					//Timers[i] = helper.substring(Pos9 + 4, Pos10);
					i++;
					//console.log("-" + helper.substring(Pos + 4, Pos2 -4) + "-" + helper.substring(Pos3 + 9, Pos4) + "-");
					//console.log(strlength + " " + Pos + " " + Pos2 + " " + Pos3 + " " +Pos4);
					//Pos++;
				}
		  };		
		//console.log(Timers.length - 1);
		this.$.repeater.setCount(Timers.length);
		
	},	
	TSAddressChanged: function(inSender, inEvent) {
		TSAddress = this.$.serverAddress.getValue();
	},
	TimerIDChanged: function(inSender, inEvent) {
		TimerID = this.$.delTimerID.getValue();
		TimerID = TimerID - 1;
	},	
	TSPWChanged: function(inSender, inEvent) {
		//TSPWMD5 =   //     TSAddress = this.$.serverAddress.getValue();
	},
	setupItem: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var item = inEvent.item;
		item.$.titel.setContent(Timers[index].titel);
		item.$.sender.setContent(Timers[index].sender);
		item.$.datum.setContent(Timers[index].datum);
		item.$.time.setContent(Timers[index].start + " - " + Timers[index].stop);
		//item.$.stop.setContent(Timers[index].stop);
		this.resize();
		
	},
	TimerHeld: function(inSender, inEvent){
		console.log(inEvent.index);
		TimerID = inEvent.index;
		this.$.lbltimerpopup.setContent(Timers[TimerID].titel);
		this.$.lbltimerdatumpopup.setContent(Timers[TimerID].datum);
		this.$.TimerSelPopup.show();		
	},
	SelTimerClosePopup: function(inSender, inEvent){
		this.$.TimerSelPopup.hide();
	},
	modTimer: function(inSender, inEvent){
		this.$.TimerSelPopup.hide();
	},
	delTimer: function(inSender, inEvent){
		//TimerID = inEvent.index;
		console.log(Timers[TimerID].titel + " " + Timers[TimerID].start);
		this.$.wsdeltimer.setUrl(TSAddress + "/index_s.html?" + TSPWMD5 + "_deletetimer_" + TimerID + "=L%C3%B6schen");
		this.$.wsdeltimer.send();				
		this.$.TimerSelPopup.hide();
	}	
});