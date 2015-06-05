var ScheduleMaker = function (app) {

    var schedule = new ScheduleObject();

    this.getSchedule = function (session_ms) {
        schedule.ms_length = session_ms;
        schedule.type = planSessionType();
        schedule.blocks = planMacroBlocks ();
        schedule.blocks = planBlockActivities ();
        schedule.blocks = planBlockTechniques ();
        schedule.blocks = planDebriefQuestions();
        return schedule;
    };

    function planSessionType () {
        var length = schedule.ms_length;
        var session_type_array = [];
        for (var each_type in session_type_library) {
            var type_window = session_type_library[each_type]['window'];
            if (length >= shortTime(type_window['min']) && length <= shortTime(type_window['max'])) {
                session_type_array.push(each_type);
            }
        }
        return session_type_array[pickRandomKeyFromArrayEven(session_type_array)];
    }
    function planMacroBlocks () {
        var work, rest;
        var length = schedule.ms_length;
        var work_length = shortTime(app.data.getMaxWork()+'m');
        var rest_length = work_length * (app.data.getRestRatio() / app.data.getWorkRatio());
        var block;
        var block_array  = [];
        if (length < ((work_length * 2) + rest_length)) {
            work = new ScheduleBlock('work', length);
            block_array.push(work);
        }
        else {
            var interval_minimum = (work_length + rest_length);
            var rest_count = Math.floor((length - work_length) / interval_minimum);
            var work_count = rest_count + 1;
            var extra_time = length - (work_count * work_length) - (rest_count * rest_length);
            var adjusted_work_length = work_length + (extra_time / (work_count + rest_count));
            var adjusted_rest_length = rest_length + (extra_time / (work_count + rest_count));

            work = new ScheduleBlock('work', adjusted_work_length);
            block_array.push(work);
            for (var i = 0; i < rest_count; i++) {
                rest = new ScheduleBlock('rest', adjusted_rest_length);
                block_array.push(rest);
                work = new ScheduleBlock('work', adjusted_work_length);
                block_array.push(work);
            }
        }
        return block_array;
    }
    function planBlockActivities () {
        var macro_array = schedule.blocks;
        var activity;
        for (var each in macro_array) {
            var macro_block = macro_array[each];
            if (macro_block.type == 'work') {
                activity = work_activity_library[pickRandomKeyFromArrayEven(work_activity_library)];
            } else if (macro_block.type == 'rest') {
                activity = rest_activity_library[pickRandomKeyFromArrayEven(rest_activity_library)];
            }
            macro_array[each].activity = activity['key'];
            macro_array[each].techs_needed = activity['techs_needed'];
        }
        return macro_array;
    }
    function planBlockTechniques () {

        var tech_list = app.data.getKnownTechniqueList();
        var combo_list = app.data.getKnownCombinationList();

        var block_array = schedule.blocks;
        for (var each in block_array) {
            var block = block_array[each];

            if (block.techs_needed == 'none') {
                block.techs = "none";
            }
            else if (block.techs_needed == 'single_technique') {
                block.techs = pickRandomTechIDFromArrayEven(tech_list);
            }
            else if (block.techs_needed == 'striking_combo') {
                block.techs = pickRandomKeyFromArrayEven(combo_list);
            }
            else if (block.techs_needed == 'full_techs_per_minute') {
                var t = profile_data['attention']['techs'];
                var m   = shortTime(profile_data['attention']['per']);
                var tpm = t / m;
                var tech_array = [];
                var tech_needed_count = capriciousRounding(tpm * block_array[each].length);
                for (var i = 0; i < tech_needed_count; i++) {
                    tech_array.push(pickRandomTechIDFromArrayEven(tech_list));
                }
                block.techs = tech_array;
            }
            else {
                block.techs = "error";
            }
        }
        return block_array;
    }
    function planDebriefQuestions () {

        var block_array = schedule.blocks;
        var activity_handlers = {
            'combo_ladder' : function (db, pb) { questionComboLadder(db, pb); },
            'serial_reps' : function (db, pb) { questionSerialReps(db, pb); }
        };
        for (var index in block_array) {
            if (block_array[index].activity == 'debrief') {
                console.log('planning debrief questions');

                var current_block = block_array[index];
                var previous_block = block_array[index-1];
                // Throw error if there isn't a contingency functionality for a particular activity;
                if (!activity_handlers[previous_block.activity]) {
                    console.log("Debrief Question planner doesn't understand the activity that preceded it: "+previous_block.activity);
                } else {
                    current_block = activity_handlers[previous_block.activity](current_block, previous_block);
                }
            }
        }
        function questionComboLadder (debrief_block, previous_block) {
            // todo how the fuck i question the combo ladder;
            return debrief_block;
        }
        function questionSerialReps (debrief_block, previous_block) {
            var question_list = [];
            for (var tech_id in previous_block.techs) {
                var question = {
                    'tech_id' : previous_block.techs[tech_id],
                    'inquiry' : 'rep_duration'
                };
                question_list.push(question);
            }
            debrief_block.question_list = question_list;
            return debrief_block;
        }

        return block_array;
    }
};