<?php
namespace Sigefor\Component;

//include "../Sevian/JS/Form.php";

//include "../Sigefor/DBTrait/Form.php";
include "../Sigefor/DBTrait/FormSave.php";
class ConfigForm{
	use Form;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
	}

}
class FS{

	private $_form = null;
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
		$this->cn = \Sevian\Connection::get();
	}

	public function createInfo($name){

		$this->_form = new ConfigForm();
		$this->_form->loadForm($this->name);
		$this->_form->configFields($this->name);
	}

	public function save($data){
		$info = new \Sevian\Sigefor\InfoRecord([
			'cn'		=> '_default',
			'mode'		=> 'update',
			'tables'	=> $this->_form->infoQuery->tables,
			'fields'	=> $this->_form->fields,
			'data' 		=> $data,
		]);

		$save = 'Sevian\Sigefor\FormSave';
		//$save::setDictRecords($this->pVars['records']);
		//$save::setDictRecords($this->getSes('_rec'));

		if($this->dataKeys){
			$save::setDictRecords($this->dataKeys);
		}
		
		return $save::send($info, $data, []);

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