var DisplayEngine = function (application) {

    // Object Variables;
    var display_engine = this;
    var current_version = application.data.getVersion();
    var container_div, page_container;
    var popup_backdrop_div, popup_container_div;

    // Public Methods;
    this.initializeDisplay = function () {
        container_div = document.getElementById('page_div');
    };
    this.showPage = function (to_page) {

        application.data.setToCookie('bookmark', to_page);

        var fade_speed = 25;

        var white_out_div = make('div');
        $(white_out_div).addClass('initial_whiteout');
        container_div.appendChild(white_out_div);

        var bookmark_list = {
            'about_page' : function () { showAboutPage(); },
            'art_tech_admin' : function () { showArtManagerPage(); },
            'budo_page' : function () { showBudoPage(); application.initializeSpeech(); },
            'combo_manager' : function () { showComboPage(); },
            'engine_information_page' : function () { showEngineInfoPage(); },
            'equipment_manager' : function () { showEquipmentManagerPage(); },
            'front_page' : function () { showFrontPage(); },
            'home_page' : function () { showHomePage(); },
            'password_recovery' : function () { showPasswordRecovery(); },
            'profile_settings' : function () { showProfileSettingsPage(); },
            'scheduler_test' : function () { showSchedulerTestPage(); },
            'technique_manager' : function () { showTechniqueManagerPage(); },
            'register_page' : function () { showRegisterPage(); },
            'register_page_2' : function () { showRegisterPage2(); },
            'register_page_3' : function () { showRegisterPage3(); },
            'session_history' : function () { application.data.getSessionHistory(function () { showSessionHistory(); }); }
        };

        function whiteIn () {
            var white_out = setInterval(function () {
                white_out_div.style.opacity = Number(white_out_div.style.opacity) + 0.1;
                if (white_out_div.style.opacity == 1) {
                    clearInterval(white_out);
                    if (page_container != undefined) {
                        container_div.removeChild(page_container);
                    }
                    if (bookmark_list[to_page]) {
                        bookmark_list[to_page]();
                    } else {
                        console.log("DisplayEngine showPage Error; "+to_page+" not a valid page name.");
                    }
                    whiteOut();
                }
            }, fade_speed);
        }
        function whiteOut () {
            var white_out = setInterval(function () {
                white_out_div.style.opacity = Number(white_out_div.style.opacity) - 0.1;
                if (white_out_div.style.opacity == 0) {
                    clearInterval(white_out);
                    container_div.removeChild(white_out_div);
                }
            }, fade_speed);
        }
        // Kick off sequence;
        whiteIn();
    };
    this.closePopup = function () {
        document.body.removeChild(popup_container_div);
        document.body.removeChild(popup_backdrop_div);
    };
    this.showPopup = function (popup_type, identifier) {

        var popup_type_list = {
            'fitness' : function (param) { showFitnessPopup(param); },
            'new_combo' : function () { showNewComboPopup(); },
            'technique' : function (param) { showTechniquePopup(param); }
        };

        popup_backdrop_div = make('div', 'popup_backdrop_div');
        popup_container_div = make('div', 'popup_container_div');

        // Populate Build;
        popup_type_list[popup_type](identifier);

        document.body.appendChild(popup_backdrop_div);
        document.body.appendChild(popup_container_div);
    };
    this.showError = function (error_type) {

        var error_cases = {
            'login_name' : function () {
                document.getElementById('submit_login_button').innerHTML = "login : name not found"; },
            'login_pass' : function () {
                document.getElementById('submit_login_button').innerHTML = "login : incorrect password"; }
        };

        if (error_cases[error_type]) {
            error_cases[error_type]();
        }
    };
    this.updateMouthDisplay = function (on_off) {
        var m_disp = document.getElementById('mouth_output');
        if (on_off) {
            m_disp.style.backgroundColor = "#cae0ed";
            m_disp.innerHTML = "speaking : true";
        } else {
            m_disp.style.backgroundColor = "white";
            m_disp.innerHTML = "speaking : false"
        }
    };
    this.updateEarsDisplay = function (on_off) {
        var e_disp = document.getElementById('ears_output');
        if (on_off) {
            e_disp.style.backgroundColor = "#cae0ed";
            e_disp.innerHTML = "listening : true";
        } else {
            e_disp.style.backgroundColor = "white";
            e_disp.innerHTML = "listening : false"
        }
    };

    // Page-Specific Methods;
    this.engineTestOutput = function (to_output) {
        if (to_output) {
            $('#engine_test_output').append(to_output);
        } else {
            $('#engine_test_output').innerHTML = "";
        }

    };
    this.addResponseButton = function (button_value, button_onclick) {
        var new_button = make('input');
        new_button.type = 'button';
        new_button.value = button_value;
        new_button.onclick = button_onclick;
        document.getElementById('speech_input_div').appendChild(new_button);
    };
    this.clearResponseButtons = function () {
        //todo works in conjunction with the above;
        var input_div = document.getElementById('speech_input_div');
        input_div.innerHTML = "";
    };

    // Page Functions;
    function showAboutPage () {

        //todo shorten the about text and div, add second panel beneath, a scrollable release notes;

        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 250);
        page_container.appendChild(makePageBanner ("budo | about", "What is this application about?"));

        var info_div = make('div');
        info_div.style.border = "1px solid black";
        info_div.style.margin = "4px 8px";
        info_div.style.textAlign = "left";
        info_div.style.padding = "18px";
        info_div.className = "no_select";
        info_div.style.cursor = "default";
        info_div.innerHTML = "" +
            "<p>'Mushin' is a Japanese concept, taken literally as:</p><p style='text-align:center;'>No (mu) Mind (shin).</p>" +
            "<p>The aim of this application is to allow users to take a no-minded approach to martial arts training and exercise.</p>" +
            "<p style='text-align:center'>" +
            "<a target='_blank' href='https://www.youtube.com/watch?v=52l6oPJPBKE'>Concept Video 1</a><br/>" +
            "<a target='_blank' href='https://www.youtube.com/watch?v=q44FPyNZK5I'>Concept Video 2</a>" +
            "</p>";
        page_container.appendChild(info_div);

        page_container.appendChild(makePageSpacer(120));

        var release_notes_div = makeButtonDiv('release notes');
        page_container.appendChild(release_notes_div);
        release_notes_div.onclick = function () {
            window.open("Release.txt");
        };

        var back_div = makeButtonDiv('back');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            display_engine.showPage('front_page');
        };
    }
    function showArtManagerPage () {

        // Page Variables;
        var known_arts = application.data.getKnownArtList();
        var relation_array = application.data.getRelationArray();

        // Page Header Block;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 450);
        page_container.appendChild(makePageBanner("budo | art control", "Define the art(s) that make up your personal style."));

        // Art List Div;
        var art_div = make('div', 'art_manager_div');
        art_div.style.height = 263;
        art_div.style.border = "1px solid black";
        art_div.style.overflowY = "auto";
        art_div.style.margin = "4px 8px";
        art_div.style.textAlign = "center";
        art_div.style.padding = "6px";
        art_div.className = "no_select";
        art_div.style.cursor = "default";
        page_container.insertBefore(art_div, clear_button_div);

        // Known Art List;
        var art_table = make('table', null);
        if (known_arts.length == 0) {
            art_table.className = 'empty_art_manager_table';
            var message_row = make('tr');
            var art_message_cell = make('td', null, 'arts_message');
            art_message_cell.innerHTML = "You have not selected any arts yet.";
            message_row.appendChild(art_message_cell);
            art_table.appendChild(message_row);
        }
        else {
            art_table.id = 'art_manager_table';
            for (var art_id in relation_array) {
                if (art_id != 'fitness') {
                    var art_row = make('tr');
                    var techs_known = application.data.getTechsKnownInArt(art_id);
                    var art_name_cell = make('td');
                    art_name_cell.innerHTML = application.data.getArtName(art_id)+ " ("+techs_known+")";
                    var art_action_cell = make('td', null, 'act_on_tech');
                    var drop_span = make('span');
                    drop_span.style.cursor = 'pointer';
                    drop_span.innerHTML = "drop";
                    drop_span.onclick = function (art_id) {
                        return function () {
                            application.data.removeArtFromUser(art_id);
                            application.data.getProfileDataAndShowPage(application.data.getUserId(), 'art_tech_admin');
                        }
                    }(art_id);
                    art_action_cell.appendChild(drop_span);
                    art_row.appendChild(art_name_cell);
                    art_row.appendChild(art_action_cell);
                    art_table.appendChild(art_row);
                }
            }
        }
        art_div.appendChild(art_table);

        // Other Arts Label;
        var other_art_label = make('p', 'other_art_label');
        other_art_label.innerHTML = "Other Arts";
        art_div.appendChild(other_art_label);

        // Other Arts Table;
        var other_arts_table = make('table', 'other_art_manager_table');
        var art_list = application.data.getArtList(true);
        for (var i in art_list) {
            var art = art_list[i];
            if (application.data.getIsArtKnown(i) == false) {
                var other_art_row = make('tr');
                var other_art_name_cell = make('td');
                other_art_name_cell.innerHTML = art['art_name'];
                var other_art_action_cell = make('td', null, 'act_on_tech');
                var add_span = make('span');
                add_span.style.cursor = 'pointer';
                add_span.innerHTML = "add";
                add_span.onclick = function (art_id) {
                    return function () {
                        application.data.addArtToUser(art_id);
                        application.data.getProfileDataAndShowPage(application.data.getUserId(), 'art_tech_admin');
                    }
                }(art['art_id']);
                other_art_action_cell.appendChild(add_span);
                other_art_row.appendChild(other_art_name_cell);
                other_art_row.appendChild(other_art_action_cell);
                other_arts_table.appendChild(other_art_row);
            }

        }
        art_div.appendChild(other_arts_table);

        // Clear Button Block;
        var clear_button_div = makeFloatButtonDiv("&nbsp;clear&nbsp;", 35, "left");
        clear_button_div.style.textDecoration = 'line-through';
        page_container.appendChild(clear_button_div);
        clear_button_div.onclick = function () {

        };

        // Save Changes Button Block;
        var save_button_div = makeButtonDiv("&nbsp;save changes&nbsp;");
        save_button_div.style.marginLeft = "66px";
        save_button_div.style.textDecoration = 'line-through';
        page_container.appendChild(save_button_div);
        save_button_div.onclick = function () {

        };

        // Create Art Button Block;
        var create_button_div = makeFloatButtonDiv("create", 35, "right");
        create_button_div.style.padding = "10px";
        page_container.appendChild(create_button_div);
        create_button_div.onclick = function () {
            if (new_art_input.value != "") {
                application.data.saveNewArt(new_art_input.value);
            }
        };

        // New Art Input Block;
        var new_art_div = make('div');
        new_art_div.style.marginRight = "70px";
        page_container.appendChild(new_art_div);
        var new_art_input = make('input');
        new_art_input.type = "text";
        new_art_input.placeholder = "New Art Name";
        new_art_input.style.width = "250px";
        new_art_input.style.padding = "4px";
        new_art_input.style.margin = "4px";
        new_art_div.innerHTML = "new name:";
        new_art_div.appendChild(new_art_input);

        // Page Spacer Block;
        page_container.appendChild(makePageSpacer(20));

        // Back Button Block;
        var back_button_div = makeButtonDiv("back");
        page_container.appendChild(back_button_div);
        back_button_div.onclick = function () {
            display_engine.showPage('home_page');
        };

        function buildTechniqueList (art_id) {

            if (art_id == 0) {
                disableSaveClearButtons();
                tech_change_array = [];
            }

            art_div.innerHTML = "";

            art_div.style.border = "1px solid black";
            art_div.style.height = 262;
            art_div.style.overflowY = "auto";
            art_div.style.margin = "4px 8px";
            art_div.style.textAlign = "left";
            art_div.style.padding = "6px";
            art_div.className = "no_select";
            art_div.style.cursor = "default";
            page_container.insertBefore(art_div, clear_button_div);

            var tech_table = make('table');
            tech_table.style.fontSize = '11px';
            var tech_list = application.data.getTechniqueList();

            tech_change_array = [];
            for (var each_tech in tech_list)
            {

                var tech = tech_list[each_tech];
                var tech_row = make('tr');
                var name_cell = make('td');
                var toggle_cell = make('td');

                var row_id = 'tech_'+tech['tech_id'];

                name_cell.id = row_id + "_name";
                name_cell.innerHTML = tech['tech_name'];

                if (art_id != 0) {

                    toggle_cell.style.width = "85px";
                    var on_radio = make('input');
                    var on_label = make('label');
                    var off_radio = make('input');
                    var off_label = make('label');
                    off_label.className = on_label.className = "tech_toggle_label";

                    on_radio.type = off_radio.type = 'radio';
                    on_radio.name = off_radio.name = row_id;

                    on_label.id = row_id + "_on";
                    off_label.id = row_id + "_off";

                    on_radio.id = row_id + "_on_r";
                    off_radio.id = row_id + "_off_r";

                    var tech_in_art = application.data.getTechRelationToArt(tech['tech_id'], art_id);
                    switch (tech_in_art) {
                        case ('true') :
                            on_radio.checked = true;
                            name_cell.style.color = "black";
                            on_label.style.color = "black";
                            on_label.style.border = "1px solid black";
                            off_label.style.color = "darkgray";
                            off_label.style.border = "1px solid darkgray";
                            break;
                        case ('false') :
                            off_radio.checked = true;
                            name_cell.style.color = "darkgray";
                            on_label.style.color = "darkgray";
                            on_label.style.border = "1px solid darkgray";
                            off_label.style.color = "black";
                            off_label.style.border = "1px solid black";
                            break;
                    }

                    on_label.innerHTML += "In";
                    off_label.innerHTML += "Out";

                    on_label.appendChild(on_radio);
                    off_label.appendChild(off_radio);

                    on_radio.onchange = function (name_cell, on_label, on_radio, off_label, in_art) {
                        return triggerOnRadio (name_cell, on_label, on_radio, off_label, in_art);
                    }(name_cell, on_label, on_radio, off_label, tech_in_art);

                    off_radio.onchange = function (name_cell, on_label, off_label, off_radio, in_art) {
                        return triggerOffRadio(name_cell, on_label, off_label, off_radio, in_art);
                    }(name_cell, on_label, off_label, off_radio, tech_in_art);

                    toggle_cell.appendChild(on_label);
                    toggle_cell.appendChild(off_label);
                }

                // todo if you toggle a tech on/off and then back again, and click save- it will send an ajax call to perform a redundant update.

                tech_row.appendChild(name_cell);

                if (art_id != 0) {
                    tech_row.appendChild(toggle_cell);
                } else {
                    name_cell.style.padding = "5px 1px 5px 1px";
                }

                tech_table.appendChild(tech_row);
            }
            art_div.appendChild(tech_table);
            tech_table.style.width = "100%";
        }
        function checkIfEditsMade () {
            var can_clear = false;
            var change_count = 0;
            for (var each in tech_change_array) {
                if (tech_change_array[each] != "") {
                    change_count ++;
                    break;
                }
            }
            if (change_count != 0) {
                enableClearButton();
                enableSaveButton();
                art_select.disabled = true;
            } else {
                disableSaveClearButtons();

            }
        }
        function disableSaveClearButtons () {
            clear_button_div.style.textDecoration = "line-through";
            clear_button_div.style.color = "darkgray";
            clear_button_div.onclick = null;

            save_button_div.style.textDecoration = "line-through";
            save_button_div.style.color = "darkgray";
            save_button_div.onclick = null;
        }
        function enableClearButton () {
            clear_button_div.style.textDecoration = "none";
            clear_button_div.style.color = "black";

            clear_button_div.onclick = function () {

                return function () {
                    console.log('Clearing');
                    // Reverse all selections;
                    for (var tech_name_id in tech_change_array) {
                        if (tech_change_array[tech_name_id] != "") {
                            var on_label = document.getElementById(tech_name_id + "_on");
                            var off_label = document.getElementById(tech_name_id + "_off");
                            var on_radio = document.getElementById(tech_name_id + "_on_r");
                            var off_radio = document.getElementById(tech_name_id + "_off_r");
                            var name_cell = document.getElementById(tech_name_id + "_name");
                            switch (tech_change_array[tech_name_id]) {
                                case ('false') :
                                    on_radio.checked = true;
                                    triggerOnRadio(name_cell, on_label, on_radio, off_label, tech_change_array[tech_name_id])();
                                    on_label.style.backgroundColor = "white";
                                    break;
                                default :
                                    off_radio.checked = true;
                                    triggerOffRadio(name_cell, on_label, off_label, off_radio, tech_change_array[tech_name_id])();
                                    off_label.style.backgroundColor = "white";
                                    break;
                            }
                        }
                    }
                    // Clear change array;
                    tech_change_array = [];

                    // Disable Buttons;
                    disableSaveClearButtons();
                }
            }();
        }
        function enableSaveButton () {
            save_button_div.style.textDecoration = "none";
            save_button_div.style.color = "black";

            save_button_div.onclick = function () {

                console.log('saving');

                var update_string = "";
                for (var tech_name_id in tech_change_array) {

                    var label_to_clear;
                    switch (tech_change_array[tech_name_id]) {
                        case ('false') : label_to_clear = document.getElementById(tech_name_id + "_off"); break;
                        default : label_to_clear = document.getElementById(tech_name_id + "_on"); break;
                    }
                    label_to_clear.style.backgroundColor = "white";

                    if (tech_change_array[tech_name_id] != "") {
                        switch (update_string) {
                            case ("") : update_string += tech_name_id.split("_")[1]+"="+tech_change_array[tech_name_id]; break;
                            default : update_string += "&" + tech_name_id.split("_")[1]+"="+tech_change_array[tech_name_id]; break;
                        }
                    }
                }
                disableSaveClearButtons();
                var art_id = art_select.value;
                application.data.saveArtTechUpdates(art_id, update_string);
            }

        }
        function triggerOnRadio (name_cell, on_label, on_radio, off_label, in_art) {
            return function () {
                if (in_art == 'false') {
                    tech_change_array[on_radio.name] = "true";
                    on_label.style.backgroundColor = "#CAE0ED";
                    off_label.style.backgroundColor = "white";
                } else {
                    tech_change_array[on_radio.name] = "";
                    on_label.style.backgroundColor = off_label.style.backgroundColor = "white";
                }
                if (on_radio.checked == true) {
                    name_cell.style.color = "black";
                    on_label.style.color = "black";
                    on_label.style.border = "1px solid black";
                    off_label.style.color = "darkgray";
                    off_label.style.border = "1px solid darkgray";
                }
                checkIfEditsMade();
            }
        }
        function triggerOffRadio (name_cell, on_label, off_label, off_radio, in_art) {
            return function () {
                if (in_art == 'true') {
                    tech_change_array[off_radio.name] = "false";
                    off_label.style.backgroundColor = "#CAE0ED";
                    on_label.style.backgroundColor = "white";
                } else {
                    tech_change_array[off_radio.name] = "";
                    on_label.style.backgroundColor = off_label.style.backgroundColor = "white";
                }
                if (off_radio.checked == true) {
                    name_cell.style.color = "darkgray";
                    on_label.style.color = "darkgray";
                    on_label.style.border = "1px solid darkgray";
                    off_label.style.color = "black";
                    off_label.style.border = "1px solid black";
                }
                checkIfEditsMade();
            }
        }
    }
    function showBudoPage () {

        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 450);
        page_container.appendChild(makePageBanner('budo'));

        var info_div = make('div');
        info_div.style.border = "1px solid black";
        info_div.style.display = "inline-block";
        info_div.style.margin = "1px 8px 1px 8px";
        info_div.style.textAlign = "left";
        info_div.style.padding = "2px";
        info_div.className = "no_select";
        info_div.style.cursor = "default";
        page_container.appendChild(info_div);

        var output_div = make('div');
        var input_div = make('div');
        output_div.id = "speech_output_div";
        input_div.id = "speech_input_div";

        output_div.style.display = "inline";
        output_div.style.overflowY= "auto";
        output_div.style.float = "left";
        output_div.style.padding = "4px";

        input_div.style.display = "inline";
        input_div.style.float = "right";
        input_div.style.padding = "3px";
        input_div.style.textAlign = "left";
        input_div.style.color = "gray";

        info_div.appendChild(output_div);
        info_div.appendChild(input_div);

        output_div.style.width = input_div.style.width = "188px";
        output_div.style.height = input_div.style.height = "308px";

        // Back Button Block;
        var back_div = makeButtonDiv('exit');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            application.tengu.stop();
            display_engine.showPage('home_page');

        };

        // Page Break Block;
        page_container.appendChild(makePageSpacer(40));
    }
    function showComboPage () {

        // Page Variables;
        var combo_array = application.data.getCombinationArray();
        console.log('combo_array');
        console.log(combo_array);

        // Page Header Block;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 450);
        page_container.appendChild(makePageBanner ("budo | combo control", "Create and adopt combinations to pattern your techniques."));

        // Combo List Div;
        var combo_list_div = make('div', 'art_manager_div');
        combo_list_div.style.height = 267;
        combo_list_div.style.border = "1px solid black";
        combo_list_div.style.overflowY = "auto";
        combo_list_div.style.margin = "4px 8px";
        combo_list_div.style.textAlign = "center";
        combo_list_div.style.padding = "6px";
        combo_list_div.style.cursor = "default";
        combo_list_div.className = "no_select";
        page_container.appendChild(combo_list_div);

        // Known Equipment List;
        var known_combo_table = make('table', null);
        if (combo_array['known_array'].length == 0) {
            known_combo_table.className = 'empty_art_manager_table';
            var message_row = make('tr');
            var art_message_cell = make('td', null, 'arts_message');
            art_message_cell.innerHTML = "You have not selected any combinations.";
            message_row.appendChild(art_message_cell);
            known_combo_table.appendChild(message_row);
        }
        else {
            known_combo_table.className = 'combo_manager_table';
            for (each in combo_array['known_array']) {
                var combo_id = combo_array['known_array'][each];
                var combo_row = make('tr');
                var combo_name_cell = make('td');
                combo_name_cell.innerHTML = application.data.getComboName(combo_id) + "<br/>" +
                    "<span class='combo_tech_string_span'>"+application.data.getComboTechString(combo_id)+"</span>";
                var combo_action_cell = make('td', null, 'act_on_tech');
                var drop_span = make('span');
                drop_span.style.cursor = 'pointer';
                drop_span.innerHTML = "drop";
                drop_span.onclick = function (id) {
                    return function () {
                        application.data.removeComboFromUser(id);
                        application.data.getProfileDataAndShowPage(application.data.getUserId(), 'combo_manager');
                    }
                }(combo_id);
                combo_action_cell.appendChild(drop_span);
                combo_row.appendChild(combo_name_cell);
                combo_row.appendChild(combo_action_cell);
                known_combo_table.appendChild(combo_row);
            }
        }
        combo_list_div.appendChild(known_combo_table);

        // Other Arts Label;
        var other_art_label = make('p', 'other_art_label');
        other_art_label.innerHTML = "Unrelated Combinations";
        combo_list_div.appendChild(other_art_label);

        // Known Equipment List;
        var unknown_combo_table = make('table', null);
        if (combo_array['unrelated_array'].length == 0) {
            unknown_combo_table.className = 'empty_art_manager_table';
            message_row = make('tr');
            art_message_cell = make('td', null, 'arts_message');
            art_message_cell.innerHTML = "You have not selected any combinations.";
            message_row.appendChild(art_message_cell);
            unknown_combo_table.appendChild(message_row);
        }
        else {
            unknown_combo_table.className = 'combo_manager_table';
            for (var each in combo_array['unrelated_array']) {
                combo_id = combo_array['unrelated_array'][each];
                combo_row = make('tr');
                combo_name_cell = make('td');
                combo_name_cell.innerHTML = application.data.getComboName(combo_id) + "<br/>" +
                    "<span class='combo_tech_string_span'>"+application.data.getComboTechString(combo_id)+"</span>";
                combo_action_cell = make('td', null, 'act_on_tech');
                var add_span = make('span');
                add_span.style.cursor = 'pointer';
                add_span.innerHTML = "add";
                add_span.onclick = function (id) {
                    return function () {
                        application.data.addComboToUser(combo_id);
                        application.data.getProfileDataAndShowPage(application.data.getUserId(), 'combo_manager');
                    }
                }(combo_id);
                combo_action_cell.appendChild(add_span);
                combo_row.appendChild(combo_name_cell);
                combo_row.appendChild(combo_action_cell);
                unknown_combo_table.appendChild(combo_row);
            }
        }
        combo_list_div.appendChild(unknown_combo_table);

        // Save Changes Button;s
        var save_button_div = makeButtonDiv("&nbsp;save changes&nbsp;");
        save_button_div.style.textDecoration = 'line-through';
        page_container.appendChild(save_button_div);
        save_button_div.onclick = function () {

        };

        // New Combination Button;
        var new_button_div = makeButtonDiv("new combination");
        page_container.appendChild(new_button_div);
        new_button_div.onclick = function () {
            display_engine.showPopup('new_combo');
        };

        page_container.appendChild(makePageSpacer(20));

        var back_div = makeButtonDiv("back");
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            display_engine.showPage('home_page');
        };
    }
    function showEngineInfoPage () {

        // Page Header Block;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 450);
        page_container.appendChild(makePageBanner ("budo | engine information", "Some information about how the Tengu designs practices."));

        // Engine Info Text Block;
        var info_div = make('div');
        info_div.style.border = "1px solid black";
        info_div.style.margin = "4px 8px";
        info_div.style.textAlign = "left";
        info_div.style.padding = "8px";
        info_div.style.height = 300;
        info_div.style.overflowY = "scroll";
        info_div.className = "no_select";
        info_div.style.cursor = "default";
        info_div.innerHTML = "" +
            "<p id='engine_notes'>" +
            "<span class='top'>Limitations:</span><br/>" +
            "<span class='sub'>Hardcoded Parameters:</span><br/>" +
            "<span class='item'>&bull; The duration of each command and rep count are hardcoded to 900ms and 800ms, respectively.</span><br/>" +
            "<span class='top'>Engine Notes:</span><br/>" +
            "<span class='sub'>System Parameters:</span><br/>" +
            "<span class='item'>&bull; Max work block length. (<span class='engine_info_var'>In your case, <b>"+application.data.getMaxWork()+" minute(s)</b></span>)</span><br/>" +
            "<span class='item'>&bull; Work/rest block ratio. (<span class='engine_info_var'>In your case, <b>"+application.data.getWorkRatio()+":"+application.data.getRestRatio()+"</b>.</span>)</span><br/>" +
            "<span class='item'>&bull; Attention (For example: 2 [techs] per 2m[inutes].)</span><br/>" +
            "<span class='item'>&bull; Known Techniques (<span class='engine_info_var'>In your case, <b>" + application.data.getKnownTechniqueCount() + " techniques</b>.)</span><br/>" +
            "<span class='sub'>Work Activities:</span><br/>" +
            "<span class='item'>&bull; <i>Combo Ladder</i> | Combination chosen at random, and is built up tech by tech.</span><br/>" +
            "<span class='item'>&bull; <i>Serial Strikes</i> | Techs are chosen at random, and repped as much as time allows. The amount of techs per block is determined by the [attention] system parameter.</span><br/>" +
            "<span class='sub'>Rest Activities:</span><br/>" +
            "<span class='item'>&bull; <i>Empty Rest</i> | Gives 10, 3, 2 and 1 second warnings before next block begins.</span><br/>" +
            "</p>";
        page_container.appendChild(info_div);

        // Page Break Block;
        page_container.appendChild(makePageSpacer(20));

        var test_div = makeButtonDiv('scheduler test');
        page_container.appendChild(test_div);
        test_div.onclick = function () {
            display_engine.showPage('scheduler_test');
        };

        // Back Button Block;
        var back_div = makeButtonDiv('back');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            display_engine.showPage('home_page');
        };
    }
    function showEquipmentManagerPage () {

        // Page Variables;
        var available_equipment = application.data.getAvailableEquipment();
        var equipment_index = application.data.getEquipmentIndex();

        // Page Header Block;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 450);
        page_container.appendChild(makePageBanner("budo | equipment manager", "Select the gear you have, to enable the techniques that require them."));

        // Art List Div;
        var art_div = make('div', 'art_manager_div');
        art_div.style.height = 263;
        art_div.style.border = "1px solid black";
        art_div.style.overflowY = "auto";
        art_div.style.margin = "4px 8px";
        art_div.style.textAlign = "center";
        art_div.style.padding = "6px";
        art_div.className = "no_select";
        art_div.style.cursor = "default";
        page_container.insertBefore(art_div, clear_button_div);

        // Known Equipment List;
        var equipment_table = make('table', null);
        if (available_equipment.length == 0) {
            equipment_table.className = 'empty_art_manager_table';
            var message_row = make('tr');
            var art_message_cell = make('td', null, 'arts_message');
            art_message_cell.innerHTML = "You have not selected any equipment yet.";
            message_row.appendChild(art_message_cell);
            equipment_table.appendChild(message_row);
        }
        else {
            equipment_table.id = 'art_manager_table';
            for (var each in available_equipment) {
                var equipment_id = available_equipment[each];
                var equipment_row = make('tr');
                var equipment_name_cell = make('td');
                equipment_name_cell.innerHTML = application.data.getEquipmentName(equipment_id);
                var art_action_cell = make('td', null, 'act_on_tech');
                var drop_span = make('span');
                drop_span.style.cursor = 'pointer';
                drop_span.innerHTML = "drop";
                drop_span.onclick = function (equip_id) {
                    return function () {
                        application.data.removeEquipmentFromUser(equip_id);
                        application.data.getProfileDataAndShowPage(application.data.getUserId(), 'equipment_manager');
                    }
                }(equipment_id);
                art_action_cell.appendChild(drop_span);
                equipment_row.appendChild(equipment_name_cell);
                equipment_row.appendChild(art_action_cell);
                equipment_table.appendChild(equipment_row);
            }
        }
        art_div.appendChild(equipment_table);

        // Other Arts Label;
        var other_art_label = make('p', 'other_art_label');
        other_art_label.innerHTML = "Other Equipment";
        art_div.appendChild(other_art_label);

        // Other Arts Table;
        var other_equipment_table = make('table', 'other_art_manager_table');
        for (each in equipment_index) {
            var equipment = equipment_index[each];
            if (application.data.getIsEquipmentAvailable(each) == false) {
                var other_art_row = make('tr');
                var other_art_name_cell = make('td');
                other_art_name_cell.innerHTML = equipment.equipment_name;
                var other_art_action_cell = make('td', null, 'act_on_tech');
                var add_span = make('span');
                add_span.style.cursor = 'pointer';
                add_span.innerHTML = "add";
                add_span.onclick = function (equipment_id) {
                    return function () {
                        application.data.addEquipmentToUser(equipment_id);
                        application.data.getProfileDataAndShowPage(application.data.getUserId(), 'equipment_manager');
                    }
                }(equipment.equipment_id);
                other_art_action_cell.appendChild(add_span);
                other_art_row.appendChild(other_art_name_cell);
                other_art_row.appendChild(other_art_action_cell);
                other_equipment_table.appendChild(other_art_row);
            }
        }
        // todo Add a message for when you have adopted ALL equipment;
        art_div.appendChild(other_equipment_table);

        // Clear Button Block;
        var clear_button_div = makeFloatButtonDiv("&nbsp;clear&nbsp;", 35, "left");
        clear_button_div.style.textDecoration = 'line-through';
        page_container.appendChild(clear_button_div);
        clear_button_div.onclick = function () {

        };

        // Save Changes Button Block;
        var save_button_div = makeButtonDiv("&nbsp;save changes&nbsp;");
        save_button_div.style.marginLeft = "66px";
        save_button_div.style.textDecoration = 'line-through';
        page_container.appendChild(save_button_div);
        save_button_div.onclick = function () {

        };

        // Create Art Button Block;
        var create_button_div = makeFloatButtonDiv("create", 35, "right");
        create_button_div.style.padding = "10px";
        page_container.appendChild(create_button_div);
        create_button_div.onclick = function () {
            if (new_equipment_input.value != "") {
                application.data.saveNewEquipment(new_equipment_input.value);
            }
        };

        // New Art Input Block;
        var new_equipment_div = make('div');
        new_equipment_div.style.marginRight = "70px";
        page_container.appendChild(new_equipment_div);
        var new_equipment_input = make('input');
        new_equipment_input.type = "text";
        new_equipment_input.placeholder = "New Equipment Name";
        new_equipment_input.style.width = "250px";
        new_equipment_input.style.padding = "4px";
        new_equipment_input.style.margin = "4px";
        new_equipment_div.innerHTML = "new name:";
        new_equipment_div.appendChild(new_equipment_input);

        // Page Spacer Block;
        page_container.appendChild(makePageSpacer(20));

        // Back Button Block;
        var back_button_div = makeButtonDiv("back");
        page_container.appendChild(back_button_div);
        back_button_div.onclick = function () {
            display_engine.showPage('home_page');
        };

        function buildTechniqueList (art_id) {

            if (art_id == 0) {
                disableSaveClearButtons();
                tech_change_array = [];
            }

            art_div.innerHTML = "";

            art_div.style.border = "1px solid black";
            art_div.style.height = 262;
            art_div.style.overflowY = "auto";
            art_div.style.margin = "4px 8px";
            art_div.style.textAlign = "left";
            art_div.style.padding = "6px";
            art_div.className = "no_select";
            art_div.style.cursor = "default";
            page_container.insertBefore(art_div, clear_button_div);

            var tech_table = make('table');
            tech_table.style.fontSize = '11px';
            var tech_list = application.data.getTechniqueList();

            tech_change_array = [];
            for (var each_tech in tech_list)
            {

                var tech = tech_list[each_tech];
                var tech_row = make('tr');
                var name_cell = make('td');
                var toggle_cell = make('td');

                var row_id = 'tech_'+tech['tech_id'];

                name_cell.id = row_id + "_name";
                name_cell.innerHTML = tech['tech_name'];

                if (art_id != 0) {

                    toggle_cell.style.width = "85px";
                    var on_radio = make('input');
                    var on_label = make('label');
                    var off_radio = make('input');
                    var off_label = make('label');
                    off_label.className = on_label.className = "tech_toggle_label";

                    on_radio.type = off_radio.type = 'radio';
                    on_radio.name = off_radio.name = row_id;

                    on_label.id = row_id + "_on";
                    off_label.id = row_id + "_off";

                    on_radio.id = row_id + "_on_r";
                    off_radio.id = row_id + "_off_r";

                    var tech_in_art = application.data.getTechRelationToArt(tech['tech_id'], art_id);
                    switch (tech_in_art) {
                        case ('true') :
                            on_radio.checked = true;
                            name_cell.style.color = "black";
                            on_label.style.color = "black";
                            on_label.style.border = "1px solid black";
                            off_label.style.color = "darkgray";
                            off_label.style.border = "1px solid darkgray";
                            break;
                        case ('false') :
                            off_radio.checked = true;
                            name_cell.style.color = "darkgray";
                            on_label.style.color = "darkgray";
                            on_label.style.border = "1px solid darkgray";
                            off_label.style.color = "black";
                            off_label.style.border = "1px solid black";
                            break;
                    }

                    on_label.innerHTML += "In";
                    off_label.innerHTML += "Out";

                    on_label.appendChild(on_radio);
                    off_label.appendChild(off_radio);

                    on_radio.onchange = function (name_cell, on_label, on_radio, off_label, in_art) {
                        return triggerOnRadio (name_cell, on_label, on_radio, off_label, in_art);
                    }(name_cell, on_label, on_radio, off_label, tech_in_art);

                    off_radio.onchange = function (name_cell, on_label, off_label, off_radio, in_art) {
                        return triggerOffRadio(name_cell, on_label, off_label, off_radio, in_art);
                    }(name_cell, on_label, off_label, off_radio, tech_in_art);

                    toggle_cell.appendChild(on_label);
                    toggle_cell.appendChild(off_label);
                }

                // todo if you toggle a tech on/off and then back again, and click save- it will send an ajax call to perform a redundant update.

                tech_row.appendChild(name_cell);

                if (art_id != 0) {
                    tech_row.appendChild(toggle_cell);
                } else {
                    name_cell.style.padding = "5px 1px 5px 1px";
                }

                tech_table.appendChild(tech_row);
            }
            art_div.appendChild(tech_table);
            tech_table.style.width = "100%";
        }
        function checkIfEditsMade () {
            var can_clear = false;
            var change_count = 0;
            for (var each in tech_change_array) {
                if (tech_change_array[each] != "") {
                    change_count ++;
                    break;
                }
            }
            if (change_count != 0) {
                enableClearButton();
                enableSaveButton();
                art_select.disabled = true;
            } else {
                disableSaveClearButtons();

            }
        }
        function disableSaveClearButtons () {
            clear_button_div.style.textDecoration = "line-through";
            clear_button_div.style.color = "darkgray";
            clear_button_div.onclick = null;

            save_button_div.style.textDecoration = "line-through";
            save_button_div.style.color = "darkgray";
            save_button_div.onclick = null;
        }
        function enableClearButton () {
            clear_button_div.style.textDecoration = "none";
            clear_button_div.style.color = "black";

            clear_button_div.onclick = function () {

                return function () {
                    console.log('Clearing');
                    // Reverse all selections;
                    for (var tech_name_id in tech_change_array) {
                        if (tech_change_array[tech_name_id] != "") {
                            var on_label = document.getElementById(tech_name_id + "_on");
                            var off_label = document.getElementById(tech_name_id + "_off");
                            var on_radio = document.getElementById(tech_name_id + "_on_r");
                            var off_radio = document.getElementById(tech_name_id + "_off_r");
                            var name_cell = document.getElementById(tech_name_id + "_name");
                            switch (tech_change_array[tech_name_id]) {
                                case ('false') :
                                    on_radio.checked = true;
                                    triggerOnRadio(name_cell, on_label, on_radio, off_label, tech_change_array[tech_name_id])();
                                    on_label.style.backgroundColor = "white";
                                    break;
                                default :
                                    off_radio.checked = true;
                                    triggerOffRadio(name_cell, on_label, off_label, off_radio, tech_change_array[tech_name_id])();
                                    off_label.style.backgroundColor = "white";
                                    break;
                            }
                        }
                    }
                    // Clear change array;
                    tech_change_array = [];

                    // Disable Buttons;
                    disableSaveClearButtons();
                }
            }();
        }
        function enableSaveButton () {
            save_button_div.style.textDecoration = "none";
            save_button_div.style.color = "black";

            save_button_div.onclick = function () {

                console.log('saving');

                var update_string = "";
                for (var tech_name_id in tech_change_array) {

                    var label_to_clear;
                    switch (tech_change_array[tech_name_id]) {
                        case ('false') : label_to_clear = document.getElementById(tech_name_id + "_off"); break;
                        default : label_to_clear = document.getElementById(tech_name_id + "_on"); break;
                    }
                    label_to_clear.style.backgroundColor = "white";

                    if (tech_change_array[tech_name_id] != "") {
                        switch (update_string) {
                            case ("") : update_string += tech_name_id.split("_")[1]+"="+tech_change_array[tech_name_id]; break;
                            default : update_string += "&" + tech_name_id.split("_")[1]+"="+tech_change_array[tech_name_id]; break;
                        }
                    }
                }
                disableSaveClearButtons();
                var art_id = art_select.value;
                application.data.saveArtTechUpdates(art_id, update_string);
            }

        }
        function triggerOnRadio (name_cell, on_label, on_radio, off_label, in_art) {
            return function () {
                if (in_art == 'false') {
                    tech_change_array[on_radio.name] = "true";
                    on_label.style.backgroundColor = "#CAE0ED";
                    off_label.style.backgroundColor = "white";
                } else {
                    tech_change_array[on_radio.name] = "";
                    on_label.style.backgroundColor = off_label.style.backgroundColor = "white";
                }
                if (on_radio.checked == true) {
                    name_cell.style.color = "black";
                    on_label.style.color = "black";
                    on_label.style.border = "1px solid black";
                    off_label.style.color = "darkgray";
                    off_label.style.border = "1px solid darkgray";
                }
                checkIfEditsMade();
            }
        }
        function triggerOffRadio (name_cell, on_label, off_label, off_radio, in_art) {
            return function () {
                if (in_art == 'true') {
                    tech_change_array[off_radio.name] = "false";
                    off_label.style.backgroundColor = "#CAE0ED";
                    on_label.style.backgroundColor = "white";
                } else {
                    tech_change_array[off_radio.name] = "";
                    on_label.style.backgroundColor = off_label.style.backgroundColor = "white";
                }
                if (off_radio.checked == true) {
                    name_cell.style.color = "darkgray";
                    on_label.style.color = "darkgray";
                    on_label.style.border = "1px solid darkgray";
                    off_label.style.color = "black";
                    off_label.style.border = "1px solid black";
                }
                checkIfEditsMade();
            }
        }
    }
    function showFrontPage () {

        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 325);

        var banner_div = make('div');
        banner_div.style.backgroundColor = "#CCD8E1";
        banner_div.style.height = "10px";
        banner_div.style.border = "1px solid black";
        banner_div.style.margin = "8px 8px 4px 8px";
        banner_div.style.padding = "70px 0 30px 0";
        banner_div.style.fontSize = "24px";
        banner_div.className = "no_select";
        banner_div.style.cursor = "default";
        banner_div.innerHTML = "budo | v." + current_version;
        page_container.appendChild(banner_div);

        // Login Name Block;
        var login_div = make('div');
        page_container.appendChild(login_div);
        var login_input = make('input');
        login_input.type = "text";
        login_input.value = "Boxer";
        login_div.innerHTML = "name:";
        login_div.appendChild(login_input);

        // Password Block;
        var pass_div = make('div');
        page_container.appendChild(pass_div);
        var pass_input = make('input');
        pass_input.type = 'password';
        pass_input.value = 'pass';
        pass_div.innerHTML = "pass:";
        pass_div.appendChild(pass_input);

        // Submit Button Block;
        var submit_div = makeButtonDiv('login');
        submit_div.id = 'submit_login_button';
        page_container.appendChild(submit_div);
        submit_div.onclick = function () {
            application.data.postLoginAttempt(login_input.value, pass_input.value);
        };

        // Submit Button Block;
        var recover_pw_button_div = makeButtonDiv('recover password');
        page_container.appendChild(recover_pw_button_div);
        recover_pw_button_div.onclick = function () {
            display_engine.showPage('password_recovery');
        };

        // Page Spacer Block;
        page_container.appendChild(makePageSpacer(34));

        // About Button Block;
        var about_div = makeButtonDiv('about budo');
        page_container.appendChild(about_div);
        about_div.onclick = function () {
            display_engine.showPage('about_page');
        };

        // Register Button Block;
        var register_div = makeButtonDiv('&nbsp;help test the alpha version&nbsp;');
        register_div.style.textDecoration = 'line-through';
        page_container.appendChild(register_div);
        register_div.onclick = function () {
            //display_engine.showPage('register_page');
        };

        // Page Spacer Block;
        page_container.appendChild(makePageSpacer(88));
    }
    function showHomePage () {

        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 250);
        page_container.appendChild(makePageBanner ("budo | home | v."+current_version));

        var info_div = make('div');
        info_div.style.border = "1px solid black";
        info_div.style.margin = "4px 8px";
        info_div.style.textAlign = "center";
        info_div.style.padding = "7px";
        info_div.className = "no_select";
        info_div.style.cursor = "default";
        info_div.innerHTML = "<p style='margin:0;'>Welcome, "+application.data.getUserName()+".</p>";
        page_container.appendChild(info_div);

        var run_budo_div = makeButtonDiv('start budo');
        page_container.appendChild(run_budo_div);
        run_budo_div.onclick = function () {
            display_engine.showPage('budo_page');
        };

        var budo_info_div = makeButtonDiv('budo scheduler info / tester');
        page_container.appendChild(budo_info_div);
        budo_info_div.onclick = function () {
            display_engine.showPage('engine_information_page');
        };

        page_container.appendChild(makePageSpacer(8));

        var profile_settings_div = makeButtonDiv('profile settings');
        page_container.appendChild(profile_settings_div);
        profile_settings_div.onclick = function () {
            display_engine.showPage('profile_settings');
        };

        var session_history_div = makeButtonDiv('session history');
        page_container.appendChild(session_history_div);
        session_history_div.onclick = function () {
            display_engine.showPage('session_history');
        };

        page_container.appendChild(makePageSpacer(8));

        var technique_mgr_div = makeButtonDiv('technique management');
        page_container.appendChild(technique_mgr_div);
        technique_mgr_div.onclick = function () {
            display_engine.showPage('technique_manager');
        };

        var combo_mgr_div = makeButtonDiv('combo management');
        page_container.appendChild(combo_mgr_div);
        combo_mgr_div.onclick = function () {
            display_engine.showPage('combo_manager');
        };

        var art_tech_admin_div = makeButtonDiv('art management');
        page_container.appendChild(art_tech_admin_div);
        art_tech_admin_div.onclick = function () {
            display_engine.showPage('art_tech_admin');
        };

        var equipment_div = makeButtonDiv('equipment management');
        page_container.appendChild(equipment_div);
        equipment_div.onclick = function () {
            display_engine.showPage('equipment_manager');
        };

        page_container.appendChild(makePageSpacer(20));

        var back_div = makeButtonDiv('log out');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            application.data.clearCookie('profile_id');
            display_engine.showPage('front_page');
        };
    }
    function showPasswordRecovery () {

        // Page Header Block;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 350);
        page_container.appendChild(makePageBanner ("budo | password recovery"));

        // Page Info Block;
        var info_div = make('div');
        info_div.style.border = "1px solid black";
        info_div.style.margin = "4px 8px";
        info_div.style.textAlign = "left";
        info_div.style.padding = "8px";
        info_div.className = "no_select";
        info_div.style.cursor = "default";
        info_div.innerHTML = "" +
            "<p style='text-align:center'>" +
            "Forgot your login information? No problem!<br/> Just enter your email address, and we'll send you an email with instructions on recovering your username and password." +
            "</p>";
        page_container.appendChild(info_div);

        // Email Input Block;
        var email_input_div = make('div');
        email_input_div.innerHTML = "<span>Email:</span>";
        email_input_div.style.textAlign = "center";
        var email_input = make('input');
        email_input.type = 'email';
        email_input.value = 'nateintransit@gmail.com';
        email_input.style.width = 200;
        email_input.onchange = function () {
            checkCanSubmit();
        };
        email_input_div.appendChild(email_input);
        page_container.appendChild(email_input_div);

        // Save Button Block;
        var save_div = makeButtonDiv('&nbsp;send recovery email&nbsp;');
        save_div.style.textDecoration = 'line-through';
        save_div.style.color = 'gray';
        page_container.appendChild(save_div);

        // Page Spacer Block;
        page_container.appendChild(makePageSpacer(207));

        // Back Button Block;
        var back_div = makeButtonDiv('back');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            display_engine.showPage('front_page');
        };

        checkCanSubmit();

        function checkCanSubmit () {
            if (email_input != "") {
                save_div.style.textDecoration = 'none';
                save_div.style.color = 'black';
                save_div.onclick = function () {
                    alert("Confession: I'm not paying for hosting, so I don't have access to a mailserver. Just shoot a note to nateintransit@gmail.com and I'll reset your info.");
                    //todo there should be a regex for the password
                    //application.data.postRecoveryEmail(email_input.value);
                };
            } else {
                save_div.style.textDecoration = 'line-through';
                save_div.style.color = 'gray';
                save_div.onclick = null;
            }
        }
    }
    function showProfileSettingsPage () {

        // Page Form Variables;
        var settings_modified = {
            'max_work' : false,
            'work_ratio' : false,
            'rest_ratio' : false
        };

        // Page Header Block;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 350);
        page_container.appendChild(makePageBanner ("budo | profile settings", "Update profile and engine settings to customize your practice."));

        // Max Work Block;
        var max_work_div = make('div');
        max_work_div.innerHTML = "<span>Maximum Work Interval:</span>";
        max_work_div.style.textAlign = "right";
        max_work_div.style.paddingRight = 10;
        var max_work_input = make('input');
        max_work_input.type = 'number';
        max_work_input.value = application.data.getMaxWork();
        max_work_input.onchange = function (original) {
            return function () {
                if (original != max_work_input.value) {
                    max_work_div.style.backgroundColor = "#cae0ed";
                    settings_modified.max_work = true
                } else {
                    max_work_div.style.backgroundColor = "white";
                    settings_modified.max_work = false;
                }
                checkIfCanSave();
            }
        }(application.data.getMaxWork());
        max_work_input.style.width = 75;
        max_work_div.appendChild(max_work_input);
        var m_span = make('span');
        m_span.innerHTML = "minute(s)";
        max_work_div.appendChild(m_span);
        page_container.appendChild(max_work_div);

        // Work Rest Ratio Block;
        var work_rest_div = make('div');
        var work_ratio_input = make('input');
        var rest_ratio_input = make('input');
        work_rest_div.innerHTML = "<span>Work/Rest Ratio:</span>";
        work_rest_div.style.textAlign = 'right';
        work_ratio_input.type = rest_ratio_input.type = 'number';
        work_ratio_input.style.textAlign = rest_ratio_input.style.textAlign = 'center';
        work_ratio_input.min = rest_ratio_input.min = 0;
        work_ratio_input.style.width = rest_ratio_input.style.width = 70;
        work_ratio_input.value = application.data.getWorkRatio();
        work_ratio_input.onchange = function (original) {
            return function () {
                if (original != work_ratio_input.value) {
                    work_rest_div.style.backgroundColor = "#cae0ed";
                    settings_modified.work_ratio = true
                } else {
                    settings_modified.work_ratio = false;
                    if (settings_modified.rest_ratio == false) {
                        work_rest_div.style.backgroundColor = "white";
                    }
                }
                checkIfCanSave();
            }
        }(application.data.getWorkRatio());
        rest_ratio_input.value = application.data.getRestRatio();
        rest_ratio_input.onchange = function (original) {
            return function () {
                if (original != rest_ratio_input.value) {
                    work_rest_div.style.backgroundColor = "#cae0ed";
                    settings_modified.rest_ratio = true
                } else {
                    settings_modified.rest_ratio = false;
                    if (settings_modified.work_ratio == false) {
                        work_rest_div.style.backgroundColor = "white";
                    }
                }
                checkIfCanSave();
            }
        }(application.data.getRestRatio());
        work_rest_div.appendChild(work_ratio_input);
        var c_span = make('span');
        c_span.innerHTML = ":";
        work_rest_div.appendChild(c_span);
        work_rest_div.appendChild(rest_ratio_input);
        page_container.appendChild(work_rest_div);

        // Save Button Block;
        var save_div = makeButtonDiv('&nbsp;save changes&nbsp;');
        save_div.style.textDecoration = 'line-through';
        save_div.style.color = 'gray';
        page_container.appendChild(save_div);

        // Page Spacer Block;
        page_container.appendChild(makePageSpacer(252));

        // Back Button Block;
        var back_div = makeButtonDiv('back');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            display_engine.showPage('home_page');
        };

        // Page Functions;
        function checkIfCanSave () {
            if (settings_modified.max_work == true
                || settings_modified.work_ratio == true
                || settings_modified.rest_ratio == true)
            {
                save_div.style.textDecoration = 'none';
                save_div.style.color = 'black';
                save_div.onclick = function () {
                    var fraction_array = reduceFraction(work_ratio_input.value, rest_ratio_input.value);
                    work_ratio_input.value = fraction_array[0];
                    rest_ratio_input.value = fraction_array[1];
                    var settings = {
                        'max_work' : max_work_input.value,
                        'work_ratio' : fraction_array[0],
                        'rest_ratio' : fraction_array[1]
                    };
                    max_work_div.style.backgroundColor = "white";
                    work_rest_div.style.backgroundColor = "white";
                    save_div.onclick = null;
                    application.data.saveProfileSettings(settings);

                    settings_modified = {
                        'max_work' : false,
                        'work_ratio' : false,
                        'rest_ratio' : false
                    };
                    checkIfCanSave();
                }
            } else {
                save_div.onclick = null;
                save_div.style.textDecoration = 'line-through';
                save_div.style.color = 'gray';
            }
        }
    }
    function showRegisterPage () {

        // Page Header Info;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 325);
        page_container.appendChild(makePageBanner ("budo | register", "Provide some basic info about yourself to get started."));

        // Page Info Blurb Block;
        var info_div = make('div');
        page_container.appendChild(info_div);
        info_div.className = "text_block";
        info_div.innerHTML = "<p>Let's start with a little basic information to get you an account. There are a couple more steps, but once you complete this you can always pick up where you left off.</p>";

        // Login Name Input Block;
        var login_div = make('div');
        page_container.appendChild(login_div);
        var login_input = make('input');
        login_input.type = "text";
        login_input.placeholder = "user name";
        login_div.innerHTML = "name:";
        login_div.appendChild(login_input);

        // Email Input Block;
        var email_div = make('div');
        page_container.appendChild(email_div);
        var email_input = make('input');
        email_input.type = "text";
        email_input.placeholder = "email address";
        email_div.innerHTML = "email:";
        email_div.appendChild(email_input);

        // Password Input Block;
        var pass_div = make('div');
        page_container.appendChild(pass_div);
        var pass_input = make('input');
        pass_input.type = 'password';
        pass_input.placeholder = 'password';
        pass_div.innerHTML = "pass:";
        pass_div.appendChild(pass_input);

        // Continue Button Block;
        var continue_div = makeButtonDiv('continue');
        continue_div.id = 'continue_1_button_div';
        page_container.appendChild(continue_div);
        continue_div.onclick = function () {
            validateRegisterForm();
        };

        // Page Break Block;
        page_container.appendChild(makePageSpacer(123));

        // Cancel Button Block;
        var cancel_div = makeButtonDiv('back');
        page_container.appendChild(cancel_div);
        cancel_div.onclick = function () {
            display_engine.showPage('front_page');
        };

        // Page Functions;
        function validateRegisterForm () {
            var name = login_input.value;
            var email = email_input.value;
            var pass = pass_input.value;

            if (name != "" && email != "" && pass != "") {
                application.data.saveNewUser(name, email, pass);
            } else {
                continue_div.innerHTML = "continue : cannot leave fields blank";
            }
        }
    }
    function showRegisterPage2 () {

        // Page Header Info;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 325);
        page_container.appendChild(makePageBanner ("budo | register step two", ""));

        // Page Info Blurb Block;
        var info_div = make('div');
        page_container.appendChild(info_div);
        info_div.className = "text_block";
        info_div.innerHTML = "<p>This program isn't a tool for learning new martial arts, but for keeping an " +
            "interesting regimen of fitness and martial arts that we already know how to self-practice. <br/><br/>" +
            "Scroll through our list to find an art you are familiar with, but keep in mind this won't limit you to this art alone; it just gives us good a place to start.</p>";

        // Pick Art From List Block;
        var art_list_div = make('div');
        art_list_div.style.border = "1px solid black";
        art_list_div.style.margin = "4px 8px";
        art_list_div.style.textAlign = "center";
        art_list_div.style.padding = "16px";
        art_list_div.className = "no_select";
        art_list_div.style.cursor = "default";
        art_list_div.innerHTML = "My first art: ";
        page_container.appendChild(art_list_div);
        var art_select = make('select');
        var default_option = make('option');
        default_option.innerHTML = "- Select -";
        default_option.value = 'unselected';
        default_option.selected = true;
        default_option.disabled = true;
        art_select.appendChild(default_option);

        var art_list = application.data.getArtList();
        for (var each in art_list) {
            var art_option = make('option');
            art_option.innerHTML = art_list[each].art_name;
            art_option.value = art_list[each].art_id;
            art_select.appendChild(art_option);
        }
        art_list_div.appendChild(art_select);

        // Type in New Art Block;
        var add_art_div = make('div');
        add_art_div.style.border = "1px solid black";
        add_art_div.style.margin = "4px 8px";
        add_art_div.style.textAlign = "center";
        add_art_div.style.padding = "2px";
        add_art_div.className = "no_select";
        add_art_div.style.cursor = "default";
        add_art_div.innerHTML = "My first art: ";
        page_container.appendChild(add_art_div);
        var add_art_input = make('input');
        add_art_input.type = 'text';
        add_art_input.style.padding = 6;
        add_art_input.style.margin = 8;
        add_art_div.appendChild(add_art_input);

        // Switch to Add New Art Button Block;
        var switch_to_add_div = makeButtonDiv("add a new art");
        page_container.appendChild(switch_to_add_div);
        switch_to_add_div.onclick = function () {
            setSaveToAdd();
        };

        // Switch to Pick List Art Button Block;
        var switch_to_list_div = makeButtonDiv("pick from list");
        page_container.appendChild(switch_to_list_div);
        switch_to_list_div.onclick = function () {
            setSaveToList();
        };

        // Continue/Save Button Block;
        var save_div = makeButtonDiv('next');
        page_container.appendChild(save_div);
        setSaveToList();

        page_container.appendChild(makePageSpacer(105));

        // Back Button Block;
        var back_div = makeButtonDiv('back');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            display_engine.showPage('front_page');
        };

        // Page Functions;
        function setSaveToAdd () {
            page_container.removeChild(switch_to_add_div);
            page_container.removeChild(art_list_div);
            page_container.insertBefore(add_art_div, save_div);
            page_container.insertBefore(switch_to_list_div, save_div);

            save_div.onclick = function () {
                if (add_art_input.value != "") {
                    application.data.saveNewArtAndRegister(add_art_input.value);
                } else {
                    save_div.innerHTML = "continue : art name cannot be blank";
                }

            }
        }
        function setSaveToList () {
            page_container.removeChild(switch_to_list_div);
            page_container.removeChild(add_art_div);
            page_container.insertBefore(art_list_div, save_div);
            page_container.insertBefore(switch_to_add_div, save_div);

            save_div.onclick = function () {
                if (art_select.value != 'unselected') {
                    application.data.saveListArtAndRegister(art_select.value);
                } else {
                    save_div.innerHTML = "continue : please select base art";
                }
            }
        }
    }
    function showRegisterPage3 () {

        // Page Header Info;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 325);
        page_container.appendChild(makePageBanner ("budo | register step three", ""));

        // Page Information Text Block;
        var info_div = make('div');
        page_container.appendChild(info_div);
        info_div.className = "text_block";
        info_div.innerHTML = "<p>Last step! Scan over this list and check off any techniques you know, to make your regimen as diverse as you want.</p>";

        // Technique List Block;
        var tech_list_div = make('div');
        tech_list_div.style.border = "1px solid black";
        tech_list_div.style.height = 236;
        tech_list_div.style.overflowY = "auto";
        tech_list_div.style.margin = "4px 8px";
        tech_list_div.style.textAlign = "left";
        tech_list_div.style.padding = "6px";
        tech_list_div.className = "no_select";
        tech_list_div.style.cursor = "default";
        page_container.appendChild(tech_list_div);
        var tech_change_array = [];
        var tech_table = buildTechListTable();
        tech_list_div.appendChild(tech_table);

        // Back Button Block;
        var continue_button_div = makeButtonDiv('continue');
        page_container.appendChild(continue_button_div);
        continue_button_div.onclick = function () {
            console.log('trying to save last step');
            console.log(tech_change_array);
            console.log();

            if (checkIfEditsMade() == true) {
                var update_string = "";
                for (var tech_name_id in tech_change_array) {
                    if (tech_change_array[tech_name_id] != "") {
                        switch (update_string) {
                            case ("") : update_string += tech_name_id.split("_")[1]+"="+tech_change_array[tech_name_id]; break;
                            default : update_string += "&" + tech_name_id.split("_")[1]+"="+tech_change_array[tech_name_id]; break;
                        }
                    }
                }
                application.data.saveUserTechniquesAndRegister(update_string);
            } else {
                continue_button_div.innerHTML = "continue : must select at least one technique"
            }

        };

        // Spacer Block;
        page_container.appendChild(makePageSpacer(20));

        // Back Button Block;
        var back_div = makeButtonDiv('back');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            display_engine.showPage('register_page_2');
        };

        // Page Functions;
        function checkIfEditsMade () {
            var change_count = 0;
            for (var each in tech_change_array) {
                if (tech_change_array[each] != "") {
                    change_count ++;
                    break;
                }
            }
            return (change_count > 0);
        }
        function buildTechListTable () {
            var table = make('table');
            table.style.fontSize = '11px';
            table.style.width = "100%";
            var tech_list = application.data.getTechniqueList();
            for (var each in tech_list)
            {
                var tech = tech_list[each];

                var tech_row = make('tr');
                var name_cell = make('td');
                var toggle_cell = make('td');

                name_cell.innerHTML = tech['tech_name'];
                toggle_cell.style.width = "85px";

                var on_radio = make('input');
                var on_label = make('label');
                var off_radio = make('input');
                var off_label = make('label');

                off_label.className = on_label.className = "tech_toggle_label";

                var row_id = 'tech_'+tech['tech_id'];

                name_cell.id = row_id + "_name";
                on_radio.type = off_radio.type = 'radio';
                on_radio.name = off_radio.name = row_id;
                on_label.id = row_id + "_on";
                on_radio.id = row_id + "_on_r";
                off_label.id = row_id + "_off";
                off_radio.id = row_id + "_off_r";

                turnTechOff(name_cell, on_label, off_label);

                on_label.innerHTML += "On";
                off_label.innerHTML += "Off";

                on_label.appendChild(on_radio);
                off_label.appendChild(off_radio);

                on_radio.onchange = function (name_cell, on_label, on_radio, off_label, is_known) {
                    return function () {
                        if (is_known == 'false') {
                            tech_change_array[on_radio.name] = "true";
                            on_label.style.backgroundColor = "#CAE0ED";
                            off_label.style.backgroundColor = "white";
                        } else {
                            tech_change_array[on_radio.name] = "";
                            on_label.style.backgroundColor = off_label.style.backgroundColor = "white";
                        }
                        if (on_radio.checked == true) {
                            turnTechOn(name_cell, on_label, off_label);
                        }
                    };

                }(name_cell, on_label, on_radio, off_label, 'false');
                off_radio.onchange = function (name_cell, on_label, off_label, off_radio, is_known) {
                    return function () {
                        if (is_known == 'true') {
                            tech_change_array[off_radio.name] = "false";
                            off_label.style.backgroundColor = "#CAE0ED";
                            on_label.style.backgroundColor = "white";
                        } else {
                            tech_change_array[off_radio.name] = "";
                            on_label.style.backgroundColor = off_label.style.backgroundColor = "white";
                        }
                        if (off_radio.checked == true) {
                            turnTechOff(name_cell, on_label, off_label);
                        }
                    };
                }(name_cell, on_label, off_label, off_radio, 'false');

                toggle_cell.appendChild(on_label);
                toggle_cell.appendChild(off_label);

                tech_row.appendChild(name_cell);
                tech_row.appendChild(toggle_cell);
                table.appendChild(tech_row);
            }
            return table;
        }
        function turnTechOn (name_cell, on_label, off_label) {
            name_cell.style.color = "black";
            on_label.style.color = "black";
            on_label.style.border = "1px solid black";
            off_label.style.color = "darkgray";
            off_label.style.border = "1px solid darkgray";
        }
        function turnTechOff (name_cell, on_label, off_label) {
            name_cell.style.color = "darkgray";
            on_label.style.color = "darkgray";
            on_label.style.border = "1px solid darkgray";
            off_label.style.color = "black";
            off_label.style.border = "1px solid black";
        }

    } // todo this page does not work correctly;
    function showSchedulerTestPage () {

        // Page Header Block;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 450);
        page_container.appendChild(makePageBanner ("budo | schedule tester", "Tester for the schedule-creating engine behind Budo."));

        // Make Schedule Button Block;
        var create_button_div = makeFloatButtonDiv("create", 35, "right");
        create_button_div.style.padding = "10px";
        page_container.appendChild(create_button_div);
        create_button_div.onclick = function () {
            var session_length = document.getElementById('length_input').value * 60 * 1000;
            schedule_output_div.innerHTML = "";
            application.tengu.quietRunning(true);
            application.tengu.generateSchedule(session_length);
        };

        // Session Length Block;
        var session_length_div = make('div');
        var session_length_label = make('label');
        var session_length_input = make('input');
        session_length_div.style.marginRight = "70px";
        page_container.appendChild(session_length_div);
        session_length_input.type = "number";
        session_length_input.min = 1;
        session_length_input.max = 240;
        session_length_input.placeholder = "15";
        session_length_input.id = "length_input";
        session_length_input.style.width = 50;
        session_length_input.style.textAlign = "center";
        session_length_input.style.padding = "4px";
        session_length_input.style.margin = "4px";
        session_length_label.appendChild(session_length_input);
        session_length_div.appendChild(session_length_label);
        session_length_div.innerHTML += "minutes";

        // Schedule Output Block;
        var schedule_output_div = make('div');
        schedule_output_div.id = "engine_test_output";
        schedule_output_div.style.border = "1px solid black";
        schedule_output_div.style.overflowY = 'scroll';
        schedule_output_div.style.margin = "4px 8px";
        schedule_output_div.style.height = 296;
        schedule_output_div.style.textAlign = "left";
        schedule_output_div.style.padding = "8px";
        schedule_output_div.className = "no_select";
        schedule_output_div.style.cursor = "default";
        page_container.appendChild(schedule_output_div);

        // Page Spacer Block;
        page_container.appendChild(makePageSpacer(20));

        // Back Button Block;
        var back_div = makeButtonDiv('back');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            display_engine.showPage('engine_information_page');
        };
    }
    function showSessionHistory () {

        // Page Header Block;
        page_container = makePageContainer();
        container_div.appendChild(page_container);
        setPageWidth(container_div, page_container, 450);
        page_container.appendChild(makePageBanner ("budo | session history"));

        // Engine Info Text Block;
        var info_div = make('div');
        info_div.style.border = "1px solid black";
        info_div.style.margin = "4px 8px";
        info_div.style.textAlign = "left";
        info_div.style.padding = "8px";
        info_div.style.height = 338;
        info_div.style.overflowY = "scroll";
        info_div.className = "no_select";
        info_div.style.cursor = "default";
        info_div.innerHTML = "";

        //todo create table of sessions;

        var session_list = application.data.getSessionArray()['session_list'];
        var tech_history = application.data.getSessionArray()['tech_rep_list'];

        var tech_table_header = make('p');
        tech_table_header.style.textAlign = 'center';
        tech_table_header.style.fontWeight = 'bold';
        tech_table_header.innerHTML = "Lifetime Technique Reps:";
        info_div.appendChild(tech_table_header);

        var tech_table = make('table');
        tech_table.id = "tech_totals_table";
        tech_table.style.marginBottom = "8px";
        if (tech_history.length != 0) {
            for (var each_total in tech_history) {
                var tech_row = make('tr');
                var name_cell = make('td');
                var count_cell = make('td');
                name_cell.style.fontSize = "14px";
                name_cell.style.padding = "4px";
                name_cell.innerHTML = each_total;
                count_cell.style.fontSize = "13px";
                count_cell.style.padding = "4px 8px 4px 8px";
                count_cell.innerHTML = tech_history[each_total];
                tech_row.appendChild(name_cell);
                tech_row.appendChild(count_cell);
                tech_table.appendChild(tech_row);
            }
            info_div.appendChild(tech_table);
            tech_table.style.position = 'relative';
            tech_table.style.width = 220;
            tech_table.style.left = "50%";
            tech_table.style.marginLeft = -110;
            console.log(tech_table.offsetWidth);
        }

        if (session_list.length == 0) {
            info_div.innerHTML += "<p id='no_session_message'>You haven't had any sessions with Budo yet.</p>";
        } else {
            var session_table_header = make('p');
            session_table_header.style.textAlign = 'center';
            session_table_header.style.fontWeight = 'bold';
            session_table_header.innerHTML = "Session History:";
            info_div.appendChild(session_table_header);

            var session_table = make('table');
            session_table.id = "session_history_table";
            session_table.style.width = "100%";
            for (var each_session in session_list) {
                var new_row = make('tr');
                var date_cell = make('td');
                var tech_cell = make('td');

                date_cell.style.fontSize = "12px";
                date_cell.style.width = "30%";
                date_cell.style.textAlign = "center";
                date_cell.innerHTML = "<b>" + session_list[each_session]['session_date'];
                tech_cell.style.fontSize = "12px";
                tech_cell.style.padding = "6px";
                var tech_html = "<p>";
                for (var each_tech in session_list[each_session]['techs']) {
                    var tech = session_list[each_session]['techs'][each_tech];
                    if (each_tech == 0) {
                        tech_html += tech['rep_count'] + " x " + tech['tech_name'] + "&nbsp;(" + tech['in_activity'] + ")";
                    } else {
                        tech_html += "<br/>" + tech['rep_count'] + " x " + tech['tech_name'] + "&nbsp;(" + tech['in_activity'] + ")";
                    }
                }
                tech_html += "</p>";
                tech_cell.innerHTML = tech_html;

                new_row.appendChild(date_cell);
                new_row.appendChild(tech_cell);
                session_table.appendChild(new_row);
            }
            info_div.appendChild(session_table);
        }

        page_container.appendChild(info_div);

        // Page Spacer Block;
        page_container.appendChild(makePageSpacer(20));

        // Back Button Block;
        var back_div = makeButtonDiv('back');
        page_container.appendChild(back_div);
        back_div.onclick = function () {
            display_engine.showPage('home_page');
        };
    }
    function showTechniqueManagerPage () {

        // Page Variables;

        var selected_art_id = null;
        var art_buttons = [];
        var tech_tables = [];
        var relation_array = application.data.getRelationArray();
        var known_tech_list = application.data.getKnownTechniqueList();
        var unknown_tech_index = application.data.getUnknownTechList();

        var new_tech_input;

        // Create Page;

        page_container = makePageContainer();
        makePageHeader (page_container);
        makeEditArtsButton (page_container);
        makeArtSelectionDiv (page_container);
        var tech_list_div = makeTechListDiv (page_container);
        makeAllArtsTable(tech_list_div);
        makeFitnessTable(relation_array['fitness']);
        for (var art_id in relation_array) {
            if (art_id != 'fitness') {
                makeSingleArtTable(art_id, relation_array[art_id]);
            }
        }
        makeClearChangesButton (page_container);
        makeSaveButton (page_container);
        makeCreateNewButton (page_container);
        makeNewTechInputBlock (page_container);
        makeBackButton (page_container);
        checkForArtCookie();

        // Page Build Functions;

        function makePageHeader (container) {
            container_div.appendChild(container);
            setPageWidth(container_div, container, 450);
            container.appendChild(makePageBanner ("budo | technique control", "Select the techniques you want included in your personal practice."));
        }
        function makeEditArtsButton (container) {
            var edit_arts_button_div = makeFloatButtonDiv("edit", 25, "right");
            edit_arts_button_div.style.padding = "10px";
            edit_arts_button_div.onclick = function () {
                display_engine.showPage('art_tech_admin');
            };
            container.appendChild(edit_arts_button_div);
        }
        function makeArtSelectionDiv (container) {

            // Art Display Block;
            var art_display_div = make('div');
            art_display_div.style.textAlign = "left";
            art_display_div.style.marginRight = "60px";

            // Make All Art Button;
            var new_art_button = make('input', null, 'art_tech_button');
            new_art_button.type = 'button';
            new_art_button.value = 'all';
            new_art_button.disabled = true;
            new_art_button.style.textDecoration = 'underline';
            new_art_button.onclick = function (art_id) {
                return function () {
                    showTechTableFor(art_id);
                    disableArtButton(art_id);
                    selected_art_id = null;
                };
            }('all');
            art_buttons['all'] = new_art_button;
            art_display_div.appendChild(new_art_button);

            // Make Fitness Button;
            var fitness_button = make('input', null, 'art_tech_button');
            fitness_button.type = 'button';
            fitness_button.value = 'Fitness';
            fitness_button.onclick = function (art_id) {
                return function () {
                    showTechTableFor(art_id);
                    disableArtButton(art_id);
                    selected_art_id = 'fitness';
                };
            }('fitness');
            art_buttons['fitness'] = fitness_button;
            art_display_div.appendChild(fitness_button);

            // Make Single Art Buttons;
            for (var art_id in relation_array) {
                if (art_id != 'fitness') {
                    new_art_button = make('input');
                    new_art_button.type = 'button';
                    new_art_button.value = application.data.getArtName(art_id);
                    new_art_button.className = "art_tech_button";
                    art_buttons[art_id] = new_art_button;
                    art_display_div.appendChild(new_art_button);
                    new_art_button.onclick = function (art_id) {
                        return function () {
                            showTechTableFor(art_id);
                            disableArtButton(art_id);
                            selected_art_id = art_id;
                        };
                    }(art_id);
                }
            }
            container.appendChild(art_display_div);
        }
        function makeTechListDiv (container) {
            var tech_list_div = make('div');
            tech_list_div.id = 'user_tech_display_div';
            tech_list_div.style.border = "1px solid black";
            tech_list_div.style.height = 246;
            tech_list_div.style.overflowY = "auto";
            tech_list_div.style.margin = "4px 8px";
            tech_list_div.style.textAlign = "left";
            tech_list_div.style.padding = "6px";
            tech_list_div.className = "no_select";
            tech_list_div.style.cursor = "default";
            container.appendChild(tech_list_div);
            return tech_list_div;
        }
        function makeAllArtsTable (list_div) {
            // All List Contents;
            var all_art_table = make('table');

            // Included Header Row
            var included_header_row = make('tr');
            var included_header_cell = make('td');
            included_header_cell.colSpan = 2;
            included_header_cell.style.padding = '8px 4px 4px 4px';
            included_header_cell.style.fontWeight = 'bold';
            included_header_cell.innerHTML = "Known Techniques:<hr>";
            included_header_row.appendChild(included_header_cell);
            all_art_table.appendChild(included_header_row);

            // Create All Known Tech Rows;
            if (known_tech_list.length != 0) {
                for (var i in known_tech_list) {
                    var tech_id = known_tech_list[i];
                    var tech_row = make('tr');
                    var name_cell = make('td');
                    name_cell.className = 'tech_mgr_name_cell';
                    var name_span = make('span');
                    name_span.className = "clickable_tech_span";
                    name_span.style.cursor = 'pointer';
                    name_span.innerHTML = application.data.getTechniqueName(tech_id);
                    name_span.onclick = function (tech_id) {
                        return function () {
                            display_engine.showPopup('technique', tech_id);
                        }
                    }(tech_id);
                    var relation_cell = make('td');
                    relation_cell.className = 'tech_mgr_action_cell';

                    relation_cell.innerHTML = "";
                    name_cell.appendChild(name_span);
                    tech_row.appendChild(name_cell);
                    tech_row.appendChild(relation_cell);
                    all_art_table.appendChild(tech_row);
                }
            } else {
                var message_row = make('tr');
                var message_cell = make('td', null, 'arts_message');
                message_cell.innerHTML = "You have no known techs.";
                message_row.appendChild(message_cell);
                all_art_table.appendChild(message_row);
            }

            // Unrelated Header Row
            var unrelated_header_row = make('tr');
            var unrelated_header_cell = make('td');
            unrelated_header_cell.colSpan = 2;
            unrelated_header_cell.style.padding = '8px 4px 4px 4px';
            unrelated_header_cell.style.fontWeight = 'bold';
            unrelated_header_cell.innerHTML = "Unknown Techniques:<hr>";
            unrelated_header_row.appendChild(unrelated_header_cell);
            all_art_table.appendChild(unrelated_header_row);

            // Create All Unknown Tech Rows;
            if (unknown_tech_index.length != 0) {
                for (i in unknown_tech_index) {
                    tech_id = unknown_tech_index[i];
                    tech_row = make('tr');
                    name_cell = make('td');
                    name_cell.className = 'tech_mgr_name_cell';
                    relation_cell = make('td');
                    relation_cell.className = 'tech_mgr_action_cell';
                    name_span = make('span');
                    name_span.className = "clickable_tech_span";
                    name_span.style.cursor = 'pointer';
                    name_span.innerHTML = application.data.getTechniqueName(tech_id);
                    name_span.onclick = function (tech_id) {
                        return function () {
                            display_engine.showPopup('technique', tech_id);
                        }
                    }(tech_id);

                    relation_cell.innerHTML = "";
                    name_cell.appendChild(name_span);
                    tech_row.appendChild(name_cell);
                    tech_row.appendChild(relation_cell);
                    all_art_table.appendChild(tech_row);
                }
            } else {
                message_row = make('tr');
                message_cell = make('td', null, 'arts_message');
                message_cell.innerHTML = "You have no unknown techs.";
                message_row.appendChild(message_cell);
                all_art_table.appendChild(message_row);
            }

            tech_tables['all'] = all_art_table;
            list_div.appendChild(all_art_table);
        }
        function makeFitnessTable (fitness_relations) {
            var fitness_table = make('table');
            fitness_table.style.width = "100%";

            var included_techs = fitness_relations['known_array'] || [];
            var suggested_techs = fitness_relations['suggested_array'] || [];
            var unrelated_techs = fitness_relations['unrelated_array'] || [];

            // Included Techs Header Row;
            var included_header_row = make('tr');
            var included_header_cell = make('td');
            included_header_cell.colSpan = 2;
            included_header_cell.style.padding = '8px 4px 4px 4px';
            included_header_cell.style.fontWeight = 'bold';
            included_header_cell.innerHTML = "Included Techniques:<hr>";
            included_header_row.appendChild(included_header_cell);
            fitness_table.appendChild(included_header_row);

            // Create All Included Tech Rows;
            for (var fitness_id in included_techs) {
                var fitness_tech = application.data.getFitnessTechFromId(fitness_id);
                var tech_row = make('tr');
                var name_cell = make('td');
                var relation_cell = make('td');
                name_cell.style.borderBottom = '1px solid lightgray';
                relation_cell.style.borderBottom = '1px solid lightgray';
                var name_span = make('span');
                name_span.className = "clickable_tech_span";
                name_span.style.cursor = 'pointer';
                name_span.innerHTML = fitness_tech.fitness_name;
                name_span.onclick = function (fit_id) {
                    return function () {
                        display_engine.showPopup('fitness', fit_id);
                    }
                }(fitness_id);
                relation_cell.style.textAlign = "right";

                var drop_tech_span = make('span');
                drop_tech_span.className = "act_on_tech";
                drop_tech_span.innerHTML = "drop";
                relation_cell.appendChild(drop_tech_span);
                drop_tech_span.onclick = function (tech_id, art_id) {
                    return function () {
                        dropTechFromArt(tech_id, art_id);
                    }
                }(fitness_tech.fitness_id, 'fitness');

                name_cell.appendChild(name_span);
                tech_row.appendChild(name_cell);
                tech_row.appendChild(relation_cell);
                fitness_table.appendChild(tech_row);
            }
            if (included_techs.length == 0) {
                var message_row = make('tr');
                var message_cell = make('td', null, 'arts_message');
                message_cell.innerHTML = "You have not added any techs to this art.";
                message_cell.colSpan = 2;
                message_row.appendChild(message_cell);
                fitness_table.appendChild(message_row);
            }

            // Suggested Techs Header Row;
            var suggested_header_row = make('tr');
            var suggested_header_cell = make('td');
            suggested_header_cell.colSpan = 2;
            suggested_header_cell.style.padding = '8px 4px 4px 4px';
            suggested_header_cell.style.fontWeight = 'bold';
            suggested_header_cell.innerHTML = "Suggested Techniques:<hr>";
            suggested_header_row.appendChild(suggested_header_cell);
            fitness_table.appendChild(suggested_header_row);

            // Create All Suggested Tech Rows;
            for (fitness_id in suggested_techs) {
                fitness_tech = application.data.getFitnessTechFromId(fitness_id);
                var relevance = suggested_techs[fitness_id];

                tech_row = make('tr');
                name_cell = make('td');
                relation_cell = make('td');
                name_cell.style.borderBottom = '1px solid lightgray';
                relation_cell.style.borderBottom = '1px solid lightgray';

                name_span = make('span');
                name_span.style.cursor = 'pointer';
                name_span.className = "clickable_tech_span";
                name_span.innerHTML = fitness_tech.fitness_name;
                name_span.onclick = function (fit_id) {
                    return function () {
                        display_engine.showPopup('fitness', fit_id);
                    }
                }(fitness_id);

                relation_cell.innerHTML = "(" + Number(relevance).toFixed(1) + "%) ";
                relation_cell.style.textAlign = "right";
                var add_tech_span = make('span');
                add_tech_span.className = "act_on_tech";
                add_tech_span.innerHTML = "add";
                relation_cell.appendChild(add_tech_span);
                add_tech_span.onclick = function (tech_id, art_id) {
                    return function () {
                        addTechToArt(tech_id, art_id);
                    }
                }(fitness_tech.fitness_id, 'fitness');

                name_cell.appendChild(name_span);
                tech_row.appendChild(name_cell);
                tech_row.appendChild(relation_cell);
                fitness_table.appendChild(tech_row);
            }
            if (suggested_techs.length == 0) {
                message_row = make('tr');
                message_cell = make('td', null, 'arts_message');
                message_cell.innerHTML = "We have no techs to suggest for this art.";
                message_cell.colSpan = 2;
                message_row.appendChild(message_cell);
                fitness_table.appendChild(message_row);
            }

            // Unrelated Techs Header Row;
            var unrelated_header_row = make('tr');
            var unrelated_header_cell = make('td');
            unrelated_header_cell.colSpan = 2;
            unrelated_header_cell.style.padding = '8px 4px 4px 4px';
            unrelated_header_cell.style.fontWeight = 'bold';
            unrelated_header_cell.innerHTML = "Unrelated Techniques:<hr>";
            unrelated_header_row.appendChild(unrelated_header_cell);
            fitness_table.appendChild(unrelated_header_row);

            // Create Unrelated Tech Rows;
            for (fitness_id in unrelated_techs) {
                fitness_tech = application.data.getFitnessTechFromId(fitness_id);
                tech_row = make('tr');
                name_cell = make('td');
                relation_cell = make('td');
                name_cell.style.borderBottom = '1px solid lightgray';
                relation_cell.style.borderBottom = '1px solid lightgray';
                name_span = make('span');
                name_span.className = "clickable_tech_span";
                name_span.style.cursor = 'pointer';
                name_span.innerHTML = fitness_tech.fitness_name;
                name_span.onclick = function (fit_id) {
                    return function () {
                        display_engine.showPopup('fitness', fit_id);
                    }
                }(fitness_id);

                relation_cell.innerHTML = "<span></span>";

                add_tech_span = make('span');
                add_tech_span.className = "act_on_tech";
                add_tech_span.innerHTML = "add";
                relation_cell.appendChild(add_tech_span);
                add_tech_span.onclick = function (tech_id, art_id) {
                    return function () {
                        addTechToArt(tech_id, art_id);
                    }
                }(fitness_tech.fitness_id, 'fitness');

                relation_cell.style.textAlign = "right";
                name_cell.appendChild(name_span);
                tech_row.appendChild(name_cell);
                tech_row.appendChild(relation_cell);
                fitness_table.appendChild(tech_row);
            }
            if (unrelated_techs.length == 0) {
                message_row = make('tr');
                message_cell = make('td', null, 'arts_message');
                message_cell.innerHTML = "We have no unrelated techniques.";
                message_cell.colSpan = 2;
                message_row.appendChild(message_cell);
                fitness_table.appendChild(message_row);
            }

            tech_list_div.appendChild(fitness_table);
            tech_tables['fitness'] = fitness_table;
            fitness_table.style.display = 'none';
        }
        function makeSingleArtTable (art_id, relation_array) {
            var art_table = make('table');
            art_table.style.width = "100%";

            var included_techs = relation_array['known_array'];
            var suggested_techs = relation_array['suggested_array'];
            var unrelated_techs = relation_array['unrelated_array'];

            // Included Techs Header Row;
            var included_header_row = make('tr');
            var included_header_cell = make('td');
            included_header_cell.colSpan = 2;
            included_header_cell.style.padding = '8px 4px 4px 4px';
            included_header_cell.style.fontWeight = 'bold';
            included_header_cell.innerHTML = "Included Techniques:<hr>";
            included_header_row.appendChild(included_header_cell);
            art_table.appendChild(included_header_row);

            // Create All Included Tech Rows;
            for (var tech_id in included_techs) {
                var tech = application.data.getTechniqueFromID(tech_id);
                var tech_row = make('tr');
                var name_cell = make('td');
                var relation_cell = make('td');
                name_cell.style.borderBottom = '1px solid lightgray';
                relation_cell.style.borderBottom = '1px solid lightgray';
                var name_span = make('span');
                name_span.className = "clickable_tech_span";
                name_span.style.cursor = 'pointer';
                name_span.innerHTML = tech.tech_name;
                name_span.onclick = function (tech_id) {
                    return function () {
                        display_engine.showPopup('technique', tech_id);
                    }
                }(tech_id);

                relation_cell.style.textAlign = "right";

                var drop_tech_span = make('span');
                drop_tech_span.className = "act_on_tech";
                drop_tech_span.innerHTML = "drop";
                relation_cell.appendChild(drop_tech_span);
                drop_tech_span.onclick = function (tech_id, art_id) {
                    return function () {
                        dropTechFromArt(tech_id, art_id);
                    }
                }(tech.tech_id, art_id);

                name_cell.appendChild(name_span);
                tech_row.appendChild(name_cell);
                tech_row.appendChild(relation_cell);
                art_table.appendChild(tech_row);
            }
            if (included_techs.length == 0) {
                var message_row = make('tr');
                var message_cell = make('td', null, 'arts_message');
                message_cell.innerHTML = "You have not added any techs to this art.";
                message_cell.colSpan = 2;
                message_row.appendChild(message_cell);
                art_table.appendChild(message_row);
            }

            // Suggested Techs Header Row;
            var suggested_header_row = make('tr');
            var suggested_header_cell = make('td');
            suggested_header_cell.colSpan = 2;
            suggested_header_cell.style.padding = '8px 4px 4px 4px';
            suggested_header_cell.style.fontWeight = 'bold';
            suggested_header_cell.innerHTML = "Suggested Techniques:<hr>";
            suggested_header_row.appendChild(suggested_header_cell);
            art_table.appendChild(suggested_header_row);

            // Create All Suggested Tech Rows;
            for (tech_id in suggested_techs) {
                tech = application.data.getTechniqueFromID(tech_id);
                var relevance = suggested_techs[tech_id];

                tech_row = make('tr');
                name_cell = make('td');
                relation_cell = make('td');
                name_cell.style.borderBottom = '1px solid lightgray';
                relation_cell.style.borderBottom = '1px solid lightgray';
                name_span = make('span');
                name_span.className = "clickable_tech_span";
                name_span.style.cursor = 'pointer';
                name_span.innerHTML = tech.tech_name;
                name_span.onclick = function (tech_id) {
                    return function () {
                        display_engine.showPopup('technique', tech_id);
                    }
                }(tech_id);

                relation_cell.innerHTML = "(" + Number(relevance).toFixed(1) + "%) ";
                relation_cell.style.textAlign = "right";

                var add_tech_span = make('span');
                add_tech_span.className = "act_on_tech";
                add_tech_span.innerHTML = "add";
                relation_cell.appendChild(add_tech_span);
                add_tech_span.onclick = function (tech_id, art_id) {
                    return function () {
                        addTechToArt(tech_id, art_id);
                    }
                }(tech['tech_id'], art_id);

                name_cell.appendChild(name_span);
                tech_row.appendChild(name_cell);
                tech_row.appendChild(relation_cell);
                art_table.appendChild(tech_row);
            }
            if (suggested_techs.length == 0) {
                message_row = make('tr');
                message_cell = make('td', null, 'arts_message');
                message_cell.innerHTML = "We have no techs to suggest for this art.";
                message_cell.colSpan = 2;
                message_row.appendChild(message_cell);
                art_table.appendChild(message_row);
            }

            // Unrelated Techs Header Row;
            var unrelated_header_row = make('tr');
            var unrelated_header_cell = make('td');
            unrelated_header_cell.colSpan = 2;
            unrelated_header_cell.style.padding = '8px 4px 4px 4px';
            unrelated_header_cell.style.fontWeight = 'bold';
            unrelated_header_cell.innerHTML = "Unrelated Techniques:<hr>";
            unrelated_header_row.appendChild(unrelated_header_cell);
            art_table.appendChild(unrelated_header_row);

            // Create Unrelated Tech Rows;
            for (tech_id in unrelated_techs) {
                tech = application.data.getTechniqueFromID(tech_id);
                tech_row = make('tr');
                name_cell = make('td');
                relation_cell = make('td');
                name_cell.style.borderBottom = '1px solid lightgray';
                relation_cell.style.borderBottom = '1px solid lightgray';
                name_span = make('span');
                name_span.className = "clickable_tech_span";
                name_span.style.cursor = 'pointer';
                name_span.innerHTML = tech.tech_name;
                name_span.onclick = function (tech_id) {
                    return function () {
                        display_engine.showPopup('technique', tech_id);
                    }
                }(tech_id);
                relation_cell.innerHTML = "<span></span>";

                add_tech_span = make('span');
                add_tech_span.className = "act_on_tech";
                add_tech_span.innerHTML = "add";
                relation_cell.appendChild(add_tech_span);
                add_tech_span.onclick = function (tech_id, art_id) {
                    return function () {
                        addTechToArt(tech_id, art_id);
                    }
                }(tech['tech_id'], art_id);

                relation_cell.style.textAlign = "right";
                name_cell.appendChild(name_span);
                tech_row.appendChild(name_cell);
                tech_row.appendChild(relation_cell);
                art_table.appendChild(tech_row);
            }
            if (unrelated_techs.length == 0) {
                message_row = make('tr');
                message_cell = make('td', null, 'arts_message');
                message_cell.innerHTML = "We have no unrelated techniques.";
                message_cell.colSpan = 2;
                message_row.appendChild(message_cell);
                art_table.appendChild(message_row);
            }

            tech_list_div.appendChild(art_table);
            tech_tables[art_id] = art_table;
            art_table.style.display = 'none';
        }
        function makeClearChangesButton (container) {
            // Clear Changes Button Block;
            var clear_button_div = makeFloatButtonDiv("&nbsp;clear&nbsp;", 35, "left");
            clear_button_div.style.textDecoration = 'line-through';
            container.appendChild(clear_button_div);
        }
        function makeSaveButton (container) {
            // Save Changes Button Block;
            var save_button_div = makeButtonDiv("&nbsp;save changes&nbsp;");
            save_button_div.style.textDecoration = 'line-through';
            save_button_div.style.marginLeft = "66px";
            container.appendChild(save_button_div);
        }
        function makeCreateNewButton (container) {
            // Create New Tech Button Block;
            var create_button_div = makeFloatButtonDiv("create", 35, "right");
            create_button_div.style.padding = "10px";
            create_button_div.onclick = function () {
                application.data.saveNewTechnique(new_tech_input.value, selected_art_id);
                window.location.reload();
            };
            container.appendChild(create_button_div);
        }
        function makeNewTechInputBlock (container) {
            // New Tech Input Block;
            var new_tech_div = make('div');
            new_tech_div.style.textAlign = 'left';
            new_tech_div.style.marginRight = "70px";
            new_tech_div.style.paddingLeft = "8px";
            new_tech_input = make('input');
            new_tech_input.type = "text";
            new_tech_input.placeholder = "New Tech Name";
            new_tech_input.style.width = 175;
            new_tech_input.style.padding = "4px";
            new_tech_input.style.margin = "4px";
            new_tech_div.innerHTML = "Add Tech ";
            new_tech_div.appendChild(new_tech_input);
            var art_span = make('span');
            art_span.id = 'add_tech_to_art_name_span';
            new_tech_input.disabled = true;
            container.appendChild(new_tech_div);
            new_tech_div.appendChild(art_span);
        }
        function makeBackButton (container) {
            var back_div = makeButtonDiv("back");
            container.appendChild(back_div);
            back_div.onclick = function () {
                display_engine.showPage('home_page');
            };
        }

        // Page Updater Functions;

        function checkForArtCookie () {
            var art_cookie = application.data.getFromCookie('viewing_art');
            if (art_cookie != null) {
                showTechTableFor(art_cookie);
                disableArtButton(art_cookie);
                selected_art_id = art_cookie;
            }
        }
        function showTechTableFor (show_art) {
            for (var each_table in tech_tables) {
                tech_tables[each_table].style.display = 'none';
            }
            var name_span = document.getElementById('add_tech_to_art_name_span');
            var show_table;
            if (show_art == 'all') {
                show_table = tech_tables['all'];
                new_tech_input.disabled = true;
                name_span.innerHTML = "";
                application.data.clearCookie('viewing_art');
            } else if (show_art == 'fitness') {
                show_table = tech_tables['fitness'];
                new_tech_input.disabled = false;
                name_span.innerHTML = 'to ' + "Fitness";
                application.data.setToCookie('viewing_art', 'fitness', 5);
            } else {
                show_table = tech_tables[show_art];
                new_tech_input.disabled = false;
                name_span.innerHTML = 'to ' + application.data.getArtName(show_art);
                application.data.setToCookie('viewing_art', show_art, 5);
            }
            show_table.style.display = 'table';
        }
        function disableArtButton (art_id) {
            for (var each_art in art_buttons) {
                art_buttons[each_art].disabled = false;
                art_buttons[each_art].style.textDecoration = 'none';
            }
            var disable_button;
            if (art_id == 'all') {
                disable_button = art_buttons['all'];
            } else if (art_id == 'fitness') {
                disable_button = art_buttons['fitness'];
            } else {
                disable_button = art_buttons[art_id];
            }
            disable_button.disabled = true;
            disable_button.style.textDecoration = 'underline';
        }
        function dropTechFromArt (tech_id, art_id) {
            console.log('drop tech '+tech_id+' from art '+art_id);
            application.data.removeTechFromArt(tech_id, art_id);
            application.data.getProfileDataAndShowPage(application.data.getUserId(), 'technique_manager');
        }
        function addTechToArt (tech_id, art_id) {
            console.log('add tech '+tech_id+' to art '+art_id);
            application.data.addTechToArt(tech_id, art_id);
            application.data.getProfileDataAndShowPage(application.data.getUserId(), 'technique_manager')
        }
    }

    // Popup Functions;
    function showFitnessPopup (id) {

        // Popup Variables;
        var fitness_tech = application.data.getFitnessTechFromId(id);
        var name_input, equipment_select;

        // Popup Banner;
        var banner = makePageBanner('fitness details');
        popup_container_div.appendChild(banner);

        var name_div = make('div');
        name_div.style.paddingLeft = "8px";
        name_div.innerHTML += "<span>Fitness Name: </span>";
        name_input = make('input');
        name_input.style.marginLeft = '5px';
        name_input.value = fitness_tech.fitness_name;

        var say_span = make('span');
        say_span.style.float = 'right';
        say_span.style.cursor = 'pointer';
        say_span.style.textDecoration = 'underline';
        say_span.style.color = '#656ba2';
        say_span.style.marginTop = '12px';
        say_span.style.marginRight = '10px';
        say_span.innerHTML = "say name";
        say_span.onclick = function () {
            application.tengu.quickSpeak(fitness_tech.fitness_name);
        };

        name_div.appendChild(name_input);
        name_div.appendChild(say_span);
        popup_container_div.appendChild(name_div);

        popup_container_div.appendChild(makeEquipmentBlock());
        popup_container_div.appendChild(makePageSpacer(18));

        // Save Button Block;
        var save_button_div = makeFloatButtonDiv("&nbsp;save&nbsp;", 95, "left");
        save_button_div.style.textAlign = 'center';
        save_button_div.onclick = function () {
            return function () {
                saveFitnessTech();
            }
        }();
        popup_container_div.appendChild(save_button_div);

        // Back Button Block;
        var back_button_div = makeButtonDiv("close");
        back_button_div.style.textAlign = 'center';
        back_button_div.style.marginLeft = 126;
        back_button_div.onclick = function () {
            display_engine.closePopup();
        };
        popup_container_div.appendChild(back_button_div);

        // Popup Functions;
        function makeEquipmentBlock () {
            var equipment_index = application.data.getEquipmentIndex();
            var equip_div = make('div');
            equip_div.style.paddingLeft = "8px";
            equip_div.innerHTML += "<span>Required Equipment: </span>";
            equipment_select = make('select');
            equipment_select.className = 'popup_equipment_select';
            var required = fitness_tech.equipment_required;
            var none_option = make('option');
            none_option.value = '0';
            none_option.innerHTML = "None";
            equipment_select.appendChild(none_option);
            for (var equipment_id  in equipment_index) {
                var equipment_option = make('option');
                equipment_option.value = equipment_id;
                equipment_option.innerHTML = equipment_index[equipment_id].equipment_name;
                equipment_select.appendChild(equipment_option);
                if (equipment_id == required) {
                    equipment_option.selected = true;
                }
            }
            equipment_select.style.marginLeft = '5px';
            equip_div.appendChild(equipment_select);
            return (equip_div);
        }
        function saveFitnessTech () {
            application.data.updateTechnique('fitness', id, name_input.value, equipment_select.value);
        }
    }
    function showTechniquePopup (id) {

        // Popup Variables;
        var tech = application.data.getTechniqueFromID(id);
        var name_input, equipment_select;

        // Make Popup;
        var banner = makePageBanner('technique details');
        popup_container_div.appendChild(banner);
        popup_container_div.appendChild(makeNameBlock());
        popup_container_div.appendChild(makeEquipmentBlock());
        popup_container_div.appendChild(makePageSpacer(18));
        popup_container_div.appendChild(makeSaveBlock(95));
        popup_container_div.appendChild(makeCloseBlock(126));

        // Popup Functions;
        function makeSaveBlock (width) {
            var div = makeFloatButtonDiv("&nbsp;save&nbsp;", width, "left");
            //div.style.textDecoration = 'line-through';
            div.style.textAlign = 'center';
            div.onclick = function () {
                return function () {
                    saveTech();
                }
            }();
            return div;
        }
        function makeCloseBlock (width) {
            var button_div = makeButtonDiv("close");
            button_div.style.textAlign = 'center';
            button_div.style.marginLeft = width;
            button_div.onclick = function () {
                display_engine.closePopup();
            };
            return button_div;
        }
        function makeNameBlock () {
            var name_div = make('div');
            name_div.style.paddingLeft = "8px";
            name_div.innerHTML += "<span>Technique Name: </span>";
            name_input = make('input');
            name_input.style.marginLeft = '5px';
            name_input.value = tech.tech_name;
            var say_span = make('span');
            say_span.style.float = 'right';
            say_span.style.cursor = 'pointer';
            say_span.style.textDecoration = 'underline';
            say_span.style.color = '#656ba2';
            say_span.style.marginTop = '12px';
            say_span.style.marginRight = '10px';
            say_span.innerHTML = "say name";
            say_span.onclick = function () {
                application.tengu.quickSpeak(tech.tech_name);
            };
            name_div.appendChild(name_input);
            name_div.appendChild(say_span);
            return (name_div);
        }
        function makeEquipmentBlock () {
            var equipment_index = application.data.getEquipmentIndex();
            var equip_div = make('div');
            equip_div.style.paddingLeft = "8px";
            equip_div.innerHTML += "<span>Required Equipment: </span>";
            equipment_select = make('select');
            equipment_select.className = 'popup_equipment_select';
            var required = tech.equipment_required;
            var none_option = make('option');
            none_option.value = '0';
            none_option.innerHTML = "None";
            none_option.selected = true;
            equipment_select.appendChild(none_option);
            for (var equipment_id  in equipment_index) {
                var equipment_option = make('option');
                equipment_option.value = equipment_id;
                equipment_option.innerHTML = equipment_index[equipment_id].equipment_name;
                equipment_select.appendChild(equipment_option);
                if (equipment_id == required) {
                    equipment_option.selected = true;
                }
            }
            equipment_select.style.marginLeft = '5px';
            equip_div.appendChild(equipment_select);
            return (equip_div);
        }
        function saveTech () {
            application.data.updateTechnique('tech', id, name_input.value, equipment_select.value);
        }
    }
    function showNewComboPopup () {
        // Popup Banner;
        var banner = makePageBanner('new combination',  'create new combinations. at least two techniques are required.');
        popup_container_div.appendChild(banner);

        // Combo Builder Block;
        var builder_div = make('div', 'combo_builder_div');
        popup_container_div.appendChild(builder_div);

        // Formula Block;
        var combo_formula_div = make('div', 'combo_formula_div');
        combo_formula_div.innerHTML = "No techniques included yet.";
        builder_div.appendChild(combo_formula_div);

        // Name Block;
        var combo_name_block = make('div', 'combo_name_div');
        combo_name_block.innerHTML = "<span>Combo Name/Alias:</span>";
        var combo_name_input = make('input');
        combo_name_input.type = 'text';
        combo_name_input.placeholder = "Combo Name";
        combo_name_input.style.width = 200;
        combo_name_block.appendChild(combo_name_input);
        builder_div.appendChild(combo_name_block);

        // Combo Table Builder;
        var combo_table = make('table','combo_build_table');
        var table_array = [];
        var select_array = [];
        for (var i = 0; i < 2; i++) {
            var is_required = (i == 0 || i == 1);
            combo_table.appendChild(makeComboRow(i, is_required));
        }
        builder_div.appendChild(combo_table);


        // Save Button Block;
        var save_button_div = makeFloatButtonDiv("&nbsp;save&nbsp;", 95, "left");
        save_button_div.style.textDecoration = 'line-through';
        save_button_div.style.textAlign = 'center';
        popup_container_div.appendChild(save_button_div);

        // Back Button Block;
        var back_button_div = makeButtonDiv("cancel");
        back_button_div.style.textAlign = 'center';
        back_button_div.style.marginLeft = 126;
        back_button_div.onclick = function () {
            display_engine.closePopup();
        };
        popup_container_div.appendChild(back_button_div);

        // Page Functions;
        function makeComboRow (combo_index, selection_required) {

            var combo_row = make('tr');

            var index_cell = make('td');
            index_cell.innerHTML = (combo_index + 1);
            index_cell.className = 'combo_builder_index_cell';

            var combo_cell = make('td');
            combo_cell.style.textAlign = 'center';

            var tech_select = make('select');
            tech_select.style.margin = '3px';
            tech_select.style.width = '95%';
            tech_select = populateTechSelect(tech_select, selection_required);

            combo_cell.appendChild(tech_select);
            combo_row.appendChild(index_cell);
            combo_row.appendChild(combo_cell);

            table_array.push(combo_row);
            select_array.push(tech_select);
            return combo_row;
        }
        function populateTechSelect (select, required) {

            var select_array = application.data.getComboTechSelectArray();
            var none_option = make('option');
            none_option.innerHTML = 'none';
            none_option.value = 'none';
            none_option.disabled = required;
            none_option.selected = true;
            select.onclick = function (select_object) {
                return function () {
                    select_object.style.color = 'black';
                }
            }(select);
            select.onchange = function () {
                return function () {
                    updateFormula();
                }
            }();
            select.onblur = function (select_object) {
                return function () {
                    if (select_object.value != 'none') {
                        select_object.style.color = 'black';
                    } else {
                        select_object.style.color = 'lightgray';
                    }
                }
            }(select);

            select.style.color = 'lightgray';
            select.appendChild(none_option);
            for (var each in select_array) {
                var new_option = make('option');
                var option_data = select_array[each];
                new_option.innerHTML = option_data['name'];
                new_option.value = option_data['type'] + '-' + option_data['id'];
                select.appendChild(new_option);
            }
            return select;
        }
        function updateFormula () {

            var row_count = 0;
            var filled_count = 0;

            var formula = "";
            for (var each in select_array) {
                row_count ++;
                var sel_value = select_array[each].value;
                if (sel_value != 'none') {
                    filled_count ++;

                    var identifier = sel_value.split('-');
                    var name;
                    if (identifier[0] == 'tech') {
                        name = application.data.getTechniqueName(identifier[1]);
                    } else if (identifier[0] == 'fitness') {
                        name = application.data.getFitnessName(identifier[1]);
                    }

                    if (each == 0) {
                        formula += name;
                    } else {
                        formula += ", " + name;
                    }
                }
            }
            //formula = (formula == "") ? "" : "No techniques included yet.";
            combo_formula_div.innerHTML = formula;
            if (row_count == filled_count) {
                addTechSelectRow();
            } else if (row_count > 3) {
                removeTechSelectRow();
            }
            if (filled_count >= 2) {
                enableSave();
            } else {
                disableSave();
            }
        }
        function addTechSelectRow () {
            var next_index = table_array.length;
            combo_table.appendChild(makeComboRow(next_index, false));
        }
        function removeTechSelectRow () {
            // todo this always removes the last row, when it should ACTUALLY remove the row where the select was set to none!
            var last_index = table_array.length - 1;
            combo_table.removeChild(table_array[last_index]);
            table_array.splice(last_index, 1);
            select_array.splice(last_index, 1);
        }
        function enableSave() {
            save_button_div.style.textDecoration = 'none';
            save_button_div.onclick = function () {
                var combo_array = [];
                for (var each in select_array) {
                    if (select_array[each].value != 'none') {
                        combo_array.push(select_array[each].value);
                    }
                }
                application.data.saveNewCombination(combo_name_input.value, combo_array);
                application.data.getProfileDataAndShowPage(application.data.getUserId(), 'combo_manager');
            }
        }
        function disableSave () {
            save_button_div.style.textDecoration = 'line-through';
            save_button_div.onclick = null;
        }
    }

};