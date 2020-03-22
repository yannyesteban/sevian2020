<?php
namespace Sigefor\Component;

include "../Sevian/JS/Menu.php";
include "../Sigefor/DBTrait/Menu.php";


class Menu extends \Sevian\JS\Menu {
	use \Sigefor\DBTrait\Menu;

	
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		$this->loadMenu($this->name);


	}
}