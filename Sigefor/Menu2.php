<?php


namespace SIGEFOR;


//require_once MAIN_PATH.'Sigefor/DBTrait/Menu2.php';

class Menu2 extends \Sevian\Element {

	//use	DBTrait\Menu2;


	private $infoPanels = null;
	private $_dbINFO = [];
	public $jsClassName = 'Menu';
	//static public $patternJsonFile = '';
	static public $elementStructure = '';
	static public $patternJsonFile = '';

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
				$this->createMenu();
				/*
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

				*/


			break;
			case 'load':


		}
		return true;
	}

	public function createMenu(){

		if(!$this->containerId){
            $this->containerId = $this->id;
        }

		$info = new Component\Menu([

            'id'		=> $this->containerId,
            'panelId'	=> $this->id,
            'name'		=> $this->name,//JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
			'method'	=> $this->method,
			'onDataUser'=>$this->onDataUser?? 'S.send(dataUser);'

        ]);

		$div = new \SEVIAN\HTML('div');
        $div->id = $this->containerId;
        $this->setPanel($div);

        //$info->id = $this->containerId;
        $this->setInit($info);

		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> '',
			'iClass'	=> 'Menu',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> $info
		]);

	}
}