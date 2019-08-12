<?php

namespace Sevian;

class FormField extends HTML{

	public $tagName = "div";
	public $input = false;
	public $name = false;

	public $caption = false;
	
	
	private $_body = false;
	private $_input = false;
	private $_caption = false;

	private $_dataType = "data-page-type";
	private $_mainType = "page";
	
	
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
		
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;	
			}
		}
		

		//$this->_row = $this->add("div");

		if($this->caption){
			$this->setCaption($this->caption);
		}
		
		$this->_body = $this->add("div");
		$this->class = "form-field";
		if($this->class){
			$this->class = " ".$this->class;
		}

		
		if($this->input){
			
			
			
			$this->_input = S::sgInput($this->input);
			$this->_body->appendChild($this->_input);
		}
		

	}

	public function setCaption($caption){

		if(!$this->_caption){
			$this->_caption = $this->add("label");
			/*
			if(isset($this->input["name"]) and $this->input["name"]){
				$this->_caption->for = $this->input["name"];
			}
*/
		}
		$this->_caption->text = $caption;
		return $this->_caption;
	}

	public function getInput(){
		return $this->_input;
	} 

}

class Form extends Page{
	
	
	public $_fields = [];
	
	public $_page = false;
	
	

	public $_pages = [];

	public $tabs = [];
	private $_tab = false;

	private $_tables = [];
	private $_table = false;

	public function __construct($opt = false){
		
		$this->setDataType("data-form-type");
		$this->setMainType("form");
		
		Page::__construct($opt);
		
		$this->addClass("ss-form");
		
		$this->_page = $this;
	}
	
	public function addTable(){
        $this->_tables[] = $this->_table = $this->_page->add("div");
		$this->_table->class = "form-group";
		
		return $this->_table;
	}

	private function addRow($row){
		if(!$this->_table){
			
			$this->addTable();
		}
		
		$this->_table->appendChild($row);

	}
	
	public function addField($opt){
		
		$field = $this->_fields[] = new FormField($opt);
		
		$this->addRow($field);
		return $field;
	}
	
	public function addPage($opt=[]){

		$page = new Page($opt);
		$this->_page->appendChild($page);
		$this->_page = $page;
		$this->_table = false;
		return $page;
	}
	
	public function addTab($opt = []){

		$this->tabs[] = $tab = new Tab($opt);
		$this->_page->appendChild($tab);
		$this->_tab = $tab;
		return $tab;
	}
	
	public function addTabPage($opt = []){

		if($this->_tab){
			$this->_table = false;
			return $this->_page = $this->_tab->add($opt);
		}
		return false;
	}
}

class FieldSet extends HTML{
	public $tagName = "fieldset";
	public $caption = false;
	private $_caption = false;
	public function __construct	($opt = false){
		
		if(is_array($opt)){
			foreach($opt as $k => $v){
				$this->$k = $v;	
			}// next			
		}// end if			
		
		if($this->caption){
			$this->_caption = new HTML("legend");
			$this->_caption->text = $this->caption;
			$this->appendChild($this->_caption);
		}

		//$this->_body = new HTML("");
		

	}

}

class Page1 extends HTML{
	
	public $tagName = "section";
	public $caption = false;
	public $body = false;
	
	private $_caption = false;
	private $_dataType = "data-page-type";
	private $_mainType = "page";
	
	
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
	
	
	public function __construct	($opt = false){
		
		if(is_array($opt)){
			foreach($opt as $k => $v){
				$this->$k = $v;	
			}// next			
		}// end if			
		
		if($this->caption){
			$this->setCaption($this->caption);
		}

		$this->{$this->getDataType()} = "main";
		$this->{"data-main-type"} = $this->getMainType();
		$this->addClass("ss-page");
		$this->body = new HTML("div");
		$this->body->{$this->getDataType()} = "body";
		$this->body->class = "body";
		HTML::appendChild($this->body);
		
	}// end fucntion
	
	public function setCaption($caption){
		
		if(!$this->_caption){
			$this->_caption = new HTML("header");
			$this->_caption->{$this->getDataType()} = "caption";
			$this->_caption->class = "caption";
			
			HTML::insertFirst($this->_caption);
		}
		
		$this->_caption->innerHTML = $caption;
		return $this->_caption;
		
	}// end fucntion
	
	public function getCaption(){
		return $this->_caption;
	}// end fucntion
	
	public function getBody(){
		return $this->_caption;
	}// end fucntion
	
	public function appendChild($e){
		return $this->body->appendChild($e);
	}// end fucntion

}// end class

class TabNo{
	
	
	public $name ="";

	public $_main = false;
	public $_menu = false;
	public $_body = false;

	public $nTab = 0;
	public $class = "";
	
	public $value = 0;
	
	public $css = "";
	public $_tab = array();
	public $body = array();
	private $_ref = "tab";
	
	public function __construct($name, $class = false) {
		

		$this->name = $name;
		$this->_main = new HTML("div");
		$this->_menu = new HTML("div");
		$this->_body = new HTML("div");
		
		$this->_main->id = $this->name;
		$this->_menu->id = $this->name."_menu";
		$this->_body->id = $this->name."_body";
		$this->_main->appendChild("\n");
		$this->_main->appendChild($this->_menu);
		$this->_main->appendChild("\n");
		$this->_main->appendChild($this->_body);
		$this->_main->appendChild("\n");
		
		$this->_main->{"data-tab-type"} = "main";
		
		$this->_main->class = "sg-tab-main";
		$this->_menu->class = "sg-tab-menu";
		$this->_body->class = "sg-tab-body";
		if($class !== false){
			//$this->setClass($class);
		
		}// end if
		
	
	}// end function
	
	public function setClass($class = ""){
		$this->_main->class = $class;
		
	}	
	
	public function setRef($name){
		$this->_ref = $name;	
	}// end function
	public function getRef(){
		return $this->_ref;	
	}// end function
	public function add($title = "", $body = false){
		
		
		$this->_tab[$this->nTab] = new HTML("a");
		$this->_tab[$this->nTab]->appendChild($title);
		$this->_tab[$this->nTab]->href = "javascript:void(0);";
		$this->_tab[$this->nTab]->class = "sg-tab-imenu";
		
		
		$this->body[$this->nTab] = new HTML("div");
		$this->body[$this->nTab]->id = $this->name."_body_".$this->nTab;
		$this->body[$this->nTab]->class = "sg-tab-ibody";
		if($body){
			$this->body[$this->nTab]->appendChild($body);
		}// end if

		$this->_menu->appendChild("\n\t");
		$this->_body->appendChild("\n");

		$this->_menu->appendChild($this->_tab[$this->nTab]);
		$this->_body->appendChild($this->body[$this->nTab]);

		return $this->body[$this->nTab++];
		
	}// end function
	
	
	public function getIMenu($index){
		if(isset($this->_tab[$index])){
			return $this->_tab[$index];
		}else{
			return false;
		}
		
		
	}
	public function getIBody($index){
		if(isset($this->body[$index])){
			return $this->body[$index];
		}else{
			return false;
		}
		
	}
	
	public function reqJSON(){
		
		$a = [];
		
		$a["sgTab"] = [
			"id"=>"tab_4_01",
			"class"=>"summer",
			"value"=>0,
			
				
			
			
			
		];
		
		
		$json = "{id='tab_01'}";
		
	}
	
	public function getRequest(){
		
		$info = new \stdClass;
		$info->classObject = "sgTab";
		
		
		$info->menuId = "{$this->name}_menu";
		$info->bodyId = "{$this->name}_body";
		$info->value = $this->value;
		$info->classObject = "sgTab";
		
		return $info;
		
	}
	
	
	public function getScript(){
		
		$ref = $this->getRef();
		if(!$ref = $this->getRef()){
			//$ref = $this->name;	
		}
		
		
		
		$j = array(
			
			"menuId" => "{$this->name}_menu",
			"bodyId" => "{$this->name}_body",
			"value"	 => 0,
		);
		$json = json_encode($j);
		
		$script = "sgTab.load($json);";
		//$script = "\n\t$ref = _sgTab.create({menu:'".$this->_menu->id."', body:'".$this->_body->id."'});";		
		return $script;
		
	}
	
	public function funcShow($index){
		$ref = $this->getRef();
		return "$ref.show($index);";
	}
	
	public function render(){
		

		return $this->_main->render();
		
		
	}// end function
	
	
}// end class



/*

$f = new Form("form_p4");

$f->setClass("clean1");

$f->setCaption("personas");

$f->setTab("x");

$f->addTabPage("basico");

$f->addField('{
	"type"=>"text",
	"name"=>"cedula"
	"valid"=>true,
	

}');

*/
?>