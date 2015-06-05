var ScheduleObject = function () {
    // Object Properties;
    this.type = undefined;
    this.blocks = undefined;
};
var ScheduleBlock = function (type, length) {
    // Object Properties;
    this.type = type;
    this.length = length;
    this.activity = undefined;
    this.techs = undefined;
    this.question_list = undefined;
    this.reps = [];
};
var ScriptObject = function () {
    // Object Properties;
    this.script_items = [];
    this.script_clock = undefined;
};
var ScriptItemObject = function (text, interval, time_stamp, rep) {
    // Object Properties;
    this.text = text;
    this.interval = interval;
    this.time_stamp = time_stamp;
    this.rep_number = rep;
};

var DataPackage = function () {

    var pack = this;
    this.user = new UserObject ();
    this.art_index = {};
    this.combo_index = {};
    this.tech_index = {};
    this.fitness_index = {};
    this.equipment_index = {};

    this.unpackData = function (ajax_data) {
        var json = JSON.parse(ajax_data);

        // Load User Data;
        pack.user.loadUser(json['user_data']);

        if (json['user_tech_library']) {
            pack.user.loadTechLibrary(json['user_tech_library']);
        }

        // Load Art Index;
        for (var art_id in json['art_list']) {
            var art_json = json['art_list'][art_id];
            pack.art_index[art_id] = new ArtObject();
            pack.art_index[art_id].loadArt(art_json);
        }

        // Load Tech Index;
        for (var tech_id in json['tech_list']) {
            var tech_json = json['tech_list'][tech_id];
            pack.tech_index[tech_id] = new TechObject();
            pack.tech_index[tech_id].loadTech(tech_json);
        }

        // Load Fitness Index;
        for (var fitness_id in json['fitness_index']) {
            var fitness_json = json['fitness_index'][fitness_id];
            pack.fitness_index[fitness_id] = new FitnessObject();
            pack.fitness_index[fitness_id].loadFitness(fitness_json);
        }

        // Load Equipment Index;
        for (var equipment_id in json['equipment_index']) {
            var equipment_json = json['equipment_index'][equipment_id];
            pack.equipment_index[equipment_id] = new EquipmentObject();
            pack.equipment_index[equipment_id].loadFitness(equipment_json);
        }

        // Load Combo Index;
        for (var combo_id in json['combo_index']) {
            var combo_json = json['combo_index'][combo_id];
            pack.combo_index[combo_id] = new ComboObject();
            pack.combo_index[combo_id].loadCombo(combo_json);
        }

        console.log('Finished Unpacking Data:');
        console.log(pack);
    }
};
var UserTechLibrary = function () {

    var library = this;
    this.combo_array = [];
    this.known_arts_list = [];
    this.known_tech_list = [];
    this.relation_array = [];

    this.loadTechLibrary = function (library_data) {
        library.known_arts_list = library_data['known_arts_list'];
        library.known_tech_list = library_data['known_tech_list'];
        library.relation_array = library_data['user_library'];
        library.combo_array = library_data['combo_array'];
    };
};

var ArtObject = function () {

    var art = this;
    this.art_id = undefined;
    this.art_name = undefined;

    this.loadArt = function (art_json) {
        art.art_id = art_json['art_id'];
        art.art_name = art_json['art_name'];
    };
};
var ComboObject = function () {

    var combo = this;
    this.combo_id = undefined;
    this.combo_name = undefined;
    this.tech_count = undefined;
    this.tech_list = undefined;
    this.type_list = undefined;

    this.loadCombo = function (combo_data) {
        combo.combo_id = combo_data['combo_id'];
        combo.combo_name = combo_data['combo_name'];
        combo.tech_count = combo_data['tech_count'];
        combo.tech_list = combo_data['techs'];
        combo.type_list = combo_data['types'];
    };
};
var EquipmentObject = function () {

    var equipment = this;
    this.equipment_id = undefined;
    this.equipment_name = undefined;

    this.loadFitness = function (equipment_data) {
        equipment.equipment_id = equipment_data['equipment_id'];
        equipment.equipment_name = equipment_data['equipment_name'];
    };
};
var FitnessObject = function () {

    var fitness = this;
    this.fitness_id = undefined;
    this.fitness_name = undefined;
    this.equipment_required = undefined;

    this.loadFitness = function (fitness_data) {
        fitness.fitness_id = fitness_data['fitness_id'];
        fitness.fitness_name = fitness_data['fitness_name'];
        fitness.equipment_required = fitness_data['equipment_required'];
    };
};
var TechObject = function () {

    var tech = this;
    this.tech_id = undefined;
    this.tech_name = undefined;
    this.equipment_required = undefined;
    this.name_duration = 1000;
    this.rep_duration = 800;

    this.loadTech = function (tech_data) {
        tech.tech_id = tech_data['tech_id'];
        tech.tech_name = tech_data['tech_name'];
        tech.equipment_required = tech_data['equipment_required'];
    };
};
var UserObject = function () {

    var user = this;

    this.user_id = undefined;
    this.user_name = undefined;
    this.max_work = undefined;
    this.work_ratio = undefined;
    this.rest_ratio = undefined;

    this.tech_library = new UserTechLibrary();

    this.loadUser = function (user_data) {
        user.user_id = (user_data['user_id']) ? user_data['user_id'] : undefined;
        user.user_name = (user_data['user_name']) ? user_data['user_name'] : undefined;
        user.max_work = (user_data['max_work']) ? user_data['max_work'] : undefined;
        user.work_ratio = (user_data['work_ratio']) ? user_data['work_ratio'] : undefined;
        user.rest_ratio = (user_data['rest_ratio']) ? user_data['rest_ratio'] : undefined;
        user.available_equipment = (user_data['available_equipment']) ? user_data['available_equipment'] : undefined;
    };
    this.loadTechLibrary = function (library_data) {
        user.tech_library.loadTechLibrary(library_data);
    };
};
