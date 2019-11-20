<?php
namespace Sevian\GT;


class MenuDevice extends \Sevian\Element{
	public $_menu = [];

	protected $tMenus = "_sg_menus";
	protected $tMenuItems = "_sg_menu_items";

    
    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();

        
    }

    public function evalMethod($method = false): bool{
		
		if($method === false){
            $method = $this->method;
        }
		if(!$this->async){
			if($this->method == "list_page"){
				$method = "list";
			}
        }

        switch($method){

			case 'load_cmd':
				$var = $this->eparams->cmd;
				$f = new \Sevian\iFragment([
					'targetId'=>'sg_form_5',
					'html'=>$var,
					'script'=>""

				]);
				//$this->addFragment($f);
				;

				$this->typeElement = "ControlDevice";
				$form = $this->loadParamsForm($this->eparams->cmd, $this->eparams->cmdId);//$form->getInfo();
				
				$this->info = [[
					'method'  => 'loadCmdForm',
					'value' => $form
				]];
				
				break;
			case 'create':
            case 'load':
            default:
				$this->create();
				break;
				
        }

        return true;
    }

    private function create(){
		$form = new \Sevian\Panel('div');
		
		//$form->innerHTML ="hola";
        //$form->text = "control-device";
        $form->id = "gt_menu_".$this->id;
        
        $this->panel = $form;
        
        
		$this->load();
		$this->_menu["id"] = $form->id;

		$form->add("div")->id = "design";

        $info = [
			"id"=>$form->id,
			'panel'=>$this->id,
			"cmdData"=> $data ?? [],
			"menu"=>$this->_menu,


        ];
        $this->typeElement = 'MenuDesign';
		$this->info = $info;//$form->getInfo();
		
	}
	private function load(){

		$this->loadCfgMenu("test_1");

		return;

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
    private function formParams($commandId){
		$cn = $this->cn;
		
		$cn->query = "SELECT param_id, v.value, v.title, p.param, c.command, type_value
			FROM devices_params_value as v
			INNER JOIN devices_comm_params as p ON p.id = param_id
			INNER JOIN devices_commands as c ON c.id = command_id WHERE c.id = '$commandId'
		";
		$result = $cn->execute();
		$dataFields = [];
		
		while($rs = $cn->getDataAssoc($result)){

			$id = $rs['param_id'];

			if(!isset($dataFields[$id])){
				$dataFields[$id] = [];
			}
			$dataFields[$id][] = [$rs['value'],$rs['title'] ?? $rs['value'],0];
			


        }

        $cn->query = "SELECT * FROM devices_comm_params where command_id = '$commandId' order by `order`;";
        
        $result = $cn->execute();
		$fields = [];
		
		
		$fields[] = [
			"input"=>'input',
			"config"=>[
				"type"=>"text",
				"name"=>"param_tag",
				"caption"=> 'tag'
			]

		];
		$fields[] = [
			"input"=>'input',
			"config"=>[
				"type"=>"text",
				"name"=>"param_pass",
				"caption"=> 'pass'
			]

		];

        while($rs = $cn->getDataAssoc($result)){

			$input = 'input';
			$type = 'text';
			$data = [];
			$doValues = false;
			$events = false;
			if(isset($dataFields[$rs['id']])){
				$input = 'multi';
				
				$data = $dataFields[$rs['id']];
				if($rs['type_value'] != '2'){
					$type = 'radio';
				}else{
					$type = 'checkbox';
					$doValues = 'let sum = 0; for(let x of inputs){sum += +x.value;} return sum;';
					$events = ["change" => "db (event.currentTarget.value,'red')"];
				}

			}

			$fields[] = [
                "input"=>$input,
                "config"=>[
                    "type"=>$type,
                    "name"=>"param_".$rs["id"],
					"caption"=>$rs["param"],
					'data' => $data,
					'id' => "param_".$rs["id"].'_'.$this->id,
					'doValues' => $doValues,
					'events' => $events
                ]

            ];

			
			

        }
        
        return $fields;
    }

	private function loadCfgMenu($menu){

		$cn = $this->cn;

		$cn->query = "
			SELECT menu, title, class, params, config
			FROM $this->tMenus 
			WHERE menu = '$menu'";
        
            
       

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}

			$this->_menu = json_decode($this->config, true);

			
			$this->_menu["caption"] = $this->_config["caption"]??$this->title;
			$this->_menu["class"] = $this->_config["class"] ?? $this->class;

			
			$this->loadCfgItems($menu);
			//print_r($this->_config);
		}

	}


	public function createItem(){

	}
	public function loadCfgItems($menu){
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tMenuItems 
			WHERE menu = '$menu' order by `order`";
        
            
       

		$result = $cn->execute();
		$opt = [];

		$items = [];
		$json = [];
		
		while($rs = $cn->getDataAssoc($result)){
			if($rs["action"]){

				$params = \Sevian\S::varParam($rs["action"], (array)$this);
				$params = \Sevian\S::vars($params);

				//$action = "Sevian.send(".$rs["action"].");";
				$action = "S.send(".$params.");";
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
		
		//print_r(json_encode($json, JSON_PRETTY_PRINT));

	}

}