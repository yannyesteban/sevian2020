<?php
namespace GT;

require_once MAIN_PATH.'GT/Trait.php';

class Cota extends \Sevian\Element{

	use DBClient;
	use DBAccount;
	use DBUnit;

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
		//$this->panel->innerHTML = "cooota";
		$this->typeElement = 'Cota';

		$main_form =  new \Sigefor\Component\Form([
			'panelId'=>$this->id,
			//'name'=>$this->name,
			'name'=>'gt_cota_unit',
			'method'=>'request',
			'mode'=>1
			//'record'=>$this->getRecord()
		]);	


		$this->containerId = "y";

		$unit = new Unit([
			'asyncMode'	=> false,
			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> 'cc',
			'method'	=> 'load',
			
			
			
			
		]);
		$unit->evalMethod('load-units');
		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'tapName'=>'yanny',
			'unit'=>$unit,
			'form'	=> $main_form,
		];
		//print_r( );


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