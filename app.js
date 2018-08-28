'use strict';

const express = require('express');
const expressWs = require('express-ws');
const serveIndex = require('serve-index');
const Ant = require('ant-plus');

const config = require(process.cwd() + '/config.json');


// Web & Websocket server setup

const consumerSockets = [];

const app = express();
expressWs(app);

app.use(express.static('www'), serveIndex('www', { icons: true }));
app.ws('/', (ws, request) => {
    consumerSockets.push(ws);

    ws.on('close', () => consumerSockets.splice(consumerSockets.indexOf(ws), 1));
});

app.listen(config.port);
console.log();
console.log('Server running on port ' + config.port);
console.log('Navigate to http://localhost:' + config.port + '/ to see available monitors.');
console.log();

function sendUpdate(data) {
    var i,
        dataString = JSON.stringify(data);

    for (i = 0; i < consumerSockets.length; i += 1) {
        consumerSockets[i].send(dataString);
    }
}


// ANT+ setup

var stick;

if (config.antStickVersion === 3) stick = new Ant.GarminStick3();
else if (config.antStickVersion === 2) stick = new Ant.GarminStick2();
else {
    console.error('Invalid stick version in config! antStickVersion must be either 2, or 3.');
    return;
}

var sensor = new Ant.HeartRateSensor(stick);

var lastMeasurement = null,
    calories = 0;

sensor.on('hbdata', function (data) {
    calories += calculateCaloriesSince(lastMeasurement, data.ComputedHeartRate);

    console.clear();
    console.log(`kCal: ${calories}, HR: ${data.ComputedHeartRate}`)

    lastMeasurement = new Date();

    sendUpdate({
        beatsPerMinute: data.ComputedHeartRate,
        caloriesBurned: calories,
        date: lastMeasurement.getTime()
    })
});

stick.on('startup', function () {
    console.info('Stick started up!');
    sensor.attach(0, 0);
});

if (!stick.open()) {
    console.log('Stick not found!');
} else {
    console.info('Connected to stick!');
}

function calculateCaloriesSince(date, heartRate) {
    var weight = config.weight,
        age = config.age,
        vo2Max = config.vo2max,
        duration;

    if (!date) {
        return 0;
    }

    duration = (new Date().getTime()) - date.getTime();
    duration /= 1000; // to seconds
    duration /= 60; // to minutes
    duration /= 60; // to hours

    return ((
        -95.7735 +
        (0.634 * heartRate) +
        (0.404 * vo2Max) +
        (0.394 * weight) +
        (0.271 * age)
    ) / 4.184) * 60 * duration;
}