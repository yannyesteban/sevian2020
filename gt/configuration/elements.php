<?php

$cls_elements = [
	
		
	'sgModule' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Module.php',
		'class' => '\Sigefor\Module',
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
	
	
	'SForm' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/SForm.php',
		'class' => '\Sigefor\SForm',
		
		'js'=>[],
		'css'=>[]
	],
	'menu' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/Menu.php',
		'class' => '\Sigefor\Menu',
		
		'js'=>[],
		'css'=>[]
	],
	'sgMap' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Map.php',
		'class' => '\Sevian\Sigefor\Map',
		'enable' => true,
		'js'=>[
			
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
			//'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
			'https://api.mapbox.com/mapbox-gl-js/v1.7.0/mapbox-gl.css'
		]
	],
	'command' 		=> [
		'file' 	=> MAIN_PATH.'gt/command.php',
		'class' => '\GT\Command',
		'enable' => true,
		'js'=>[
			[
				'file' 	=> MAIN_PATH.'gt/js/command.js',
				'begin'=> false
			]

		],
		'css'=>[]
	],
];
$cls_elements['gt_cota'] = [
	
	'file' 	=> MAIN_PATH.'gt/cota.php',
	'class' => '\GT\Cota',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'gt/js/Cota.js',
		'begin'=> false
	]],
	'css'=>[]
	
];
$cls_elements['gt_map'] = [
	
	'file' 	=> MAIN_PATH.'gt/Map.php',
	'class' => '\GT\Map',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'gt/js/Map.js',
		'begin'=> false
	]],
	'css'=>[]
	
];
$cls_elements['gt_unit'] = [
	
	'file' 	=> MAIN_PATH.'gt/unit.php',
	'class' => '\GT\Unit',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'gt/js/Unit.js',
		'begin'=> false
	]],
	'css'=>[]
	
];
$cls_elements['gt_info_unit'] = [
	
	'file' 	=> MAIN_PATH.'gt/InfoUnit.php',
	'class' => '\GT\InfoUnit',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'gt/js/InfoUnit.js',
		'begin'=> false
	]],
	'css'=>[]
	
];

$cls_elements['catalogue'] = [
	
	'file' 	=> MAIN_PATH.'Sigefor/Catalogue.php',
	'class' => '\Sigefor\Catalogue',
	'enable' => true,
	'js_'=>[[
		'file' 	=> MAIN_PATH.'js/InfoUnit.js',
		'begin'=> false
	]],
	'css'=>[]
	
];

Sevian\S::elementsLoad($cls_elements);

?>