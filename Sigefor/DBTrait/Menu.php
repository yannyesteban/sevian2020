<?php
namespace Sigefor\DBTrait;

trait Menu{
	protected $tMenus = "_sg_menus";
	protected $tMenuItems = "_sg_menu_items";
	private $cn = null;

	public function loadMenu($name){
		$cn = $this->cn;

		$cn->query = "
			SELECT menu, title,class, params, config, datetime
			FROM $this->tMenus 
			WHERE menu = '$name'";
        
            
       

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}
			$params = \Sevian\S::vars($this->config);
			$config = json_decode($params);
			if($config){
				foreach($config as $k => $v){
					$this->$k = $v;
				}
			}


			//$this->_menu = json_decode($this->config, true);

			
			//$this->_menu["caption"] = $this->_config["caption"]??$this->title;
			//$this->_menu["class"] = $this->_config["class"] ?? $this->class;

			
			$this->loadCfgItems($name);
			//print_r($this->_config);
		}
	}

	public function loadCfgItems($name){
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tMenuItems 
			WHERE menu = '$name' order by `order`";
        
            

		$result = $cn->execute();
		$opt = [];

		$items = [];
		$json = [];
		
		while($rs = $cn->getDataAssoc($result)){
			if($rs["action"]){
				$action = "Sevian.send(".$rs["action"].");";
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

			
			


			$opt[] = [
				"caption" => $rs["title"],
				"index" => $rs["index"],
				"parent" => $rs["parent"],
				"action" => $action,

			];
			
			



			
		
		}
		$this->items = $json;
		//print_r($items);
		//print_r(json_encode($json, JSON_PRETTY_PRINT));

	}
}