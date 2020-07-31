<?php
namespace Sigefor\DBTrait;
require_once MAIN_PATH.'Sigefor/DBTrait/Form.php';

class ConfigForm{
	use Form;

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
	}

}