<?php

//require 'Libraries/PHPMailer/PHPMailerAutoload.php';
include "Libraries/Connect.php";
include "Libraries/Utility.php";

// Updater Calls;

if (isset($_POST['add_art_to_user'])) {
    $art_id = $_POST['art_id'];
    $user_id = $_POST['user_id'];
    addArtToUser($user_id, $art_id);
}
if (isset($_POST['add_equipment_to_user'])) {
    $equipment_id = $_POST['equipment_id'];
    $user_id = $_POST['user_id'];
    addEquipmentToUser($equipment_id, $user_id);
}
if (isset($_POST['add_tech_to_art'])) {
    $tech_id = $_POST['tech_id'];
    $art_id = $_POST['art_id'];
    $user_id = $_POST['user_id'];

    if ($art_id == 'fitness') {
        addFitnessTech($tech_id, $user_id);
    } else {
        addTechToArt($tech_id, $art_id, $user_id);
    }
}
if (isset($_POST['add_combo_to_user'])) {
    $user_id = $_POST['user_id'];
    $combo_id = $_POST['combo_id'];
    addComboToUser($combo_id, $user_id);
}
if (isset($_POST['new_art'])) {
    $new_name = $_POST['art_name'];
    $submitter_id = $_POST['submitter_id'];
    $art_id = setNewArt($new_name, $submitter_id);
    echo $art_id;
}
if (isset($_POST['new_combo'])) {
    $submitter_id = $_POST['submitter_id'];
    $combo_name = $_POST['name'];
    $combo_techs = $_POST['techs'];
    $combo_array = explode('!', $combo_techs);
    $combo_id = createNewCombination($submitter_id, $combo_name, $combo_array);
    addComboToUser($combo_id, $submitter_id);

}
if (isset($_POST['new_equipment'])) {
    $equipment_name = $_POST['equipment_name'];
    $submitter_id = $_POST['submitter_id'];
    $equipment_id = createNewEquipment($equipment_name, $submitter_id);
    addEquipmentToUser($equipment_id, $submitter_id);
}
if (isset($_POST['new_profile'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $pass = $_POST['pass'];
    $user_id = setNewUser($name, $email, $pass);
    echo json_encode(getPrelimDataPackage($user_id));
}
if (isset($_POST['new_technique'])) {
    $art_id = $_POST['art_id'];
    $new_name = $_POST['tech_name'];
    $submitter_id = $_POST['submitter_id'];
    if ($art_id == 'fitness') {
        $return_id = createNewFitnessTech($new_name, $submitter_id);
    } else {
        $return_id = createNewTechnique($new_name, $submitter_id);
        setMyTechnique($submitter_id, $return_id, 'true', $art_id);
    }

    echo $return_id;
}
if (isset($_POST['new_user_new_art'])) {
    $user_id = $_POST['user_id'];
    $name = $_POST['art_name'];
    $art_id = setNewArt($name, $user_id);
    addArtToUser($user_id, $art_id);
    setUserRegistry($user_id, 1);
}
if (isset($_POST['new_user_list_art'])) {
    $user_id = $_POST['user_id'];
    $art_id = $_POST['art_id'];
    addArtToUser($user_id, $art_id);
    setUserRegistry($user_id, 1);
}
if (isset($_POST['new_user_save_techs'])) {
    $user_id = $_POST['user_id'];
    foreach ($_POST as $key => $value) {
        if ($key != 'new_user_save_techs' && $key != 'user_id') {
            setMyTechnique($user_id, $key, $value);
        }
    }
    setUserRegistry($user_id, 2);
}
if (isset($_POST['remove_art_from_user'])) {
    $art_id = $_POST['art_id'];
    $user_id = $_POST['user_id'];
    removeArtFromUser($user_id, $art_id);
}
if (isset($_POST['remove_combo_from_user'])) {
    $user_id = $_POST['user_id'];
    $combo_id = $_POST['combo_id'];
    removeComboFromUser($combo_id, $user_id);
}
if (isset($_POST['remove_equipment_from_user'])) {
    $equipment_id = $_POST['equipment_id'];
    $user_id = $_POST['user_id'];
    removeEquipmentFromUser($equipment_id, $user_id);
}
if (isset($_POST['remove_tech_from_art'])) {
    $tech_id = $_POST['tech_id'];
    $art_id = $_POST['art_id'];
    $user_id = $_POST['user_id'];

    if ($art_id == 'fitness') {
        removeFitnessTech($tech_id, $user_id);
    } else {
        removeTechFromArt($tech_id, $art_id, $user_id);
    }
}
if (isset($_POST['save_profile_settings'])) {
    $profile_id = $_POST['profile_id'];
    $max_work = $_POST['max_work'];
    $work_ratio = $_POST['work_ratio'];
    $rest_ratio = $_POST['rest_ratio'];
    setUserSettings($profile_id, $max_work, $work_ratio, $rest_ratio);
}
if (isset($_POST['save_session'])) {
    $user_id = $_POST['user_id'];
    $session_string = $_POST['session_techs'];
    $tech_array = explode("%", $session_string);
    setSession($user_id, $tech_array);
}
if (isset($_POST['update_art_techs'])) {
    $profile_id = $_POST['profile_id'];
    $art_id = $_POST['art_id'];
    foreach ($_POST as $key => $value) {
        if ($key != 'update_art_techs' && $key != 'profile_id' && $key != 'art_id') {
            $tech_id = $key;
            $included = $value;
            setArtRelation($profile_id, $art_id, $tech_id, $included);
        }
    }
}
if (isset($_POST['update_tech'])) {

    if ($_POST['type'] == 'fitness') {
        updateFitnessTechnique(
            $_POST['updater_id'],
            $_POST['tech_id'],
            $_POST['tech_name'],
            $_POST['req_equip']
        );
    } else if ($_POST['type'] == 'tech') {
        updateTechnique(
            $_POST['updater_id'],
            $_POST['tech_id'],
            $_POST['tech_name'],
            $_POST['req_equip']
        );
    }

}

// Data Getter Calls;

if (isset($_POST['try_login'])) {
    $name = $_POST['name'];
    $pass = $_POST['pass'];
    $version = $_POST['version'];

    $profile_query = "
        SELECT
            users.id as user_id,
            users.user_name,
            user_registry.registration_state
        FROM users
        LEFT JOIN user_registry
        ON users.id = user_registry.id
        WHERE user_name = '$name'
        AND user_pass = '$pass'
        ";
    $profile_results = mysql_query($profile_query) or die (mysql_error());

    if (mysql_num_rows($profile_results) < 1) {
        $name_query = "
            SELECT id
            FROM users
            WHERE user_name = '$name'
            ";
        $name_results = mysql_query($name_query ) or die (mysql_error());

        if (mysql_num_rows($name_results) < 1) {
            echo "name_not_found";
        } else {
            echo "password_incorrect";
        }
    }
    else {
        while ($row = mysql_fetch_array($profile_results)) {
            setLastLogin($row['user_id'], $version);
            echo $row['user_id']."|".$row['user_name']."|".$row['registration_state'];
        }
    }
}
if (isset($_POST['post_recovery'])) {
    $email = $_POST['email'];
    sendRecoveryEmail($email);
}
if (isset($_POST['get_profile_data'])) {
    echo json_encode(getDataPackage($_POST['profile_id']));
}
if (isset($_POST['get_prelim_data'])) {
    echo json_encode(getPrelimDataPackage($_POST['user_id']));
}
if (isset($_POST['get_session_history'])) {
    $user_id = $_POST['user_id'];
    $history = getSessionHistory($user_id);
    echo json_encode($history);
}

// Getters;

// Top-Getters;
function getPrelimDataPackage ($user_id) {

    $art_list = [];
    $art_query = "
        SELECT
        id as art_id,
        art_name
        FROM arts
        ORDER BY art_name ASC
        ";
    $sql_result = mysql_query($art_query) or die (mysql_error());
    while ($row = mysql_fetch_array($sql_result)) {
        $art_id = $row['art_id'];
        $art_list[$art_id]['art_id'] = $art_id;
        $art_list[$art_id]['art_name'] = $row['art_name'];
    }

    $tech_list = [];
    $tech_query = "
        SELECT
        id as tech_id,
        tech_name
        FROM techs
        ORDER BY tech_name ASC
        ";
    $sql_result = mysql_query($tech_query) or die (mysql_error());
    while ($row = mysql_fetch_array($sql_result)) {
        $tech_list[] = [
            'tech_id' => $row['tech_id'],
            'tech_name' => $row['tech_name']
        ];
    }

    $data = [
        'user_data' => [
            'user_id' => $user_id
        ],
        'tech_list' => $tech_list,
        'art_list' => $art_list
    ];

    return $data;
}
function getDataPackage ($user_id) {
    $name = $email = $max_work = $work_ratio = $rest_ratio = null;
    $available_equipment = [];
    $user_info_query = "
        SELECT
            id as profile_id,
            user_name,
            user_email,
            max_work,
            work_ratio,
            rest_ratio
        FROM users
        WHERE id = '$user_id'
        ";
    $user_sql = mysql_query($user_info_query) or die (mysql_error());
    while ($row = mysql_fetch_array($user_sql)) {
        $name = $row['user_name'];
        $email = $row['user_email'];
        $max_work = $row['max_work'];
        $work_ratio = $row['work_ratio'];
        $rest_ratio = $row['rest_ratio'];
    }
    $equipment_query = "
        SELECT equipment_id
        FROM user_equipment
        WHERE user_id = '$user_id'
        ";
    $equipment_sql = mysql_query($equipment_query) or die (mysql_error());
    while ($row = mysql_fetch_array($equipment_sql)) {
        $available_equipment[] = $row['equipment_id'];
    }
    $data = [
        'user_data' => [
            'user_id' => $user_id,
            'user_name' => $name,
            'profile_email' => $email,
            'max_work' => $max_work,
            'work_ratio' => $work_ratio,
            'rest_ratio' => $rest_ratio,
            'available_equipment' => $available_equipment
        ],
        'art_list' => getArtIndex(),
        'combo_index' => getComboIndex(),
        'tech_list' => getTechIndex(),
        'fitness_index' => getFitnessIndex(),
        'equipment_index' => getEquipmentIndex(),
        'user_tech_library' => getUserTechLibrary($user_id)
    ];
    return $data;
}
// Sub-Getters;
function getArtIndex () {
    $art_list = [];
    $art_query = "
        SELECT
            arts.id as art_id,
            arts.art_name,
            art_relations.tech_id
        FROM arts
        LEFT JOIN art_relations
        ON arts.id = art_relations.art_id
        ORDER BY arts.art_name ASC
        ";
    $sql_result = mysql_query($art_query) or die (mysql_error());
    while ($row = mysql_fetch_array($sql_result)) {
        $art_id = $row['art_id'];
        $art_list[$art_id]['art_id'] = $art_id;
        $art_list[$art_id]['art_name'] = $row['art_name'];

        if (!isset($art_list[$art_id]['art_techs']) ||  $art_list[$art_id]['art_techs'] == null) {
            $art_list[$art_id]['art_techs'] = [$row['tech_id']];
        } else {
            $art_list[$art_id]['art_techs'][] = $row['tech_id'];
        }
    }
    return $art_list;
}
function getComboIndex () {
    $combo_index = [];
    $combo_query = "
        SELECT
            c.id as combination_id,
            c.combo_name,
            (SELECT COUNT(id) FROM combo_techs WHERE combo_techs.combo_id = c.id) as tech_count,
            ct.tech_id,
            ct.tech_type
        FROM combinations c
        JOIN combo_techs ct
        ON ct.combo_id = c.id
        ORDER BY c.combo_name ASC;
        ";
    $sql_result = mysql_query($combo_query) or die (mysql_error());
    while ($row = mysql_fetch_array($sql_result)) {
        $combo_id = $row['combination_id'];
        if (!isset($combo_index[$combo_id])) {
            $combo_index[$combo_id] = [
                'combo_id' => $combo_id,
                'combo_name' => $row['combo_name'],
                'tech_count' => $row['tech_count'],
                'techs' => [$row['tech_id']],
                'types' => [$row['tech_type']]
            ];
        } else {
            $combo_index[$combo_id]['techs'][] = $row['tech_id'];
            $combo_index[$combo_id]['types'][] = $row['tech_type'];
        }
    }
    return $combo_index;
}
function getEquipmentIndex () {
    $equipment_index = [];
    $query = "
        SELECT
        id as equipment_id,
        name as equipment_name
        FROM equipment
        ";
    $sql = mysql_query($query) or die (mysql_error());
    while ($row = mysql_fetch_array($sql)) {
        $equipment_id = $row['equipment_id'];
        $equipment_index[$equipment_id] = [
            'equipment_id' => $equipment_id,
            'equipment_name' => $row['equipment_name']
        ];
    }
    return $equipment_index;
}
function getFitnessIndex () {
    $fitness_index = [];
    $query = "
        SELECT
        id as fitness_id,
        name as fitness_name,
        equipment_required
        FROM fitness_techs
        ";
    $sql = mysql_query($query) or die (mysql_error());
    while ($row = mysql_fetch_array($sql)) {
        $fitness_id = $row['fitness_id'];
        $fitness_index[$fitness_id] = [
            'fitness_id' => $fitness_id,
            'fitness_name' => $row['fitness_name'],
            'equipment_required' => $row['equipment_required']
        ];
    }
    return $fitness_index;
}
function getSessionHistory ($user_id) {

    // Sub-functions;
    function getSessionIndex ($session_array, $id) {
        foreach ($session_array as $key => $value) {
            if ($session_array[$key]['session_id'] == $id) {
                return $key;
            }
        }
        return "error";
    }
    $session_list_array = [];
    $history_query = "
        SELECT
          id as session_id,
          session_date
        FROM sessions
        WHERE user_id = '$user_id'
        ORDER BY session_date DESC
        ";
    $sql_result = mysql_query($history_query) or die(mysql_error());
    while ($row = mysql_fetch_array($sql_result)) {
        $session = [
            'session_id' => $row['session_id'],
            'session_date' => $row['session_date'],
            'techs' => []
        ];
        $session_list_array[] = $session;
    }
    $rep_list_array = [];
    $tech_query = "
        SELECT
          st.id as session_block_id,
          s.id as session_id,
          st.tech_id,
          st.rep_count,
          t.tech_name,
          st.in_activity
        FROM session_techs st
        JOIN sessions s
        ON s.id = st.session_id
        JOIN techs t
        ON t.id = st.tech_id
        WHERE s.user_id = '$user_id'
        ";
    $sql_result = mysql_query($tech_query) or die(mysql_error());
    while ($row = mysql_fetch_array($sql_result)) {
        $session_index = getSessionIndex($session_list_array, $row['session_id']);
        $tech = [
            'tech_id' => $row['tech_id'],
            'tech_name' => $row['tech_name'],
            'rep_count' => $row['rep_count'],
            'in_activity' => $row['in_activity']
        ];
        if (isset($rep_list_array[$row['tech_name']])) {
            $rep_list_array[$row['tech_name']] += $row['rep_count'];
        } else {
            $rep_list_array[$row['tech_name']] = $row['rep_count'];
        }
        $session_list_array[$session_index]['techs'][] = $tech;
    }
    $history = [
        'session_list' => $session_list_array,
        'tech_rep_list' => $rep_list_array
    ];
    return $history;
}
function getTechIndex() {
    $tech_list = [];
    $tech_query = "
        SELECT
            techs.id as tech_id,
            techs.tech_name as tech_name,
            techs.equipment_required
        FROM techs
        ";
    $sql_result = mysql_query($tech_query) or die (mysql_error());
    while ($row = mysql_fetch_array($sql_result)) {
        $tech_list[$row['tech_id']] = [
            'tech_id' => $row['tech_id'],
            'tech_name' => $row['tech_name'],
            'equipment_required' => $row['equipment_required']
        ];
    }
    return $tech_list;
}
function getUserTechLibrary ($user_id) {

    $known_art_list = [];
    $known_tech_list = [];
    $library_array = [];
    $combo_array = [];
    $suggestion_array = [];

    $query = "
        SELECT
        ua.art_id
        FROM user_arts ua
        WHERE ua.user_id = '$user_id'
        ";
    $sql = mysql_query($query);
    while ($row = mysql_fetch_array($sql)) {
        $known_art_list[] = $row['art_id'];
    }

    $query = "
        SELECT
          t.id AS tech_id,
          a.id AS art_id,
          (SELECT count(bk_ua.user_id) FROM user_arts bk_ua JOIN arts bk_a ON bk_ua.art_id = bk_a.id WHERE bk_ua.art_id = a.id) AS budoka_count,
          (SELECT count(bk_ut.user_id) FROM user_techs bk_ut JOIN arts bk_a ON bk_ut.art_id = bk_a.id WHERE bk_ut.art_id = a.id AND bk_ut.tech_id = t.id AND bk_ut.is_known = 1 ) AS budoka_with_tech,
          (CASE WHEN (SELECT user_techs.is_known FROM user_techs WHERE user_techs.tech_id = t.id AND user_techs.art_id = a.id AND user_techs.user_id = '$user_id') = 1 THEN 'known'
           ELSE (CASE WHEN (SELECT art_relations.relevance FROM art_relations WHERE art_relations.tech_id = t.id AND art_relations.art_id = a.id ) > 1 THEN 'suggested' ELSE 'unrelated' END) END) AS relation,
          ar.relevance
        FROM techs t
          JOIN arts a
          LEFT JOIN art_relations ar
          ON ar.art_id = a.id AND ar.tech_id = t.id
        WHERE a.id IN (SELECT u_a.art_id FROM user_arts u_a WHERE u_a.user_id = '$user_id')
        ORDER BY t.tech_name;
    ";
    $sql = mysql_query($query) or die (mysql_error());
    if ($sql == true) {
        while ($row = mysql_fetch_array($sql)) {
            $tech_id = $row['tech_id'];
            $art_id = $row['art_id'];
            $relation = $row['relation'];
            $relevance = $row['relevance'];

            if (!isset($library_array[$art_id])) {
                $library_array[$art_id] = [
                    'known_array' => [],
                    'suggested_array' => [],
                    'unrelated_array' => []
                ];
            }
            if ($relation == 'known') {
                $known_tech_list[] = $tech_id;
                $library_array[$art_id]['known_array'][$tech_id] = $tech_id;
            } else if ($relation == 'suggested') {
                $library_array[$art_id]['suggested_array'][$tech_id] = $relevance;
            } else {
                $library_array[$art_id]['unrelated_array'][$tech_id] = $tech_id;
            }
        }
    }

    $fitness_query = "
        SELECT
            ft.id as fitness_id,
            ft.name as fitness_name,
            (CASE uf.is_known WHEN '1' THEN 'known' ELSE 'unrelated' END) as relation
        FROM fitness_techs ft
        LEFT JOIN user_fitness uf
        ON ft.id = uf.fitness_id AND uf.user_id = '$user_id'
        ";
    $sql = mysql_query($fitness_query) or die (mysql_error());
    if (!isset($library_array['fitness'])) {
        $library_array['fitness'] = [
            'known_array' => [],
            'suggested_array' => [],
            'unrelated_array' => []
        ];
    }
    while ($row = mysql_fetch_array($sql)) {
        $fitness_id = $row['fitness_id'];
        $relation = $row['relation'];
        if ($relation == 'known') {
            $library_array['fitness']['known_array'][$fitness_id] = $fitness_id;
        } else if ($relation == 'suggested') {
            $library_array['fitness']['suggested_array'][$fitness_id] = $fitness_id;
        } else {
            $library_array['fitness']['unrelated_array'][$fitness_id] = $fitness_id;
        }
    }

    $combo_query = "
        SELECT
            c.id as combo_id,
            (CASE uc.is_known WHEN '1' THEN 'known' ELSE 'unrelated' END) as relation
        FROM combinations c
        LEFT JOIN user_combos uc
        ON c.id = uc.combo_id AND uc.user_id = '$user_id'
        ";
    $sql = mysql_query($combo_query) or die (mysql_error());
    $combo_array = [
        'known_array' => [],
        'suggested_array' => [],
        'unrelated_array' => []
    ];
    while ($row = mysql_fetch_array($sql)) {
        $combo_id = $row['combo_id'];
        $relation = $row['relation'];
        if ($relation == 'known') {
           $combo_array['known_array'][$combo_id] = $combo_id;
        } else if ($relation == 'suggested') {
            $combo_array['suggested_array'][$combo_id] = $combo_id;
        } else {
            $combo_array['unrelated_array'][$combo_id] = $combo_id;
        }
    }

    $data = [
        'known_arts_list' => $known_art_list,
        'known_tech_list' => $known_tech_list,
        'user_library' => $library_array,
        'suggestion_array' => $suggestion_array,
        'combo_array' => $combo_array
    ];
    return $data;
}

// Adders;
function addArtToUser ($user_id, $art_id) {
    $query = "
        INSERT INTO user_arts
        (user_id,
        art_id)
        VALUES
        ('$user_id',
        '$art_id');
        ";
    mysql_query($query) or die (mysql_error());
    $query = "
        UPDATE user_techs ut
        SET ut.is_known = 1
        WHERE ut.user_id = '$user_id'
        AND ut.art_id = '$art_id'
        AND ut.is_known = 2
        ";
    mysql_query($query) or die (mysql_error());
    echo "successfully added";
}
function addComboToUser ($combo_id, $user_id) {
    $existing_entry_query = "
        SELECT user_combos.id
        FROM user_combos
        WHERE user_combos.combo_id = '$combo_id'
        AND user_combos.user_id = '$user_id'
        ";
    $sql_result = mysql_query($existing_entry_query) or die (mysql_error());
    if (mysql_num_rows($sql_result) == 0) {
        $query = "
            INSERT INTO user_combos
            SET user_combos.user_id = '$user_id',
            user_combos.combo_id = '$combo_id',
            user_combos.is_known = 1
            ";
    } else {
        $query = "
            UPDATE user_combos
            SET user_combos.is_known = 1
            WHERE user_combos.user_id = '$user_id'
            AND user_combos.combo_id = '$combo_id'
            ";
    }
    mysql_query($query) or die (mysql_error());
}
function addEquipmentToUser ($equipment_id, $user_id) {
    $query = "
        INSERT INTO user_equipment
        SET user_equipment.user_id = '$user_id',
        user_equipment.equipment_id = '$equipment_id'
        ";
    mysql_query($query) or die (mysql_error());
    echo 'insert success '.mysql_insert_id();
}
function addFitnessTech ($fitness_id, $user_id) {
    $existing_entry_query = "
        SELECT uf.id
        FROM user_fitness uf
        WHERE uf.fitness_id= '$fitness_id'
        AND uf.user_id = '$user_id'
        ";
    $sql_result = mysql_query($existing_entry_query) or die (mysql_error());
    if (mysql_num_rows($sql_result) == 0) {
        $query = "
            INSERT INTO user_fitness
            SET user_fitness.user_id = '$user_id',
            user_fitness.fitness_id = '$fitness_id',
            user_fitness.is_known = 1
            ";
    } else {
        $query = "
            UPDATE user_fitness
            SET user_fitness.is_known = 1
            WHERE user_fitness.user_id = '$user_id'
            AND user_fitness.fitness_id = '$fitness_id'
            ";
    }
    mysql_query($query) or die (mysql_error());
}
function addTechToArt ($tech_id, $art_id, $user_id) {
    $existing_entry_query = "
        SELECT user_techs.id
        FROM user_techs
        WHERE user_techs.tech_id = '$tech_id'
        AND user_techs.art_id = '$art_id'
        AND user_techs.user_id = '$user_id'
        ";
    $sql_result = mysql_query($existing_entry_query) or die (mysql_error());
    if (mysql_num_rows($sql_result) == 0) {
        $query = "
            INSERT INTO user_techs
            SET user_techs.user_id = '$user_id',
            user_techs.tech_id = '$tech_id',
            user_techs.art_id = '$art_id',
            user_techs.is_known = 1
            ";
    } else {
        $query = "
            UPDATE user_techs
            SET user_techs.is_known = 1
            WHERE user_techs.user_id = '$user_id'
            AND user_techs.art_id = '$art_id'
            AND user_techs.tech_id = '$tech_id'
            ";
    }
    mysql_query($query) or die (mysql_error());
    updateTechRelevance($tech_id, $art_id);
}
// Creators;
function createNewCombination ($submitter_id, $combo_name, $combo_techs) {

    $combo_insert_query = "
        INSERT INTO
        combinations
        SET
        combo_name = '$combo_name',
        submitter_id = '$submitter_id'
        ";
    mysql_query($combo_insert_query) or die (mysql_error());
    $combo_id = mysql_insert_id();

    $insert_string = "";
    var_dump($combo_techs);
    foreach ($combo_techs as $position => $value) {
        if ($position != 0) {
            $insert_string .= ", (";
        } else {
            $insert_string .= "(";
        }
        $insert_string .= "'".$combo_id."', ";
        $insert_string .= "'".$position."', ";

        $tech_array = explode('-', $value);
        $insert_string .= "'".$tech_array[0]."', ";
        $insert_string .= "'".$tech_array[1]."'";

        $insert_string .= ")";
    }
    $combo_tech_insert_query = "
        INSERT INTO combo_techs
        (combo_techs.combo_id,
        combo_techs.position,
        combo_techs.tech_type,
        combo_techs.tech_id)
        VALUES {$insert_string}
        ";
    mysql_query($combo_tech_insert_query) or die (mysql_error());
    return $combo_id;
}
function createNewEquipment ($equipment_name, $submitter_id) {
    $query = "
        INSERT INTO equipment
        SET equipment.submitter_id = '$submitter_id',
        equipment.name = '$equipment_name'
        ";
    mysql_query($query) or die (mysql_error());
    return mysql_insert_id();
}
function createNewFitnessTech ($fitness_name, $user_id) {
    $insert_query = "
        INSERT INTO fitness_techs
        SET
        name = '$fitness_name',
        submitter_id = '$user_id'
        ";
    mysql_query($insert_query) or die (mysql_error());
    $fitness_id = mysql_insert_id();
    $user_fitness_query = "
        INSERT INTO user_fitness
        SET
        fitness_id = '$fitness_id',
        is_known = '1',
        user_id = '$user_id'
        ";
    mysql_query($user_fitness_query) or die (mysql_error());
    return $fitness_id;
}
function createNewTechnique ($new_name, $submitter_id) {
    $insert_query = "
        INSERT INTO techs
        SET
        tech_name = '$new_name',
        submitter_id = '$submitter_id'
        ";
    mysql_query($insert_query) or die (mysql_error());
    $tech_id = mysql_insert_id();

    $insert_into_relations = "
        INSERT INTO art_relations
        (art_relations.tech_id,
        art_relations.art_id)
        (SELECT DISTINCT
        '$tech_id',
        arts.id FROM arts)
        ";
    mysql_query($insert_into_relations) or die (mysql_error());

    return $tech_id;
}
// Removers;
function removeArtFromUser ($user_id, $art_id) {
    $query = "
        DELETE FROM user_arts
        WHERE user_id = '$user_id'
        AND art_id = '$art_id'
        ";
    mysql_query($query) or die (mysql_error());
    $query = "
        UPDATE user_techs ut
        SET ut.is_known = 2
        WHERE ut.user_id = '$user_id'
        AND ut.art_id = '$art_id'
        ";
    mysql_query($query) or die (mysql_error());
}
function removeComboFromUser ($combo_id, $user_id) {
    $query = "
        UPDATE user_combos
        SET user_combos.is_known = 0
        WHERE user_combos.user_id = '$user_id'
        AND user_combos.combo_id = '$combo_id'
        ";
    mysql_query($query) or die (mysql_error());
}
function removeEquipmentFromUser ($equipment_id, $user_id) {
    $query = "
        DELETE FROM user_equipment ue
        WHERE ue.user_id = '$user_id'
        AND ue.equipment_id = '$equipment_id'
        ";
    mysql_query($query) or die (mysql_error());
}
function removeFitnessTech ($fitness_id, $user_id) {
    $query = "
        UPDATE user_fitness
        SET user_fitness.is_known = 0
        WHERE user_fitness.user_id = '$user_id'
        AND user_fitness.fitness_id = '$fitness_id'
        ";
    mysql_query($query) or die (mysql_error());
}
function removeTechFromArt ($tech_id, $art_id, $user_id) {
    $query = "
        UPDATE user_techs
        SET is_known = 0
        WHERE user_id = '$user_id'
        AND art_id = '$art_id'
        AND tech_id = '$tech_id'
        ";
    mysql_query($query) or die (mysql_error());
    updateTechRelevance($tech_id, $art_id);
}
// Setters;
function setArtRelation ($updater_id, $art_id, $tech_id, $is_included) {
    switch ($is_included) {
        case ('true') :
            $query = "
                INSERT INTO art_relations
                SET updater_id = '$updater_id',
                art_id = '$art_id',
                tech_id = '$tech_id'
                ";
            break;
        default :
            $query = "
                DELETE FROM art_relations
                WHERE art_id = '$art_id'
                AND tech_id = '$tech_id'
                ";
            break;
    }
    mysql_query($query) or die (mysql_error());
    echo "Art Update Success!";
}
function setLastLogin ($user_id, $version) {
    $query = "
        UPDATE users
        SET last_login = now(),
        last_version = '$version'
        WHERE id = '$user_id'
        ";
    mysql_query($query) or die (mysql_error());
}
function setMyTechnique ($user_id, $tech_id, $is_known, $art_id) {

    $is_known = ($is_known == 'true') ? 1 : 0;

    $existing_entry_query = "
        SELECT id
        FROM user_techs
        WHERE user_techs.tech_id = '$tech_id'
        AND user_id = '$user_id'
        ";
    $sql_result = mysql_query($existing_entry_query) or die (mysql_error());
    if (mysql_num_rows($sql_result) == 0) {
        $query = "
            INSERT INTO user_techs
            SET user_techs.user_id = '$user_id',
            user_techs.tech_id = '$tech_id',
            user_techs.is_known = '$is_known',
            user_techs.art_id = '$art_id'
            ";
    } else {
        $query = "
            UPDATE user_techs
            SET user_techs.is_known = '$is_known'
            WHERE user_techs.user_id = '$user_id'
            AND user_techs.tech_id = '$tech_id'
            AND user_techs.art_id = '$art_id'
            ";
    }
    mysql_query($query) or die (mysql_error());
}
function setNewArt ($new_name, $submitter_id) {
    $query = "
        INSERT INTO arts
        SET submitter_id = '$submitter_id',
        arts.art_name = '$new_name'
        ";
    mysql_query($query) or die (mysql_error());
    return mysql_insert_id();
}
function setNewUser ($name, $email, $pass) {
    $user_query = "
        INSERT INTO users
        SET user_name = '$name',
        user_email = '$email',
        user_pass = '$pass';
        ";
    mysql_query($user_query) or die (mysql_error());
    $insert_id = mysql_insert_id();

    $registry_query = "
        INSERT INTO user_registry
        SET id = '$insert_id',
        registration_state = 0
        ";
    mysql_query($registry_query) or die (mysql_error());

    return $insert_id;
}
function setSession ($user_id, $tech_array) {
    $save_query = "
        INSERT INTO sessions
        set
        user_id = '$user_id',
        session_date = now()
        ";
    mysql_query($save_query) or die (mysql_error());
    $session_id = mysql_insert_id();

    $insert_array = [];
    for ($i = 0; $i < count($tech_array); $i ++) {
        $tech_string = $tech_array[$i];
        $tech = explode(";", $tech_string);
        $position = $tech[0];
        $tech_id = $tech[1];
        $rep_count = $tech[2];
        $activity = $tech[3];
        $insert_array[] = "(".$session_id.", ".$tech_id.", ".$rep_count.", '".$activity."', ".$position.")";
    }
    $insert_string = implode(",", $insert_array);
    $query = "
      INSERT INTO session_techs
        (session_id,
        tech_id,
        rep_count,
        in_activity,
        position)
      VALUES $insert_string";
    print($query);
    mysql_query($query) or die (mysql_error());

    echo "Session Saved.";
}
function setUserRegistry ($user_id, $registry_state) {
    $user_query = "
        UPDATE user_registry
        SET registration_state = '$registry_state'
        WHERE id = '$user_id'
        ";
    mysql_query($user_query) or die (mysql_error());
}
function setUserSettings ($user_id, $max_work, $work_ratio, $rest_ratio) {
    $query = "
        UPDATE users
        SET max_work = '$max_work',
        work_ratio = '$work_ratio',
        rest_ratio = '$rest_ratio'
        WHERE id = '$user_id'
        ";
    mysql_query($query) or die (mysql_error());
    echo "Save Profile Settings Success.";

}
// Updaters;
function updateFitnessTechnique ($updater_id, $tech_id, $name, $req_equip) {
    $query = "
        UPDATE fitness_techs
        SET updater_id = '$updater_id',
        name = '$name',
        equipment_required = '$req_equip'
        WHERE id = '$tech_id'
        ";
    mysql_query($query) or die (mysql_error());
}
function updateTechnique ($updater_id, $tech_id, $name, $req_equip) {
    $query = "
        UPDATE techs
        SET updater_id = '$updater_id',
        tech_name = '$name',
        equipment_required = '$req_equip'
        WHERE id = '$tech_id'
        ";
    mysql_query($query) or die (mysql_error());
}

// Other;

function sendRecoveryEmail ($email) {

    // todo rebuild to make use of the phpmailer functionality;

    $name = null;
    $query = "
        SELECT
            user_name,
            user_email
        FROM users
        WHERE user_email = '$email'
        ";
    print $query;
    $sql = mysql_query($query) or die (mysql_error());
    while ($row = mysql_fetch_array($sql)) {
        $name = $row['user_name'];
        $email = $row['email'];
    }
    $email_body = "
        <html>
        <body>
            <p>Aw, dude! You forgot your login info.</p>
        </body>
        </html>
        ";

    // Always set content-type when sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    // More headers
    //$headers .= 'From: <webmaster@example.com>' . "\r\n";
    //$headers .= 'Cc: myboss@example.com' . "\r\n";

    //mail($email, "Budo Account Recovery", $email_body, $headers);
}
function calculateRelevance () {

    $budoka_array = [];
    $tech_array = [];
    $query = "
        SELECT
        arts.id as art_id,
        (SELECT count(user_id) FROM user_arts WHERE user_arts.art_id = arts.id) as budoka_count
        FROM arts
        ";
    $sql = mysql_query($query);
    while ($row = mysql_fetch_array($sql)) {
        $budoka_array[$row['art_id']] = $row['budoka_count'];
    }
    $query = "
        SELECT
            tech_id,
            art_id,
            COUNT(*) as budoka_agreed
        FROM user_techs
        WHERE is_known = 1
        GROUP BY tech_id, art_id
        ";
    $sql = mysql_query($query);
    while ($row = mysql_fetch_array($sql)) {
        $tech_array[] = [
            'tech_id' => $row['tech_id'],
            'art_id' => $row['art_id'],
            'budoka_count' => $budoka_array[$row['art_id']],
            'budoka_agreed' => $row['budoka_agreed']
        ];
    }
    foreach ($tech_array as $index => $tech_art_pair) {
        $relevance = ($tech_art_pair['budoka_agreed'] / $tech_art_pair['budoka_count']) * 100;
        $tech_array[$index]['relevance'] = $relevance;
    }
}
function updateTechRelevance ($tech_id, $art_id) {
    $relation_id = null;
    $existing_relation = null;
    $check_query = "
        SELECT id as relation_id
        FROM art_relations
        WHERE tech_id = '$tech_id' AND art_id = '$art_id'
        ";
    $sql = mysql_query($check_query) or die (mysql_error());
    if (mysql_num_rows($sql) == 0) {
        $existing_relation = false;
    } else {
        $existing_relation = true;
        while ($row = mysql_fetch_array($sql)) {
            $relation_id = $row['relation_id'];
        }
    }
    if ($existing_relation == true) {
        $update_query = "
            UPDATE art_relations  SET art_relations.relevance = (
                ((SELECT count(id) FROM user_techs WHERE user_techs.art_id = '$art_id' AND user_techs.tech_id = '$tech_id' AND user_techs.is_known = 1)
                / (SELECT count(id) FROM user_arts WHERE user_arts.art_id = '$art_id'))
                * 100
            )
            WHERE art_relations.id = '$relation_id'
            ";
        mysql_query($update_query) or die (mysql_error());
    } else {
        $update_query = "
            INSERT INTO art_relations
            (art_id, tech_id, relevance)
            VALUES ('$art_id', '$tech_id', (
                ((SELECT count(id) FROM user_techs WHERE user_techs.art_id = '$art_id' AND user_techs.tech_id = '$tech_id' AND user_techs.is_known = 1)
                / (SELECT count(id) FROM user_arts WHERE user_arts.art_id = '$art_id'))
                * 100
            ))
            ";
        mysql_query($update_query) or die (mysql_error());
    }
}