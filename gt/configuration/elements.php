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
		
		'file' 	=> MAIN_PATH.'Sigefor/Structure3.php',
		'class' => '\Sigefor\structure3',
		'init'=>[
			'patternJsonFile'=>JSON_PATH.'/{name}.json',
			'patternTemplateFile'=>TEMPLATES_PATH.'/{name}.html'
		],
		'js'=>[],
		'css'=>[]
	],
	's-module' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/Module3.php',
		'class' => '\Sigefor\Module3',
		
		'js'=>[],
		'css'=>[],
		'init'=>[
			'patternJsonFile'=>MAIN_PATH.'json/{name}.json'
			//'patternJsonFile'=>MODULE_PATH.'json/menu/{name}.json'
		]
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
		'enable' => false,
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
				'file' 	=> MAIN_PATH.'build/lib/MapBox.js',
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
				'file' 	=> MAIN_PATH.'build/GT/ts/command.js',
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
		'file' 	=> MAIN_PATH.'build/GT/ts/Cota.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	]
	
];
$cls_elements['gt_map'] = [
	
	'file' 	=> MAIN_PATH.'gt/Map.php',
	'class' => '\GT\Map',
	'enable' => false,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Map.js',
		'begin'=> false
	]],
	'css'=>[]
	
];
$cls_elements['gt_unit'] = [
	
	'file' 	=> MAIN_PATH.'gt/Unit.php',
	'class' => '\GT\Unit',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Unit.js',
		'begin'=> false
	]],
	'css'=>[]
	
];

$cls_elements['gt-site'] = [
	
	'file' 	=> MAIN_PATH.'gt/Site.php',
	'class' => '\GT\Site',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Site.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];

$cls_elements['gt-communication'] = [
	
	'file' 	=> MAIN_PATH.'gt/Communication.php',
	'class' => '\GT\Communication',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Communication.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];

$cls_elements['gt-geofence'] = [
	
	'file' 	=> MAIN_PATH.'gt/Geofence.php',
	'class' => '\GT\Geofence',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Geofence.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];

$cls_elements['gt_alarm'] = [
	
	'file' 	=> MAIN_PATH.'gt/Alarm.php',
	'class' => '\GT\Alarm',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Alarm.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];
$cls_elements['gt_event'] = [
	
	'file' 	=> MAIN_PATH.'gt/Event.php',
	'class' => '\GT\Event',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Event.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];

$cls_elements['gt_config'] = [
	
	'file' 	=> MAIN_PATH.'gt/Config.php',
	'class' => '\GT\Config',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Config.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];

$cls_elements['gt_search'] = [
	
	'file' 	=> MAIN_PATH.'gt/Search.php',
	'class' => '\GT\Search',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Search.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];

$cls_elements['gt_geofence'] = [
	
	'file' 	=> MAIN_PATH.'gt/Geofence.php',
	'class' => '\GT\Geofence',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Geofence.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];

$cls_elements['gt_history'] = [
	
	'file' 	=> MAIN_PATH.'gt/History.php',
	'class' => '\GT\History',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/History.js',
		'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];

$cls_elements['catalogue'] = [
	
	'file' 	=> MAIN_PATH.'Sigefor/Catalogue.php',
	'class' => '\Sigefor\Catalogue',
	'enable' => true,
	'js_'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/InfoUnit.js',
		'begin'=> false
	]],
	'css'=>[]
	
];
$cls_elements['fcatalogue'] = [
	
	'file' 	=> MAIN_PATH.'Sigefor/FCatalogue.php',
	'class' => '\Sigefor\FCatalogue',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/Sevian/ts/FCatalogue.js',
		'begin'=> false
	]],
	'css'=>[]
	
];


$cls_elements['gt_info_unit'] = [
	
	'file' 	=> MAIN_PATH.'gt/InfoUnit.php',
	'class' => '\GT\InfoUnit',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/InfoUnit.js',
		'begin'=> false
	]],
	'css'=>[]
	
];

$cls_elements['gt_webcar'] = [
	
	'file' 	=> MAIN_PATH.'gt/Webcar.php',
	'class' => '\GT\Webcar',
	'enable' => true,
	'js'=>[[
		'file' 	=> MAIN_PATH.'build/GT/ts/Webcar.js',
		'begin'=> false
	]],
	'css'=>[]
	
];

Sevian\S::elementsLoad($cls_elements);

?>