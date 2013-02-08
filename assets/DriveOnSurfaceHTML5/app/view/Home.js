/**
 * Created with JetBrains WebStorm.
 * User: user
 * Date: 11/01/13
 * Time: 11:55
 * To change this template use File | Settings | File Templates.
 */
Ext.define('DriveOnSurface.view.Home', {
    extend:'Ext.form.Panel',
    requires: ["Ext.form.FieldSet"],
    alias: "widget.home",

    config: {
        title: 'Drive On Surface',
        scrollable: 'vertical'
    },
    /*choixpseudo : {
      id: 'pseudo'
    },
    pseudoValue: "",*/
    initialize: function(){
        this.callParent(arguments);


       var choixPseudo = {
            xtype:'textfield',
            label:'Choisis un pseudo',
            //id:'pseudo',
            name: 'pseudo',
            required : true

        };

        var choixServeur = {
            xtype:'textfield',
            label:'Choisis un serveur',
            //id:'pseudo',
            value: window.location.host,
            name: 'serveur',
            required : true

        };
        //this.pseudoValue = choixPseudo.Value;
        //DriveOnSurface.app.socket.send(pseudoValue);

        var jouer = {
            xtype: 'button',
            id: 'jouer',
            text: 'Jouer',
            handler : this.onJouerButtonTap,
            scope: this
            /*listeners: {
                tap:{
                    fn: console.log("fuck"),//this.onJouerButtonTap,
                    scope: this
                }
            }

                    /*if(choixPseudo.getValue()==null)
                        alert("Choisis d'abord un pseudo!");
                    else
                        this.fireEvent("jouerButtonTap", this);}
           */// }
        };

        this.add([{xtype: "fieldset", items: [choixServeur, choixPseudo]}, jouer]);
    },
    onJouerButtonTap : function(){
        //console.log(Ext.getCmp('pseudo').getValue());
        //var pseudoValue = DriveOnSurface.home.choixPseudo.getValue();
        //DriveOnSurface.app.socket.emit(DriveOnSurface.home.pseudoValue);

        var data = this.getValues();
        DriveOnSurface.app.socket = io.connect('http://'+data.serveur+'/');
        DriveOnSurface.app.socket.on('connect',function(){
            console.log("connected server");
            //DriveOnSurface.app.socket.emit("truc", 'canard');
        });

        DriveOnSurface.app.socket.on('disconnect',function(){
            console.log("server closed");
        });

        DriveOnSurface.app.socket.on('message',function(data) {
            console.log('Received a message from the server: ',data);
        });
        if(data.pseudo != ""){
            DriveOnSurface.app.socket.emit("pseudo", data.pseudo);
            this.fireEvent("jouerButtonTap", this);
        }
        else{
            alert("Il faut d'abord choisir un pseudo!");
        }
    }

})

