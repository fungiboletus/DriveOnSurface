
Ext.define("Datetimepicker.view.Main", {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.TitleBar',
        'Ext.field.DatePicker',
        'Ext.Spacer',
        'Ext.Picker'
    ],
    config: {
        fullscreen:'true',
        title:'DatatimePicker',
        items: [
            {
                xtype: 'datepickerfield',
                label: 'Birthday',
                name: 'birthday',
                value: new Date(),
                listeners: {
                    change: function(picker, value) {
                        // This function use to prepend 0 to the month which less than October
                        function minTwoDigits(n) {
                            return (n < 10 ? '0' : '') + n;
                        }
                        var date = value.getDate(), // Get date's value
                            month = value.getMonth(); // Get month's value
                        month += 1; // Increase the number of month by 1 since the index started with 0
                        var formatMonth = minTwoDigits(month),
                            year = value.getFullYear(), // Get year's value
                            formatDate = formatMonth.concat("/",date,"/",year); // Concatenate string
                        Ext.ComponentQuery.query('#textfield')[0].setValue(formatDate); // Set the value of the textfield with itemID equal to textfield
                    }
                }
            },
            {
                xtype:'textfield',
                label:'time',
                itemId: 'textfield',
                value:''

            }
        ]
    }
});