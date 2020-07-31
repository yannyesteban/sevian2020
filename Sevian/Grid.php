<?php
namespace Sevian;


class JSMenu {
	public $menu = "";
	public $caption = "MENU 5.0";
	public $class = "";
	public $params = "";
	//public $config = [];
	public $items = [];

	public $tag = "yanny";
	
	
}

class JSForm{
	public $target = "";
	public $name = "";
	public $id = "";
	public $caption = "";
	public $className = "";
	public $type = "";
	public $iconClass = "";
	
	public $fields = [];
	public $data = "";

	public $pages = "";
	public $menu = "";
	
	
}

class Grid  {
	
	public $target = "";
	public $name = "";
	public $id = "";
	public $caption = "";
	public $className = "";
	public $type = "";
	public $selectMode = "";
	public $editMode = "";
	public $fields = [];
	public $data = "";
	
	public $page = 1;
	public $paginator = "";
	public $searchControl = "";
	public $searchValue = "";
	

	public $menu = "";
	public $form = "";

	
	
	public function jsonSerialize() {
        return $this->array;
	}
	
	public function jsrender(){

	}

}



?>