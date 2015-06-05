var ApplicationEngine = function () {

    // ApplicationEngine Object Variables;
    var engine = this;
    var data, display, tengu;
    var speech_input_div, speech_output_div; // unnecessary?

    // Core Framework;
    this.initialize = function () {

        // Set Self-Reference Variable;
        engine = this;
        this.data = new DataEngine(engine);
        this.display = new DisplayEngine (engine);
        this.tengu = new TenguEngine (engine);

        data = this.data;
        display = this.display;
        tengu = this.tengu;

        display.initializeDisplay();
        data.initialize();

        function checkForBookmark () {
            var user_id = data.getFromCookie('profile_id');
            var bookmark = data.getFromCookie('bookmark');
            console.log('trying to go to '+bookmark);
            if (bookmark != null && user_id != 'null') {
                if (bookmark != 'front_page'
                    && bookmark != 'about_page'
                    && bookmark != 'register_page'
                    && bookmark != 'password_recovery') {
                    data.getProfileDataAndShowPage(user_id, bookmark);
                } else {
                    display.showPage(bookmark);
                }
            } else {
                display.showPage('front_page');
            }
        }
        checkForBookmark();
    };
    this.quickLogin = function (user_id) {
        var quick_name;
        switch(user_id) {
            case(1) : quick_name = 'Boxer'; break;
            case(2) : quick_name = 'TangSoo'; break;
            case(3) : quick_name = 'KungFu'; break;
            case(4) : quick_name = 'BoxerBro'; break;
            case(5) : quick_name = 'TangTwo'; break;
        }
        engine.data.postLoginAttempt(quick_name, 'pass');
    };
    this.initializeSpeech = function () {

        speech_output_div = document.getElementById('speech_output_div');
        speech_input_div = document.getElementById('speech_input_div');
        tengu.start();
    };
    this.heardCommand = function (identified_command) {
        switch(identified_command) {
            case('ready') : activityMenu(); break;
            case('dummy_exercise') : dummyExercise(); break;
            case('one') : logReviewScore(1); break;
            case('two') : logReviewScore(2); break;
            case('three') : logReviewScore(3); break;
            case('four') : logReviewScore(4); break;
        }
    };
    this.gotoPage = function (page_name) {
        display.showPage(page_name);
    };

};