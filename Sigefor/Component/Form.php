<?php
namespace Sigefor\Component;

include "../Sevian/JS/Form.php";
include "../Sigefor/DBTrait/Form.php";

class Form extends \Sevian\JS\Form{
	
	use \Sigefor\DBTrait\Form;

	private $loadRecord = null;

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
				$this->setInfoFields($infoForm['infoFields']);

			}else{
				$infoForm = $this->infoDBForm($this->name);
				$this->setInfoForm($infoForm);
				$infoField = $this->infoDBFields($this->name);
				$this->setInfoFields($infoField, $this->loadRecord);
				
			}

			$this->menu = new Menu(['name'=>$this->menuName]);
		}

	}
	
}