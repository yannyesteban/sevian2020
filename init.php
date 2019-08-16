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
			'id'		=> 1,
			'element'	=> 'sgUser',
			'name'		=> '',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
		[
			'id'		=> 2,
			'element'	=> 'sgModule',
			'name'		=> 'gt_comm',
			'method'	=> 'load',
			'designMode'=> true,
			'fixed'		=> true,
		],
		[
			'id'		=> 3,
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


Sevian\S::configInit($init2);

