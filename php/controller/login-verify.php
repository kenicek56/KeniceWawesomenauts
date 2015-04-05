<?php

     require_once(__DIR__ . "/../model/config.php");
     
     // when it is required by a by a webpage they will have access to the function
     // and the file will be able to use this function to determine weather or not the user is logged in.
     function authenticateUser() {

         if(!isset($_SESSION["authenticated"])) {
              return false;
         }
         else {
         	if($_SESSION["authenticated"] != true) {
         		return false;
         	}
         	else {
         		return true;
         	}
         }
     }