<?php

namespace Sevian;

class Page extends HTML{
    public $typePage = "normal"; // "fieldset"
	public $tagName = "section";
	public $captionTagName = "header";
    public $caption = false;

    public $_caption = false;
	
	private $_dataType = "data-page-type";
	private $_mainType = "page";
	
	private $_tables = [];
	private $_table = false;
	
	public function setDataType($dataType){
		$this->_dataType = $dataType;
	}
	public function getDataType(){
		return $this->_dataType;
	}
	public function setMainType($type){
		$this->_mainType = $type;
	}
	public function getMainType(){
		return $this->_mainType;
	}
	
    public function __construct($opt = []){

		if(is_array($opt)){
			foreach($opt as $k => $v){
				$this->$k = $v;	
			}
		}
		
		
		$this->{$this->getDataType()} = "main";
		$this->{"data-main-type"} = $this->getMainType();
		
		
		if($this->typePage == "fieldset"){
			$this->tagName = "fieldset";
			$this->captionTagName = "legend";
		}
		
		
        if($this->caption !== false){

            $this->setcaption($this->caption);
        }

    }


    public function setCaption($caption){
		
		if(!$this->_caption){
			$this->_caption = new HTML("header");
			$this->_caption->{$this->getDataType()} = "caption";
			$this->_caption->class = "caption";
			
			HTML::insertFirst($this->_caption);
		}
		
		$this->_caption->innerHTML = $caption;
		return $this->_caption;
		
	}

	public function _addTable(){
        $this->_tables[] = $this->_table = $this->add("div");
		$this->_table->class = "form-group";
		return $this->_table;
	}
	
	public function _addRow($row){
		if(!$this->_table){
			
			$this->addTable();
		}
		
		$this->_table->appendChild($row);
		
	}
	
    public function addSection(){

        $section = new HTML("div");
        $this->_section = $section;

    }

    public function addNav($opt){

        $nav = new HTML("nav");
        HTML:appendChild($nav);
    } 

}





?>