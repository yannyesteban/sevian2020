<?php
namespace Sevian;

class InfoWindow{
	public $caption = false;
	public $mode = 'custom';
	public $width = '300px';
	public $height = '300px';
	public $visible = true;
	public $className = false;
	public $classImage = false;
	public $icon = false;
	
	public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}
}
class InfoRequest{

	public $panel = false;
	public $targetId = false;
	public $html = false;
	public $script = false;
	public $css = false;
	public $title = false;
	public $typeAppend = 1;
	public $hidden = false;
	public $window = false;
	
	public function __construct($opt = []){
		foreach($opt as $k => $v){
			$this->$k = $v;
		}
	}
}
class InfoParam{
	public $panel = false;
	public $element = '';
	public $name = '';
	public $method = '';
	public $eparams = [];
	public $async = false;
	public $update = false;
	public $debugMode = false;
	public $designMode = false;
	public $fixed = false;
	
	public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
			
		}
	}
}
class InfoThemes{
	
	public $css = [];
	public $js = [];
	public $templates = [];
	public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}
}

?>