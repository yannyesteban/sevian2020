<?php

$PATH = MAIN_PATH;
const BUILD = MAIN_PATH.'build/';



$no = [
	
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Page.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	

	[
		'file' 	=> "{$PATH}build/Sevian/ts/Menu.js",
		//'attrib' => [			'_type'=>'module'		]
	],

	
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Accordion.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	
	[
		'file' 	=> "{$PATH}build/Sevian/ts/FormDetail.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Form.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Grid.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Calendar.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/List.js",
		//'attrib' => [			'_type'=>'module'		]
	],

	[
		'file' 	=> "{$PATH}js/Sevian/Valid.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Monads.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/MenuDesign.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	/*
		[
			'file_'=>"http://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing",
			'file'=>"https://maps.googleapis.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&callback=initMap",
			'begin'	=> false,'file_'=>''
		],
		*/
		/*
		[
			'file' 	=> "{$PATH}js/Map.js",
			'begin'	=> false
			//'attrib' => [			'_type'=>'module'		]
		],
	*/
	[
		'file' 	=> "{$PATH}build/GT/ts/ControlDevice.js",
		
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/GT/ts/Actions.js",
		
		//'attrib' => [			'_type'=>'module'		]
	],


];


$js = [
	
	[
		'file' 	=> BUILD.'Sevian/ts/Query.js',
		'begin'	=> true
	],
	[
		'file' 	=> BUILD.'Sevian/ts/Window.js',
		'begin'	=> true
		//'attrib' => ['type'=>'module']
	],	
	[
		'file' 	=> BUILD.'Sevian/ts/Ajax.js',
		'begin'	=> true
	],
	
	[
		'file' 	=> BUILD.'Sevian/ts/DB.js',
		'begin'	=> true
	],

	[
		'file' 	=> BUILD.'Sevian/ts/Valid.js',
		//'attrib' => [			'_type'=>'module'		]
	],
	
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Sevian.js",
		'begin'	=> true
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Page.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Menu2.js",
		//'attrib' => [			'_type'=>'module'		]
	],

	[
		'file' 	=> "{$PATH}build/Sevian/ts/Tab.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Input.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/FormDetail.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Form2.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Grid2.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Calendar.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/List.js",
		//'attrib' => [			'_type'=>'module'		]
	],

	
	

	[
		'file' 	=> "{$PATH}build/GT/ts/Actions.js",
		
		//'attrib' => [			'_type'=>'module'		]
	],

	
];

Sevian\S::jsInit($js);

?>