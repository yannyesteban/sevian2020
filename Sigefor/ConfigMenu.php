<?php

namespace Sevian\Sigefor;

class ConfigMenu  implements \Sevian\DocElement{

		public $menu = "";
		public $title = "MENU 5.0";
		public $class = "";
		public $params = "";
		public $config = [];
		public $_info = [];
    
		protected $tMenus = "_sg_menus";
		protected $tMenuItems = "_sg_menu_items";
	
   
		

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
			//$opt["id"] = "hola";

			//$opt["target"] = "hola";
			//$opt["type"] = "accordion";
			//$opt["mode"] = "close";
			

			//$opt["caption"] = "Menú Principal";
/*
			$opt["items"][] = [
				"caption"=>"one",
				"index"=>0,
				"parent"=>false,

			];
			$opt["items"][] = [
				"caption"=>"dos",
				"action"=>"alert(this.caption);",
				"index"=>1,
				"parent"=>false,
			];
			$opt["items"][] = [
				"caption"=>"Tres",
				//"action"=>"alert(this.caption);",
				"index"=>2,
				"parent"=>false,
			];
			$opt["items"][] = [
				"caption"=>"IV",
				//"action"=>"alert(this.caption);",
				"index"=>3,
				"parent"=>false,
			];

			$opt["items"][] = [
				"caption"=>"Cinco",
				"action"=>"alert(this.caption);",
				"index"=>4,
				"parent"=>2,
			];
			$opt["items"][] = [
				"caption"=>"Seis",
				"action"=>"alert(this.caption);",
				"index"=>5,
				"parent"=>2,
			];
			$opt["items"][] = [
				"caption"=>"Siete",
				"action"=>"alert(this.caption);",
				"index"=>6,
				"parent"=>2,
			];
*/
			//$info = new \Sevian\InfoMenu();

			$menu = new \Sevian\Menu($opt);
			//$menu->class = "uva";

			$this->_main = $menu;
	
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

			$info = (array)json_decode($this->config);
			$info["caption"] = $this->_config["caption"]?? $this->title;
			$info["class"] = $this->_config["class"]?? $this->class;

			
			$info["items"] = $this->loadCfgItems();
			$this->_info = $info;
		}

	}

	public function loadCfgItems(){
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tMenuItems 
			WHERE menu = '$this->name'";
        
            
       

		$result = $cn->execute();
		$opt = [];
		while($rs = $cn->getDataAssoc($result)){

			
			if($rs["action"]){
				$action = "Sevian.action.send(".$rs["action"].");";
			}else{
				$action = "";
			}
			
			$opt[] = [
				"caption" => $rs["title"],
				"index" => $rs["index"],
				"parent" => $rs["parent"],
				"action" => $action,
			];
			
		
		}

		return $opt;

	}
	
	public function getConfig($menu){
		$this->name = $menu;
		$this->loadCfgMenu();
		return $this->_info;
		
	}
}





?>