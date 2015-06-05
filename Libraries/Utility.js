
// Utility Functions;

function capriciousRounding (float) {
    var choice_info = {
        'options' : [
            'follow_rounding',
            'round_up_regardless',
            'round_down_regardless'
        ],
        'odds' : [ 70, 20, 10  ]
    };
    var choice = pickFromArrayBiased(choice_info['options'], choice_info['odds']);
    var integer = null;
    switch (choice) {
        case ('follow_rounding') : integer = (Math.round(float)); break;
        case ('round_up_regardless') : integer = (Math.ceil(float)); break;
        case ('round_down_regardless') : integer = (Math.floor(float)); break;
    }
    return integer;
}
function countArrayOrObject(this_object) {
    var count = 0;
    for (var attribute in this_object) {
        if (this_object.hasOwnProperty(attribute)) {
            ++count;
        }
    }
    return count;
}
function getRepCount (count) {

    var spoken_count;
    if (count <= 10) {
        spoken_count = count;
    } else {
        if ((count / 10) == Math.floor(count / 10)) {
            spoken_count = count;
        } else {
            spoken_count = count - (Math.floor(count / 10) * 10);
        }
    }
    return spoken_count;
}
function getTime (ms) {

    var hours = Math.floor(((ms / 1000) / 60 )/ 60);
    hours = (String(hours).length < 2) ? "0"+hours : hours;

    var minutes = Math.floor((ms / 1000) / 60 ) - (hours * 60);
    minutes = (String(minutes).length < 2) ? "0"+minutes : minutes;

    var seconds = Math.floor(ms / 1000) - (hours * 60) - (minutes * 60);
    seconds = (String(seconds).length < 2) ? "0"+seconds : seconds;

    ms = Math.floor(ms - (hours * 60 * 60 * 1000) - (minutes * 60 * 1000) - (seconds * 1000));
    ms = (String(ms).length == 1) ? ms + "0" : ms;
    ms = (String(ms).length == 2) ? ms + "0" : ms;

    return ("["+hours+":"+minutes+":"+seconds+"."+ms+"]");
}
function shortTime(short_time) {
    var ms_time = 0;
    var unit = short_time.replace(/[0-9]/g, '');
    var int =  Number(short_time.replace(/[^\d]/g, ''));
    switch (unit) {
        case ('m') : ms_time = int * 60 * 1000; break;
        case ('h') : ms_time = int * 60 * 60 * 1000; break;
        case ('s') : ms_time = int * 1000; break;
    }
    return ms_time;
}
function timeToText (ms_length) {

    var text_string = "";
    var hours = Math.floor(((ms_length / 1000) / 60 )/ 60);
    var minutes = Math.floor((ms_length / 1000) / 60 ) - (hours * 60);
    var seconds = Math.floor(ms_length / 1000) - (hours * 60 * 60) - (minutes * 60);
    var milliseconds = Math.floor(ms_length) - (hours * 60 * 60 * 1000) - (minutes * 60 * 1000) - (seconds * 1000);

    if (hours > 1) {
        text_string += (String(hours) + " hours");
    } else if (hours == 1) {
        text_string += (String(hours) + " hour");
    }

    if (minutes > 1) {
        text_string += (hours != 0) ? (" "+ String(minutes) + " minutes") : (String(minutes) + " minutes");
    } else if (minutes == 1) {
        text_string += (hours != 0) ? (" "+ String(minutes) + " minute") : (String(minutes) + " minute");
    }

    if (seconds > 1) {
        text_string += (minutes != 0) ? (" "+ String(seconds) + " seconds") : (String(seconds) + " seconds");
    } else if (seconds == 1) {
        text_string += (minutes != 0) ? (" "+ String(seconds) + " second") : (String(seconds) + " second");
    }

    if (milliseconds != 0) {
        text_string += (hours != 0 || minutes != 0 || seconds != 0) ? (" "+ String(milliseconds) + " ms") : (String(milliseconds) + " ms");
    }


    return text_string;
}
function wordInString(word, string) {
    return string.search(word) > -1;
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function sendToOutput (text) {
    var output_string = "<p class='engine_output_par'>"+text+"</p>";
    var output = document.getElementById('speech_output_div');
    output.innerHTML += output_string;
    output.scrollTop = output.scrollHeight;
}
function getVocab (swap_phrase) {
    var swap_for = "";
    switch (swap_phrase) {
        case ("Prepare for") : swap_for = pickRandomString([swap_phrase, "Get ready for"]); break;
        case ("Control your breathing.") : swap_for = pickRandomString([swap_phrase, "Shake your muscles loose.", "Try and touch your toes."]); break;
        default : swap_for = swap_phrase;
    }
    return swap_for;

}
function countAttributes(this_object) {
    var count = 0;
    for (var attribute in this_object) {
        if (this_object.hasOwnProperty(attribute)) {
            ++count;
        }
    }
    return count;
}
function removeFromArray (string, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == string) {
            array.splice(i, 1);
            break;
        }
    }
    return array;
}
function reduceFraction(numerator, denominator) {
    var gcd = function gcd(a,b){
        return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/gcd, denominator/gcd];
}
function sortObject(o, prop) {
    var sorted = {},
        key, a = [];
    var b = [];
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            b.push(o[key]);
            a.push(o[key][prop]);
        }
    }
    a.sort();
    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[b[key]];
    }
    return sorted;
}
function dropDuplicates(array) {
    var unique_array = [];
    for (var each  in array) {
        if (unique_array.indexOf(array[each]) == -1) {
            unique_array.push(array[each]);
        }
    }
    return unique_array;
}

// Decision Utility Functions;
function pickRandomTechIDFromArrayEven (tech_array) {
    var choices = countArrayOrObject(tech_array);
    var share = 100 / choices;
    var dice_hit = Math.random() * 100;
    var dice_counter = 0;
    var chosen_tech;
    for (var key in tech_array) {
        dice_counter += share;
        if (dice_counter > dice_hit && chosen_tech == undefined) {
            chosen_tech = tech_array[key];
        }
    }
    return chosen_tech;
}
function pickRandomKeyFromArrayEven (choice_array) {
    var choices = countArrayOrObject(choice_array);
    var share = 100 / choices;
    var dice_hit = Math.random() * 100;
    var dice_counter = 0;
    var chosen_key;
    for (var key in choice_array) {
        dice_counter += share;
        if (dice_counter > dice_hit && chosen_key == undefined) {
            chosen_key = key;
        }
    }
    return chosen_key;
}
function pickRandomString (string_array) {
    var choices = countArrayOrObject(string_array);
    var share = 100 / choices;
    var dice_hit = Math.random() * 100;
    var dice_counter = 0;
    var chosen_key;
    for (var key in string_array) {
        dice_counter += share;
        if (dice_counter > dice_hit && chosen_key == undefined) {
            chosen_key = key;
        }
    }
    return string_array[chosen_key];
}
function pickFromArrayBiased (choice_array, odds_array) {
    var picked = false;
    var total_odds = 0;
    var dice = Math.random() * 100;
    for (var each in odds_array) {
        total_odds += odds_array[each];
        if (total_odds > dice && picked == false) {
            picked = true;
            var pick = choice_array[each];
            var pick_odds = odds_array[each];
        }
    }
    if (total_odds > 100) {
        //console.log('Odds Calculator Issue: Sum of odds greater than 100%');
        return 'Error!';
    } else {
        //console.log('Bias picker picked ['+pick+'], at a '+pick_odds+'% chance ('+dice+')');
        return pick;
    }
}

// DOM Utilities;

// DOM Utility Makers;
function make (type, id, class_name) {
    var dom_ob = document.createElement(type);
    if (id != null) { dom_ob.id = id; }
    if (class_name != null) { dom_ob.className = class_name; }
    return dom_ob;
}
function makePageSpacer (height) {
    var div = make('div');
    div.style.height = height;
    div.margin = "8px";
    div.style.backgroundColor = "#CCD8E1";
    return div;
}
function makePageContainer () {
    page_container = make('div');
    page_container.style.height = "100%";
    page_container.style.width = "100%";
    page_container.style.marginTop = "-1px";
    page_container.style.marginLeft = "-1px";
    return page_container;
}
function makePageBanner (page_title, page_guidance, banner_height) {
    var banner_div = make('div');
    banner_div.style.backgroundColor = "#CCD8E1";
    banner_div.style.border = "1px solid black";
    banner_div.style.margin = "8px 8px 4px 8px";
    banner_div.style.padding = "0";
    banner_div.style.textAlign = "center";
    banner_div.style.fontSize = "18px";
    banner_div.className = "no_select";
    banner_div.style.cursor = "default";
    banner_div.style.height = (banner_height != undefined) ? banner_height : "60px";
    banner_div.innerHTML = "<p class='page_title'>" + page_title + "</p>";
    if (page_guidance) {
        banner_div.innerHTML += "<p class='page_guidance'>" + page_guidance+ "</p>";
    } else {
        banner_div.style.paddingTop = "8px";
        banner_div.style.height = (banner_height != undefined) ? banner_height : "52px";
    }
    return banner_div;
}
function makeButtonDiv (button_label) {
    var back_div = make('div');
    back_div.innerHTML = button_label;
    back_div.style.padding = "8px";
    back_div.className = "div_button no_select";
    return (back_div);
}
function makeFloatButtonDiv (button_label, button_size, left_or_right) {
    var floating_button_div = make('div');
    floating_button_div.style.float = left_or_right;

    switch (left_or_right) {
        case("left") : floating_button_div.style.margin = "0 0 0 8px"; break;
        case("right") : floating_button_div.style.margin = "0 8px 0 0"; break;
    }

    floating_button_div.style.padding = "8px";
    floating_button_div.style.width = button_size+"px";
    floating_button_div.className = "div_button no_select";
    floating_button_div.innerHTML = button_label;
    return floating_button_div;
}
function makeFloatingTip () {
    var canvas = make('canvas');
    canvas.style.backgroundColor = white;
    canvas.style.width = 200;
    canvas.style.height = 200;
    var cx = canvas.getContext('2d');

}

// DOM Utility Setter;
function setPageWidth (container, page, width) {
    page.style.width = width;
    page.style.marginLeft = -1;
    container.style.width = width;
    container.style.marginLeft = (-1 * (width / 2));

}