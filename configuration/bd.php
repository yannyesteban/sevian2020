<?php


$cn = [
	'_default' => [
		'driver'	=> 'mysql',
		'host'		=> '127.0.0.1',
		'port'		=> '3306',
		'user'		=> 'root',
		'pass'		=> '123456',
		'dbase'		=> 'sevian_2019',
		'charset'	=> 'utf-8'],
	
	'sevian' => [
		'driver'	=> 'mysql',
		'host'		=> '127.0.0.1',
		'port'		=> '3306',
		'user'		=> 'root',
		'pass'		=> '123456',
		'dbase'		=> 'seniat_2017',
		'charset'	=> 'utf-8'],
	
	
];

Sevian\Connection::load($cn);
?>