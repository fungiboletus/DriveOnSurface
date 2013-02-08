/**
 * Created with JetBrains WebStorm.
 * User: user
 * Date: 11/01/13
 * Time: 15:02
 * To change this template use File | Settings | File Templates.
 */
Ext.define('DriveOnSurface.view.Kart', {
    extend:'Ext.Container',
    alias: "widget.kart",
    layout: {
        type: 'vbox',
        align: 'center',
        autoSize: true
    },
    initialize: function(){
        this.callParent(arguments);

        /*var carousel = new Ext.Carousel({
            listeners: {
            activate: function(carousel, newActiveItem, oldActiveItem, options) {

                    var items = [];
                    items.push({
                            xtype: 'myimage',
                            src: 'resources/mario-kart-ds-nintendo-ds-214.jpg'
                        });
                    items.push({
                        xtype: 'myimage',
                        src: 'resources/mario-kart-ds-nintendo-ds-206.jpg'
                    });
                    items.push({
                        xtype: 'myimage',
                        src: 'resources/mario-kart-ds-nintendo-ds-208.jpg'
                    });
                    items.push({
                        xtype: 'myimage',
                        src: 'resources/mario-kart-ds-nintendo-ds-216.jpg'
                    });

                }
            }
        });*/


        var rouge = {
            xtype: 'button',
            id: 'rouge',
            //text: 'Rouge',
            height: 120,
            //ui:'plain',
            html: '<div><img src=\'resources/red.png\' width = "100" heigth = "100" ></div>',
            //handler : this.onChooseKartRouge(),
            listeners : {
                tap : function() {
                    var text = "Tu as choisi le kart rouge" ;
                    DriveOnSurface.app.iskartselected = true;
                    console.log(text);
                    DriveOnSurface.app.socket.emit("kart", "Red");
                    this.fireEvent("chooseKartRouge", this);

                }
            },
            scope: this
        };
        var vert = {
            xtype: 'button',
            id: 'vert',
            //text: 'vert',
            height: 120,
            //ui:'plain',
            html: '<div><img src=\'resources/green.png\' width = "100" heigth = "100" ></div>',
            //handler : this.onVertTap(),
            listeners : {
                tap : function() {
                    var text = "Tu as choisi le kart vert" ;
                    DriveOnSurface.app.iskartselected = true;
                    console.log(text);
                    DriveOnSurface.app.socket.emit("kart", "Green");
                    this.fireEvent("chooseKartVert", this);
                }
            },
            scope: this
        };
        var bleu = {
            xtype: 'button',
            id: 'bleu',
            //text: 'bleu',
            height: 120,
            //ui:'plain',
            html: '<div><img src=\'resources/blue.png\' width = "100" heigth = "100" ></div>',

            //handler : this.onChooseKartBleu(),
            listeners : {
                tap : function() {
                    var text = "Tu as choisi le kart bleu" ;
                    DriveOnSurface.app.iskartselected = true;
                    console.log(text);
                    DriveOnSurface.app.socket.emit("kart", "Blue");
                    this.fireEvent("chooseKartBleu", this);
                }
            },
            scope: this
            };
        var jaune = new Ext.Button({
            //xtype: 'button',
            id: 'jaune',
            title: 'jaune',
            //text: 'jaune',
            height: 120,
            //ui:'plain',
            html: '<div><img src=\'resources/yellow.png\' width = "100" heigth = "100" ></div>',
           // handler : this.onChooseKartJaune(),
            listeners : {
                tap : function() {
                    var text = "Tu as choisi le kart jaune" ;
                    DriveOnSurface.app.iskartselected = true;
                    console.log(text);
                    DriveOnSurface.app.socket.emit("kart", "Yellow");
                    this.fireEvent("chooseKartJaune", this);
                }
            },
            scope: this
        });

        var paneltext = {
            xtype: 'panel',
            items:{ html: 'Choisis ton kart: '}
        };


       var panel = {
            xtype : 'panel',

           layout: {
               type: 'hbox',
               align: 'center',
               autoSize: true
           },

            items: [
                rouge, vert, bleu, jaune
            ]
        };
        this.add([paneltext, panel]);
    },
    onChooseKartRouge : function(){
        var text = "Tu as choisi le kart rouge" ;
        console.log(text);
        this.fireEvent("chooseKartRouge", this);
    },
    onVertTap : function(){
        var text = "Tu as choisi le kart vert" ;
        console.log(text);
        this.fireEvent("onVertTap", this);
    },
    /*onChooseKartBleu : function(){
        var text = "Tu as choisi le kart bleu" ;
        console.log(text);
        this.fireEvent("chooseKartBleu", this);
    },*/
   /* onChooseKartJaune : function(){
        var text = "Tu as choisi le kart jaune" ;
        console.log(text);
        this.fireEvent("chooseKartJaune", this);
    }*/

});


    /*items: [

        {cls: 'painting kart1'},
        {cls: 'painting kart2'},
        {cls: 'painting kart3'},
        {cls: 'painting kart4'}

    ]*/