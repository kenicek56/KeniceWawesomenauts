<?php
require_once(__DIR__ . "/../model/config.php");
// deletes any characters it doesnt recoginze as part of the string 
//deletes any characters that dont exsist in email
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

// tells php that we wanna use salt 56 5,000 times
//creates unqiue id for us
$salt = "$5$" . "rounds=5000$" . uniqid(mt_rand(), true) . "$";

// tells it to use this password and this salt to come together to create a incrypted password.
$hashedPassword = crypt($password, $salt);

$query = $_SESSION["connection"]->query("INSERT INTO users Set "
	. "email = '',"
	. "username = '$username',"
	. "password = '$hashedPassword',"
	. "salt = '$salt', "
	. "exp = 0, "
    . "exp1 = 0, "
    . "exp2 = 0, "
    . "exp3 = 0, "
    . "exp4 = 0");
$_SESSION["name"] = $username;

if($query) {
	echo "true";
}
else {
	echo "<p>" . $_SESSION["connection"]->error . "</p>";
}