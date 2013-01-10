enyo.kind({
	name : "Toolset",
	//kind : enyo.VFlexBox,
	//style : "background-color: White",
	//flex : 1,
	components : [ {
		name : "launchApp",
		kind : "PalmService",
		service : "palm://com.palm.applicationManager/",
		method : "launch",
		onSuccess : "launchFinished",
		onFailure : "launchFail",
		onResponse : "gotResponse",
		subscribe : true
	} ]
})

function SuchenUndErsetzen(QuellText, SuchText, ErsatzText) { // Erstellt von Ralf Pfeifer
	// Fehlerpruefung
	if ((QuellText == null) || (SuchText == null)) {
		return null;
	}
	if ((QuellText.length == 0) || (SuchText.length == 0)) {
		return QuellText;
	}

	// Kein ErsatzText ?
	if ((ErsatzText == null) || (ErsatzText.length == 0)) {
		ErsatzText = "";
	}

	var LaengeSuchText = SuchText.length;
	var LaengeErsatzText = ErsatzText.length;
	var Pos = QuellText.indexOf(SuchText, 0);

	while (Pos >= 0) {
		QuellText = QuellText.substring(0, Pos) + ErsatzText
				+ QuellText.substring(Pos + LaengeSuchText);
		Pos = QuellText.indexOf(SuchText, Pos + LaengeErsatzText);
	}
	return QuellText;
};

JetztLesen = function(QuellText, Suchtext, Endtext, Eintrag) {
	var Pos = QuellText.indexOf(Suchtext, 0); // Start der Section
	var Pos2 = QuellText.indexOf(Endtext, Pos); // Ende der Section
	var Zieltext = "";
	var Laenge = Suchtext.length;

	switch (Eintrag) {
	case 2: //Jetzt
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		break;
	case 3: //Vorher 1
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		break;
	case 4: //Vorher 2
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		break;
	case 5: //Vorher 3
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		break;
	case 6: //Vorher 3
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		break;
	case 7: //Vorher 3
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		Pos = QuellText.indexOf(Suchtext, Pos + Laenge); // Start der Section
		break;
	}
	;

	Pos2 = QuellText.indexOf(Endtext, Pos); // Ende der Section
	Zieltext = QuellText.substring(Pos + Laenge, Pos2);
	return Zieltext;
};

gotJetzt = function(transport) {
	//this.$.labelModerator.setLabel("test "+ Counter);
	//var result = transport.responseText;
	enyo.log("gotJetzt ausgeloest!");
	Jetzt = transport;
	Jetzt = SuchenUndErsetzen(Jetzt, "&ouml;", "ö");
	Jetzt = SuchenUndErsetzen(Jetzt, "&uuml;", "ü");
	Jetzt = SuchenUndErsetzen(Jetzt, "&auml;", "ä");
	Jetzt = SuchenUndErsetzen(Jetzt, "&Ouml;", "Ö");
	Jetzt = SuchenUndErsetzen(Jetzt, "&Uuml;", "Ü");
	Jetzt = SuchenUndErsetzen(Jetzt, "&Auml;", "Ä");
	Jetzt = SuchenUndErsetzen(Jetzt, "&amp;", "&");
	Jetzt = SuchenUndErsetzen(Jetzt, "&szlig;", "ß");
	Jetzt = SuchenUndErsetzen(Jetzt, "<![CDATA[", "");
	Jetzt = SuchenUndErsetzen(Jetzt, "]]>", "");

	//Cover Gleich
	JetztImgUrl = this.JetztLesen(Jetzt, "<c>", "</c>", 3);

	/*	
		
		Counter++;
		//this.$.pictureJetzt.setSrc("http://mobile.swr3.de/common/swr3/cover/17719.jpg");//JetztImgUrl);
		//this.$.pictureGleich.setSrc(JetztImgUrl+"?"+Counter);
		this.$.pictureGleichKlein.setSrc(JetztImgUrl+"?"+Counter);
	 */
	//Gleich Cover
	GleichImgUrl = this.JetztLesen(Jetzt, "<c>", "</c>", 2);//2);
	//JetztImg = JetztImgUrl;			
	//Gleich Interpret
	GleichInterpret = this.JetztLesen(Jetzt, "<i>", "</i>", 1);
	//this.$.labelGleichInterpret.setLabel(GleichInterpret);
	//Gleich Titel
	GleichTitel = this.JetztLesen(Jetzt, "<t>", "</t>", 1);
	//this.$.labelGleichTitel.setLabel(GleichTitel);
	//Gleich URL Biographie
	GleichURL = this.JetztLesen(Jetzt, "<u>", "</u>", 1);
	//this.$.labelGleichTitel.setLabel(GleichTitel);

	//Jetzt Cover
	JetztImgUrl = this.JetztLesen(Jetzt, "<c>", "</c>", 3);//3);
	JetztImg = JetztImgUrl;
	//Jetzt Interpret
	JetztText = this.JetztLesen(Jetzt, "<w>", "</w>", 2);
	JetztInterpret = this.JetztLesen(Jetzt, "<i>", "</i>", 2);
	//Jetzt Titel
	JetztTitel = this.JetztLesen(Jetzt, "<t>", "</t>", 2);
	//Jetzt URL Biographie
	JetztURL = this.JetztLesen(Jetzt, "<u>", "</u>", 2);

	// Twittertexte festlegen
	TweetTitel = "'" + JetztTitel + "' von " + JetztInterpret;

	//Vorh1 Cover
	Vorh1ImgUrl = this.JetztLesen(Jetzt, "<c>", "</c>", 4);//4);
	//Vorher1 Interpret
	Vorh1Text = this.JetztLesen(Jetzt, "<w>", "</w>", 3);
	Vorh1Interpret = this.JetztLesen(Jetzt, "<i>", "</i>", 3);
	//this.$.labelVorh1.setLabel(Vorh1text);
	//this.$.labelVorh1Interpret.setLabel(Vorh1Interpret);
	//Vorher1 Titel
	Vorh1Titel = this.JetztLesen(Jetzt, "<t>", "</t>", 3);
	//this.$.labelVorh1Titel.setLabel(Vorh1Titel);
	//Vorher1 URL Biographie
	Vorh1URL = this.JetztLesen(Jetzt, "<u>", "</u>", 3);

	/*
	//Vorh1 Cover
	JetztImgUrl = this.JetztLesen(Jetzt, "<c>", "</c>", 3);
	Counter++;
	this.$.pictureVorh1.setSrc(JetztImgUrl+"?"+Counter);
	 */

	//Vorh2 Cover
	Vorh2ImgUrl = this.JetztLesen(Jetzt, "<c>", "</c>", 5);//5);			
	//Vorher2 Interpret
	Vorh2Text = this.JetztLesen(Jetzt, "<w>", "</w>", 4);
	Vorh2Interpret = this.JetztLesen(Jetzt, "<i>", "</i>", 4);
	//this.$.labelVorh2.setLabel(Vorh1text);
	//this.$.labelVorh2Interpret.setLabel(Vorh1Interpret);
	//Vorher2 Titel
	Vorh2Titel = this.JetztLesen(Jetzt, "<t>", "</t>", 4);
	//this.$.labelVorh2Titel.setLabel(Vorh1Titel);
	//Vorher2 URL Biographie
	Vorh2URL = this.JetztLesen(Jetzt, "<u>", "</u>", 4);

	/*
	//Vorh2 Cover
	JetztImgUrl = this.JetztLesen(Jetzt, "<c>", "</c>", 4);
	Counter++;
	this.$.pictureVorh2.setSrc(JetztImgUrl+"?"+Counter);
	 */

	//Vorh3 Cover
	Vorh3ImgUrl = this.JetztLesen(Jetzt, "<c>", "</c>", 6);//6);
	//Vorher3 Interpret
	Vorh3Text = this.JetztLesen(Jetzt, "<w>", "</w>", 5);
	Vorh3Interpret = this.JetztLesen(Jetzt, "<i>", "</i>", 5);
	//this.$.labelVorh3.setLabel(Vorh1text);
	//this.$.labelVorh3Interpret.setLabel(Vorh1Interpret);
	//Vorher3 Titel
	Vorh3Titel = this.JetztLesen(Jetzt, "<t>", "</t>", 5);
	//this.$.labelVorh3Titel.setLabel(Vorh1Titel);

	//Vorher3 URL Biographie
	Vorh3URL = this.JetztLesen(Jetzt, "<u>", "</u>", 5);

	/*
	//Vorh3 Cover
	JetztImgUrl = this.JetztLesen(Jetzt, "<c>", "</c>", 5);
	Counter++;
	this.$.pictureVorh3.setSrc(JetztImgUrl+"?"+Counter);
	 */

	//Sendungsname
	Sendung = this.JetztLesen(Jetzt, "<n>", "</n>", 1);
	//Moderator
	Moderator = this.JetztLesen(Jetzt, "<m>", "</m>", 1);

	//Mojo.Log.info("GotJetzt " + Moderator);
	//Live-Daten updaten auf Pre / Pixi

	/*
	if (ERPrefs.device != 3){
				Counter++;
				this.$.labelSendung.setLabel("SWR3 live: " + Sendung);
				this.$.labelModerator.setLabel("mit " + Moderator);
				
				this.$.labelGleichÜberschrift.setLabel("Gleich - "+GleichInterpret+" - "+GleichTitel);
				
				this.$.labelJetzt.setLabel("Jetzt (seit "+Jetzttext+"):");
				this.$.labelJetztInterpret.setLabel(JetztInterpret);
				this.$.labelJetztTitel.setLabel(JetztTitel);
				this.$.pictureJetzt.setSrc(JetztImgUrl+"?"+Counter); //http://swr.ivwbox.de/cgi-bin/ivw/CP/SWR3;p=http%3A%2F%2Fmobile.swr3.de%2Fpalm%2Fstart%2Findex.html&amp;i=SWR3.de%2Fmobil%2Fpalm%2F&amp;k=90
	
				this.$.labelVorh1.setLabel(Vorh1text + " - " + Vorh1Interpret + " - " + Vorh1Titel);			
				this.$.labelVorh2.setLabel(Vorh2text + " - " + Vorh2Interpret + " - " + Vorh2Titel);
				this.$.labelVorh3.setLabel(Vorh3text + " - " + Vorh3Interpret + " - " + Vorh3Titel);
	}
	 */

	/*
	//Live-Daten updaten auf Touchpad
	if (ERPrefs.device == 3){
				Counter++;
				this.$.labelWLTP.setLabel("SWR3-live: " + Sendung + " mit " + Moderator);
				//this.$.labelModerator.setLabel("mit " + Moderator);
				
				this.$.labelGleichInterpretTP.setLabel(GleichInterpret);
				this.$.labelGleichTitelTP.setLabel(GleichTitel);
				this.$.pictureGleichTP.setSrc(GleichImg+"?"+Counter);
				
				this.$.labelJetztTP.setLabel("Jetzt (seit "+Jetzttext+"):");
				this.$.labelJetztInterpretTP.setLabel(JetztInterpret);
				this.$.labelJetztTitelTP.setLabel(JetztTitel);
				this.$.pictureJetztTP.setSrc(JetztImgUrl+"?"+Counter); //http://swr.ivwbox.de/cgi-bin/ivw/CP/SWR3;p=http%3A%2F%2Fmobile.swr3.de%2Fpalm%2Fstart%2Findex.html&amp;i=SWR3.de%2Fmobil%2Fpalm%2F&amp;k=90
				//Mojo.Log.info(JetztImgUrl);
	
				
				this.$.labelVorher1TP.setLabel(Vorh1text);
				this.$.labelVorher1InterpretTP.setLabel(Vorh1Interpret);
				this.$.labelVorher1TitelTP.setLabel(Vorh1Titel);
				this.$.pictureVorher1TP.setSrc(Vorh1Img+"?"+Counter); 
				
				this.$.labelVorh2TP.setLabel(Vorh2text);
				this.$.labelVorh2InterpretTP.setLabel(Vorh2Interpret);
				this.$.labelVorh2TitelTP.setLabel(Vorh2Titel);
				this.$.pictureVorh2TP.setSrc(Vorh2Img+"?"+Counter); 						

				this.$.labelVorh3TP.setLabel(Vorh3text);
				this.$.labelVorh3InterpretTP.setLabel(Vorh3Interpret);
				this.$.labelVorh3TitelTP.setLabel(Vorh3Titel);
				this.$.pictureVorh3TP.setSrc(Vorh3Img+"?"+Counter);
				
				//this.$.labelVorh1.setLabel(Vorh1text + " - " + Vorh1Interpret + " - " + Vorh1Titel);			
				//this.$.labelVorh2.setLabel(Vorh2text + " - " + Vorh2Interpret + " - " + Vorh2Titel);
				//this.$.labelVorh3.setLabel(Vorh3text + " - " + Vorh3Interpret + " - " + Vorh3Titel);
	}
	
	//Bei Neustart Spinner abschalten und Bild aufbauen
	if (Neustart){
			this.SetMode(ERPrefs.startmode);
	};
	 */

};

TweetOut = function(TweetText) {
	enyo.log("TWEETOUT " + TweetText);
	TweetText = "♫ Höre gerade " + ClickTitel + " von " + ClickInterpret
			+ " mit SWR3-Elchradio für HP webOS! ♫ ";//+ "\n" + JetztImg + " \n " + JetztURL;
	//TweetText = TweetText + " mit @HP Touchpad";
	params = {
		action : "post",
		msg : TweetText
	};
	this.$.Toolset.$.launchApp.call({
		"id" : "com.funkatron.app.spaz-hd",
		"params" : params
	});
	//enyo.log("Tweet: " + TweetText);
};

ImageFiltern = function (QuellText, SuchText, ErsatzText)
{   // Falls im Wetter bei Sturmwarnung ein Image enthalten ist als HTML, wird dies gefiltert
    if ((QuellText == null) || (SuchText == null))           { return null; }
    var LaengeQuellText = QuellText.length;
    var Pos = QuellText.indexOf(">", 0);
    if (Pos || 0){
    		QuellText = QuellText.substring(Pos + 1, LaengeQuellText);
    }
    return QuellText;
}