<?php
namespace Sigefor\Component;

require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';
require_once MAIN_PATH.'Sevian/JS/Form.php';
require_once MAIN_PATH.'Sigefor/DBTrait/Form.php';

class Form extends \Sevian\JS\Form{
	
	use \Sigefor\DBTrait\JasonFileInfo;
	use \Sigefor\DBTrait\Form;

	private $loadRecord = null;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		
		if($this->name){
			if(substr($this->name, 0, 1) == '#'){
				
				//$filePath = substr($this->name, 1);

				$infoForm = $this->loadJsonInfo($this->name);
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