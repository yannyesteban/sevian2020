<?php
namespace Sigefor\Component;

//include "../Sevian/JS/Form.php";

//include "../Sigefor/DBTrait/Form.php";
include "../Sigefor/DBTrait/FormSave.php";
class ConfigForm{
	use \Sigefor\DBTrait\Form;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
	}

	public function getTables(){
		return $this->infoQuery->tables;
	}

}
class FS{
	private $name = null;
	private $_form = null;
	private $data = null;
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
		$this->cn = \Sevian\Connection::get();
		$this->createInfoDB($this->name);
	}

	public function createInfo($name){

		$this->_form = new ConfigForm();
		$this->_form->loadForm($this->name);
		$this->_form->configFields($this->name);
	}

	public function createInfoDB($name){

		//print_r($this->data);


		$_form = new ConfigForm();
		$_form->loadForm($name);
		$_form->configFields($name);
		$aux = [];
		if($_form->subforms){
			foreach($_form->subforms as $subform){
				$s = new ConfigForm(); 
				$s->loadForm($subform->form);
				$s->configFields($subform->form);
				$info = new \Sevian\Sigefor\InfoRecord([
					'cn'		=> '_default',
					'mode'		=> 'update',
					'tables'	=> $s->getTables(),
					'fields'	=> $s->fields,
					'masterFields'=>$subform->masterFields,
					'fieldData'=>$subform->fieldData
					//'data' 		=> $this->data
				]);
				$aux[] = $info;
				
			}
		}

		$info2 = new \Sevian\Sigefor\InfoRecord([
			'cn'		=> '_default',
			
			'tables'	=> $_form->getTables(),
			'fields'	=> $_form->fields,
			'subforms'	=> $aux,
			//'data' 		=> $this->data
		]);

		$save = 'Sevian\Sigefor\FormSave';
		//$save::setDictRecords($this->pVars['records']);
		//$save::setDictRecords($this->getSes('_rec'));

		if($this->dataKeys??false){
			$save::setDictRecords($this->dataKeys);
		}
		
		$result = $save::send($info2, $this->data, []);

		print_r($result);
		exit;

	}

	public function save($data=null){

		if($data){
			$this->data = $data;
		}
		print_r($this->_form->subform);
		exit;
		$info = new \Sevian\Sigefor\InfoRecord([
			'cn'		=> '_default',
			'mode'		=> 'update',
			'tables'	=> $this->_form->getTables(),
			'fields'	=> $this->_form->fields,
			//'data' 		=> $this->data
		]);

		$save = 'Sevian\Sigefor\FormSave';
		//$save::setDictRecords($this->pVars['records']);
		//$save::setDictRecords($this->getSes('_rec'));

		if($this->dataKeys??false){
			$save::setDictRecords($this->dataKeys);
		}
		
		$result = $save::send($info, $this->data, []);

		print_r($result);

	}


}

class FormSave {
	use \Sigefor\DBTrait\FormSave;
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
	}
}