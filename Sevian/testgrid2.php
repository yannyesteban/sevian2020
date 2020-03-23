<?php



namespace Sevian;
include "../sigefor/Trait.php";
include "Grid.php";

include "../sigefor/Component/Menu.php";
include "../sigefor/Component/Form.php";
include "../sigefor/Component/Grid.php";

include "../sigefor/Component/FormSave.php";

class GTest extends \Sevian\Element{

	
	use \Sigefor\FormInfoDB;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		
	}

	public function config(){

		if(!$this->getSes('_records')){
			$this->setSes('_records', []);
		}

		$this->records = &$this->getSes('_records');

		hr($this->records);
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
			case "save":
				$this->save();
			break;

		}


		
		return true;
	}

	public function createForm(){
		$this->typeElement = "test";
		

		$form = new \Sevian\Panel('div');
        //$form->text = "control-device";
        $form->id = "testgrid_".$this->id;
        //$form->innerHTML = "TEST TWO";
		$this->panel = $form;
		$g =  new \Sigefor\Component\Form(
			[
				'panelId'=>$this->id,
				'name'=>'brands'
			]);
hr($this->records = $g->getDataKeys());
		$this->info = [
			"id"=>"testgrid_".$this->id,
			"tag"=>"FORM TWO",
			"grid"=>$g,
			'menu'=> new \Sigefor\Component\Menu(['name'=>'catalog'])
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

	public function save(){

		$g =  new \Sigefor\Component\FormSave(
			[
				'panelId'=>$this->id,
				'name'=>'brands'
			]);
			\Sevian\S::setReq("__record_", (object)["id"=>48])	;
		$_data = (object)\Sevian\S::getVReq();
		//print_r([$_data]);
		$result = $g->send([$_data]);
		//hr("hola2");

		
		foreach($result as $k => $v){

			if(!$v->error){
				//print_r($result);
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>$g->caption,
					'text'=>'Record was saved!!!'
				]));
			}else{
				//print_r($result);
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>'Error '.$g->caption,
					'text'=>"Record wasn't saved!!!"
				]));

			}

		}
		
	}


}




