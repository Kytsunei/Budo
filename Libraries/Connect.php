<?php

error_reporting(E_ALL & ~E_DEPRECATED);

//$db_name = 'mushinx';
$db_name = '1870000_budo';
$db_host = "localhost";
$db_username = "root";
$db_pass = "";

mysql_connect("$db_host", "$db_username", "$db_pass");
mysql_select_db("$db_name");