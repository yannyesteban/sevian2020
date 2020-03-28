<?php



namespace Sevian;
include "../sigefor/Trait.php";
include "Grid.php";

include "../sigefor/Component/Menu.php";
include "../sigefor/Component/Form.php";
//include "../sigefor/Component/JsonForm.php";
include "../sigefor/Component/Grid.php";

include "../sigefor/Component/FormSave.php";

class GTest extends \Sevian\Element{

	private $records = null;
	private $lastRecord = null;
	
	//use \Sigefor\FormInfoDB;

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
		if(!$this->getSes('_lastRecords')){
			$this->setSes('_lastRecords', []);
		}

		$this->records = &$this->getSes('_records');
		$this->lastRecord = &$this->getSes('_lastRecords');

		//hr($this->lastRecord);
	}

	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
        }
		//hr($method,"red");
		switch($method){

			case "form":
				$this->createForm('form');
				break;
			case 'grid':
				$this->createForm('grid');
				break;
			case 'js-grid':
				$this->createForm('js-grid');
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

	public function createForm($type = 'form'){
		$this->typeElement = "test";
		

		$form = new \Sevian\Panel('div');
        //$form->text = "control-device";
        $form->id = "testgrid_".$this->id;
        //$form->innerHTML = "TEST TWO";
		$this->panel = $form;
		if($type == 'form'){

			//hr($this->getRecord());
			$g =  new \Sigefor\Component\Form([
				'panelId'=>$this->id,
				//'name'=>$this->name,
				'name'=>'#../json/forms/brands.json',
				'record'=>$this->getRecord()
			]);
			
			
		}else if($type == 'grid'){
			$this->lastRecord = null;
			$g =  new \Sigefor\Component\Grid([
				'panelId'=>$this->id,
				//'name'=>$this->name,
				'name'=>'#../json/forms/brands.json'
			]);
		}else if($type == 'js-grid'){
			$type = 'grid';
			$this->lastRecord = null;
			$g =  new \Sigefor\Component\JsonForm([
				'panelId'=>$this->id,
				'name'=>'../json/forms/brands.json'
			]);
		}
		
		$this->records = $g->getDataKeys();
		
		
		
			$this->info = [
			"id"=>"testgrid_".$this->id,
			"tag"=>"FORM TWO",
			$type=>$g,
			//'menu'=> new \Sigefor\Component\Menu(['name'=>'#../json/menus/menu1.json']),
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
		$g =  new \Sigefor\Component\Grid([
			//'name'=>$this->name
			'name'=>'#../json/forms/brands.json'
		
		]);
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
		
		
		$this->records = $g->getDataKeys();
		$this->typeElement = "";
		$this->info = $opt;//$form->getInfo();

	}

	

	public function getRecord(){



		if($this->lastRecord){
			return $this->lastRecord;
		}
		$__id_ = \Sevian\S::getReq("__id_");

		if(!$__id_){
			return null;
		}
		//hr( \Sevian\S::getVReq());
		//hr($this->method."...".$this->id,"red");
		//hr($__id_,"blue","aqua");
		//hr($this->_rId,"orange");
		//hr($this->getRId($__id_),"red");
		//$record = $this->pVars['records'][$__id_]?? false;
		$record = $this->records[$__id_];
		/*
			OJO :
			evita el error cuando el usuario pulsa F5/Refresh
			$this->records[$__id_] = $record;
		*/
		//$this->records[$__id_] = $record;
		$this->lastRecord = $record;
		return $record;
	}
	
	public function save(){
		//hr($this->records);
		$g =  new \Sigefor\Component\FormSave(
			[
				'panelId'	=> $this->id,
				'name'		=> $this->name,
				'dataKeys'	=> &$this->records
			]);
			//\Sevian\S::setReq("__record_", (object)["id"=>48])	;

			//$g::setDictRecords($this->records);	
		$_data = (object)\Sevian\S::getVReq();
		//print_r([$_data]);
		$result = $g->send([$_data]);
		//hr("hola2");
		//hr($result);
		$this->lastRecord = $this->records[0];
		//hr($this->records);
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




