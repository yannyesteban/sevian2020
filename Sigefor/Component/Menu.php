<?php
namespace Sigefor\Component;

require_once MAIN_PATH.'Sevian/JS/Menu.php';
require_once MAIN_PATH.'Sigefor/DBTrait/Menu2.php';




class Menu extends \Sevian\JS\Menu {
	use \Sigefor\DBTrait\Menu2;

	static public $patternJsonFile = JSON_PATH.'{name}.json';
	
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}

		$this->cn = \Sevian\Connection::get();

		if($this->name){
			$this->loadMenu($this->name);
		}

	}
}