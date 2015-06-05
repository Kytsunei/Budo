
// Profile Data

var profile_data = {
    'attention' : {'techs': 4, 'per':'2m'},
    'new_tech_delay' : 250,
    'min_reps' : 3,
    'max_reps' : 25
};

// Session Type

var session_type_library = {
    'striking_sampler' : {
        'name' : "Striking Sampler", 'window' : { 'min' : '30s', 'max' : '8m' }
        // Implement code that adds bias towards Striking Sampler-ish activity choices.
    }, /*
    'combo_buildup' : {
        'name' : "Combo Builder", 'window' : { 'min' : '1m', 'max' : '4m'}
    }, */
    'interval_workout' : {
        'name' :  'Interval Workout', 'window' : { 'min' : '8m', 'max' : '45m'}
        // Implement code that adds bias towards Interval-ish activity choices.
    }
};

// Work/Rest Activities

var work_activity_library = {
    'serial_reps' : {
        'key' : 'serial_reps',
        'techs_needed' : 'full_techs_per_minute'
    },
    'combo_ladder' : {
        'key' : 'combo_ladder',
        'techs_needed' : 'striking_combo'
    }
};
var rest_activity_library = {
    'empty_rest' : {
        'key' : 'empty_rest',
        'techs_needed' : 'none'
    },
    'debrief' : {
        'key' : 'debrief',
        'techs_needed' : 'none'
    }
};

// Techniques

var technique_library = {
    '0' : { 'id': '0', 'name' : 'Jab', 'name_duration' : 3000, 'rep_duration' : 2000 },
    '1' : { 'id': '1', 'name' : 'Cross', 'name_duration' : 3100, 'rep_duration' : 2000 },
    '2' : { 'id': '2', 'name' : 'Hook', 'name_duration' : 3100, 'rep_duration' : 2000  },
    '3' : { 'id': '3', 'name' : 'Uppercut', 'name_duration' : 3250, 'rep_duration' : 2000 },
    '4' : { 'id': '4', 'name' : 'Push Kick', 'name_duration' : 3250, 'rep_duration' : 2000 },
    '5' : { 'id': '5', 'name' : 'Snap Kick', 'name_duration' : 3250, 'rep_duration' : 2000 },
    '6' : { 'id': '6', 'name' : 'Roundhouse Kick', 'name_duration' : 3250, 'rep_duration' : 2000 },
    '7' : { 'id': '7', 'name' : 'Side Kick', 'name_duration' : 3250, 'rep_duration' : 2000 },
    '8' : { 'id': '8', 'name' : 'Elbow', 'name_duration' : 3250, 'rep_duration' : 2000 },
    '9' : { 'id': '9', 'name' : 'Knee', 'name_duration' : 3250, 'rep_duration' : 2000 }
};

var even_tech_odds = (100 / 10);
var tech_odds_index = {
    '0' : even_tech_odds,
    '1' : even_tech_odds,
    '2' : even_tech_odds,
    '3' : even_tech_odds,
    '4' : even_tech_odds,
    '5' : even_tech_odds,
    '6' : even_tech_odds,
    '7' : even_tech_odds,
    '8' : even_tech_odds,
    '9' : even_tech_odds
};

// Combos

var combo_library = {
    '0' : ['1', '1', '2'],
    '1' : ['1', '2', '3', '2'],
    '2' : ['1', '2', '8']
};
var even_combo_odds = (100 / 3);
var combo_odds_index = {
    '0' : even_combo_odds,
    '1' : even_combo_odds,
    '2' : even_combo_odds
};