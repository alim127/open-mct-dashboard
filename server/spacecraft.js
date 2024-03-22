/*
 Spacecraft.js simulates a small spacecraft generating telemetry.
*/

function Spacecraft() {
    this.state = {
        "vboost":0,
        "vbatt":0,
        "curout":0,
        "curin":0,
        "cursun":0,
        "cursys":0,
        "temp":0,
        "out.val":0,
        "battmode":0,
        "pptmode":0,
        "wdtI2cS":0,
        "wdtGndS":0,
        "bootcount":0,
        "cntWdtI2c":0,
        "cntWdtGnd":0,
        "cntWdtCsp":0,
        "wdtCspC":0,
        "latchups":0,
        "bootcause":0,
        "comms.recd": 0,
        "comms.sent": 0,
    };
    this.history = {};
    this.listeners = [];
    Object.keys(this.state).forEach(function (k) {
        this.history[k] = [];
    }, this);

    setInterval(function () {
        //this.updateState();
        this.generateTelemetry();
    }.bind(this), 1000);

    console.log("Spacecraft launched!");
/*
    process.stdin.on('data', function () {
        this.state['prop.thrusters'] =
            (this.state['prop.thrusters'] === "OFF") ? "ON" : "OFF";
        this.state['comms.recd'] += 32;
        console.log("Thrusters " + this.state["prop.thrusters"]);
        this.generateTelemetry();
    }.bind(this));
    */
};
/*
Spacecraft.prototype.updateState = function () {
    this.state["prop.fuel"] = Math.max(
        0,
        this.state["prop.fuel"] -
            (this.state["prop.thrusters"] === "ON" ? 0.5 : 0)
    );
    this.state["pwr.temp"] = this.state["pwr.temp"] * 0.985
        + Math.random() * 0.25 + Math.sin(Date.now());
    if (this.state["prop.thrusters"] === "ON") {
        this.state["pwr.c"] = 8.15;
    } else {
        this.state["pwr.c"] = this.state["pwr.c"] * 0.985;
    }
    this.state["pwr.v"] = 30 + Math.pow(Math.random(), 3);
};
*/
/**
 * Takes a measurement of spacecraft state, stores in history, and notifies 
 * listeners.
 */
Spacecraft.prototype.generateTelemetry = function () {
    var timestamp = Date.now(), sent = 0;
    Object.keys(this.state).forEach(function (id) {
        var state = { timestamp: timestamp, value: this.state[id], id: id};
        this.notify(state);
        this.history[id].push(state);
        this.state["comms.sent"] += JSON.stringify(state).length;
    }, this);
};

Spacecraft.prototype.notify = function (point) {
    this.listeners.forEach(function (l) {
        l(point);
    });
};

Spacecraft.prototype.listen = function (listener) {
    this.listeners.push(listener);
    return function () {
        this.listeners = this.listeners.filter(function (l) {
            return l !== listener;
        });
    }.bind(this);
};

module.exports = function () {
    return new Spacecraft()
};