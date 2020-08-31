<?php
namespace Sigefor\Component;

//require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';
require_once MAIN_PATH.'Sevian/JS/Grid.php';
require_once MAIN_PATH.'Sigefor/DBTrait/Grid.php';
require_once MAIN_PATH.'Sigefor/Component/Menu.php';

class Grid extends \Sevian\JS\Grid {
	
	use \Sigefor\DBTrait\JasonFileInfo;
	use \Sigefor\DBTrait\Grid;

	public $panelId = 0;
	public $element = null;
	public $asyncMode = true;
	public $patternJsonFile = '';
	public $userData = [];
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();

		if($this->name){
			$this->loadForm($this->name, null, $this->patternJsonFile);
			
			$this->data = $this->getDataGrid($this->searchValue, $this->page);
			
			$this->menu = new Menu([
				'name'=>$this->menuName,
				'userData'=>&$this->userData,
				'onDataUser'=>$this->onDataUser?? 'S.send(dataUser);' 
				]);
			
		}
	}
}