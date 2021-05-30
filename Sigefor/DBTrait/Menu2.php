<?php
namespace Sigefor\DBTrait;

require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';

trait Menu2{
	use JasonFileInfo;
	private $cn = null;
	private $infoItems = null;

	protected $tMenus = "_sg_menus";
	protected $tMenuItems = "_sg_menu_items";

	public $userData = [];
	static public $patternJsonFile = JSON_PATH.'{name}.json';

	private $expressions = null;

	public function loadMenu($name){
		//hr(self::$patternJsonFile);hr($name);
		if(!($info = $this->loadJsonInfo($name, self::$patternJsonFile))){
			$info = $this->loadDBMenu($name);
		}
		$this->setInfoMenu($info);
	}

	public function setInfoMenu($info){

		foreach($info as $k => $v){
			$this->$k = $v;
		}
		if(is_string($this->params)){
			$params = \Sevian\S::varCustom($this->params, $this->userData, '&P_');
			$params = \Sevian\S::vars($params);
			$config = json_decode($params);
		}else{
			$config = $this->params;
		}

		if($config){
			foreach($config as $k => $v){
				$this->$k = $v;
			}
		}

		if($this->expressions){
			foreach($this->expressions as $k => $v){
				\Sevian\S::setExp($k, $v);
			}
		}

		if($this->methods?? false){
			if(is_string($this->methods)){

				$methods = \Sevian\S::varCustom($this->methods, $this->userData, '&P_');

				$methods = \Sevian\S::vars($methods);
				$methods = json_decode($methods, true);
			}else{
				$methods = (array)$this->methods;
			}

			if($methods and $methods[$this->method]?? false){
				foreach($methods[$this->method] as $k => $v){
					$this->$k = $v;
				}
			}
		}
		if($this->items?? false){


			if(is_string($this->items)){
				$items = \Sevian\S::varCustom($this->items, $this->userData, '&P_');
				$items = \Sevian\S::vars($items);
				$this->items = json_decode($items, true);
			}else{
				//$config = (array)$this->items;
			}


		}
	}


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

	public function loadDBMenu($name){
		$cn = $this->cn;

		$cn->query = "
			SELECT menu, title as caption, class, items, params, config
			FROM $this->tMenus
			WHERE menu = '$name'";

		$this->cn->execute();
		return $this->cn->getDataAssoc();
		/*
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
		*/
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