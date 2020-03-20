<?php



namespace Sevian;
include "../sigefor/Trait.php";
include "Grid.php";

class Fr extends JSForm{
	use \Sigefor\traitFormDB;
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		$this->fields = $this->load($this->name);
	}
}

class Gr extends Grid {
	
	use \Sigefor\FormInfoDB;
	public $panelId = 0;
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();

		$this->fields = $this->loadFormDB($this->name);
		$this->data = $this->getDataGrid($this->searchValue, $this->page);

		$this->search = "
			 S.send(
                {
                    async: true,
                    panel:$this->panelId,
                    valid:false,
                    confirm_: 'seguro?',
                    params:	[
                        {t:'setMethod',
                            id:$this->panelId,
                            element:'testgrid',
                            method:'search',
                            name:'$this->name',
                            eparams:{
								page:1,
                                token:'search',
                                q:this.getSearchValue(),
                            }
                        }
                        
                    ]
                });
				 
			 ";

		$this->paginator = [
			'page'=> $this->page,
			'totalPages'=>	$this->totalPages,
			'maxPages'=>	$this->pageLimit,
			'change'=>"S.send(
				{
					async: true,
					panel:$this->panelId,
					valid:false,
					confirm_: 'seguro?',
					params:	[
						{t:'setMethod',
							id:$this->panelId,
							element:'testgrid',
							method:'get_data',
							name:'$this->name',
							eparams:{

								page:page,
								q:this.getSearchValue(),
								
							   
							}
						}
						
					]
				});"
			];

	}
}

class Gr2 extends Grid {
	
	use \Sigefor\FormJson;
	public $panelId = 0;
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();

		$this->fields = $this->loadFormDB($this->name);
		$this->data = $this->getDataGrid($this->searchValue, $this->page);

		$this->search = "
			 S.send(
                {
                    async: true,
                    panel:$this->panelId,
                    valid:false,
                    confirm_: 'seguro?',
                    params:	[
                        {t:'setMethod',
                            id:$this->panelId,
                            element:'testgrid',
                            method:'search',
                            name:'$this->name',
                            eparams:{
								page:1,
                                token:'search',
                                q:this.getSearchValue(),
                            }
                        }
                        
                    ]
                });
				 
			 ";

		$this->paginator = [
			'page'=> $this->page,
			'totalPages'=>	$this->totalPages,
			'maxPages'=>	$this->pageLimit,
			'change'=>"S.send(
				{
					async: true,
					panel:$this->panelId,
					valid:false,
					confirm_: 'seguro?',
					params:	[
						{t:'setMethod',
							id:$this->panelId,
							element:'testgrid',
							method:'get_data',
							name:'$this->name',
							eparams:{

								page:page,
								q:this.getSearchValue(),
								
							   
							}
						}
						
					]
				});"
			];

	}
}

class GTest extends \Sevian\Element{

	
	use \Sigefor\FormInfoDB;

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

			case "form":
				$this->createForm();
			break;
			case "create":
				
				$this->create();
				break;
			case "get_data":
				$this->setPage($this->eparams->q, $this->eparams->page);
				break;
			case "search":
				$this->setPage($this->eparams->q, 1);
				break;
		}


		
		return true;
	}

	public function createForm(){
		$this->typeElement = "test";
		

		$form = new \Sevian\Panel('div');
        //$form->text = "control-device";
        $form->id = "testgrid_".$this->id;
        $form->innerHTML = "TEST TWO";
		$this->panel = $form;
		$g =  new Fr(['panelId'=>$this->id,
		'name'=>'personas',]);

		$this->info = [
			"tag"=>"FORM TWO",
			"grid"=>$g
		];
	}

	public function create(){
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
		//$this->eparams->page = 1;
		//hr ($this->totalPages);
		$g =  new Gr2([
			'panelId'=>$this->id,
			'name'=>'../json/forms/personas.json',
			'searchFor'=>['cedula', 'nombre_1'],
			'searchValue'=>'',
			'paginator_x' => [
				'page'=> $this->eparams->page?? 1,
				'totalPages'=>	4,//$this->totalPages,
				'maxPages'=>	$this->pageLimit??4,
				'change'=>"S.send(
					{
						async: true,
						panel:$this->id,
						valid:false,
						confirm_: 'seguro?',
						params:	[
							{t:'setMethod',
								id:$this->id,
								element:'testgrid',
								method:'set_page',
								name:'$this->name',
								eparams:{
	
									page:page,
									q:this.getSearchValue(),
									
								   
								}
							}
							
						]
					});"
			]

		]);
		//$this->searchFor = ['cedula'];
		//$g->fields = $this->loadFormDB("alarms");


		//$g->data = $this->getDataGrid(1,2);
		
		//$g->caption = "";
		
		//$g->jsrender();
		
	


		$this->info = [
			"tag"=>"yanny esteban test",
			"grid"=>$g
		];
	}

	public function setPage($q, $page){
		$g =  new Gr([
			'name'=>'alarms']);
		$data = $g->getDataGrid($q, ($page<=0)? 1: $page);
		$opt[] = [
			'method'  => 'setData',
			'args' => [$data, ($page<=0)? 1: $page, $g->getTotalPages()]
		];
		if($page <= 0){
			$opt_[] = [
				'method' => 'setPage',
				'value' => 1
			];
		}
		
		$opt_[] = [
			'method' => 'setTotalPages',
			'value' => $g->getTotalPages()
		];
		
		
		
		$this->typeElement = "";
		$this->info = $opt;//$form->getInfo();

	}

	public function a(){

		$g = new SGGrid("name-form");
		
		$g->render();


	}


}
