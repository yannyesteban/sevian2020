<?php



namespace Sevian;

include "Grid.php";

class GTest extends \Sevian\Element{

	use \Sigefor\FormInfoJSON;
	use \Sigefor\FormInfoDB;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
        $this->cn = \Sevian\Connection::get();
	}


	public function evalMethod($method = false): bool{

		$this->typeElement = "test";
		$this->info = [
			[
			'method'  => 'ver',
			'value' => "un Test Grid",
			],
		];


	
		

		$form = new \Sevian\Panel('div');
        //$form->text = "control-device";
        $form->id = "testgrid_".$this->id;
        $form->innerHTML = "TEST ONE";
		$this->panel = $form;
		
		$g =  new Grid();
		$g->fields = $this->loadFormDB("alarms");


		$g->data = $this->getDataGrid();
		
		$g->caption = "";
		
		$g->jsrender();
		
	


		$this->info = [
			"tag"=>"yanny esteban test",
			"grid"=>$g
		];
		return true;
	}


	public function a(){

		$g = new SGGrid("name-form");
		$g->render();


	}


}
