/**
 * Created with JetBrains WebStorm.
 * User: user
 * Date: 11/01/13
 * Time: 11:47
 * To change this template use File | Settings | File Templates.
 */

Ext.application({
    name: 'DriveOnSurface',

    views: ['Home', 'Kart', 'PlayMode'],
    controllers: ["DriveController"],
    //stores: ["Picture"],
    //models: ["Picture"],

    stop : new Boolean(false),
    iskartselected : new Boolean(false),
    socket : io.connect('/'),
    launch : function(){

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
        var home = {
            xtype: "home"
        };
        var kart = {
            xtype: "kart"
        };

        var play = {
            xtype:"play"
        };
        Ext.Viewport.add([home, kart, play]);

    }
});