<?php
namespace test;

include "../sigefor/SuperForm.php";


class One extends \sevian\element{

	public function __construct($info = []){
		foreach($info as $k => $v){
			$this->$k = $v;
		}
	
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
				break;
			case 'get_data':
				case 'search':
				$this->createGrid();
				break;



		}

	}
	public function config(){}

	public function createForm($mode = 1){
		$this->panel = new \Sevian\HTML("div");
		$this->panel->id = $this->getPanelId();
		
	

		$f = new  \Sigefor\sform([
			'containerId'=>$this->panel->id,
			"id"=>$this->id,
			//"id"=>$this->panel->id,
			"name"=>"products",
			"method"=>"request",
			'eparams' => &$this->eparams
		]);

		$f->evalMethod('request');

		$this->typeElement = 'One';
		$this->info = ["a"=>2, "id"=>$this->getPanelId()];
		//$f->evalMethod("request");
		//print_r($f->info);
		$this->panel->appendChild($f->panel); 
		$this->addJasonComponent($f);
	}

	public function createGrid($mode = 1){

		$this->panel = new \Sevian\HTML("div");
		$this->panel->id = $this->getPanelId();
		$this->panel->innerHTML = "test One 2";

		

		$f = new  \Sigefor\sform([
			"id"=>$this->id,
			//"id"=>$this->panel->id,
			"name"=>"products",
			"method"=>"list",
			'eparams' => &$this->eparams
		]);

		$f->evalMethod('get_data');

		$this->typeElement = 'One';
		$this->info = ["a"=>2, "id"=>$this->getPanelId()];
		//$f->evalMethod("request");
		//print_r($f->info);
		$this->panel->appendChild($f->panel); 
		$this->addJasonComponent($f);

	}
	

	
}



