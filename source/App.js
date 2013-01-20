TSAddress = ""; //"http://192.168.2.48";
TSPWMD5 = "";
TimerID = 0;
Timers = new Array();
NewTimer = [];
channelList = new Array();
enyo.kind({
  name: "Channel",
  kind: "onyx.MenuItem",
  published: {
    value: 0
  }
});

enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx enyo-fit",
	style: "background-color: grey",
	components: [
		{kind: "onyx.Toolbar", components: [
			{content: "Technisat Frontend"},
			{kind: "onyx.MenuDecorator", onSelect: "MenuItemSelected", components: [
				{content: "Settings"},
				{kind: "onyx.Menu", floating: true, components: [
					{content: "Receiver setup"},
					{content: "Add new timer"},
					//{classes: "onyx-menu-divider"},
					//{content: "3"},
				]}
			]},
			{kind:"onyx.Button", content: "+", ontap:"OpenAddTimerPopup"},
			/*{
				kind : "onyx.PickerDecorator",
				components : [{
						kind : "onyx.PickerButton",
						content : "Channel",
						style : "width: 220px"
					}, {
						kind : "onyx.Picker",
						name : "NewTimerChannel2",
						onSelect : "ChannelSelected",
						onSetupItem : "setupChannelSelect",
						components : [{
								name : "channel",
								content : "Auswählen"
							}
						]
					}
				]
			},
			*/

			
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
			{ tag: "form", name: "myTimerForm", showing: false, action: "http://192.168.2.48/index_s.html?350a7f5ee27d22dbe36698b10930ff96_newhddtimer=Neuer+DVR-Timer", components: [
				{ tag: "input", type: "hidden", name: "start", value:"23:00"},
				{ tag: "input", type: "hidden", name: "ende", value:"23:10"}
			]},
			
		{name: "DelTimerConfirmPopup", classes: "onyx-sample-popup", kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", components: [
				{kind: "onyx.InputDecorator", name: "lblDelTimer", content: "Are you sure?", components: [
				]},
				{tag: "br"},
				{kind: "onyx.Button", content: "Yes", classes: "onyx-affirmative", ontap: "delTimerConfirm"},
				{kind: "onyx.Button", content: "No", classes: "onyx-negative", ontap: "delTimerCancel"}
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
		{name: "NewTimerPopup", classes: "onyx-sample-popup", kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", components: [
				/*{kind: "onyx.InputDecorator", content: "Add new timer:", components: [
				]},
				{kind: "onyx.PickerDecorator", components: [
					{kind: "onyx.PickerButton", content: "Channel", style: "width: 220px"},
					{kind: "onyx.Picker", name:"NewTimerChannel", onSelect: "ChannelSelected", components: [
						{content: "ARD HD", value: 0, active: true},
						{content: "ZDF HD", value: 1},
						{content: "RTL   ", value: 2},
						{content: "SAT1  ", value: 3}
					]}
				]},*/
				{classes: "onyx-sample-divider", content: "Channel"},				
				{
				    kind: "onyx.PickerDecorator",
				    components: [{
						style: "width: 300px;"
					}, 
					{
					      kind: "onyx.FlyweightPicker",
					      name: "NewTimerChannel2",
					      onSetupItem: "setupChannelSelect",
					      onSelect: "ChannelSelected",
					      count: 1,
					      style: "text-align: left",
					      components: [{
						kind: "Channel",
						name: "channelSelect",
						content: "Test",
						value: 0,
						active: true
					      }]
					}
				]},

				{kind: "FittableColumns", fit: true, classes: "fittable-sample-mtb fittable-sample-o", components: [
					{classes: "onyx-sample-divider", fit: true, content: "Date"},				
					{classes: "onyx-toolbar-inline", components: [
						{name:"NewTimerDate", kind:"onyx.DatePicker"}
					]}
				]},
				
				{kind: "FittableColumns", fit: true, classes: "fittable-sample-mtb fittable-sample-o", components: [
					{classes: "onyx-sample-divider", content: "Start"},
					{content: "", fit: true, classes: "fittable-sample-mlr fittable-sample-o"},
					{name:"NewTimerStart", kind:"onyx.TimePicker", is24HrMode:true}
				]},							
				{kind: "FittableColumns", fit: true, classes: "fittable-sample-mtb fittable-sample-o", components: [
					{classes: "onyx-sample-divider", content: "Stop"},
					{content: "", fit: true, classes: "fittable-sample-mlr fittable-sample-o"},
					{name:"NewTimerStop", kind:"onyx.TimePicker", is24HrMode:true}
				]},				
				{kind: "FittableColumns", fit: true, classes: "fittable-sample-mtb fittable-sample-o", components: [
					{classes: "onyx-sample-divider", fit: true, content: "Type"},
					//{content: "", fit: true, classes: "fittable-sample-mlr fittable-sample-o"},
					{kind: "onyx.PickerDecorator",  components: [
						{},
						{kind: "onyx.Picker", name:"NewTimerRepeat", onSelect: "RepeatSelected", components: [
							{content: "once  ", value: 0, active: true},
							{content: "daily ", value: 1},
							{content: "weekly", value: 2},
							{content: "Mo-Fr", value: 3},
							{content: "Sa-So", value: 4},
						]}
					]}
				]},				
				{classes: "onyx-sample-divider", content: " "},

				{kind: "FittableColumns", fit: true, classes: "fittable-sample-mtb fittable-sample-o", components: [
					{kind:"onyx.Button", content: "Set Timer", classes: "onyx-affirmative", ontap:"buttonSetTimer"},			
					//{kind: "onyx.Button", content: "Save", classes: "onyx-negative", ontap: "buttonSetNewTimer"},
					//{tag: "br"},
					{content: "", fit: true, classes: "fittable-sample-mlr fittable-sample-o"},
					{kind: "onyx.Button", content: "Abbruch", classes: "onyx-negative", ontap: "buttonCloseNewTimerPopup"}
				]},				
		]},		
		{name: "LoginPopup", classes: "onyx-sample-popup", kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", components: [
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", placeholder: "IP address", name: "serverAddress", value: "http://192.168.2.48"}
				]},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", type:"password", name: "serverPW", placeholder: "Enter password"}
				]},			
				{tag: "br"},
				{kind: "onyx.Button", content: "Save", ontap: "LoginSave"},
				{kind: "onyx.Button", content: "Cancel", ontap: "LoginClose"}
		]},		
		{kind: "WebService", name:"wslogin", url: "", onResponse:"processLogin", callbackName: "callback"},
		{kind: "WebService", name:"wstimers", url: "", onResponse:"processTimers", callbackName: "callback"},
		{kind: "WebService", name:"wsdeltimer", url: "", onResponse:"processDelTimer", callbackName: "callback"},
		{kind: "WebService", name:"wsdeltimerconfirm", url: "", onResponse:"", callbackName: "callback"},
		{kind: "WebService", name:"wssettimer", url: "", onResponse:"processSTResponse", callbackName: "callback"},
		{kind: "WebService", name:"wsgetchannels", url: "", onResponse:"GetChannelsResponse", callbackName: "callback"},			
	],
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
		window.setTimeout(this.startapp(), 1);
		//this.$.NewTimerChannel2.setCount(this.channelList.length);		
		this.resize();		
	},
	create : function () {
		this.inherited(arguments);
		//this.$.channel.setContent(this.ChannelList);
	},	
	startapp: function(inSender,inEvent){		
		//console.log("StartAPP");		
		TSAddress = localStorage.getItem("tsaddress");
		TSPWMD5 = localStorage.getItem("tspwmd5");
		console.log("geladen:" + TSAddress + " - " + TSPWMD5);
		if (TSPWMD5 == null)
		{
			this.$.LoginPopup.show();
		} else
		{
			//Kanalliste laden
			SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_newhddtimer=Neuer+DVR-Timer";
			this.$.wsgetchannels.setUrl(SetTimerUrl);
			this.$.wsgetchannels.send();			
		}
		this.buttonTimers();
		NewTimer = [];
		NewTimer["channel"] = 0;
		NewTimer["repeat"] = 0;
	},
	setupChannelSelect: function (inSender, inEvent) {
	  this.$.channelSelect.setContent(this.channelList[inEvent.index]);
	  this.$.channelSelect.setValue(inEvent.index);
	},
	ChannelSelected2: function (inSender, inEvent) {
	  enyo.log(inEvent.selected.getValue());
	  enyo.log(inEvent.selected.getContent());
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
	ChannelSelected: function(inSender, inEvent){
		//enyo.log(inEvent.selected.getValue());
		//enyo.log(inEvent.selected.getContent());		
		//help = inEvent.selected;
		NewTimer["channel"] = inEvent.selected.getValue();	
	},
	RepeatSelected: function(inSender, inEvent){
		help = inEvent.selected;
		NewTimer["repeat"] = help.value;
		console.log(NewTimer.repeat);
	},	
	buttonSetTimer: function(inSender) {

		//NewTimer = [];

		//Datum
		help = this.$.NewTimerDate.getValue();
		help=help.getDate();
		NewTimer["date"] =  ( help < 10 ? "0" : "" ) + help;		
		help = this.$.NewTimerDate.getValue();
		help=help.getMonth();
		help++;
		NewTimer.date= NewTimer.date + "." + ( help < 10 ? "0" : "" ) + help;

		//Start
		help = this.$.NewTimerStart.getValue();
		help=help.getHours();
		NewTimer["start"]= ( help < 10 ? "0" : "" ) + help;
		help = this.$.NewTimerStart.getValue();
		help=help.getMinutes();
		NewTimer["start"]= NewTimer.start + ":" + ( help < 10 ? "0" : "" ) + help;
		
		//Stop
		help = this.$.NewTimerStop.getValue();
		help=help.getHours();
		NewTimer["stop"]= ( help < 10 ? "0" : "" ) + help;
		help = this.$.NewTimerStop.getValue();
		help=help.getMinutes();
		NewTimer["stop"]= NewTimer.stop + ":" + ( help < 10 ? "0" : "" ) + help;
	
		//Channel
		//help = this.$.NewTimerChannel.Value();
		//console.log("Channel: " + help);
		
		SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_newhddtimer=Neuer+DVR-Timer";
		this.$.wssettimer.setUrl(SetTimerUrl);
		this.$.wssettimer.send();		
	},
	processDelTimer: function(inSender, inEvent)  {
		this.$.DelTimerConfirmPopup.show();
		helper = TimerID + 1;
		//this.$.lblDelTimer.setContent("Delete Timer #" + helper);
	},
	processSetTimer: function(inSender, inEvent)  {
		//console.log("2");
		//console.log("SetTimerSucc:" + inEvent);
		//this.$.lbldebug.setContent(inEvent);
		this.buttonTimers();
		this.$.NewTimerPopup.hide();
	},
	processSetTimerError: function(inSender, inEvent)  {
		//console.log("");
		console.log("SetTimerError!");
		//this.$.lbldebug.setContent(inEvent);
		this.buttonTimers();
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
		//Kanäle einselen
		//console.log("LOGIN**********");
		SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_newhddtimer=Neuer+DVR-Timer";
		this.$.wsgetchannels.setUrl(SetTimerUrl);
		this.$.wsgetchannels.send();		
		this.$.lbldebug.setContent(inEvent.data);//.result[1].countryCode));
	},
	processSTResponse: function(inSender, inEvent) {
		//this.getChannels(inEvent.data);
		SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_newhddtimer=Neuer+DVR-Timer";
		params = {
		    //"tvMode": "1_350a7f5ee27d22dbe36698b10930ff96_set_tvMode_backtonew",
		    "service_1": NewTimer.channel, //0,
		    "date": NewTimer.date, //"20.01",
		    "start": NewTimer.start, //"03:00",
		    "stop": NewTimer.stop, //"03:03",
		    "repeat": NewTimer.repeat, //0,
		    "type": 6,
		    "350a7f5ee27d22dbe36698b10930ff96_set_newtimer": "Übernehmen"                               
		};
		var request = new enyo.Ajax({
			url: SetTimerUrl,
			method: "POST",
			//handleAs: "text",
			postBody: params //formData
		});
		request.response(enyo.bind(this, "processSetTimer"));
		request.error(this, "processSetTimerError");
		request.go(); 	
	},
	GetChannelsResponse: function(inSender, inEvent){
		this.channelList = [];
		helper = inEvent.data;
		//Tabelle suchen
		var strlength = helper.length;
		var Pos = helper.indexOf("service_1", 0); //
		PosEndeList = helper.indexOf("</select>", Pos);
		var i = 0;
		while (Pos >= 0)
		  {
			//Einträge suchen
			Pos = helper.indexOf("value='", Pos + 2); //
			if (Pos  >= 0 ) 
				{var Pos2 = helper.indexOf("'", Pos + 7);
					if (Pos >= PosEndeList){
						Pos = -1;	
					}
					else {
						//this.channelList[i] = helper.substring(Pos + 7 , Pos2);
						Pos3  = helper.indexOf(">", Pos + 1);
						Pos4  = helper.indexOf("<", Pos + 1);
						//console.log("Found " + helper.substring(Pos3 + 1, Pos4)+"*");
						this.channelList[i] = helper.substring(Pos3 + 5, Pos4);
					}
					i++;
				}
		  };
		this.$.NewTimerChannel2.setCount(this.channelList.length);		  
		//this.$.repeater.setCount(Timers.length);		
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
		//console.log(Timers[TimerID].titel + " " + Timers[TimerID].start);
		this.$.wsdeltimer.setUrl(TSAddress + "/index_s.html?" + TSPWMD5 + "_deletetimer_" + TimerID + "=L%C3%B6schen");
		this.$.wsdeltimer.send();				
		this.$.TimerSelPopup.hide();
	},
	MenuItemSelected: function(inSender, inEvent){
		switch (inEvent.content) {
		case 'Receiver setup':
			this.$.LoginPopup.show();
			break;
		case 'Add new timer':
			this.$.NewTimerPopup.show();
			break;
		}			
		//console.log(inEvent.content);
		//console.log(inSender);
	},
	LoginClose: function(inSender, inEvent){
		this.$.LoginPopup.hide();
	},	
	LoginSave: function(inSender, inEvent){
		TSPWMD5 = MD5(this.$.serverPW.getValue());
		TSAddress = this.$.serverAddress.getValue();
		//console.log("Neues Login: " + TSAddress + " - " + TSPWMD5);
		localStorage.setItem("tsaddress", TSAddress);
		localStorage.setItem("tspwmd5", TSPWMD5);
		this.buttonTimers();
		//Kanalliste laden
		SetTimerUrl = TSAddress + "/index_s.html?" + TSPWMD5 + "_newhddtimer=Neuer+DVR-Timer";
		this.$.wsgetchannels.setUrl(SetTimerUrl);
		this.$.wsgetchannels.send();		
		this.$.LoginPopup.hide();
	},
	buttonCloseNewTimerPopup: function(inSender, inEvent){
		this.$.NewTimerPopup.hide();
	},
	buttonSetNewTimer: function(inSender, inEvent){
		this.$.NewTimerPopup.hide();
		this.buttonSetTimer();
	},
	OpenAddTimerPopup: function(inSender, inEvent){
		this.$.NewTimerPopup.show();		
	}
});