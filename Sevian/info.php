<?php
namespace Sevian;

class InfoUser{
	public $user = 'pepe';
	public $pass = '123';
	public $roles = ['_public'];
	public $auth = false;
}

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
	public $async = 0;

	public $id = null;
	public $panel = false;
	public $mode = 'panel';


	public $element = '';
	public $name = '';
	public $method = '';
	public $eparams = false;
	public $debugMode = false;
	public $designMode = false;

	public $update = false;
	public $fixed = false;

	public $isPanel = false;
	public $iToken = null;

	public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}

		}
	}
}
class InfoElement{
	//public $mode = 'panel';
	public $id = false;
	public $element = '';
	public $name = '';
	public $method = '';
	public $eparams = false;
	public $iToken = null;

	public $debugMode = false;
	public $designMode = false;

	//public $async = false;
	//public $update = false;
    //public $isPanel = false;

	//public $fixed = false;

	//public $evalSigns = false;

	public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){

				if($k === 'eparams' and gettype($v) !== 'object' and gettype($v) !== 'array'){
					$this->$k = \json_decode($v?? '');
					continue;
				}

				$this->$k = $v;
			}

		}
	}
}
class InfoPanel{
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

	public $evalSigns = false;

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

class InfoInit{
	public $theme;
	public $title;
	public $templateName;
	public $elements = [];
	public $panels;

	public $css = [];
	public $js = [];
	public $templates = [];
	public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){

				if($k == 'elements'){

					//$v = \json_decode(\json_encode($v));
					//hx($v);

					foreach($v as $kk => $vv){
						$vv = (array)$vv;
					//hx($vv);
						//$this->$k[$vv['id']] = new InfoElement($vv);
						$this->$k[$vv['id']] = new InfoParam($vv);
					}

				}else if($k == 'panels'){
					foreach($v as $kk => $vv){
						$this->$k[$vv['panel']] = new InfoPanel($vv);
					}
				}else{
					$this->$k = $v;
				}
			}
		}
	}
}
class InfoActionParams{
	public $t = '';
	public $id = '0';
	public $element = '';
	public $method = '';
	public $name = '';
	public $eparams = '';
	public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}
}

class InfoAction{

	public $async = false;
	public $panel = '0';
	public $valid = false;
	public $confirm = '';
	public $actions = [];
	public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}
}

?>