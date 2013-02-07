/**
 * Created with JetBrains WebStorm.
 * User: user
 * Date: 25/01/13
 * Time: 10:04
 * To change this template use File | Settings | File Templates.
 */
Ext.ns('DriveOnSurface');

DriveOnSurface.Button = Ext.extend(Ext.Button, {
    initEvents : function () {
        var me = this;

        me.mon(me.el, {
            scope : me,

            touchstart : me.onTouchStart,
            touchend   : me.onTouchEnd
        });
    },

    onTouchStart : function (e) {
        this.fireEvent('touchstart', this, e);
    },

    onTouchEnd : function (e) {
        this.fireEvent('touchend', this, e);
    }
});

Ext.reg('ux-button', DriveOnSurface.Button);