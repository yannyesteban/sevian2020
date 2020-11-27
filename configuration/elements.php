<?php

$cls_elements = [
	'sgUser' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/User.php',
		'class' => '\Sigefor\User',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
		
	'sgModule' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Module.php',
		'class' => '\Sigefor\Module',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'sgStructure' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Structure.php',
		'class' => '\Sigefor\Structure',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'structure' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/structure2.php',
		'class' => '\Sigefor\structure2',
		'init'=>[
			'patternJsonFile'=>MAIN_PATH.'json/structure/{name}.json'
		],
		'js'=>[],
		'css'=>[]
	],
	'ajax' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Ajax.php',
		'class' => '\Sigefor\Ajax',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	
	'form' => [
		'file' 	=> MAIN_PATH.'Sevian/SgForm.php',
		'class' => 'SgForm',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'menux' 		=> [
		'file' 	=> MAIN_PATH.'Sevian/SgMenu.php',
		'class' => 'SgMenu',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'fragment' 	=> [
		'file' 	=> MAIN_PATH.'Sevian/ssFragment.php',
		'class' => 'ssFragment',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'procedure' => [
		'file' 	=> MAIN_PATH.'Sigefor/Procedure.php',
		'class' => 'Sigefor\Procedure',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'sgForm' 	=> [
		'file' 	=> MAIN_PATH.'Sigefor/Form.php',
		'class' => 'Sevian\Sigefor\Form',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'ImagesDir' => [
		'file' 	=> MAIN_PATH.'Sevian/ImagesDir.php',
		'class' => 'Sevian\ImagesDir',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'menuX' 	=> [
		'file' 	=> MAIN_PATH.'Sevian/mMenu.php',
		'class' => 'Sevian\mMenu',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'menuD' 	=> [
		'file' 	=> MAIN_PATH.'Sigefor/DesignMenu.php',
		'class' => '\DesignMenu',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'menu' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Menu.php',
		'class' => '\Sevian\Sigefor\Menu',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],		
	'test4' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Menu.php',
		'class' => '\Sevian\Sigefor\Test4',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],	
	'test55' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Menu.php',
		'class' => '\Sevian\Sigefor\Test5',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'test5' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Article.php',
		'class' => '\Sevian\Sigefor\Article',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'sgArticle' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Article.php',
		'class' => '\Sevian\Sigefor\Article',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	'sgMap1' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Map.php',
		'class' => '\Sevian\Sigefor\Map',
		'enable' => false,
		'js'=>[
			[
				'file'=>'https://maps.googleapis.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&callback=initMap',
				'begin'	=> false
			],
			[
				'file' 	=> MAIN_PATH.'js/Map.js',
				'begin'=> false
			]
		],
		'css'=>[]
	],
	'sgMap' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Map.php',
		'class' => '\Sevian\Sigefor\Map',
		'enable' => false,
		'jss'=>[
			
			[
				'file'=>'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
				'begin'	=> false
			],
			[
				'file' 	=> MAIN_PATH.'lib/LeafletMap.js',
				'begin'=> false
			],
			/**/
			[
				'file'=>'https://api.mapbox.com/mapbox-gl-js/v1.7.0/mapbox-gl.js',
				'begin'	=> true
			],
			[
				'file'=>'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-language/v0.10.1/mapbox-gl-language.js',
				'begin'	=> true
			],
			[
				'file' 	=> MAIN_PATH.'lib/MapBox.js',
				'begin'=> false
			],
			[
				'file' 	=> MAIN_PATH.'js/Map.js',
				'begin'=> false
			]
		],
		'css'=>[
			'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
			'https://api.mapbox.com/mapbox-gl-js/v1.7.0/mapbox-gl.css'
		]
	],
	'gtControlDevice' 		=> [
		'file' 	=> MAIN_PATH.'gt/ControlDevice.php',
		'class' => '\Sevian\GT\ControlDevice',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],
	
	'gtMenuDevice' 		=> [
		'file' 	=> MAIN_PATH.'gt/MenuDevice.php',
		'class' => '\Sevian\GT\MenuDevice',
		'enable' => true,
		'js'=>[],
		'css'=>[]
	],

	'testgrid' 		=> [
		'file' 	=> MAIN_PATH.'Sevian/testgrid2.php',
		'class' => '\Sevian\GTest',
		'enable' => true,
		'js'=>[
			[
				'file' 	=> MAIN_PATH.'js/testgrid.js',
				'begin'=> false
			]

		],
		'css'=>[]
	],
	'command' 		=> [
		'file' 	=> MAIN_PATH.'gt/command.php',
		'class' => '\GT\Command',
		'enable' => true,
		'js'=>[
			[
				'file' 	=> MAIN_PATH.'gt/js/Command.js',
				'begin'=> false
			]

		],
		'css'=>[]
	],
	'SForm' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/SForm.php',
		'class' => '\Sigefor\SForm',
		
		'js'=>[],
		'css'=>[]
	],
	'one' 		=> [
		'file' 	=> MAIN_PATH.'test/testOne.php',
		'class' => 'Test\One',
		'enable' => true,
		'js'=>[
			[
				'file' 	=> MAIN_PATH.'test/js/x.js',
				'begin'=> false
			]

		],
		'css'=>[]
	],
	];

Sevian\S::elementsLoad($cls_elements);

?>