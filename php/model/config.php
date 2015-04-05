<?php
require_once(__DIR__ . "/database.php");
//keeps the sessions id constant when you are logged in.
session_start();
//everytime the session start is called uponed its gonna regenerate the id
//its foing to create a new session with a new id and delete the old session
//prevents highjackers
session_regenerate_id(true);

$path = '/KeniceWawesomenauts/php/';
//information in the mode */
$host = "localhost";
$username = "root";
$password = "root";
$database = "KeniceWawesomenauts_db";
// based off of the old class
// the database objects is going to query the database
// sessions used to save database objects
// session equal to database connection
if(!isset($_SESSION["connection"])) {
$connection = new Database($host, $username, $password, $database);
$_SESSION["connection"] = $connection;
}