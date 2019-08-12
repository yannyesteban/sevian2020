<?php
$PATH = '../../../themes/';
$themes = [
	'sevian' => [
		'css' => [
			//$PATH.'sevian/css/Sevian.css',
			$PATH.'sevian/css/login.css',
			//'Main.css',
			//'Window.css',
			//'Menu.css',
			//'Calendar.css',
			//'Tab.css',
			//'Ajax.css',
			//'SelectText.css',
			//'Form.css'
			],
		'js' => [
			'uno.js'],
		'templates'	=> [
			'main'	=> $PATH.'sevian/html/main.html',
			'main2'	=> $PATH.'sevian/html/main2.html',
			'main3'	=> $PATH.'sevian/html/main3.php',
			'main4'	=> $PATH.'sevian/html/main4.php',
			'login'	=> $PATH.'sevian/html/login.html',
			
			]]
	
	
];

Sevian\S::themesLoad($themes);


?>