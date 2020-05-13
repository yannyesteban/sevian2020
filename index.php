<?php
set_include_path(get_include_path().":"."/path/to/new/folder");
define("MAIN_PATH", "");


include MAIN_PATH.'Sevian/functions.php';
include MAIN_PATH.'Sevian/sevian.php';



include MAIN_PATH.'configuration/themes.php';
include MAIN_PATH.'configuration/bd.php';
include MAIN_PATH.'configuration/inputs.php';
include MAIN_PATH.'gt/configuration/elements.php';
include MAIN_PATH.'configuration/actions.php';
include MAIN_PATH.'configuration/commands.php';
include MAIN_PATH.'cota/configuration/css.php';
include MAIN_PATH.'configuration/js.php';
include 'init.php';

/* test */
echo Sevian\S::render();