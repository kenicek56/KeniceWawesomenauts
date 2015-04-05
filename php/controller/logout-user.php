<?php

require_once(__DIR__ . "/../model/config.php");

unset($_SESSION["authenticated"]);
// destroys the session when we logout
session_destroy();
header("Location: " . $path . "index.php");