<?php


$cn = [
	[
		'name'=>'_default',
		'driver'	=> 'mysql',
		'host'		=> '127.0.0.1',
		'port'		=> '3306',
		'user'		=> 'root',
		'pass'		=> '123456',
		'dbase'		=> 'gt',
		'charset'	=> 'utf-8'
	],
	
	[
		'name'=>'sevian',
		'driver'	=> 'mysql',
		'host'		=> '127.0.0.1',
		'port'		=> '3306',
		'user'		=> 'root',
		'pass'		=> '123456',
		'dbase'		=> 'seniat_2017',
		'charset'	=> 'utf-8'
	]
	
];

Sevian\Connection::load($cn);
?>