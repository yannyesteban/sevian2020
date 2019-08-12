<?php


namespace Sevian;


class InfoAction{
	
	public $async = false;
	public $panel = false;
	public $valid = false;
	public $confirm = false;
	public $params = array();
	public $window = false;
	
	public function __construct($opt = array()){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}	
	
}

class Action{
	
	
	
	static public  function send($opt){
		
		
		$json = json_encode($opt, JSON_PRETTY_PRINT);
		
		return "Sevian.action.send($json);";
		
		
	}
	
	
	
}


?>