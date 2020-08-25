<?php
namespace Sigefor\Component;
require_once MAIN_PATH.'Sigefor/DBTrait/Form2.php';
require_once MAIN_PATH.'Sigefor/FormSave.php';


class FF{
	use \SIGEFOR\DBTrait\Form2;
	
	public $patternJsonFile = '';
	public $userData = [];
	
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
		
		$this->cn = \Sevian\Connection::get();
		$this->infoRecord($this->name, $this->patternJsonFile);
		
		
		$info2 = new \Sigefor\InfoRecord([
			'token'=>'yanny',
			'cn'		=> '_default',
			
			'tables'	=> $this->getTables(),
			'fields'	=> $this->fields,
			'subforms'	=> $this->subforms,
			'dataKeys'=> $this->dataKeys,
			'dataKeysId'=>$this->dataKeysId,
			
			//'data' 		=> $this->data
		]);
		
		
		$xx = function($parametro){
			hr($this->tables);
			hx("Parametro: $parametro\n","red");
		};
		$z = $xx->bindTo($info2, $info2);
		
		$z("5");
		//hx($info2);
		$this->result = \Sigefor\FormSave::send($info2, $this->data, []);

	}

	public function getResult(){
		return $this->result;
	}
	public function getCaption(){
		return $this->caption;
	}
}



//include "../Sevian/JS/Form.php";

//include "../Sigefor/DBTrait/Form.php";
require_once MAIN_PATH.'Sigefor/DBTrait/FormSave.php';
class ConfigForm{
	use \Sigefor\DBTrait\Form2;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		if($this->name){
			if(substr($this->name, 0, 1) == '#'){

				$filePath = substr($this->name, 1);

				$infoForm = $this->loadJsonFile($filePath);
				$this->setInfoForm($infoForm);
				$this->setInfoRecordFields($infoForm['infoFields']);
				
			}else{
				$infoForm = $this->infoDBForm($this->name);
				$this->setInfoForm($infoForm);
				$infoField = $this->infoDBFields($this->name);
				$this->setInfoRecordFields($infoField);
				
			}
		}
	}

	public function getTables(){
		return $this->infoQuery->tables;
	}

}
class FS{
	private $name = null;
	private $_form = null;
	private $data = null;
	private $result = null;
	public $dataKeys = null;
	public $dataKeysId = null;
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			
			$this->$k = $v;
			
			
		}
		
		$this->cn = \Sevian\Connection::get();
		$this->createInfoDB($this->name);
	}

	public function createInfoDB($name){

		$this->_form = $_form = new ConfigForm(['name'=>$this->name]);

		$aux = [];
		if($_form->subforms?? false){
			foreach($_form->subforms as $subform){

				$s = new ConfigForm(['name'=>$subform->form]); 
				$info = new \Sevian\Sigefor\InfoRecord([
					'cn'		=> '_default',
					'mode'		=> 'update',
					'tables'	=> $s->getTables(),
					'fields'	=> $s->fields,
					'masterFields'=>$subform->masterFields,
					'fieldData'=>$subform->fieldData,
					'dataKeysId'=>$subform->dataKeysId
					//'data' 		=> $this->data
				]);
				$aux[] = $info;
				
			}
		}
		
		$info2 = new \Sevian\Sigefor\InfoRecord([
			'token'=>'yanny',
			'cn'		=> '_default',
			
			'tables'	=> $_form->getTables(),
			'fields'	=> $_form->fields,
			'subforms'	=> $aux,
			'dataKeys'=> $this->dataKeys,
			'dataKeysId'=>$this->dataKeysId,
			
			//'data' 		=> $this->data
		]);
		
		$save = 'Sevian\Sigefor\FormSave';

		$this->result = $save::send($info2, $this->data, []);

	}

	public function getResult(){
		return $this->result;
	}
	public function getCaption(){
		return $this->_form->caption;
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