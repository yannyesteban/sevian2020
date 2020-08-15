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
    'x-form' 		=> [
		'enable' => true,
		
		'file' 	=> MAIN_PATH.'Sigefor/XForm.php',
		'class' => '\Sigefor\XForm',
		
		'js'=>[],
		'css'=>[],
		'init'=>[
			'patternJsonFile'=>MAIN_PATH.'json/{name}.json'
	
			
			
		]
	],    
	
];

Sevian\S::elementsLoad($cls_elements);

?>