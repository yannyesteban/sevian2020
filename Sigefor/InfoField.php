<?php
namespace Sevian\Sigefor;
class InfoField{
	public $set = 'field';
	
	//public $form = '';
	public $field = '';
	public $name = '';
	//public $method = '';

	public $page = '';
	public $params = '';
	public $caption = false;
	public $class = '';
	public $placeholder = '';
	public $input = '';//['input'=>'text'];
	public $inputType = '';//['input'=>'text'];
	public $type = '';//['input'=>'text'];
	public $cell = 'xxx';//['input'=>'text'];
	public $cellType = '';//['input'=>'text'];
	public $value = '';
	
	public $modeValue = '';
	public $default = '';
	public $data = false;
	public $parent = false;
	public $childs = false;
	public $rules = false;
	
	public $events = false;
	public $info = false;
	
	public $config = false;
	public $inputConfig = false;
	public $onSave = false;
	
	public $subform = false;

	public $mtype = false;
	//public $key = false;
	//public $serial = false;
	//public $length = false;
	//public $table = false;


	
	public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;	
			}
		}

		if($this->caption === false){
			$this->caption = $this->name;
		}
		
	}

	public function update($opt = []){
		self::__construct($opt);
	}

}