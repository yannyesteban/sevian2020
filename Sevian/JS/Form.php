<?php
namespace Sevian\JS;

class Form{
	public $target = "";
	public $name = "";
	public $id = "";
	public $caption = "";
	public $className = "";
	public $type = "";
	public $iconClass = "";
	
	public $fields = [];
	public $data = "";

	public $pages = "";
	public $menu = "";

	public function __construct($info = []){
		foreach($info as $k => $v){
			
			//$this->$k = $v;
			if(property_exists(__CLASS__, $k)){
				$this->$k = $v;
			}
		}
	}
	
	
}