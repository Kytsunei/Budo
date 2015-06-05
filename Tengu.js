var TenguEngine = function (application) {

    // Mouth/Ear Objects;
    var MouthEngine = function () {

        var talking;
        var speech_interval;
        var voices = speechSynthesis.getVoices();
        window.speechSynthesis.localService = true;
        window.speechSynthesis.lang = voices[1];

        this.getTalking = function () {
            return talking;
        };
        this.stopSpeaking = function () {
            console.log('MOUTH: Stopping.');
            window.speechSynthesis.cancel();
            clearInterval(speech_interval);
        };
        this.speak = function (speech_text, on_finish, speed) {
            console.log("MOUTH: " + speech_text);

            window.speechSynthesis.cancel();
            window.speechSynthesis.rate = 10;
            var speech_object = new SpeechSynthesisUtterance(speech_text);
            speech_object.lang = 'en-US';

            window.speechSynthesis.speak(speech_object);
            talking = true;
            application.display.updateMouthDisplay(true);

            var speech_interval = setInterval(function () {
                if (window.speechSynthesis.speaking == false) {
                    clearInterval(speech_interval);
                    if (on_finish != undefined) {
                        on_finish();
                    }
                    talking = false;
                    application.display.updateMouthDisplay(false);
                }
            }, 10);
        };
    };
    var EarsEngine = function () {

        var listener;
        var listening = false;
        var listening_for_array = [];

        var word_thesaurus = {
            'any_affirmative' : ['yes', 'yep', 'ready', 'yelp', 'yeah', 'ready', 'reddit', 'freddie', 'freddy'],
            'any_negative' : ['no', 'nope'],
            'wait' : ['wait', 'weight'],
            'hour' : ['hour', 'hours', 'our', 'ours'],
            'minute' : ['minute', 'minutes'],
            'second' : ['second', 'seconds']
        };

        this.getListening = function () {
            return listening;
        };
        this.listenFor = function (response_list_object) {

            listener = new webkitSpeechRecognition();
            listener.lang = "en-US";
            listener.continuous = false;
            listener.interimResults = true;

            listener.onresult = function(event) {

                var heard_text = getResultText(event);
                console.log('EARS: Heard ['+heard_text+']');

                var understood_as = getIsListenedFor(heard_text);
                if (understood_as != false) {
                    if (listening == true) {
                        console.log("EARS: understood [" + understood_as + "]");

                        // Parse out time if looking for a duration response;
                        if (response_list_object[0]['response'] == 'minute') {
                            var time_integer = Number(heard_text.replace(/[^\d]/g, ''));
                            time_integer = (time_integer < 1) ? 1 : time_integer;
                            sendToOutput("[USER] " + time_integer + " " + understood_as);
                            getResponseReaction(understood_as)(time_integer);

                        } // Otherwise expect a single word response;
                        else {
                            sendToOutput("[USER] " + understood_as);
                            getResponseReaction(understood_as)();
                        }
                        // Stop listening to further results;
                        listening = false;
                        listener.abort();
                    }
                }
            };
            listener.onend = function () {
                listening = false;
                listener.abort();
            };
            listener.start();

            console.log("EARS: Listening...");
            listening = true;
            application.display.updateEarsDisplay(true);

            function getIsListenedFor (response) {
                var understood_response = false;
                for (var each_response in response_list_object)
                {
                    var response_name = response_list_object[each_response]['response'];
                    for (var i = 0; i < word_thesaurus[response_name].length; i++) {
                        if (wordInString(word_thesaurus[response_name][i], response) == true) {
                            understood_response = response_name;
                            break;
                        }
                    }
                    if (understood_response != false) {
                        break;
                    }
                }
                return understood_response;
            }
            function getResultText(event) {
                var recognition_result = event['results'][0][0]['transcript'];
                var string_result = recognition_result.toString();
                return string_result.toLowerCase();
            }
            function getResponseReaction (understood_response) {
                var reaction_function = null;
                for (var each in response_list_object) {
                    if (response_list_object[each]['response'] == understood_response) {
                        reaction_function = response_list_object[each]['reaction'];
                        break;
                    }
                }
                return reaction_function;
            }
        };
        this.stopListening = function () {
            console.log('EARS: Stopping.');
            application.display.updateEarsDisplay(false);
        };
    };
    var mouth = new MouthEngine();
    var ears = new EarsEngine();

    // Scheduler/Scripter Objects;
    var schedule_maker = new ScheduleMaker(application);
    var script_maker = new ScriptMaker(application);
    var current_schedule, current_script;
    var script_current_index;

    // Control Variables;
    var quiet_run = false;
    var session_length;
    var session_type_name;

    var script_array = [];

    // Data Containers;
    var exchange_library = {
        'greeting' : {
            'do_before_call' : function () {
                application.display.clearResponseButtons();
                console.log('do before call- greeting');
                application.display.addResponseButton('Yes', function () {
                    startExchange('session_length');
                });
                application.display.addResponseButton('No', function () {
                    application.display.showPage('home_page');
                });
            },
            'call_script' : "Hi! I'm Budo. Ready to start?",
            'do_after_call' : function () {},
            'listen_for' : [
                {
                    'response' : 'any_affirmative',
                    'reaction' : function () {
                        startExchange('session_length');
                    }
                }, {
                    'response' : 'any_negative',
                    'reaction' : function () {
                        application.display.showPage('home_page');
                    }
                }
            ]
        },
        'session_length' : {
            'do_before_call' : function () {
                application.display.clearResponseButtons();
                console.log('do before call- session_length');
                application.display.addResponseButton('30 seconds', function () {
                    mouth.stopSpeaking();
                    planSession(shortTime(30 + 's'));
                    startSession();
                });
                application.display.addResponseButton('1 minute', function () {
                    mouth.stopSpeaking();
                    planSession(shortTime(1 + 'm'));
                    startSession();
                });
                application.display.addResponseButton('2 minutes', function () {
                    mouth.stopSpeaking();
                    planSession(shortTime(2 + 'm'));
                    startSession();
                });
                application.display.addResponseButton('6 minutes', function () {
                    mouth.stopSpeaking();
                    planSession(shortTime(6 + 'm'));
                    startSession();
                });
                application.display.addResponseButton('10 minutes', function () {
                    mouth.stopSpeaking();
                    planSession(shortTime(10 + 'm'));
                    startSession();
                });
                application.display.addResponseButton('20 minutes', function () {
                    mouth.stopSpeaking();
                    planSession(shortTime(20 + 'm'));
                    startSession();
                });
            },
            'call_script' : "How long should I plan for?",
            'do_after_call' : null,
            'listen_for' : [
                {
                    'response' : 'minute',
                    'reaction' : function (integer) {
                        console.log('understood a time! ' + integer + " minute(s)");
                        planSession(shortTime(integer + 'm'));
                        startSession();
                    }
                }, {
                    'response' : 'hour',
                    'reaction' : function (integer) {
                        console.log('understood a time! ' + integer + " hour(s)");
                        planSession(shortTime(integer + 'h'));
                        startSession();
                    }
                }, {
                    'response' : 'second',
                    'reaction' : function (integer) {
                        console.log('understood a time! ' + integer + " second(s)");
                        planSession(shortTime(integer + 's'));
                        startSession();
                    }
                }
            ]
        }
    };
    var lecture_library = {
        'read_script_item' : {
            'call_script' : function () {
                return String(script_array[script_current_index][0]);
            },
            'do_after_call' : function () {
                var wait_interval = setInterval(
                    function () {
                        startNextScriptItem();
                        clearInterval(wait_interval);
                    }, script_array[script_current_index][1]
                );

            }
        },
        'declare_session_type' : {
            'call_script' : function (duration_string, session_type) {
                return String(duration_string + ". Let's do a " + session_type);
            },
            'do_after_call' : function () {
                designSession();
            }
        },
        'finish_session' : {
            'call_script' : function () {
                return String("Alright, session complete. Saving.");
            },
            'do_after_call' : function () {
                //application.data.saveSessionData();
            }
        }
    };
    var question_library = {

    };

    // Public Methods;
    this.quickSpeak = function (say_this) {
        mouth.speak(say_this);
    };
    this.start = function () {
        quiet_run = false;
        startExchange("greeting");
    };
    this.stop = function () {
        mouth.stopSpeaking();
        ears.stopListening();
    };
    this.quietRunning = function (on_off) {
        quiet_run = (on_off) ? true : false;
    };
    this.generateSchedule = function (session_length) {
        console.log('Trying to generate schedule for a '+session_length+' ms session.');
        planSession(session_length);
        outputSchedule(current_schedule);
        outputScript(current_script);
    };

    // Private Functions;
    function startExchange (exchange_key) {
        console.log("EXCH: Starting [" + exchange_key + "]");
        var exchange = exchange_library[exchange_key];

        // DO-BEFORE ACTIONS;
        if (exchange['do_before_call'] != null) {
            exchange['do_before_call']()
        }

        // SPEAK CALL;
        mouth.speak(exchange['call_script']);
        sendToOutput("[TENGU] "+exchange['call_script']);

        var on_done_talking = setInterval (
            function () {
                if (mouth.getTalking() == false) {
                    console.log('EXCH: Done talking.');
                    doAfterCall();
                    ears.listenFor(exchange['listen_for']);
                    clearInterval(on_done_talking);
                }
            }, 10
        );

        // DO AFTER CALL;
        function doAfterCall () {
            if (exchange['do_after_call'] != null) {
                return exchange['do_after_call']();
            } else {
                return null;
            }
        }
    }
    function startReadingScript (next) {

        if (next != true) {
            script_current_index = 0;
        } else {
            script_current_index ++;
        }

        if (current_script.script_items[script_current_index]) {

            var script_object = current_script.script_items[script_current_index];
            var script_text = script_object.text;

            var script_interval = setInterval(
                function () {
                    clearInterval(script_interval);
                    startReadingScript(true);
                },
                script_object.interval
            );
            sendToOutput(script_object.time_stamp+" "+script_text);
            mouth.speak(script_text);
        } else {
            endSession();
        }
    }
    function startLecture (lecture_key) {
        console.log('trying to start a lecture');

        var script;
        var lecture = lecture_library[lecture_key];
        switch (lecture_key) {
            case('read_script_item') : script = lecture['call_script'](); break;
            case('declare_session_type') : script = lecture['call_script'](timeToText(session_length), session_type_name); break;
            default : console.log ("startLecture does not understand this lecture key."); break;
        }
        mouth.speak(script);
        sendToOutput("[TENGU] "+script);
        var on_done_talking = setInterval (
            function () {
                if (mouth.getTalking() == false) {
                    console.log('LECT: Done talking.');
                    clearInterval(on_done_talking);
                    lecture['do_after_call']();
                }
            }, 10
        );

    }
    function startSession () {
        // start session is redundant to startreadingscript, i think.
        startReadingScript(null);
    }
    function endSession () {
        mouth.speak('Session Complete.');
        sendToOutput("[TENGU] Session Complete.");
        application.data.saveSession(current_schedule);
    }

    // Schedule Design;
    function planSession (ms_length) {
        current_schedule = schedule_maker.getSchedule(ms_length);
        current_script = script_maker.getScript(current_schedule);
        console.log(current_schedule);
        //console.log(current_script);
    }

    // Engine-tester Output Function;
    function outputSchedule (schedule_obj) {
        application.display.engineTestOutput("<p><b>Test Schedule Output:</b></p>");
        application.display.engineTestOutput("<hr>");
        for (var each in schedule_obj.blocks) {
            var block = schedule_obj.blocks[each];
            var block_output = "" +
                "<p>" + block.type + " : <b>" + block.activity + "</b> (" + timeToText(block.length) + ")</p>";
            application.display.engineTestOutput(block_output);
        }
        application.display.engineTestOutput("<hr>");
    }
    function outputScript (script_obj) {
        application.display.engineTestOutput("<p><b>Test Script Output:</b></p>");
        application.display.engineTestOutput("<hr>");
        var rep_count = 0;
        var last_rep = "";
        var rep_time = 0;
        for (var each in script_obj.script_items) {
            var item = script_obj.script_items[each];
            var block_output;
            if (item.rep_number != 0) {
                rep_time += item.interval;
                last_rep = "<p><span class='timestamp'>" + item.time_stamp +"</span> <b>\""+ item.text + "\" x " + item.rep_number + "</b> (" + timeToText(rep_time) + ")</p>";
            } else if (rep_count == 0 && last_rep != "") {
                block_output = last_rep + "<p><span class='timestamp'>" + item.time_stamp +"</span> <b>\""+ item.text + "\"</b> (" + timeToText(item.interval) + ")</p>";
                application.display.engineTestOutput(block_output);
                last_rep = "";
            } else {
                block_output = "<p><span class='timestamp'>" + item.time_stamp +"</span> <b>\""+ item.text + "\"</b> (" + timeToText(item.interval) + ")</p>";
                application.display.engineTestOutput(block_output);
            }
        }
        if (last_rep != "") {
            application.display.engineTestOutput(last_rep);
        }
        application.display.engineTestOutput("<hr>");
    }
};