<?php

namespace sigefor;

use DBTrait\Form as TForm;
class SuperForm extends \sevian\JsComponent{
	use DBTrait\Form;

	private $loadRecord = null;

	private $_info = null;
	private $_mode = '';
	private $_type = '';
	private $_name = '';

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();

		if($this->method){
			$this->evalMethod($this->method);
		}
	}

	public function evalMethod($method = null): bool{

		if($method){
			$this->method = $method;
		}
		switch($this->method){
			case 'request':
				$this->createForm(1);
				break;
			case 'load':
				$this->createForm(2);
				break;
			case 'list':
				$this->createGrid(1, '');
				break;
			case 'save':
				$this->save();
				break;
			case 'get_data':
				$this->createGrid($this->eparams->page, $this->eparams->q ?? '');
				break;
			case 'search':
				$this->createGrid(1, $this->eparams->q ?? '');
				break;
			default:
				break;

		}
		return true; 
	}

	private function createForm($mode){
		$infoForm = $this->infoDBForm($this->name);
		$this->setInfoForm($infoForm);
		$infoField = $this->infoDBFields($this->name);
		$this->setInfoFields($infoField, $this->loadRecord);
		$this->menu = new \Sigefor\Component\Menu(['name'=>$this->menuName]);

		$f = new \Sevian\JS\Form();
		$f->id = $this->id;
		$f->caption = $this->caption;
		$f->fields = $this->fields;
		$f->menu = $this->menu;
		$this->_name = $this->name;
		$this->_type = 'Form2';
		$this->_mode = 'create';
		$this->_info = $f;

		//echo json_encode($f, JSON_PRETTY_PRINT);exit;
	}

	public function jasonRender(){

		return [
			'name'	=> $this->_name,
			'type'	=> $this->_type,
			'mode'	=> $this->_mode,
			'info'	=> $this->_info
		];
	}

}
