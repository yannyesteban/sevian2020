<?php
//set_include_path(get_include_path().":"."/path/to/new/folder");
define("MAIN_PATH", "");
define("MODULE_PATH", "");
define("JSON_PATH", "json/");
define("TEMPLATES_PATH", "templates/");
define("IMAGES_PATH", "images/");
define("PATH_IMAGES", "images/");

define("SEVIAN_PATH", "");
define("SIGEFOR_PATH", "");

include MAIN_PATH.'Sevian/functions.php';
include MAIN_PATH.'Sevian/sevian.php';

include MAIN_PATH.'gt/configuration/css.php';
include MAIN_PATH.'configuration/js.php';

include MAIN_PATH.'configuration/themes.php';
include MAIN_PATH.'configuration/bd.php';
include MAIN_PATH.'configuration/inputs.php';
include 'modules/gt/elements.php';
include MAIN_PATH.'configuration/actions.php';
include MAIN_PATH.'configuration/commands.php';

include 'modules/gt/init.php';

/* test */
echo Sevian\S::render();