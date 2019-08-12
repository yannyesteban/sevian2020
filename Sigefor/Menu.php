<?php

namespace Sevian\Sigefor;

class Menu extends \Sevian\Panel2 implements \Sevian\DocElement{

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

			
			

			$cn = $this->cn;

			$cn->query = "
				SELECT * 
				FROM $this->tMenus 
				WHERE menu = '$this->name'";
					
							
					hr($cn->query);
	
			$result = $cn->execute();
			
			if($rs = $cn->getDataAssoc($result)){
	
				foreach($rs as $k => $v){
					$this->$k = $v;
					hr($v);
				}
				
			}


			$div = new \Sevian\HTML("div");
			$div->style = "color:white;background:blue;";
			$div->innerHTML = "TEST 27 de MAYO de 2019";

			$this->_main = $div;
		
			return;
		
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tMenus 
			WHERE menu = '$this->name'";
        
            
        hr($cn->query);

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}
			
		}
		\Sevian\S::setSes("f", 'USA');
		/* leemos el campo params y remplaamos la informacion del objeto */
		$this->_params = \Sevian\S::params($this->params);
		
		if($this->_params){
			
			foreach($this->_params as $k => $v){
				$this->$k = $v;
			}
		}


		$info = $this->getInfoFields($this->query);
		$fields = $info->fields;

		foreach($fields as $k => $v){
			
			$this->fields[$k] = new \Sevian\Sigefor\InfoField($v);
		}

		$q = "
			SELECT * 
			FROM $this->tMenuItemss 
			WHERE form = '$this->name'";

		$result = $cn->execute($q);

		if($rs = $cn->getDataAssoc($result)){
			if(isset($this->fields[$rs['field']])){
				$this->fields[$rs['field']]->update($rs);
			}
			
		
		}

		//print_r($this->fields);
		
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

			$this->_menu = (array)json_decode($this->config);
			$this->_menu["caption"] = $this->_config["caption"]??$this->title;
			$this->_menu["class"] = $this->_config["class"] ?? $this->class;

			
			$this->loadCfgItems();
		//	print_r($this->_config);
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

			foreach($rs as $k => $v){
			//	$this->$k = $v;
			}
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
		$this->_menu["items"] = $opt;
	//	print_r($this->_menu);

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



class Test4 extends \Sevian\Panel2 {
	public function __construct($opt = []){
			
		foreach($opt as $k => $v){
			$this->$k = $v;
		}

		$this->_main = new \Sevian\HTML('div');
		$this->_main->style = "color:red";
		$this->_main->innerHTML = "alpha";
	}



}
class Test5 extends \Sevian\Panel2 {
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