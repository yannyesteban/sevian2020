<?php

define("MAIN_PATH", "../");
define("SG_PATH_IMAGES", "../images/");

define("IMAGES_PATH", "images/");
define("PATH_IMAGES", "images/");

include MAIN_PATH.'Sevian/functions.php';
include MAIN_PATH.'Sevian/sevian.php';



include MAIN_PATH.'configuration/themes.php';
include MAIN_PATH.'configuration/bd.php';
include MAIN_PATH.'configuration/inputs.php';
include MAIN_PATH.'gt/configuration/elements.php';
include MAIN_PATH.'configuration/actions.php';
include MAIN_PATH.'configuration/commands.php';
include MAIN_PATH.'gt/configuration/css.php';
include MAIN_PATH.'configuration/js.php';
include 'init.php';
/* test */
echo Sevian\S::render();