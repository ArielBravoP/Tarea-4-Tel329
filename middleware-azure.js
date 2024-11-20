'use strict';
var express = require('express');
var request = require('request');
var app = express();
var http = require('http').Server(app);
var clientFromConnectionString=require('azure-iot-device-mqtt').clientFrom-ConnectionString;
var Message = require('azure-iot-device').Message;
var connectionString = '';
var mydevideId = 'contiki-ng-01'
var client = clientFromConnectionString(connectionString);

app.get('/', function(req,res){
    res.send('Websense Azure Cloud');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
    console.log('Websense Azure Cloud was started');
});

function printResultFor(op){
    return function printResult(err,res){
        if(err) 
            console.log(op + 'error' + err.toString());
        if(res) 
            console.log(op + 'status' + res.constructor.name);
    };
};

var connectCallback = function(err){
     if(err) {
         console.log('Could not connect:' + err);
     } else {+
        console.log('Client connected');     
        setInterval(function(){
            request.get('http://[fd00::201:1:1:2]/',function(err,res,body){  
                if(err){
                    console.log(err);
                    return;
                }
                var obj = JSON.parse(body);
                console.log(obj);
                var temperature = obj.temp;
                var humidity = obj.hum;
                var data = JSON.stringify({devideId:mydevideId,temperature:temperature,humidity:humidity});
                var message = new Message(data);
                message.properties.add('temperatureAlert',(temperature > 30)?'true':'false');
                console.log("Sending message:" + message.getData());
                client.sendEvent(message,printResultFor('send'));
            });
        },3000);
        }
};

client.open(connectCallback);
console.log('Contiki-NG Azure Middleware started.');