var Clock = function () {

    var started_at = null;
    var paused_at = null;
    var resumed_at = null;

    this.start = function () {
        started_at = new Date().getTime();
        logAll();
    };
    this.check = function () {
        var this_time =  (new Date().getTime() - started_at);
        if (paused_at != null && resumed_at == null) {
            this_time -= (new Date().getTime() - paused_at);
        }
        logAll();
        return this_time;
    };
    this.pause = function () {
        paused_at = new Date().getTime();
        logAll();

    };
    this.resume = function () {
        resumed_at = new Date().getTime();
        started_at += (resumed_at - paused_at);
        paused_at = null;
        resumed_at = null;
        logAll();

    };
    this.reset = function () {
        started_at = undefined;
    };

    function logAll () {
        console.log('started_at '+(new Date().getTime() - started_at));
        console.log('paused_at '+(new Date().getTime() - paused_at));
        console.log('resumed_at '+(new Date().getTime() - resumed_at));
    }
};

var OniObject = function () {

    // Oni Variables;
    var oni = this;
    var session_clock;

    this.startSession = function (session_length) {
        chooseSessionPlan(session_length);
    };

    function chooseSessionPlan () {
        /*
        Selects a workout plan (Short Workout, Interval Workout, Long Workout);
        */
    }

};

// Oni Methods;



