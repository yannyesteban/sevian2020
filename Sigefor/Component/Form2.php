<?php
namespace Sigefor\Component;

//require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';
require_once MAIN_PATH.'Sevian/JS/Form.php';
require_once MAIN_PATH.'Sigefor/DBTrait/Form2.php';
//require_once MAIN_PATH.'Sigefor/Component/FormSave.php';

class Form2 extends \Sevian\JS\Form{
	

	use \Sigefor\DBTrait\Form2;

	private $loadRecord = null;

	public $patternJsonFile = '';
	public $userData = [];
	//private $record = null;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		
		$this->loadForm($this->name, $this->record, $this->patternJsonFile);
		
		$this->menu = new Menu(['name'=>$this->menuName]);

		$this->menu = new Menu([
			'name'=>$this->menuName,
			'userData'=>&$this->userData,
			'onDataUser'=>$this->onDataUser?? 'S.send(dataUser);' 
			]);
		

	}
	
}