<?php

include '../../../sevian/classes/sevian.php';

include 'init.php';

include 'configuration/themes.php';
include 'configuration/bd.php';
include 'configuration/inputs.php';
include 'configuration/elements.php';
include 'configuration/commands.php';
include 'configuration/css.php';
include 'configuration/js.php';

/* test */
echo Sevian\S::render();