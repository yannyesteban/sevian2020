<?php

$init = [
	'theme'=>'sevian',
	'title'=>'GT-Comm 1.0',
	'templateName' => 'main',
	'defaultPanel' => 4,
	'elements' => [
		[
			'mode'=>'panel',
			'id'	=> 20,
            'element'	=> 's-module',
            'name'		=> '/gt/modules/gt',
            'method'	=> 'load',
            'designMode'=> true,
            'fixed'		=> true
        ],

		[
			'id'	=> 22,
			'element'	=> 'structure3',
			//'name'		=> '/structures/webcar-login',//gt2020
			'name'		=> '/gt/structures/webcar-login',//gt2020
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
        ]
        
	],
	
	'panels'	=> [],
	'sequences' => [],
	'actions' 	=> [],
	'css' 		=> [],
	'js' 		=> [],
];

Sevian\S::configInit($init);