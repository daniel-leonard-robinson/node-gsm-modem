var Modem = require('./');

function onSMS (sms) {
    console.log('onSMS', sms);
}
function onUSSD (ussd) {
    console.log('onUSSD', ussd);
}
function onStatusReport (report) {
    console.log('onStatusReport', report);
}
function onDisconnect (modem) {
    console.log('onDisconnect');
}


var modem1 = new Modem({
    //port : '/dev/ttyUSB0',
    port : 'COM38',
    //notify_port : '/dev/ttyUSB1',
    //notify_port : 'COM39',
    onDisconnect : onDisconnect,
    //balance_ussd : '*102*1#',
    balance_ussd : '*101#',
    dollar_regexp : /(-?\d+)\s*rub/,
    cents_regexp : /(-?\d+)\s*kop/,
    debug : true
});
modem1.on('message', onStatusReport, function(){
    console.log("message_callback");
});
modem1.on('report', onStatusReport);
modem1.on('USSD', onUSSD);

modem1.connect(function () {

    modem1.getAllSMS(function (err, sms) {
        console.log('SMSes:', sms);
    });

    modem1.sendSMS({
        receiver : 'ENTER NUMBER HERE',
        text : 'Проверка связи, однако!',
        request_status : true
    }, function (err, data) {
        console.log('sendSMS', data);
    });

    modem1.getSignalStrength(function(err, data){
        if (!err) {
            console.log('getSignalStrength', data)
        } else {
            console.log(err);
        }
    });

    modem1.customATCommand('AT+CIND?', function(err, data){
        console.log('networkIndication', data)
    });

    modem1.getUSSD('*101#', function(err, data){
        console.log('balance', data)
    });

    modem1.setupInternet({
        apn: 'internet',
        //username: 'bob',
        //password: 'thebuilder',
        //dns1: '8.8.8.8',
        //dns2: '8.8.4.4'
    }, function(err) {
        if (err) console.log(err)
    })

    modem1.deleteAllSMS (function(err){
        if (err === undefined) {
            console.log ('all messages were deleted');
        } else {
            console.log ('messages were not deleted');
        }
    });

});

