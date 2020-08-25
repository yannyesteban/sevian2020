<?php

$cls_elements = [
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
	's-menu' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/Menu2.php',
		'class' => '\Sigefor\Menu2',
		
		'js'=>[],
		'css'=>[],
		'init'=>[
			'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
			
			//'patternJsonFile'=>MODULE_PATH.'json/menu/{name}.json'
		]
	],    
    'form' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/Form.php',
		'class' => '\Sigefor\Form',
		
		'js'=>[],
		'css'=>[],
		'init'=>[
			'patternJsonFile'=>MAIN_PATH.'json/{name}.json'
	
			
			
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


$cls_elements['h-command'] = [
	
	'file' 	=> MAIN_PATH.'gt/HCommand.php',
	'class' => '\GT\HCommand',
	'enable' => true,
	'js'=>[[
		//'file' 	=> MAIN_PATH.'build/GT/ts/Communication.js',
		//'begin'=> false
	]],
	'css'=>[],
	'init'=>[
		'patternJsonFile'=>MAIN_PATH.'json/{name}.json',
		//'patternTemplateFile'=>MAIN_PATH.'templates/{name}.html'
	],
	
];
Sevian\S::elementsLoad($cls_elements);

?>