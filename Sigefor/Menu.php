<?php

namespace Sevian\Sigefor;

class Menu extends \Sevian\Element{

	public $menu = "";
	public $title = "MENU 5.0";
	public $class = "";
	public $params = "";
	public $config = [];
	public $_menu = [];

	protected $tMenus = "_sg_menus";
	protected $tMenuItems = "_sg_menu_items";


	//private $_config = [];

	public function getMain(){
		return true;
	}

	public function evalMethod($method = false): bool{
	

		if($method === false){
			$method = $this->method;
		}
		
		//$this->loadForm();
		$this->load();
		//$this->script = ";alert(88888);";

		
		switch($method){
			case 'create':

				
				
			case 'load':
				//$this->main = $this->load();
				break;
			case 'delete':
				break;
			case 'get_field_data':
				break;
				
				
				
		}
		return true;	
	}
	public function __construct($opt = array()){
		
		foreach($opt as $k => $v){
			$this->$k = $v;
		}

		$this->main = new \Sevian\HTML('div');

		$this->cn = \Sevian\Connection::get();
	}



	public function create(){
		$menu = new MM();
		$menu->caption = $this->caption;
		$menu->type = $this->type;


	}

	private function load(){

		$this->loadCfgMenu();

		$opt = $this->_menu;
		//print_r($this->_menu);
		$opt["id"] = "sg_menu_".$this->id;
		$menu = new \Sevian\Menu($opt);

		$this->typeElement = "Menu";
		$this->info = $menu->getInfo();

		
		//$menu->class = "uva";
		//print_r($opt);
		$this->panel = $menu;

		return;

	}

	private function loadCfgMenu(){

		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tMenus 
			WHERE menu = '$this->name'";
        
            
       

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}

			$this->_menu = json_decode($this->config, true);

			
			$this->_menu["caption"] = $this->_config["caption"]??$this->title;
			$this->_menu["class"] = $this->_config["class"] ?? $this->class;

			
			$this->loadCfgItems();
			//print_r($this->_config);
		}

	}


	public function createItem(){

	}
	public function loadCfgItems(){
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tMenuItems 
			WHERE menu = '$this->name' order by `order`";
        
            
       

		$result = $cn->execute();
		$opt = [];

		$items = [];
		$json = [];
		
		while($rs = $cn->getDataAssoc($result)){
			if($rs["action"]){
				$action = "Sevian.action.send(".$rs["action"].");";
				$action = "S.send(".$rs["action"].");";
			}else{
				$action = "";
			}

			$index = $rs["index"];
			$parent = $rs["parent"];
			
			$items[$index] = [
				"caption" => $rs["title"],

				"action" => $action,

			];
			

			if($parent != ""){
				if(!isset($items[$parent]["items"])){
					$items[$parent]["items"] = [];
				}
				
				$items[$parent]["items"][] = &$items[$index];
			}else{
				
				$json[] = &$items[$index];
			}


			foreach($rs as $k => $v){
			//	$this->$k = $v;
			}
			
			
			


			$opt[] = [
				"caption" => $rs["title"],
				"index" => $rs["index"],
				"parent" => $rs["parent"],
				"action" => $action,

			];
			
			



			
		
		}
		$this->_menu["items"] = $json;
		//print_r($items);
		//print_r(json_encode($json, JSON_PRETTY_PRINT));

	}
	public function renderx(){
		
		global $sevian;
		/* 		
		$sevian->setPanelSign($this->panel, "save_cosa", array(
			
			array("vses"=>array("titulo"=>"Principal 2017")),
			array("setPanel"=>array("panel"=>8, "element"=>"menu")),
			array("setPanel"=>array("panel"=>7, "element"=>"procedure"))
		
		));
		 */
		

		$aux = ' {
			async: false,
			panel: 4,
			
			valid: false,
			confirm: \'Seguro\',
			params:{}}
		';

		$this->title .= " Panel($this->panel)";
		return "<span style='color:white'>($this->panel) $this->title ... El Menu".'<input type="button" name="submit1" id="submit1" value="Menu" onclick="sevian.send('.$aux.')"></span>';
		
	}
	
}



class Test4 extends \Sevian\Element {
	public function __construct($opt = []){
			
		foreach($opt as $k => $v){
			$this->$k = $v;
		}

		$this->_main = new \Sevian\HTML('div');
		$this->_main->style = "color:red";
		$this->_main->innerHTML = "alpha";
	}



}
class Test5 extends \Sevian\Element {
	public function __construct($opt = []){
			
		foreach($opt as $k => $v){
			$this->$k = $v;
		}

		$this->_main = new \Sevian\HTML('div');
		$this->_main->style = "color:red";
		$this->_main->innerHTML = "betha....";
	}


	public function getMain(){
		return true;
	}
}
?>