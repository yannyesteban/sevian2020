<?php

$PATH = "";

$js = [
	[
		'file' 	=> "{$PATH}js/_sgQuery.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/sgAjax.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/drag.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/sgWindow.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/sgDB.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/sgInit.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/sgSevian.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/Sevian/Tab.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/Sevian/Menu.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/Sevian/DesignMenu.js",
		'begin'	=> true],
	/*[
		'file' 	=> "{$PATH}js/Sevian/Upload.js",
		'begin'	=> true],*/
	[
		'file' 	=> "{$PATH}js/sgCalendar.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/Sevian/Input.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/Sevian/Form.js",
		'begin'	=> true],

	/*[
		'file' 	=> "{$PATH}js/Sevian/modulo1.js",
		'begin'	=> false,
		'attrib' => [
			'type'=>'module'
		]],*/
	[
		'file' 	=> "{$PATH}js/Sevian/proyecto.js",
		'begin'	=> false,
		'attrib' => [
			'type'=>'module'
		]],
	[
		'file' 	=> "{$PATH}js/Sevian.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}js/Form.js",
		'attrib' => [
			'type'=>'module'
		]],
];

Sevian\S::jsInit($js);

?>