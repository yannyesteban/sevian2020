<?php



$init = [
	'theme'=>'sevian',
	'title'=>'GTcomm v0.0.1',
	'templateName' => 'main',
	'defaultPanel' => 4,
	'elements' => [
				[
			'id'		=> 20,
			'element'	=> 'sgUser',
			'name'		=> '',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
		[
			'id'		=> 21,
			'element'	=> 'sgModule',
			'name'		=> 'gt2',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
		[
			'id'		=> 22,
			'element'	=> 'sgStructure',
			'name'		=> 'tres',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
	],
	
	'panels'=>[],
	'sequences' => [],
	'actions' => [],
	'css' => [],
	'js' => [],
];

Sevian\S::configInit($init);

