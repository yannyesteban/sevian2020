<?php

namespace Sevian;


function CreateInput($opt){
	
	
	
	
	//return new ""
	
}
	
	
	

class InfoInput{
	private $_main = false;
	public $main = "";
	
	public $input = "";
	
	public $type = "";
	
	public $id = false;
	public $name = false;
	public $src = false;
	public $className = false;
	public $events = array();
	public $propertys = array();
	public $rules = array();
	
	
	
	
	public $value = "";
	public $parent = false;
	public $childs = false;
	public $data = array();
	
	private $masterData = array();
	
	private $_ref = "";
	
	public function __construct($opt = array()){
		foreach($opt as $k => $v){
			
				$this->$k = $v;
			
		}
	}
	
	
	
}


class Input extends InfoInput{
	
	
	public function __construct($opt = array()){
		
		foreach($opt as $k => $v){
			$this->$k = $v;	
		}
		
	}
	

	
	public function render(){
		
		
		
		switch($this->type){
			case "text":
			case "password":
			case "hidden":
			//case "checkbox":
			//case "radio":
			case "button":
			case "submit":
			case "image":

			case "color":
			case "range":				
				
				$main = new HTML("input");
				$main->type = $this->type;
				
				
				if($this->type == "image"){
					$main->src = $this->src;
				}
				
				break;
			case "select":
				$main = new HTML("select");
				break;
			case "multiple":
				$main = new HTML("select");
				$main->multiple = "multiple";
				break;
			case "textarea":
				$main = new HTML("textarea");
				break;
			default:
				$main = new HTML("input");
				$main->type = "text";
				
				
		}
		
		
		$this->main = $main->id = $this->id;
		$main->name = $this->name;
		
		$main->value = $this->value;
		
		$main->className = $this->className;
		$main->events = $this->events;
		
		
		//$json = json_encode($this, JSON_PRETTY_PRINT);
		//$main->script ="var i21 = new Sevian.InputStd($json);";
		
		
		
		//$this->_main = $main;
		
		return $main->render();
	}
	
	
	public function getScript1(){
		
	}
	
}


class DateInput extends InfoInput{
	
	
	public function __construct($opt = []){
		
		InfoInput::__construct($opt);
	}
	

	
	public function render(){
		
		
		
		switch($this->type){
			case "text":
				break;
			default:
				
				
				
		}
		
		
		$main = new HTML("span");
		
		
		$main->id = $this->id."_tgt";
		
		$this->main = false;
		$this->target = "#".$main->id ;
		//$main->name = $this->name;
		
		
		$json = json_encode($this, JSON_PRETTY_PRINT);
		$main->script ="var i1 = new Sevian.DateInput($json);";
		
		
		
		$this->_main = $main;
		
		return $main->render();
	}
	
	
	public function getScript(){
		if($this->_main){
			
			return $this->_main->getScript();
		}
	}
	
}




?>