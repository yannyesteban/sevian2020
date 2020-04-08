<?php
namespace test;

include "../sigefor/SuperForm.php";


class One extends \sevian\element{

	public function __construct($info = []){
		foreach($info as $k => $v){
			$this->$k = $v;
		}

		
		

		return ;
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

	public function evalMethod($method = ''){
		if($method != ''){
			$this->method = $method;
		}

		switch($this->method){
			case 'request':
				$this->createForm(1);
				break;
			case 'load':
				break;	
			case 'list':
				$this->createGrid();


		}

	}
	public function config(){}

	public function createForm($mode = 1){
		$this->panel = new \Sevian\HTML("div");
		$this->panel->id = $this->getPanelId();
		$this->panel->innerHTML = "test One 2";

		print_r($this);

		$f = new  \Sigefor\sform([
			"id"=>$this->id,
			//"id"=>$this->panel->id,
			"name"=>"products",
			"method"=>"list",
			'eparams' => &$this->eparams
		]);

		$f->evalMethod('list');

		$this->typeElement = 'One';
		$this->info = ["a"=>2, "id"=>$this->getPanelId()];
		//$f->evalMethod("request");
		//print_r($f->info);
		$this->panel->appendChild($f->panel); 
		$this->addJasonComponent($f);
	}

	public function createGrid($mode = 1){}
	

	
}



