<?php
namespace Sigefor\Component;

include "../Sevian/JS/Form.php";

include "../Sigefor/DBTrait/Form.php";


class Form extends \Sevian\JS\Form {
	use \Sigefor\DBTrait\Form;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		$this->loadForm($this->name);
		$this->fields = $this->loadFields($this->name);
		$this->menu = new Menu(['name'=>$this->menuName]);
		//$this->createFields([]);
	}
}