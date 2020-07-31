<?php


namespace SIGEFOR;


require_once MAIN_PATH.'Sigefor/DBTrait/Menu2.php';

class Menu2 extends \Sevian\Element {
	
	use	DBTrait\Menu2;

	
	private $infoPanels = null;
	private $_dbINFO = [];
	
	//static public $patternJsonFile = '';
	static public $elementStructure = '';
	

	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();
	}

	public function config(){
		
	}
	
	public function evalMethod($method = false): bool{

		if($method){
			$this->method = $method;
		}

		switch($this->method){
			case 'create':
				$this->loadMenu($this->name);
				$this->panel = new \SEVIAN\HTML('div');
				
				$this->panel->id = $this->getPanelId();
				$this->typeElement = "Menu";
				$menu = [
					'id'=>$this->panel->id,
					'caption'=>$this->caption,
					'type'=>$this->type,
					'subType'=>$this->subType,
					'className'=>$this->className,
					'autoClose'=>$this->autoClose,
					'items'=>$this->items,
					'onDataUser'=>$this->onDataUser?? 'S.send(dataUser);' 
				


				];
				$this->info = $menu;
				



			break;
			case 'load':
				$info = $this->loadModule($this->name);

				$this->infoPanels[] = new \Sevian\InfoElement([
					'id'=>0,
					'element'=>self::$elementStructure,
					'method'=>'load',
					'name'=>$this->structure
					
				]);
				break;

		}
		return true;		
	}
}