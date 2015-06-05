var DataEngine = function (application) {

    var app_version = "0.43.2";
    this.getVersion = function () { return app_version; };

    var log_ajax_out = true;
    var log_ajax = true;

    var data_engine = this;
    var data_package = new DataPackage();

    var output;
    var profile_data = {};
    var data_active = false;

    profile_data['combo_list'] = {
        '1' : ['1', '1', '2'],
        '2' : ['1', '2', '3', '2'],
        '3' : ['1', '2', '57']
    };

    // Starter Method;
    this.initialize = function () {
        updateDataOutput(false);
    };
    this.log = function () {
        console.log('------- Current Data -------');
        console.log('Profile_Data');
        console.log(profile_data);
        console.log('DataPackage');
        console.log(data_package);
        console.log('-------------------------');
    };

    // Getter Methods;
    this.getArtList = function () {
        return data_package.art_index;
    };
    this.getArtName = function (art_id) {
        return data_package.art_index[art_id].art_name;
    };
    this.getAvailableEquipment = function () {
        return data_package.user.available_equipment;
    };
    this.getCombinationArray = function () {
        return data_package.user.tech_library.combo_array;
    };
    this.getCombinationFromId = function (combo_id) {
        return data_package.combo_index[combo_id];
    }
    this.getComboName = function (combo_id) {
        return data_package.combo_index[combo_id].combo_name;
    };
    this.getComboTechSelectArray = function () {
        var return_array = [];
        var tech_list = data_engine.getKnownTechniqueList();
        var fitness_list = data_engine.getKnownFitnessList();
        var each, id, name, type;
        for (each in tech_list) {
            id = tech_list[each];
            name = data_engine.getTechniqueName(id);
            type = 'tech';
            return_array.push(
                { 'id' : id, 'name' : name, 'type' : type }
            );
        }
        for (each in fitness_list) {
            id = fitness_list[each];
            name = data_engine.getFitnessName(id);
            type = 'fitness';
            return_array.push(
                { 'id' : id, 'name' : name, 'type' : type }
            );
        }
        return return_array;
    };
    this.getComboTechString = function (combo_id) {
        var return_string = "";
        var combination = data_engine.getCombinationFromId(combo_id);
        var tech_list = combination.tech_list;
        for (var each in tech_list) {
            var id = tech_list[each];
            var comma_prefix = (each != 0) ? ", " : "";
            var tech_name = (combination.type_list[each] == 'tech') ? data_engine.getTechniqueName(id) : data_engine.getFitnessName(id)
            return_string += comma_prefix + tech_name;
        }
        return return_string;
    };
    this.getIsArtKnown = function (art_id) {
        if (data_package.user.tech_library.relation_array[art_id]) {
            return true;
        } else {
            return false;
        }
    };
    this.getIsEquipmentAvailable = function (equipment_id) {
        for (var each_id in data_package.user.available_equipment) {
            if (equipment_id == data_package.user.available_equipment[each_id]) {
                return true;
            }
        }
        return false;
    };
    this.getEquipmentName = function (equipment_id) {
        return data_package.equipment_index[equipment_id].equipment_name;
    };
    this.getEquipmentIndex = function () {
        return data_package.equipment_index;
    };
    this.getFitnessTechFromId = function (fitness_id) {
        return data_package.fitness_index[fitness_id];
    };
    this.getFitnessName = function (fitness_id) {
        return data_package.fitness_index[fitness_id].fitness_name;
    };
    this.getKnownArtList = function () {
        return data_package.user.tech_library.known_arts_list;
    };
    this.getKnownFitnessList = function () {
        return data_package.user.tech_library.relation_array['fitness']['known_array'];
    };
    this.getKnownCombinationList = function () {
        return data_package.user.tech_library.combo_array['known_array'];
    };
    this.getKnownTechniqueCount = function () {
        return data_package.user.tech_library.known_tech_list.length;
    };
    this.getKnownTechniqueList = function () {
        return data_package.user.tech_library.known_tech_list;
    };
    this.getMaxWork = function () {
        return parseFloat(data_package.user.max_work);
    };
    this.getWorkRatio = function () {
        return parseFloat(data_package.user.work_ratio);
    };
    this.getRelationArray = function () {
        return data_package.user.tech_library.relation_array;
    };
    this.getRestRatio = function () {
        return parseFloat(data_package.user.rest_ratio);
    };
    this.getSessionArray = function () {
        return profile_data['session_history'];
    };
    this.getTechniqueList = function () {
        return profile_data['tech_list'];
    };
    this.getTechArrayFromComboId = function (combo_id) {
        var tech_array = "unknown";
        if (combo_library[combo_id]) {
            tech_array = combo_library[combo_id];
        }
        return tech_array;
    };
    this.getTechniqueFromID = function (tech_id) {
        return data_package.tech_index[tech_id];
    };
    this.getTechsKnownInArt= function (art_id) {
        var known_array = data_package.user.tech_library.relation_array[art_id]['known_array'];
        return countAttributes(known_array);
    };
    this.getTechniqueName = function (tech_id) {
        return data_package.tech_index[tech_id].tech_name;
    };
    this.getTechRelationToArt = function (tech_id, art_id) {
        var art_array = profile_data['art_list'][art_id]['art_techs'];
        var included = "false";
        for (var each_included in art_array) {
            if (art_array[each_included] == tech_id) {
                included = "true";
                break;
            }
        }
        return included;
    };
    this.getUnknownTechList = function () {
        var unknown_list = [];
        var known_list = data_engine.getKnownTechniqueList();
        for (var tech_id in data_package.tech_index) {
            if (known_list.indexOf(tech_id) == -1) {
                unknown_list.push(tech_id);
            }
        }
        return unknown_list;
    };
    this.getUserId = function () {
        return data_package.user.user_id;
    };
    this.getUserName = function () {
        return data_package.user.user_name;
    };

    // Cookie Controls;
    this.setToCookie = function (attribute, value, expiry_minutes) {
        createCookie(attribute, value, expiry_minutes);
    };
    this.getFromCookie = function (attribute) {
        return readCookie(attribute);
    };
    this.clearCookie = function (attribute) {
        eraseCookie(attribute);
    };
    function createCookie(name, value, minutes) {
        var expires;
        var date = new Date();

        if (minutes) {
            date.setTime(date.getTime() + (minutes * 60 * 1000));
        } else {
            date.setTime(date.getTime() + (45 * 60 * 1000));
        }
        expires = "; expires=" + date.toGMTString();
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    }
    function readCookie(name) {
        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }
    function eraseCookie(name) {
        createCookie(name, "", -1);
    }

    // Ajax Getters;
    this.postRecoveryEmail = function (email) {
        var post_string = "post_recovery=true&email="+email;
        sendPostAjax(post_string);
    };
    this.postLoginAttempt = function (name, pass) {
        var post_string = "try_login=true&name=" + name + "&pass=" + pass + "&version=" + data_engine.getVersion();
        var return_function = function (ajax_response) {

            if (ajax_response === 'password_incorrect') {
                application.display.showError('login_pass');
            }
            else if (ajax_response === 'name_not_found') {
                application.display.showError('login_name');
            }
            else {
                var reply_array = ajax_response.split('|');
                var id = reply_array[0],
                    name = reply_array[1],
                    reg_state = reply_array[2];

                createCookie('profile_id', id, 45);

                if (reg_state == 2) {
                    var to_home_post_string = "get_profile_data=true&profile_id=" + id;
                    var to_home_return_function = function (ajax_response) {
                        profile_data = JSON.parse(ajax_response);
                        data_package.unpackData(ajax_response);
                        application.display.showPage('home_page');
                    };
                    sendPostAjax(to_home_post_string, to_home_return_function);
                }
                else {
                    var get_prelim_post_string = "get_prelim_data=true&user_id=" + id;
                    var get_prelim_return_function;

                    if (reg_state == 0) {
                        get_prelim_return_function = function (prelim_ajax) {
                            data_package.unpackData(prelim_ajax);
                            application.display.showPage('register_page_2');
                        };
                    } else if (reg_state == 1) {
                        get_prelim_return_function = function (prelim_ajax) {
                            data_package.unpackData(prelim_ajax);
                            application.display.showPage('register_page_3');
                        };
                    }
                    sendPostAjax(get_prelim_post_string, get_prelim_return_function);
                }
            }
        };
        sendPostAjax(post_string, return_function);
    };
    this.getProfileDataAndShowPage = function (user_id, bookmark) {
        var post_string = "get_profile_data=true&profile_id=" + user_id;
        var return_function = function (ajax_response) {
            //profile_data = JSON.parse(ajax_response);
            data_package.unpackData(ajax_response);
            createCookie('profile_id', data_engine.getUserId(), 45);
            application.display.showPage(bookmark);
        };
        sendPostAjax(post_string, return_function);
    };
    this.getSessionHistory = function (on_return) {
        var post_string = "get_session_history=true&user_id=" + data_engine.getUserId();
        var return_function = function (ajax_response) {
            profile_data['session_history'] = JSON.parse(ajax_response);
            on_return();
        };
        sendPostAjax(post_string, return_function);
    };

    // Adding Ajax;
    this.addArtToUser = function (art_id) {
        var post_string = "add_art_to_user=true&user_id="+data_engine.getUserId()+"&art_id="+art_id;
        sendPostAjax(post_string);
    };
    this.addComboToUser = function (combo_id) {
        var post_string = "add_combo_to_user=true&user_id="+data_engine.getUserId()+"&combo_id="+combo_id;
        sendPostAjax(post_string);
    };
    this.addEquipmentToUser = function (equipment_id) {
        var post_string = "add_equipment_to_user=true&user_id="+data_engine.getUserId()+"&equipment_id="+equipment_id;
        sendPostAjax(post_string);
    };
    this.addTechToArt = function (tech_id, art_id) {
        var post_string = "add_tech_to_art=true&user_id="+data_engine.getUserId()+"&tech_id="+tech_id+"&art_id="+art_id;
        sendPostAjax(post_string);
    };
    // Removal Ajax;
    this.removeArtFromUser = function (art_id) {
        var post_string = "remove_art_from_user=true&user_id="+data_engine.getUserId()+"&art_id="+art_id;
        sendPostAjax(post_string);
    };
    this.removeComboFromUser = function (combo_id) {
        var post_string = "remove_combo_from_user=true&user_id="+data_engine.getUserId()+"&combo_id="+combo_id;
        sendPostAjax(post_string);
    };
    this.removeEquipmentFromUser = function (equipment_id) {
        var post_string = "remove_equipment_from_user=true&user_id="+data_engine.getUserId()+"&equipment_id="+equipment_id;
        sendPostAjax(post_string);
    };
    this.removeTechFromArt = function (tech_id, art_id) {
        var post_string = "remove_tech_from_art=true&user_id="+data_engine.getUserId()+"&tech_id="+tech_id+"&art_id="+art_id;
        sendPostAjax(post_string);
    };
    // Updating Ajax;
    this.updateTechnique = function (type, tech_id, tech_name, req_equip) {
        var return_function = function () {
            window.location.reload();
        };
        var post_string = "" +
            "update_tech=true" +
            "&type=" + type +
            "&updater_id=" + data_engine.getUserId() +
            "&tech_id=" + tech_id +
            "&tech_name=" + tech_name +
            "&req_equip="+req_equip;
        sendPostAjax(post_string);
    };

    this.saveListArtAndRegister = function (art_id) {
        var post_string = "new_user_list_art=true&user_id=" + data_engine.getUserId() + "&art_id=" + art_id;
        sendPostAjax(post_string);
        data_engine.getProfileDataAndShowPage(data_engine.getUserId(), 'register_page_3');
    };
    this.saveMyTechniques = function (update_string) {
        var update_list_array = update_string.split("&");
        for (var each_update in update_list_array) {
            var update_array = update_list_array[each_update].split("=");
            for (var each_tech in profile_data['tech_list']) {
                if (profile_data['tech_list'][each_tech]['tech_id'] == update_array[0]) {
                    profile_data['tech_list'][each_tech]['is_known'] = update_array[1];
                }
            }
        }
        var post_string = "save_my_techniques=true&profile_id=" + profile_data['profile_id'] + "&" + update_string;
        sendPostAjax(post_string);
    };
    this.saveNewArt = function (new_name) {
        var post_string = "new_art=true&submitter_id=" + data_package.user.user_id + "&art_name=" + new_name;
        var return_function = function (ajax_response) {
            profile_data['art_list'][ajax_response] = {"art_id" : ajax_response, "art_name" : new_name, "art_techs" : [null]};
            application.display.showPage('art_tech_admin');
        };
        sendPostAjax(post_string, return_function);
    };
    this.saveNewArtAndRegister = function (new_art_name) {
        var post_string = "new_user_new_art=true&user_id=" + data_engine.getUserId() + "&art_name=" + new_art_name;
        sendPostAjax(post_string);
        data_engine.getProfileDataAndShowPage(data_engine.getUserId(), 'register_page_3');
    };
    this.saveNewCombination = function (combo_name, combo_array) {
        var combo_string = "";
        for (var each in combo_array) {
            combo_string += (each != 0) ? "!"+combo_array[each] : combo_array[each];
        }
        var post_string = "new_combo=true&submitter_id=" + data_engine.getUserId() + "&name=" + combo_name + "&techs=" + combo_string;
        sendPostAjax(post_string);
    };
    this.saveNewEquipment = function (new_equipment_name) {
        var post_string = "new_equipment=true&submitter_id=" + data_package.user.user_id + "&equipment_name=" + new_equipment_name;
        var return_function = function (ajax_response) {
            // todo update data package with new equipment;
            //profile_data['art_list'][ajax_response] = {"art_id" : ajax_response, "art_name" : new_name, "art_techs" : [null]};
            application.display.showPage('equipment_manager');
        };
        sendPostAjax(post_string, return_function);
    };
    this.saveNewUser = function (name, email, pass) {
        var post_string = "new_profile=true&name=" + name + "&email=" + email + "&pass=" + pass;
        var return_function = function (ajax_response) {
            profile_data = JSON.parse(ajax_response);
            application.display.showPage('register_page_2');
        };
        sendPostAjax(post_string, return_function);
    };
    this.saveNewTechnique = function (new_name, art_id) {
        var post_string = "new_technique=true&submitter_id=" + data_engine.getUserId() + "&tech_name=" + new_name + "&art_id="+art_id;
        var return_function = function (ajax_response) {
            var new_technique = {"tech_id" : ajax_response, "tech_name" : new_name, "is_known" : "true"};
            for (var i = 0; i < profile_data['tech_list'].length; i++) {
                var tech = profile_data['tech_list'][i];
                if (tech['tech_name'] > new_name) {
                    profile_data['tech_list'].splice((i-1), 0, new_technique);
                    break;
                }
            }
        };
        sendPostAjax(post_string, return_function);
    };
    this.saveProfileSettings = function (settings_object) {
        data_package.user.max_work = settings_object.max_work;
        data_package.user.work_ratio = settings_object.work_ratio;
        data_package.user.rest_ratio = settings_object.rest_ratio;
        var post_string = "" +
            "save_profile_settings=true" +
            "&profile_id="+data_engine.getUserId() +
            "&max_work=" + settings_object.max_work +
            "&work_ratio=" + settings_object.work_ratio +
            "&rest_ratio=" + settings_object.rest_ratio;
        sendPostAjax(post_string);
    };
    this.saveArtTechUpdates = function (art_id, update_string) {

        var update_list_array = update_string.split("&");
        var art_relations = profile_data['art_list'][art_id];

        for (var each_update in update_list_array) {

            var update_array = update_list_array[each_update].split("=");
            var tech_id = update_array[0];
            var included = update_array[1];

            if (included == 'true') {
                profile_data['art_list'][art_id]['art_techs'].push(tech_id);
            } else {
                removeFromArray(tech_id, profile_data['art_list'][art_id]['art_techs']);
            }
        }

        var post_string = "update_art_techs=true&profile_id=" + profile_data['profile_id'] +"&art_id="+ art_id + "&" + update_string;
        sendPostAjax(post_string);
    };
    this.saveSession = function (schedule) {
        console.log("trying to save a session!");
        console.log(schedule);

        var session_string = "&session_techs=";
        for (var each_block in schedule.blocks) {
            var block = schedule.blocks[each_block];
            if (block.activity == 'combo_ladder') {
                var tech_array = data_engine.getTechArrayFromComboId(block.techs);
                block.techs = dropDuplicates(tech_array);
            }
            console.log(each_block);
            console.log(block.techs);
            console.log(block.reps);
            for (var position in block.techs) {
                var tech_id = block.techs[position];
                var rep_count = block.reps[tech_id];
                var activity = block.activity;
                session_string += (position == 0)
                    ? (position + ";"+tech_id+";"+rep_count+";"+activity)
                    : ("%"+position + ";"+tech_id+";"+rep_count+";"+activity);
            }
        }
        var post_string = "save_session=true&user_id=" + profile_data.profile_id + session_string;
        sendPostAjax(post_string);
    };
    this.saveUserTechniquesAndRegister = function (update_string) {
        var update_list_array = update_string.split("&");
        for (var each_update in update_list_array) {
            var update_array = update_list_array[each_update].split("=");
            for (var each_tech in profile_data['tech_list']) {
                if (profile_data['tech_list'][each_tech]['tech_id'] == update_array[0]) {
                    profile_data['tech_list'][each_tech]['is_known'] = update_array[1];
                }
            }
        }
        var post_string = "new_user_save_techs=true&user_id=" + profile_data['profile_id'] + "&" + update_string;
        var return_function = function () {
            data_engine.getProfileDataAndShowPage(data_engine.getUserId(), 'home_page');
        };
        sendPostAjax(post_string, return_function);
    }

    // Ajax Function;
    function sendPostAjax(post_string, return_function) {

        var ajax_request = new XMLHttpRequest();
        ajax_request.open("POST", "Server.php", true);
        ajax_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajax_request.send(post_string);
        if (log_ajax_out) { console.log('Ajax Post : '+post_string); }

        data_active = true;
        updateDataOutput(true);

        ajax_request.onreadystatechange = function() {
            if (ajax_request.readyState == 4 && ajax_request.status == 200) {

                if (log_ajax) { console.log('Ajax Response : '+ajax_request.responseText); }

                data_active = false;
                updateDataOutput(false);

                if (return_function) {
                    if (log_ajax) { console.log('Ajax Return Function : '+return_function); }
                    return_function(ajax_request.responseText);
                }
            }
        };
    }

    // Front-end data-use indicator updater;
    function updateDataOutput (send_status) {
        output = document.getElementById('save_output');

        if (send_status == true) {
            output.innerHTML = "ajax : true";
            output.style.backgroundColor = "#CAE0ED";
        }
        else {
            output.innerHTML = "ajax : false";
            output.style.backgroundColor = "white";
        }
    }
};