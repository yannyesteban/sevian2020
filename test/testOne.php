<?php
namespace test;

include "../sigefor/SuperForm.php";


class One extends \sevian\element implements \Sevian\JSComponent{

	public function __construct($info = []){
		foreach($info as $k => $v){
			$this->$k = $v;
		}

		$this->panel = new \Sevian\HTML("div");
		$this->panel->id = $this->getPanelId();
		$this->panel->innerHTML = "test One 2";

		$f = new  \Sigefor\SuperForm([
			"id"=>$this->panel->id,
			"name"=>"models",
			"method"=>"request"
		]);

		$this->typeElement = 'One';
		$this->info = ["a"=>2, "id"=>$this->getPanelId()];
		//$f->evalMethod("request");
		//print_r($f->info);

		$this->_components[] = [
			"name"=>"test".$this->id,
			"type"=>"Grid2",
			"mode"=>"create",
			"info" => new \Sigefor\Component\Grid([
				'asyncMode'	=> false,
				'id'		=> $this->panel->id,
				'panelId'	=> $this->id,
				'name'		=> '#../json/forms/brands.json',
				'method'	=> $this->method,
				'page'		=> 1,
				'searchValue' => ''
				
			])
		];

		$this->_components[] = [
			"name"=>"test".$this->id,
			"type"=>"Grid2",
			"mode"=>"setting",
			"info" =>[
				[
					'method'  => 'test',
					'value'=>'nada',
					
				]
			]
				];

		
	}

	public function config(){
		
	}

	public function addComponents(){

	}
	public function getJsComponents(){
		
		return $this->_components?? [];

	}


}



