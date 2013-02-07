/**
 * Created with JetBrains WebStorm.
 * User: user
 * Date: 18/01/13
 * Time: 15:49
 * To change this template use File | Settings | File Templates.
 */
Ext.define('DriveOnSurface.view.PlayMode', {
    extend:'Ext.Container',
    alias: "widget.play",
    fullscreen : true,
    initialize: function(){
        this.callParent(arguments);

        /*this.getEventDispatcher().addListener('element', '#gauche', 'touchstart', this.onTouchGaucheEvent, this );
        this.getEventDispatcher().addListener('element', '#gauche', 'touchend', this.onReleaseGaucheEvent, this );
        this.getEventDispatcher().addListener('element', '#gauche', 'longpress', this.onLongGaucheEvent, this );
        this.getEventDispatcher().addListener('element', '#droite', 'touchstart', this.onTouchDroiteEvent, this );
        this.getEventDispatcher().addListener('element', '#droite', 'touchend', this.onReleaseDroiteEvent, this );
        this.getEventDispatcher().addListener('element', '#droite', 'longpress', this.onLongDroiteEvent, this );
        this.getEventDispatcher().addListener('element', '#haut', 'touchstart', this.onTouchHautEvent, this );
        this.getEventDispatcher().addListener('element', '#haut', 'touchend', this.onReleaseHautEvent, this );
        this.getEventDispatcher().addListener('element', '#haut', 'longpress', this.onLongHautEvent, this );
        this.getEventDispatcher().addListener('element', '#bas', 'touchstart', this.onTouchBasEvent, this );
        this.getEventDispatcher().addListener('element', '#bas', 'touchend', this.onReleaseBasEvent, this );
        this.getEventDispatcher().addListener('element', '#bas', 'longpress', this.onLongBasEvent, this );*/
        this.getEventDispatcher().addListener('element', '#exit', 'touchstart', this.onTouchExitEvent, this );
        
        if (window.DeviceOrientationEvent) {
            console.log("DeviceOrientation is supported");

            window.addEventListener('deviceorientation', function (eventData) {
                var LR = eventData.gamma;
                var FB = eventData.beta;
                var DIR = eventData.alpha;
                deviceOrientationHandler(LR, FB, DIR);
            }, false);
        } else {
            alert("Device orientation not supported on your device or browser.  Sorry.");
        };
        
    	var oldemitdir = "0";
    	var oldemitacc = "0";
    	var direction;
    	var acceleration;
        function deviceOrientationHandler(LR, FB, DIR) {

            //console.log("gamma : " + Math.round(LR));
            //console.log("beta : " + Math.round(FB));
            //console.log("alpha : " + Math.round(DIR));
            /*if(0<Math.round(DIR) && Math.round(DIR)<330) DriveOnSurface.app.socket.emit("direction", -1);
            if(330<=Math.round(DIR)&& Math.round(DIR)<=350) DriveOnSurface.app.socket.emit("direction", 0);
            if(330<Math.round(DIR)&& Math.round(DIR)<430) DriveOnSurface.app.socket.emit("direction", 1);*/

if(DriveOnSurface.app.iskartselected == true && DriveOnSurface.app.stop == false){
            if(Math.round(FB)<-8) 
            {
            	if(oldemitdir!="-1"){
            		DriveOnSurface.app.socket.emit("direction", -1);
            		direction = "gauche";
            		console.log("gauche");
            		oldemitdir = "-1";
            	}
            }
            if(Math.round(FB)>=-8 && Math.round(FB)<=8) 
            {
            	if(oldemitdir!="0"){
            		DriveOnSurface.app.socket.emit("direction", 0);
            		direction = "fixe";
            		console.log("fixe");
            		oldemitdir = "0";
            	}
            }
            if(Math.round(FB)>8) 
            {
            	if(oldemitdir!="1"){
            		DriveOnSurface.app.socket.emit("direction", 1);
            		direction = "droite";
            		console.log("droite");
            		oldemitdir = "1";
            	}
            }
            if(Math.round(LR)<-70 || Math.round(LR)>=250) 
            {
            	if(oldemitacc!="-1"){
            		DriveOnSurface.app.socket.emit("acceleration", -1);
            		acceleration = "frein";
            		console.log("frein");
            		oldemitacc = "-1";
            	}
            }
            if(Math.round(LR)>=-70 && Math.round(LR)<=-45) 
            {
            	if(oldemitacc!="0"){
            		DriveOnSurface.app.socket.emit("acceleration", 0);
            		console.log("fixeacc");
            		oldemitacc = "0";

            		acceleration = "fixe";
            	}
            }
            if(Math.round(LR)>-45 && Math.round(LR)<50) 
            {
            	if(oldemitacc!="1"){
            		DriveOnSurface.app.socket.emit("acceleration", 1);
            		console.log("accelere");
            		oldemitacc = "1";
            		acceleration = "avant";
            	}
            }
};
            // Apply the transform to the image, three ways of doing it for max compatibility
            // webkit
            /*document.getElementById("imgLogo").style.webkitTransform = "rotate(" +
                LR + "deg) rotate3d(1,0,0, " + (FB * -1) + "deg)";
            // mozilla
            document.getElementById("imgLogo").style.MozTransform = "rotate(" + LR + "deg)";
            // standard
            document.getElementById("imgLogo").style.transform = "rotate(" + LR +
                "deg) rotate3d(1,0,0, " + (FB * -1) + "deg)";

            // On envoie l'orientation aux autres devices connectés. La fonction appelée est sur le serveur
            now.distributeOrientationEvent({'alpha':DIR, 'beta':FB, 'gamma':LR});*/
        };

    document.onkeydown = function(evt) {
        evt = evt || window.event; /* There are four evt.keyCodes: 37 --> left; 38 --> up; 39 --> right;  40 --> down.*/
        switch (evt.keyCode) {
            case 37:
                if(oldemitdir!="-1"){
                    DriveOnSurface.app.socket.emit("direction", -1);
                    console.log("gauche");
                    oldemitdir = "-1";
                }
                break;
            case 39:
                if(oldemitdir!="1"){
                    DriveOnSurface.app.socket.emit("direction", 1);
                    console.log("droite");
                    oldemitdir = "1";
                }
                break;
            case 38:
                if(oldemitacc!="1"){
                    DriveOnSurface.app.socket.emit("acceleration", 1);
                    console.log("accelere");
                    oldemitacc = "1";
                }
                break;
            case 40:
                if(oldemitacc!="-1"){
                    DriveOnSurface.app.socket.emit("acceleration", -1);
                    console.log("frein");
                    oldemitacc = "-1";
                }
                break;
        }
    };
    document.onkeyup = function(evt) {
        evt = evt || window.event; /* There are four evt.keyCodes: 37 --> left; 38 --> up; 39 --> right;  40 --> down.*/
        switch (evt.keyCode) {
            case 37:
                if(oldemitdir!="0"){
                    DriveOnSurface.app.socket.emit("direction", 0);
                    console.log("fixe");
                    oldemitdir = "0";
                }
                break;
            case 39:
                if(oldemitdir!="0"){
                    DriveOnSurface.app.socket.emit("direction", 0);
                    console.log("fixe");
                    oldemitdir = "0";
                }
                break;
            
            case 38:
                if(oldemitacc!="0"){
                    DriveOnSurface.app.socket.emit("acceleration", 0);
                    console.log("fixeacc");
                    oldemitacc = "0";
                }
                break;
            case 40:
                if(oldemitacc!="0"){
                    DriveOnSurface.app.socket.emit("acceleration", 0);
                    console.log("fixeacc");
                    oldemitacc = "0";
                }
                break;
        }
    };

        var vitesse = {
            xtype : 'panel',
            id: 'vitesse',
            align: 'center',
            vspeed : null,
            html: 'Vitesse :' + this.vspeed
        };
        var classement =  {

            xtype : 'panel',
            id: 'rank',
            align: 'center',
            crank: null,
            html: 'Classement :'+  this.crank
        };

        var speed;
        var rank;
            DriveOnSurface.app.socket.on("speed", function(data){
                speed = data;
                console.log('speed ' + speed);
                vitesse.vspeed = speed;
            });
           DriveOnSurface.app.socket.on("rank", function(data){
               rank = data;
               console.log('rank ' + rank);
               classement.crank = rank;
           });
        var bonus= new Ext.Button({
            //xtype: 'button',
            id: 'bonus',
            title: 'bonus',
            //text: 'jaune',
            height: 120,
            width: 120,
            //ui:'plain',
            bonusname: 'nobonus',
            html: '<div><img src=\'resources/nobonus.jpg\' width = "100" heigth = "100" ></div>',
            // handler : this.onChooseKartJaune(),
            listeners : {
                tap : function() {
                    if(bonustype != null){
                        DriveOnSurface.app.socket.emit("bonus", bonustype)
                        console.log(bonustype + ' used');
                        bonustype = 'nobonus';
                        this.html= '<div><img src=\'resources/nobonus.jpg\' width = "100" heigth = "100" ></div>';
                    }
                }
            },
            scope: this
        });
        var bonustype;
        DriveOnSurface.app.socket.on("enableBonus", function(data){
            bonustype = data;
            console.log('Bonus received: ' + bonustype);
            bonus.bonusname = bonustype;
            if(data == "rabbit")
                 bonus.html = '<div><img src=\'resources/rabbit.jpg\' width = "100" heigth = "100" ></div>';

            else if(data == "train")
                bonus.html = '<div><img src=\'resources/train.jpg\' width = "100" heigth = "100" ></div>';

            if(data == "biggerengine")
                bonus.html = '<div><img src=\'resources/biggerengine.jpg\' width = "100" heigth = "100" ></div>';

            if(data == "nails")
                bonus.html = '<div><img src=\'resources/nails.jpg\' width = "100" heigth = "100" ></div>';
        });
        DriveOnSurface.app.socket.on("disableBonus", function(data){
            bonus.bonusname = 'nobonus';
        });

      /*  var gauche = {
            xtype: 'button',
            id: 'gauche',
            text: 'gauche',
            align: 'left',
            width: 100,
            scope: this
        };
        var droite = {
            xtype: 'button',
            id: 'droite',
            text: 'droite',
            align: 'right',
            width: 100,
            scope: this
        };
        var haut = {
            xtype: 'button',
            id: 'haut',
            text: 'haut',
            align: 'center',
            width: 100,
            scope: this
        };
        var bas = {
            xtype: 'button',
            id: 'bas',
            title: 'bas',
            text: 'bas',
            align: 'center',
            width: 100,
            scope: this
        };
        var hbox1 =  {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {xtype: 'spacer', width : 100},haut
            ],
            flex: 1
        };
        var hbox2 =  {
            xtype: 'container',
            layout: 'hbox',
            items: [
                gauche, {xtype: 'spacer', width : 100}, droite
            ],
            flex: 1
        };
        var hbox3 =  {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {xtype: 'spacer', width : 100}, bas
            ],
            flex: 1
        };*/
        var exit = {
                xtype: 'button',
                id: 'exit',
                title: 'Exit',
                text: 'Exit',
                align: 'center',
                width: 100,
                scope: this
            };
        var hbox1 = {
            xtype: 'container',
            layout: 'vbox',
            items: [
                vitesse, {xtype: 'spacer', width : 100},classement, bonus
            ],
            flex: 1
        }
        /*var panel = {
            xtype : 'panel',
            layout: 'hbox',
            align: 'center',

            items: [
                gauche, droite, haut, bas
            ]
        };*/
        //this.add([hbox1, hbox2, hbox3, exit]);
        this.add([exit, hbox1]);
    },
    /*onTouchGaucheEvent : function(e, target, options, eventController){
        console.log(eventController.info.eventName);
        DriveOnSurface.app.socket.emit("direction", -1);
    },
    onReleaseGaucheEvent: function(e, target, options, eventController){
        console.log(eventController.info.eventName);
        DriveOnSurface.app.socket.emit("direction", 0);
    },
    onLongGaucheEvent: function(e, target, options, eventController){
        console.log(eventController.info.eventName);
    },
    onTouchDroiteEvent : function(e, target, options, eventController){
        console.log(eventController.info.eventName);
        DriveOnSurface.app.socket.emit("direction", 1);
    },
    onReleaseDroiteEvent: function(e, target, options, eventController){
        console.log(eventController.info.eventName);
        DriveOnSurface.app.socket.emit("direction", 0);
    },
    onLongDroiteEvent: function(e, target, options, eventController){
        console.log(eventController.info.eventName);
    },
    onTouchHautEvent : function(e, target, options, eventController){
        console.log(eventController.info.eventName);
        DriveOnSurface.app.socket.emit("acceleration", 1);
    },
    onReleaseHautEvent: function(e, target, options, eventController){
        console.log(eventController.info.eventName);
        DriveOnSurface.app.socket.emit("acceleration", 0);
    },
    onLongHautEvent: function(e, target, options, eventController){
        console.log(eventController.info.eventName);
    },
    onTouchBasEvent : function(e, target, options, eventController){
        console.log(eventController.info.eventName);
        DriveOnSurface.app.socket.emit("acceleration", -1);
    },
    onReleaseBasEvent: function(e, target, options, eventController){
        console.log(eventController.info.eventName);
        DriveOnSurface.app.socket.emit("acceleration", 0);
    },
    onLongBasEvent: function(e, target, options, eventController){
        console.log(eventController.info.eventName);
    },*/
    onTouchExitEvent: function(e, target, options, eventController){
        DriveOnSurface.app.stop = true;
        DriveOnSurface.app.socket.emit("exit");
        console.log("exit");
    }

});