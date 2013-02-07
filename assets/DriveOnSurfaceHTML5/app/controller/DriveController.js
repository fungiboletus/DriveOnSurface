/**
 * Created with JetBrains WebStorm.
 * User: user
 * Date: 11/01/13
 * Time: 11:55
 * To change this template use File | Settings | File Templates.
 */
Ext.define("DriveOnSurface.controller.DriveController", {
    extend: 'Ext.app.Controller',
    config: {
        refs : {
            home : "home",
            kart : "kart",
            play : "play"
        },
        control: {
            home: {
                jouerButtonTap: 'onJouerButtonTap'
            },
            kart: {
                chooseKartRouge: 'onChooseKartRouge',
                chooseKartVert: 'onChooseKartVert',
                chooseKartBleu: 'onChooseKartBleu',
                chooseKartJaune: 'onChooseKartJaune'
            },
            play: {
                directTap: 'onDirectTap'
            },
            '#rouge': {
                tap: 'onChooseKartRouge'
            },
            '#bleu': {
                tap: 'onChooseKartBleu'
            },
            '#vert': {
                tap: 'onChooseKartVert'
            },
            '#jaune': {
                tap: 'onChooseKartJaune'
            }
        }

    },

    slideLeftTransition: { type: 'slide', direction: 'left' },
    onJouerButtonTap : function(){
        /*console.log(Ext.getCmp('pseudo').getValue());
        if(this.getHome().getItems().items[0]._value==null)
            alert("Choisis d'abord un pseudo!");
        else*/
        Ext.Viewport.animateActiveItem(this.getKart(), this.slideLeftTransition );
    },
    onChooseKartRouge : function(record){
        var text = "Tu as choisi le kart rouge" ;
        DriveOnSurface.app.iskartselected = true;
        Ext.Msg.alert("Kart", text );
        Ext.Viewport.animateActiveItem(this.getPlay(), this.slideLeftTransition );
    },
    onChooseKartVert : function(record){
        var text = "Tu as choisi le kart vert" ;
        DriveOnSurface.app.iskartselected = true;
        Ext.Msg.alert("Kart", text );
        Ext.Viewport.animateActiveItem(this.getPlay(), this.slideLeftTransition );

    },
    onChooseKartBleu : function(record){
        var text = "Tu as choisi le kart bleu" ;
        DriveOnSurface.app.iskartselected = true;
        Ext.Msg.alert("Kart", text );

        Ext.Viewport.animateActiveItem(this.getPlay(), this.slideLeftTransition );
    },
    onChooseKartJaune : function(record){
        var text = "Tu as choisi le kart jaune" ;
        DriveOnSurface.app.iskartselected = new Boolean(true);
        Ext.Msg.alert("Kart", text );

        Ext.Viewport.animateActiveItem(this.getPlay(), this.slideLeftTransition );
    }
})