var ScriptMaker = function (app) {

    var script = new ScriptObject();
    var rep_counter = 1;

    this.getScript = function (schedule) {
        script.script_items = [];
        script.script_clock = 0;
        var block_array = schedule.blocks;
        var block_type_responses = {
            'combo_ladder' : function (sched_block) { return writeComboLadder(sched_block); },
            'serial_reps' : function (sched_block) { return writeSerialReps(sched_block); },
            'empty_rest' : function (sched_block) { return writeEmptyRest(sched_block); },
            'debrief' : function (sched_block) { return writeDebrief(sched_block); }
        };
        for (var each in block_array) {
            var block = block_array[each];
            if (block_type_responses[block.activity]) {
                var block_items = block_type_responses[block.activity](block);
                script.script_items = script.script_items.concat(block_items);
            } else {
                var error_placeholder = makeItem(capitalizeFirstLetter(block.activity) + " interval block not understood; Script placeholder.", block.length);
                script.script_items = script.script_items.push(error_placeholder);
            }
        }
        return script;
    };

    function writeComboLadder (block) {

        var items = [];
        var hup_or_tech = "hup";
        var remaining_length = block.length;
        items.push(makeItem("Combo Ladder. "+getVocab("Prepare for")+" striking commands.", 5000));
        remaining_length -= 5000;

        var combo = app.data.getCombinationFromId(block.techs);
        var combo_id_array = combo.tech_list;
        var techs_in_combo = combo.tech_count;
        var tier_length = remaining_length / techs_in_combo;

        var tier_preface = "";
        var cumulative_rep_length = 0;
        var cumulative_name_length = 0;
        for (var i = 0; i < techs_in_combo; i++) {

            var tech_id = combo_id_array[i];
            var tech_preface_delay;
            if (i == 0) {
                tech_preface_delay = 2200;
                items.push(makeItem("Starting technique.", tech_preface_delay));
            } else {
                tech_preface_delay = 2400;
                items.push(makeItem("Adding technique to combo.", tech_preface_delay));
            }
            var tech = app.data.getTechniqueFromID(combo_id_array[i]);

            cumulative_rep_length += Number(tech.rep_duration);
            cumulative_name_length += Number(tech.name_duration);

            tier_preface += (i != 0) ? ", "+tech['tech_name'] : tech['tech_name'];
            items.push(makeItem(tier_preface, cumulative_name_length));

            var rep_count = Math.floor(tier_length / cumulative_rep_length);
            var remainder = tier_length - (rep_count * cumulative_rep_length);

            for (var j = 0; j < rep_count; j ++) {
                var delay = (j==0) ? cumulative_rep_length + remainder : cumulative_rep_length;
                if (hup_or_tech == "tech") {
                    items.push(makeItem(tier_preface, delay, true));
                } else {
                    var n_hups;
                    switch(i){
                        case(0) :
                            n_hups = "hup!";
                            block.reps[combo_id_array[0]] = (block.reps[combo_id_array[0]] != undefined) ? block.reps[combo_id_array[0]] + 1 : 1;
                            break;
                        case(1) :
                            n_hups = "hup-hup!";
                            block.reps[combo_id_array[0]] = (block.reps[combo_id_array[0]] != undefined) ? block.reps[combo_id_array[0]] + 1 : 1;
                            block.reps[combo_id_array[1]] = (block.reps[combo_id_array[1]] != undefined) ? block.reps[combo_id_array[1]] + 1 : 1;
                            break;
                        case(2) : n_hups = "hup-hup-hup!";
                            block.reps[combo_id_array[0]] = (block.reps[combo_id_array[0]] != undefined) ? block.reps[combo_id_array[0]] + 1 : 1;
                            block.reps[combo_id_array[1]] = (block.reps[combo_id_array[1]] != undefined) ? block.reps[combo_id_array[1]] + 1 : 1;
                            block.reps[combo_id_array[2]] = (block.reps[combo_id_array[2]] != undefined) ? block.reps[combo_id_array[2]] + 1 : 1;
                            break;
                        case(3) :
                            n_hups = "hup-hup-hup-hup!";
                            block.reps[combo_id_array[0]] = (block.reps[combo_id_array[0]] != undefined) ? block.reps[combo_id_array[0]] + 1 : 1;
                            block.reps[combo_id_array[1]] = (block.reps[combo_id_array[1]] != undefined) ? block.reps[combo_id_array[1]] + 1 : 1;
                            block.reps[combo_id_array[2]] = (block.reps[combo_id_array[2]] != undefined) ? block.reps[combo_id_array[2]] + 1 : 1;
                            block.reps[combo_id_array[3]] = (block.reps[combo_id_array[3]] != undefined) ? block.reps[combo_id_array[3]] + 1 : 1;
                            break;
                        case(4) :
                            n_hups = "hup-hup-hup-hup-hup!";
                            block.reps[combo_id_array[0]] = (block.reps[combo_id_array[0]] != undefined) ? block.reps[combo_id_array[0]] + 1 : 1;
                            block.reps[combo_id_array[1]] = (block.reps[combo_id_array[1]] != undefined) ? block.reps[combo_id_array[1]] + 1 : 1;
                            block.reps[combo_id_array[2]] = (block.reps[combo_id_array[2]] != undefined) ? block.reps[combo_id_array[2]] + 1 : 1;
                            block.reps[combo_id_array[3]] = (block.reps[combo_id_array[3]] != undefined) ? block.reps[combo_id_array[3]] + 1 : 1;
                            block.reps[combo_id_array[4]] = (block.reps[combo_id_array[4]] != undefined) ? block.reps[combo_id_array[4]] + 1 : 1;
                            break;
                    }
                    items.push(makeItem(n_hups, delay, true));
                }
            }
        }
        return items;
    }
    function writeSerialReps (block) {
        var items = [];

        var hup_or_count = "hup";
        var remaining_length = block.length;
        items.push(makeItem("Serial Strikes. "+getVocab("Prepare for")+" striking commands.", 5000));
        remaining_length -= 5000;

        var techs_to_rep = block.techs.length;
        var each_length = (remaining_length / techs_to_rep);
        block['reps'] = [];
        var spoken_rep_count = 1;

        for (var each_tech = 0; each_tech  < techs_to_rep; each_tech++) {

            spoken_rep_count = 1;
            var tech_id = block.techs[each_tech];
            var tech = app.data.getTechniqueFromID(tech_id);
            var name = tech.tech_name;
            var name_duration = tech.name_duration;
            var rep_duration = tech.rep_duration;

            var syntax_prefix;
            if (each_tech == 0) {
                syntax_prefix = "First technique.";
            } else {
                syntax_prefix = "Next technique."
            }
            items.push(makeItem(syntax_prefix, 2000));
            items.push(makeItem(name, name_duration));

            var remainder = (each_length - name_duration - 2000);
            var rep_count = Math.floor(remainder / (rep_duration + 5));

            for (var rep = 0; rep < rep_count; rep++) {
                block.reps[tech_id] = (block.reps[tech_id] != undefined) ? block.reps[tech_id] + 1 : 1;
                if (hup_or_count == "count") {
                    items.push(makeItem(getRepCount(spoken_rep_count), rep_duration, true));
                }  else {
                    items.push(makeItem("Hup!", rep_duration, true));
                }
                spoken_rep_count++;
            }
        }
        return items;
    }
    function writeEmptyRest (block) {

        var items = [];
        items.push(makeItem("Rest period. " + getVocab("Control your breathing."), block.length - (10 * 1000)));
        items.push(makeItem("10 Seconds.", (7 * 1000)));
        items.push(makeItem("3.", 1000));
        items.push(makeItem("2.", 1000));
        items.push(makeItem("1.", 1000));
        return items;
    }
    function writeDebrief (block) {
        var items = [];
        items.push(makeItem("Rest period. " + getVocab("Control your breathing."), block.length - (10 * 1000)));
        return items;
    }

    function makeItem (script_text, block_length, is_rep) {
        if (is_rep != true) {
            rep_counter = 0;
        } else {
            rep_counter ++;
        }

        var item = new ScriptItemObject(script_text, block_length, getTime(script.script_clock), rep_counter);
        script.script_clock += block_length;
        return item;
    }
};