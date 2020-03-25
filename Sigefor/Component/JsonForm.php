<?php
namespace Sigefor\Component;

include_once "../Sevian/JS/Form.php";

include_once "../Sigefor/DBTrait/JsonForm.php";


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