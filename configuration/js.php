<?php

$PATH = "../../../";

$js = [
	[
		'file' 	=> "{$PATH}js/_sgQuery.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/sgAjax.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/drag.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/sgWindow.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/sgDB.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/sgInit.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/sgSevian.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/Sevian/Tab.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/Sevian/Menu.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/Sevian/DesignMenu.js",
		'begin'	=> false],
	/*[
		'file' 	=> "{$PATH}js/Sevian/Upload.js",
		'begin'	=> false],*/
	[
		'file' 	=> "{$PATH}js/sgCalendar.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/Sevian/Input.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/Sevian/Form.js",
		'begin'	=> false],

	[
		'file' 	=> "{$PATH}js/Sevian/proyecto.js",
		'begin'	=> true],
	
];

Sevian\S::jsInit($js);

?>