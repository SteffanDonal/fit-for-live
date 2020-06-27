'use strict';

const Ant = require('ant-plus');
const osc = require('osc');

const config = require(process.cwd() + '/config.json');


// OSC Setup
//FIXME: Strictly it is possible that the ANT+ stick could send data before the port is ready. #ProblemsForLater

const oscPort = new osc.UDPPort(config.oscUDP);
oscPort.on('ready', () => {
    console.info('OSC Port ready!');
});
oscPort.open();

function sendUpdate(beatsPerMinute, caloriesBurned) {
    oscPort.send({
        timeTag: osc.timeTag(),
        packets: [
            {
                address: config.osc.bpmAddress,
                args: [ { type: 'f', value: beatsPerMinute } ]
            },
            {
                address: config.osc.caloriesAddress,
                args: [ { type: 'f', value: caloriesBurned } ]
            }
        ]
    });
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

    sendUpdate(data.ComputedHeartRate, calories);
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