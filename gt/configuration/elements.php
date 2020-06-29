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
	'structure3' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/structure3.php',
		'class' => '\Sigefor\structure3',
		'init'=>[
			'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
			'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
		],
		'js'=>[],
		'css'=>[]
	],
	's-menu' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/Menu2.php',
		'class' => '\Sigefor\Menu2',
		
		'js'=>[],
		'css'=>[],
		'init'=>[
			'patternJsonFile'=>MAIN_PATH.'json/{name}.json'
			//'patternJsonFile'=>MODULE_PATH.'json/menu/{name}.json'
		]
	],
	's-form' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/Form2.php',
		'class' => '\Sigefor\Form2',
		
		'js'=>[],
		'css'=>[],
		'init'=>[
			'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
			'patternFormFile'=>MAIN_PATH.'json/form/{name}.json',
			'patternMenuFile'=>MAIN_PATH.'json/menu/{name}.json'
		]
	],
	'SForm' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/SForm.php',
		'class' => '\Sigefor\SForm',
		
		'js'=>[],
		'css'=>[],
		'init'=>[
			'patternJsonFile'=>MODULE_PATH.'json/form/{name}.json',
		]
	],
	'menu' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/Menu.php',
		'class' => '\Sigefor\Menu',
		
		'js'=>[],
		'css'=>[],
		'init'=>[
			//'patternJsonFile'=>MAIN_PATH.'json/structure/{name}.json'
		]
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
				'file'=>'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.js',
				'begin'	=> true
			],
			[
				'file'=>'https://unpkg.com/@turf/turf/turf.min.js',
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
			'https://api.mapbox.com/mapbox-gl-js/v1.7.0/mapbox-gl.css',
			'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css'
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
	'procedure' => [
		'file' 	=> MAIN_PATH.'Sigefor/Procedure.php',
		'class' => 'Sigefor\Procedure',
		'enable' => true,
		'js'=>[],
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
$cls_elements['fcatalogue'] = [
	
	'file' 	=> MAIN_PATH.'Sigefor/FCatalogue.php',
	'class' => '\Sigefor\FCatalogue',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'js/FCatalogue.js',
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

$cls_elements['gt_webcar'] = [
	
	'file' 	=> MAIN_PATH.'gt/Webcar.php',
	'class' => '\GT\Webcar',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'gt/js/Webcar.js',
		'begin'=> false
	]],
	'css'=>[]
	
];

Sevian\S::elementsLoad($cls_elements);

?>