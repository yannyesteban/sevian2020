<?php
namespace GT;
require_once 'Unit.php';
class Webcar extends \Sevian\Element{

	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}
        $this->cn = \Sevian\Connection::get();
	}
	
	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
        }
		switch($method){
			case 'load':
				$this->load();
				break;
			case 'x':

				break;
		}

		return true;
	}


	public function load(){
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-webcar-'.$this->id;
		
		$this->typeElement = 'GTWebcar';
		$unit = new Unit();
		
		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'unit'=>$unit->init()
		];

		
	}
}


