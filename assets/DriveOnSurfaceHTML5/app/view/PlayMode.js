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

    layout: 'ux.center',

    initialize: function(){
        this.callParent(arguments);

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

        var speed = "0";
        var rank= "0";


        var vitesse = Ext.create('Ext.Panel', {
            xtype : 'panel',
            id: 'vitesse',
            align: 'center'
        });
        var classement = Ext.create('Ext.Panel',{

            xtype : 'panel',
            id: 'rank',
            align: 'center'
        });
        DriveOnSurface.app.socket.on('speed', function(data){
            vitesse.setHtml('Vitesse : '+ data.toFixed(2) + "kmh");
        });
        DriveOnSurface.app.socket.on('rank', function(data){
            classement.setHtml('Classement: ' +data);
        });

        DriveOnSurface.app.socket.on('rankEnd', function(data){
           alert("Votre position finale: " + data);
        });
        var bonus= Ext.create('Ext.Button',{
            xtype: 'button',
            id: 'bonus',
            title: 'bonus',
            //text: 'jaune',
            height: 120,
            width: 120,
            //ui:'plain',
            bonusname: bonustype,
            html: '<div><img src=\'resources/nobonus.jpg\' width = "100" heigth = "100" ></div>',
            // handler : this.onChooseKartJaune(),
            listeners : {
                tap : function() {
                    if(bonustype != null && bonustype != "nobonus"){
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
        DriveOnSurface.app.socket.on('enableBonus', function(data){
            bonustype = data;
            console.log('Bonus received: ' + bonustype);
            bonus.bonusname = bonustype;
            if(data == "Rabbit")
                 bonus.setHtml('<div><img src=\'resources/rabbit.png\' width = "100" heigth = "100" ></div>');

            else if(data == "Train")
                bonus.setHtml('<div><img src=\'resources/train.jpg\' width = "100" heigth = "100" ></div>');

            if(data == "BiggerEngine")
                bonus.setHtml('<div><img src=\'resources/biggerengine.jpg\' width = "100" heigth = "100" ></div>');

            if(data == "Nails")
                bonus.setHtml('<div><img src=\'resources/nails.png\' width = "100" heigth = "100" ></div>');
        });
        DriveOnSurface.app.socket.on("disableBonus", function(data){
            bonus.bonusname = 'nobonus';
        });

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

            layout: {
                type: 'vbox',
                align: 'center',
                autoSize: true
            },
            items: [
                vitesse, classement, bonus,{xtype: 'spacer', height : 100}, exit
            ],
            flex: 1
        };
        this.add([ hbox1]);
    },
    onTouchExitEvent: function(e, target, options, eventController){
        DriveOnSurface.app.stop = true;
        DriveOnSurface.app.socket.emit("exit");
        alert("Vous etes sortis du jeu");
        console.log("exit");
    }
});