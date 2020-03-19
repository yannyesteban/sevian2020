<?php
namespace Sevian;



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