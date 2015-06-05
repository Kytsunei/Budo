<?php

include "Libraries/Connect.php";
include "Server.php";

print "<pre>";

/*
$query = "
    SELECT
        a.id as art_id,
        count(ua.user_id) as budoka_count
    FROM user_arts ua
    JOIN arts a ON ua.art_id = a.id
    GROUP BY (a.art_name)
    ";
$sql = mysql_query($query);
$art_budoka = [];
$art_tech_array = [];

while ($row = mysql_fetch_array($sql)) {
    $art_budoka[$row['art_id']] = $row['budoka_count'];
    $art_tech_array[$row['art_id']] = [];
}
*/
calculateRelevance();




print "</pre>";
?>
<html>
<head>
    <title></title>
    <style>
        input {
            margin:3px;
        }
    </style>
    <script src="Libraries/Utility.js"></script>
    <script src="Tengu/Oni.js"></script>
    <script>
        var oni = new OniObject();
    </script>
</head>
<body>
<div id="session_clock_div"></div>
<input type="button" value="START" onclick="oni.startSession()"><br/>
<input type="button" value="PAUSE" onclick="oni.pauseSessionTime()"><br/>
<input type="button" value="RESUME" onclick="oni.resumeSessionTime()"><br/>
<input type="button" value="RESET" onclick="oni.resetSessionTime()">
</body>
</html>