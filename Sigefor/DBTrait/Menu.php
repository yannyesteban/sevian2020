<?php
namespace Sigefor\DBTrait;

trait Menu{
	
	private $cn = null;
	private $infoItems = null;

	protected $tMenus = "_sg_menus";
	protected $tMenuItems = "_sg_menu_items";
	
	public function jsonConfig($info){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}

		$params = \Sevian\S::vars($this->params);
		$params = json_decode($params);
		
		if($params){
			foreach($params as $k => $v){
				$this->$k = $v;
			}
		}

		return $info;
	}

	public function loadJsonMenu($file){
		
		$info = json_decode(file_get_contents($file, true));
		return $this->jsonConfig($info);
	}

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

			$this->loadCfgItems($name);

		}
	}

	public function loadCfgItems($name){
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tMenuItems 
			WHERE menu = '$name' order by `order`
			";

		$result = $cn->execute();

		$items = [];
		$json = [];
		
		while($rs = $cn->getDataAssoc($result)){
			if($rs["action"]){
				$action = "S.send(".$rs["action"].");";
			}else{
				$action = "";
			}
            $events = null;
            if($rs['events']){
				$events = [];
				$params = str_replace("\r\n", '\\n', $rs['events']);
				$params = str_replace("\t", '',  ($params));
			
				
				$params = json_decode(\Sevian\S::vars($params));

				
				foreach($params as $k => $v){
					$events[$k] = $v;
				}
				
			}

			$index = $rs["index"];
			$parent = $rs["parent"];
			
			$items[$index] = [
				"caption" => $rs["title"],
				"action" => $action,
			];
            
            if($events){
                $items[$index]['events'] = $events;
            }

			if($parent != ""){
				if(!isset($items[$parent]["items"])){
					$items[$parent]["items"] = [];
				}
				$items[$parent]["items"][] = &$items[$index];
			}else{
				$json[] = &$items[$index];
			}

		}
		$this->items = $json;

	}
}