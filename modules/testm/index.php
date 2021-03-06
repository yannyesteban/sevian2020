<?php
ini_set('memory_limit','512M');

$constants = (array)json_decode(@file_get_contents("constants.json", true));

foreach($constants as $key => $value){
    define($key, $value);
}

include MAIN_PATH.'Sevian/functions.php';
include MAIN_PATH.'Sevian/sevian.php';

Sevian\S::setConfigInit('config.json', $constants);
echo Sevian\S::render();