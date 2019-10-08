<?php
namespace Sevian;

class iPanel{
	public $id = 0;
    public $title = '';
    public $html = '';
	public $script = '';
	public $css = '';
	public $class = '';

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}
}

class iFragment{
    
    public $token = '';
    public $targetId = '';
    public $html = '';
	public $script = '';
	public $css = '';
	public $mode = '1';
    

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
        }
        $this->token = 'fragment';
	}
}

class iDataInput{
    public $token = '';
	public $targetId = '';
    public $data = [];
	public $value = '';

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
        }
        $this->token = 'dataInput';
	}
}

class iPropertyHTML{
    public $token = '';
	public $targetId = '';
    public $propertys = [];
    public $style = [];
	

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
        }
        $this->token = 'propertyHTML';
	}
}

class iObjectData{
    public $token = '';
	public $name = '';
    public $data = [];
	public $value = '';

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
        }
        $this->token = 'objectData';
	}
}

class iMessage{
    public $token = '';
	public $message = '';
    public $time = 0;
	public $mode = '';

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
        }
        $this->token = 'message';
	}
}


class jsConfigPanel{
    
    public $panel = '';
    public $type = '';
    public $option = [];
	public $debug = false;

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
        }
	}
}

class jsUpdatePanel{
    
    public $panel = '';
    public $actions = [];
	public $debug = false;
	
    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
        }
	}
}

class jsConfigElement{
    
    public $id = '';
    public $type = '';
    public $option = [];

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
        }
	}
}