<?php
namespace Sigefor\Component;

include "../Sevian/JS/Form.php";

include "../Sigefor/DBTrait/Form.php";


class Form extends \Sevian\JS\Form {

	
	use \Sigefor\DBTrait\Form;

	private $loadRecord = null;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		
		if($this->name){
			if(substr($this->name, 0, 1) == '#'){

				
				$this->name = substr($this->name, 1);
				$info = $this->loadJsonFile($this->name);
				$this->jsonConfig($info);

				$this->setInfoFields($this->fields, $this->loadRecord);
			}else{
				$this->loadForm($this->name);
				$this->fields = $this->loadFields($this->name, $this->loadRecord);
				
			}
			$this->menu = new Menu(['name'=>$this->menuName]);
		}

		
		//$this->createFields([]);
	}

	
}