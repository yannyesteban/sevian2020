<?php
namespace Sigefor\Component;

//include "../Sevian/JS/Form.php";

//include "../Sigefor/DBTrait/Form.php";
include "../Sigefor/DBTrait/FormSave.php";

class FormSave {
	use \Sigefor\DBTrait\FormSave;
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
	}
}