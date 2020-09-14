<?php

$PATH = MAIN_PATH;

$js = [
	
	[
		'file' 	=> "{$PATH}js/_sgQuery.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Window.js",
		//'attrib' => ['type'=>'module']
	],	
	[
		'file' 	=> "{$PATH}js/sgAjax.js",
		'begin'	=> true],
	/*
	[
		'file' 	=> "{$PATH}js/drag.js",
		'begin'	=> true],
		*/
	/*[
		'file' 	=> "{$PATH}js/sgWindow.js",
		'begin'	=> true],
	*/
	[
		'file' 	=> "{$PATH}js/sgDB.js",
		'begin'	=> false],
	/*
	[
		'file' 	=> "{$PATH}js/sgInit.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/sgSevian.js",
		'begin'	=> true],
	
	[
		'file' 	=> "{$PATH}js/Sevian/Tab.js",
		'begin'	=> true],*/
	/*
	[
		'file' 	=> "{$PATH}js/Sevian/Menu.js",
		'begin'	=> true],
	
	[
		'file' 	=> "{$PATH}js/Sevian/DesignMenu.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/Sevian/Upload.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/sgCalendar.js",
		'begin'	=> true],
	*/
	/*[
		'file' 	=> "{$PATH}js/Sevian/Input.js",
		'begin'	=> true],
	[
		'file' 	=> "{$PATH}js/Sevian/Form.js",
		'begin'	=> true],*/

	/*[
		'file' 	=> "{$PATH}js/Sevian/modulo1.js",
		'begin'	=> false,
		'attrib' => [
			'type'=>'module'
		]],*/
	/*[
		'file' 	=> "{$PATH}js/Sevian/proyecto.js",
		'begin'	=> false,
		'attrib' => [
			'type'=>'module'
		]],*/
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Sevian.js",
		'begin'	=> false],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Page.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Menu2.js",
		//'attrib' => [			'_type'=>'module'		]
	],

	[
		'file' 	=> "{$PATH}build/Sevian/ts/Menu.js",
		//'attrib' => [			'_type'=>'module'		]
	],

	[
		'file' 	=> "{$PATH}build/Sevian/ts/Tab.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Accordion.js",
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
		'file' 	=> "{$PATH}build/Sevian/ts/Form.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Form2.js",
		//'attrib' => [			'_type'=>'module'		]
	],
	[
		'file' 	=> "{$PATH}build/Sevian/ts/Grid.js",
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

Sevian\S::jsInit($js);

?>