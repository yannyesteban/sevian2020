<?php
namespace Sigefor\Component;

require_once MAIN_PATH.'Sevian/JS/Form.php';

require_once MAIN_PATH.'Sigefor/DBTrait/JsonForm.php';


class JsonForm extends \Sevian\JS\Form {

	
	use \Sigefor\DBTrait\JsonForm;

	private $loadRecord = null;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		$info = $this->loadForm($this->name);
		$this->fields = $this->loadFields($info, $this->loadRecord);
		$this->menu = new Menu(['name'=>$this->menuName]);
		//$this->createFields([]);
	}
}