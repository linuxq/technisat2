TSAddress = "http://192.168.2.48";
TSPWMD5 = "350a7f5ee27d22dbe36698b10930ff96";
TimerID = 0;
enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx enyo-fit",
	components: [
		{kind: "onyx.Toolbar", components: [
			{content: "Technisat Frontend"},
			//{kind: "onyx.Checkbox", onchange: "checkboxChange"}
		]},
		{kind: "Panels", fit: true, classes: "panels-sample-sliding-panels enyo-fit", arrangerKind: "CollapsingArranger", wrap: false, components: [
			{name: "left", components: [
				{classes: "onyx-sample-divider", content: "Receiver"},
				{classes: "onyx-toolbar-inline", components: [
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", placeholder: "IP address", name: "serverAddress", value: "http://marcel.homelinux.org:90", onchange: "TSAddressChanged"}
					]},
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", type:"password", name: "serverPW", placeholder: "Enter password", onchange: "TSPWChanged"}
					]}
				]},
				{classes: "onyx-sample-divider", content: "MD5Hex"},
				{content: "350a7f5ee27d22dbe36698b10930ff96"},
				{kind:"onyx.Button", content: "Login", ontap:"buttonLogin"},
				{kind:"onyx.Button", content: "Timers", ontap:"buttonTimers"},
				{tag: "br"},
				{kind:"onyx.Button", content: "Delete timer #", ontap:"buttonDelTimer"},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", name: "delTimerID", placeholder: "1", onchange: "TimerIDChanged"}
				]},				
				{kind: "onyx.Groupbox", style:"padding:5px;", components: [
					{kind: "onyx.GroupboxHeader", content: "new DVR timer"},			
					//{content:"DATE",classes:"onyx-sample-divider"},
					{classes: "onyx-toolbar-inline", components: [
						{name:"NewTimerDate", kind:"onyx.DatePicker"}
					]},
					{classes: "onyx-toolbar-inline", components: [
						{name:"NewTimerStart", kind:"onyx.TimePicker", is24HrMode:true},
						{name:"NewTimerStop", kind:"onyx.TimePicker", is24HrMode:true},
						{kind:"onyx.Button", content: "Set Timer", ontap:"buttonSetTimer"},
					]}					
				]}					
			]},		
			/*{name: "middle", components: [
				{kind: "WebView", url: "http://www.google.com"}
			]},*/
			{name: "body", fit: true, components: [
				{kind: "Scroller", classes: "enyo-fit", touch: true, components: [
					//{classes: "panels-sample-sliding-content", name: "lbltext", content: ""}
					{content: "", name: "lbltext", allowHtml: true}
				]}
			]}
		]},
		{name: "DelTimerConfirmPopup", classes: "onyx-sample-popup", kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", components: [
				{kind: "onyx.InputDecorator", name: "lblDelTimer", content: "Delete timer #", components: [
				]},
				{tag: "br"},
				{kind: "onyx.Button", content: "No", classes: "onyx-negative", ontap: "delTimerCancel"},
				{kind: "onyx.Button", content: "Yes", classes: "onyx-affirmative", ontap: "delTimerConfirm"}
		]},		
		{kind: "WebService", name:"wslogin", url: "", onResponse:"processLogin", callbackName: "callback"},
		{kind: "WebService", name:"wstimers", url: "", onResponse:"processTimers", callbackName: "callback"},
		{kind: "WebService", name:"wsdeltimer", url: "", onResponse:"processDelTimer", callbackName: "callback"},
		{kind: "WebService", name:"wsdeltimerconfirm", url: "", onResponse:"", callbackName: "callback"},
		{kind: "WebService", name:"wssettimer", url: "", onResponse:"processSTResponse", callbackName: "callback"},
	],
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
		console.log("2");
		console.log(inEvent);
		this.$.lbltext.setContent(inEvent);
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
		this.$.lbltext.setContent(inEvent.data);//.result[1].countryCode));
	},
	processSTResponse: function(inSender, inEvent) {
		// do something with it
		//console.log(inEvent.data);
		//this.$.lbltext.setContent(inEvent.data);//.result[1].countryCode));
		//SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_set_newtimer=%C3%9Cbernehmen";
		
		SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_newhddtimer=Neuer+DVR-Timer";
		params = {
			"service_1": 0,
			"date": "10.01",
			"start": "23:00", //%3A00",
			"stop": "23:03", //%3A03",
			"repeat": 0,
			"type": 6,
			"350a7f5ee27d22dbe36698b10930ff96_set_newtimer": "%C3%9Cbernehmen"			
		};
		console.log(params);
		var request = new enyo.Ajax({
			url: SetTimerUrl,
			method: "POST",
			postBody: params
		});
		request.response(enyo.bind(this, "processSetTimer")); 
		request.go(); 	
	},
	processSTResponse2: function(inSender, inEvent) {	
		SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_newhddtimer=Neuer+DVR-Timer";
		params = {
			"service_1": 0,
			"date": "10.01",
			"start": "23:00",
			"stop": "23:03",
			"repeat": 0,
			"type": 6,
			"350a7f5ee27d22dbe36698b10930ff96_set_newtimer": "%C3%9Cbernehmen"                                
		};
		var request = new enyo.Ajax({
			    url: SetTimerUrl,
			    method: "POST"
		});
		request.response(this, "processSetTimer");
		request.go(params);
	},
	
	processTimers: function(inSender, inEvent) {
		//console.log(inEvent.data);
		//this.$.lbltext.setContent(inEvent.data);//.result[1].countryCode));
		timerliste = "<html><body>";
		helper= inEvent.data;
		//Tabelle suchen
		var strlength = helper.length;
		var Pos = helper.indexOf("</thead>", 0); //
		var i = 1;
		while (Pos >= 0)
		  {
			//Einträge suchen
			Pos = helper.indexOf("TV: ", Pos + 2); //
			if (Pos  >= 0 )
				{var Pos2 = helper.indexOf(">", Pos + 3);
					timerliste = timerliste + helper.substring(Pos + 4, Pos2 -4);
					Pos3 = helper.indexOf("'center'>", Pos2);
					Pos4 = helper.indexOf("<", Pos3);
					timerliste = timerliste + "-" + helper.substring(Pos3 + 9, Pos4);
					Pos5 = helper.indexOf("'center'>", Pos4);
					Pos6 = helper.indexOf("<", Pos5);
					timerliste = timerliste + "-" + helper.substring(Pos5 + 9, Pos6);
					Pos7 = helper.indexOf("'center'>", Pos6);
					Pos8 = helper.indexOf("<", Pos7);
					timerliste = timerliste + "-" + helper.substring(Pos7 + 9, Pos8);
					Pos9 = helper.indexOf("<td>", Pos8);
					Pos10 = helper.indexOf("</td>", Pos9);
					timerliste = timerliste + "-" + helper.substring(Pos9 + 4, Pos10) + "<br>";										
					//console.log("-" + helper.substring(Pos + 4, Pos2 -4) + "-" + helper.substring(Pos3 + 9, Pos4) + "-");
					//console.log(strlength + " " + Pos + " " + Pos2 + " " + Pos3 + " " +Pos4);
					//Pos++;
				}
		  };		
		timerliste = timerliste + "</body></html>";
		this.$.lbltext.setContent(timerliste);
		
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
});