<?php


$structure = [
	
	"name"=>"ne",
	"templates"=>"main3",
	
	
];


$init = [
	'theme'=>'sevian',
	'title'=>'GTcomm v1.0',
	'templateName' => 'login',
	'elements' => [
		[
			'panel'		=> 100,
			'element'	=> 'sgArticle',
			'name'		=> 'banner',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
		[
			'panel'		=> 1,
			'element'	=> 'menu',
			'name'		=> 'principal',
			'method'	=> 'create',
			'designMode'=> true,
			'fixed'		=> true,
		],
		
		[
			'panel'		=> 4,
			'element'	=> 'test4',
			'name'		=> '',
			'method'	=> '',
			'designMode'=> true,
			'fixed'		=> true,
		],
		
		[
			'panel'		=> 5,
			'element'	=> 'sgForm',
			'name'		=> 'login',
			'method'	=> 'request',
			'designMode'=> true,
			'fixed'		=> true,
		],
		/*
		[
			'panel'		=> 8,
			'element'	=> 'sgForm',
			'name'		=> 'login',
			'method'	=> 'request',
			'designMode'=> true,
			'fixed'		=> true,
		],
		
		[
			'panel'		=> 44,
			'element'	=> 'menuD',
			'name'		=> 'uno_m',
			'method'	=> 'request',
			'designMode'=> true,
			'fixed'		=> true,
		],
		[
			'panel'		=> 66,
			'element'	=> 'ImagesDir',
			'name'		=> 'dos',
			'method'	=> 'toolbar',
			'designMode'=> false,
			'fixed'		=> true,
		],
		*/
	
	],
	
	'sequences' => [
	
	
	
	],
	'actions' => [
	
	
	
	],
	
	'css' => [],
	
	'js' => [],
	
];


$init2 = [
	'theme'=>'sevian',
	'title'=>'GTcomm v1.0',
	'templateName' => 'login',
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
			'name'		=> 'gt_comm',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
		[
			'id'		=> 22,
			'element'	=> 'sgStructure',
			'name'		=> 'main',
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


$init2 = [
	'theme'=>'sevian',
	'title'=>'GTcomm v1.0',
	'templateName' => 'login',
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
			'name'		=> 'gt_comm',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
		[
			'id'		=> 22,
			'element'	=> 'sgStructure',
			'name'		=> 'main',
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


$init3 = [
	'theme'=>'sevian',
	'title'=>'GTcomm v0.0.1',
	'templateName' => 'main',
	'defaultPanel' => 4,
	'elements' => [
		[
			'id'		=> 4,
			'element'	=> 'procedure',
			'name'		=> 'cota_init',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
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


$init = [
	'theme'=>'sevian',
	'title'=>'GTcomm v0.0.1',
	'templateName' => 'main',
	'defaultPanel' => 4,
	'elements' => [
		/*
		[
			'id'		=> 20,
			'element'	=> 'sgUser',
			'name'		=> '',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
		*/
		[
			'id'		=> 21,
			'element'	=> 'sgModule',
			'name'		=> 'test1',//gt2020
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
		/*[
			'id'		=> 22,
			'element'	=> 'sgStructure',
			'name'		=> 'gt',//gt2020
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],*/
		[
			'id'		=> 22,
			'element'	=> 'structure',
			'name'		=> 'gt_cota',//gt2020
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

$init = [
	'theme'=>'sevian',
	'title'=>'Webcar 3.0',
	'templateName' => 'main',
	'defaultPanel' => 4,
	'elements' => [
		[
            'id'=>20,
            'element'=>'s-module',
            'name'=>'/gt/modules/cota',
            'method'=>'load',
            'designMode'=>true,
            'fixed'=>true
        ],

		[
			'id'		=> 22,
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