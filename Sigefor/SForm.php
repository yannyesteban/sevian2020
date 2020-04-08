<?php
namespace sigefor;

trait DataRecord{

	

	public $_masterData = [];
	public $_lastRecord = [];

	public function initDataRecord(){

		if(!$this->getSes('_masterData')){
			$this->setSes('_masterData', []);
		}

		if(!$this->getSes('_lastRecord')){
			$this->setSes('_lastRecord', []);
		}

		$this->_masterData = &$this->getSes('_masterData');
		$this->_lastRecord = &$this->getSes('_lastRecord');

	}

	public function setDataRecord($key, $record){
		$this->_masterData[$key] = $record;
	}
	public function getDataRecord($key){
		return $this->_masterData[$key];
	}
	public function getRecord($name, $index){

		if($this->_lastRecord){
			//return $this->_lastRecord;
		}
		
		$record = $this->_masterData[$name][$index];
		$this->_lastRecord = $record;
		return $record;
	}

}

class SForm extends \sevian\element implements \sevian\JasonComponent{
	
	use DataRecord;
	
	private $_info = null;
	private $_mode = '';
	private $_type = '';
	private $_name = '';


	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}
		
        $this->cn = \Sevian\Connection::get();
    }
	
	public function config(){
		$this->initDataRecord();
	}

	public function evalMethod($method = false): bool{
		
		if($method === false){
            $method = $this->method;
		}
		
		switch($method){
			case 'request':
				$this->createForm(1);
				break;
			case 'load':
				$this->createForm(2);
				break;
			case 'list':
				$this->createGrid(1, '');
				break;
			case 'save':
				$this->save();
				break;
			case 'get_data':
				$this->createGrid($this->eparams->page, $this->eparams->q ?? '');
				break;
			case 'search':
				$this->createGrid(1, $this->eparams->q ?? '');
				break;
			default:
				break;

		}
		
		return true;
	}

	public function createForm($mode = 1){
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = $this->element.'-'.$this->id;
		$this->typeElement = 'Form2';
		if($mode == 1){
			$form =  new \Sigefor\Component\Form([

				'id'		=> $this->panel->id,
				'panelId'	=> $this->id,
				'name'		=> $this->name,//'#../json/forms/brands.json',
				'method'	=> $this->method,
				'mode'		=> 1
				//'record'=>$this->getRecord()
			]);
		}else if($mode == 2){
			$__id_ = \Sevian\S::getReq("__id_");

			if(!isset($__id_)){
				$__id_ = 0;
			}

			$form =  new \Sigefor\Component\Form([

				'id'		=> $this->panel->id,
				'panelId'	=> $this->id,
				'name'		=> '#../json/forms/brands.json',
				'method'	=> $this->method,
				'mode'		=> 2,
				'record'	=> $this->getRecord('grid', $__id_)
			]);

			//$records[$__id_] = $form->getDataKeys()[0];
			
			//$this->setDataRecord('form', $records);
		}
		
		$this->info = $form;
		$form->id = 'one_6';
		$this->_name = $this->name;
		$this->_type = 'Form2';
		$this->_mode = 'create';
		$this->_info = $form;
		
	}
	
	public function createGrid($page = 1, $searchValue = ''){
		$this->panel = new \Sevian\HTML('div');

		$this->panel->id = $this->element.'-'.$this->id;
		$this->typeElement = 'Grid2';

		$grid =  new \Sigefor\Component\Grid([
			'asyncMode'	=> false,
			'id'		=> $this->panel->id,
			'panelId'	=> $this->id,
			'name'		=> $this->name,//'#../json/forms/brands.json',
			'method'	=> $this->method,
			'page'		=> $page,
			'searchValue' => $searchValue
			
		]);

		
		$records=$grid->getDataKeys();
		$this->setDataRecord('grid', $records);

		$this->info = $grid;

		//$grid->id = $this->panel->id;
		$this->_name = $this->name;
		$this->_type = 'Grid2';
		$this->_mode = 'create';
		$this->_info = $grid;
		//print_r(json_encode($grid,JSON_PRETTY_PRINT));exit;
		
	}

	public function save(){

		$formSave =  new \Sigefor\Component\FS([
			'name'		=> '#../json/forms/brands.json',
			'dataKeys'	=> $this->_masterData,
			'dataKeysId'=> 'grid',
			'data'		=> [(object)\Sevian\S::getVReq()]
		]);
		
		//print_r($formSave->getResult());

		foreach($formSave->getResult() as $k => $v){
			
			if(!$v->error){
				
				$this->addFragment(new \Sevian\iMessage([
					'caption'	=> $formSave->getCaption(),
					'text'		=> 'Record was saved!!!'
				]));
				
			}else{
				
				$this->addFragment(new \Sevian\iMessage([
					'caption'	=> 'Error '.$formSave->getCaption(),
					'text'		=> "Record wasn't saved!!!"
				]));

			}
		}
		
	}

	public function jasonRender(){

		return [
			'name'	=> $this->_name,
			'type'	=> $this->_type,
			'mode'	=> $this->_mode,
			'info'	=> $this->_info
		];
	}
}

class Form2000 extends \sevian\element{
	
	use DataRecord;
	
	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}
		
        $this->cn = \Sevian\Connection::get();
    }
	
	public function config(){
		$this->initDataRecord();
	}

	public function evalMethod($method = false): bool{
		
		if($method === false){
            $method = $this->method;
		}
		
		switch($method){
			case 'request':
				$this->createForm(1);
				break;
			case 'load':
				$this->createForm(2);
				break;
			case 'list':
				$this->createGrid(1, '');
				break;
			case 'save':
				$this->save();
				break;
			case 'get_data':
				$this->createGrid($this->eparams->page, $this->eparams->q ?? '');
				break;
			case 'search':
				$this->createGrid(1, $this->eparams->q ?? '');
				break;
			default:
				break;

		}
		
		return true;
	}

	public function createForm($mode = 1){
		
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = $this->element.'-'.$this->id;
		$this->typeElement = 'Form2';
		if($mode == 1){
			$form =  new \Sigefor\Component\Form([

				'id'		=> $this->panel->id,
				'panelId'	=> $this->id,
				'name'		=> '#../json/forms/brands.json',
				'method'	=> $this->method,
				'mode'		=> 1
				//'record'=>$this->getRecord()
			]);
		}else if($mode == 2){
			$__id_ = \Sevian\S::getReq("__id_");

			if(!isset($__id_)){
				$__id_ = 0;
			}

			$form =  new \Sigefor\Component\Form([

				'id'		=> $this->panel->id,
				'panelId'	=> $this->id,
				'name'		=> '#../json/forms/brands.json',
				'method'	=> $this->method,
				'mode'		=> 2,
				'record'	=> $this->getRecord('grid', $__id_)
			]);

			//$records[$__id_] = $form->getDataKeys()[0];
			
			//$this->setDataRecord('form', $records);
		}
		
		$this->info = [
			'type'=>'Form',
			'name'=>$this->name,
			'mode'=>'create',
			'info'=>$form
		];
		
	}
	
	public function createGrid($page = 1, $searchValue = ''){
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = $this->element.'-'.$this->id;
		$this->typeElement = 'Grid2';

		$grid =  new \Sigefor\Component\Grid([
			'asyncMode'	=> false,
			'id'		=> $this->panel->id,
			'panelId'	=> $this->id,
			'name'		=> '#../json/forms/brands.json',
			'method'	=> $this->method,
			'page'		=> $page,
			'searchValue' => $searchValue
			
		]);
		$records=$grid->getDataKeys();
		$this->setDataRecord('grid', $records);

		$this->info = $grid;
		
	}

	public function save(){

		$formSave =  new \Sigefor\Component\FS([
			'name'		=> '#../json/forms/brands.json',
			'dataKeys'	=> $this->_masterData,
			'dataKeysId'=> 'grid',
			'data'		=> [(object)\Sevian\S::getVReq()]
		]);
		
		//print_r($formSave->getResult());

		foreach($formSave->getResult() as $k => $v){
			
			if(!$v->error){
				
				$this->addFragment(new \Sevian\iMessage([
					'caption'	=> $formSave->getCaption(),
					'text'		=> 'Record was saved!!!'
				]));
				
			}else{
				
				$this->addFragment(new \Sevian\iMessage([
					'caption'	=> 'Error '.$formSave->getCaption(),
					'text'		=> "Record wasn't saved!!!"
				]));

			}
		}
		
	}
}