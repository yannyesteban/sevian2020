<?php
namespace Sigefor\Component;

//require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';
require_once MAIN_PATH.'Sevian/JS/Form.php';
require_once MAIN_PATH.'Sigefor/DBTrait/Form.php';

class Form2 extends \Sevian\JS\Form{
	

	use \Sigefor\DBTrait\Form2;

	private $loadRecord = null;

	public $patternJsonFile = '';
	
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		
		$this->loadForm($this->name, $record, $pattern);
		$this->menu = new Menu(['name'=>$this->menuName]);
		

	}
	
}