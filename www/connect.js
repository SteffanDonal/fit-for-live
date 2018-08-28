'use strict';

var endpoint = 'ws://' + location.host + '/';

function Connection() {
    this.socket = null;

    this.updateConsumers = [];
}

Connection.prototype.onUpdate = function (callback) {
    this.updateConsumers.push(callback);
};
Connection.prototype.invokeOnUpdate = function (updateData) {
    var i;

    for (i = 0; i < this.updateConsumers.length; i += 1) {
        this.updateConsumers[i](updateData);
    }
};

Connection.prototype.connect = function () {
    var self = this;

    if (this.socket && this.socket.readyState !== 3) return;

    this.socket = new WebSocket(endpoint);
    console.info('Connecting to broadcast server...');

    this.socket.addEventListener('open', function () {
        console.info('Connected to broadcast server!');
    });

    this.socket.addEventListener('close', function () {
        console.info('Lost connection to broadcast server.');

        setTimeout(function () { self.connect(); }, 1000);
    });

    this.socket.addEventListener('message', function (message) {
        self.invokeOnUpdate(JSON.parse(message.data));
    });
};

window.FitForLive = new Connection();
window.addEventListener('load', function () { window.FitForLive.connect(); });