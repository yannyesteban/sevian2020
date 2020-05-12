<?php

namespace GT;


class Cota extends \Sevian\Element{

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
		$this->panel->id = 'gt-cota-'.$this->id;
		
		$this->typeElement = 'Cota';

	


		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'tapName'=>'yanny'
		];
		/*
		$f = new  \Sigefor\sform([
			'containerId'=>'list-commands',
			"id"=>$this->id,
			//"id"=>$this->panel->id,
			"name"=>"h_commands",
			"method"=>"request",
			'eparams' => &$this->eparams
		]);

		$f->evalMethod('request');
		$this->addJasonComponent($f);
		*/
	}
}