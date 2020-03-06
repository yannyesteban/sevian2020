<?php
namespace Sevian\GT;


class ControlDevice extends \Sevian\Element{


    
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

			case 'save_command':
				break;
			case 'load_commands':
				$this->typeElement = "ControlDevice";
				$data = $this->getCommandData($this->eparams->cmdId, $this->eparams->deviceId);
				
				$this->info = [
					[
					'method'  => 'loadMenuCommands',
					'value' => $data,
					],
				];
				break;
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
				$form = $this->loadParamsForm($this->eparams->cmd, $this->eparams->cmdId, $this->eparams->deviceId);//$form->getInfo();
				
				$this->info = [[
					'method'  => 'loadCmdForm',
					'value' => $form,
					
				],
			
				[
					'method'=>'setDeviceInfo',
					'value'=> $this->loadDevice($this->eparams->deviceId)

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
        //$form->text = "control-device";
        $form->id = "gt_control_".$this->id;
        
        $this->panel = $form;
        
        
        
		
		$clientData = $this->getDataField([['','. seleccione',''], "SELECT id, client FROM clients ORDER BY 2;"]);
		$accountData = $this->getDataField([['','. seleccione','*'], "SELECT id, name, client_id FROM accounts a ORDER BY name;"]);
		$unitData = $this->getDataField([['','. seleccione','*'], 
		"SELECT u.id as unit_id, un.name as unit_name, account_id, device_id
		FROM units as u
		INNER JOIN units_names as un on un.id = u.name_id
		ORDER BY account_id, unit_name"]);
		


        $info = [
			"id"=>$form->id,
			'panel'=>$this->id,
            //"cmdData"=> $data,
			'paramForm'=> $this->loadParamsForm('xxx', '5', ''),
			'clientData' => $clientData,
			'accountData' => $accountData,
			'unitData' => $unitData,
			'units'=>$this->loadUnits()

        ];
        $this->typeElement = 'ControlDevice';
        $this->info = $info;//$form->getInfo();
	}
	
	private function loadParamsForm($cmd, $cmdId, $deviceId){

		$formsFields = $this->formParams($cmd, $cmdId, $deviceId);

		$menu = [
			'caption'=>'',
			'tagLink'=>'button',
			'className'=>'navigator',
			'items'=>[
				['caption'=>'save', 'action'=>"this.sendCMD();//let data = this.getValue(); for(let x in data){db ('value: '+data[x], 'red');}"],
				['caption'=>'get'],
				['caption'=>'send']
			]

			];

        $form = [
            'caption'=> "COMMAND: $cmd",
            
			'fields'=> $formsFields,
			'menu'=>$menu
        ];

		
		return $form;
	}

    private function formParams($cmd, $commandId, $deviceId){
		$cn = $this->cn;
		
		$cn->query = "SELECT v.param_id, v.value, v.title, p.param, c.command, type_value
		FROM devices_params_value as v
		INNER JOIN devices_comm_params as p ON p.id = v.param_id
		INNER JOIN devices_commands as c ON c.id = command_id 

		WHERE c.id = '$commandId'
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

        $cn->query = "SELECT p.*, co.value 
		FROM devices_comm_params as p
		LEFT JOIN devices_config as co ON co.param_id = p.id AND co.device_id = '$deviceId'
		WHERE p.command_id = '$commandId' 
		order by `order`;";
        
        $result = $cn->execute();
		$fields = [];
		
		//\Sevian\S::db($cn->query);

		$fields['param_cmd_id'] = [
			"input"=>'input',
			"config"=>[
				"type"=>"text",
				"name"=>"param_cmd_id",
				"caption"=> 'cmd_id',
				'value'=>$commandId
			]

		];

		$fields['param_device_id'] = [
			"input"=>'input',
			"config"=>[
				"type"=>"text",
				"name"=>"param_device_id",
				"caption"=> 'param_device_id',
				'value'=>$deviceId
			]

		];


		$fields['param_tag'] = [
			"input"=>'input',
			"config"=>[
				"type"=>"text",
				"name"=>"param_tag",
				"caption"=> 'tag'
			]

		];
		$fields['param_pass'] = [
			"input"=>'input',
			"config"=>[
				"type"=>"text",
				"name"=>"param_pass",
				"caption"=> 'pass',
				"value"=>"0000"
			]

		];

		$fields['param_name'] = [
			"input"=>'input',
			"config"=>[
				"type"=>"text",
				"name"=>"param_name",
				"caption"=> 'Name',
				"value"=>$cmd
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

			$fields['param_'.$rs['id']] = [
                "input"=>$input,
                "config"=>[
                    "type"=>$type,
                    "name"=>"param_".$rs["id"],
					"caption"=>$rs["param"],
					'data' => $data,
					'id' => "param_".$rs["id"].'_'.$this->id,
					'doValues' => $doValues,
					'events' => $events,
					'dataset'=>["cmd"=>"param_".$rs["id"]],
					"value"=> $rs["value"],
                ]

            ];

			
			

        }
        
        return $fields;
    }

    private function getDataField($info){
		$data = [];
		foreach($info as $_data){

			switch(gettype( $_data)){
				case "array":
					$data[] = $_data;//array_merge($data, $_data);
					break;
				case "string":
					$data = array_merge($data, $this->getDataQuery($_data));
					break;
				case "object":
					$data = array_merge($data, $this->getDataExtra($_data));
					break;					
			}

		}
		return $data;
	}
	
	private function getDataQuery($query){
		$cn = $this->cn;

		$result = $cn->execute($query);
		$data = [];
		while($rs = $cn->getDataRow($result)){
			$data[] = [$rs[0], $rs[1], $rs[2]?? ''];
		}

		return $data;
	}

	private function getDataExtra($info){
		$data = [];
		if(isset($info->t)){

			switch($info->t){
				case 'for':
				case 'range':
					if($info->ini < $info->end){
						for($i = $info->ini; $i < $info->end; $i = $i + abs($info->step)){
							$data[] = [$i, $i, $info->parent?? ''];
						}

					}else{
						for($i = $info->ini; $i > $info->end; $i = $i - abs($info->step)){
							$data[] = [$i, $i, $info->parent?? ''];
						}
					}
					break;
			}
		}
		return $data;
	}

	private function getCommandData($commandId, $deviceId){
		$q = "SELECT c.id, c.command
		FROM devices_commands as c
		INNER JOIN devices as d on d.version_id = c.version_id
		WHERE
		d.id = '$deviceId'
		ORDER BY 1";
		\Sevian\S::db($q);
		return $this->getDataField([$q]);
	}

	private function loadDevice($deviceId){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT
            u.id as unit_id,
            ac.client_id as client_id,
            cl.client,
            u.account_id,
            ac.name as account,
            u.device_id,
            de.device_name,
            u.vehicle_id,
            vn.name as vehicle_name,
            ic.icon, ve.plate, br.brand, mo.model, ve.color


        FROM units as u
        LEFT JOIN units_names as vn ON vn.id = u.name_id

        LEFT JOIN users_units as uu ON uu.unit_id = u.id

        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id

        LEFT JOIN brands as br ON br.id = ve.brand_id
        LEFT JOIN models as mo ON mo.id = ve.model_id

        INNER JOIN devices as de ON de.id = u.device_id
        INNER JOIN devices_names as dn ON dn.name = de.device_name


        LEFT JOIN icons as ic ON ic.id = u.icon_id

        LEFT JOIN accounts as ac ON ac.id = u.account_id
        LEFT JOIN clients as cl ON cl.id = ac.client_id
		
		
		WHERE u.device_id = '$deviceId'
        ORDER BY u.id
        ";
		$result = $cn->execute();
		
        //\Sevian\S::db($cn->query);
        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[$rs['unit_id']] = $rs;
        }


        return $data;
	}
	
	private function loadUnits(){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT
            u.id as unit_id,
            ac.client_id as client_id,
            cl.client,
            u.account_id,
            ac.name as account,
            u.device_id,
            de.device_name,
            u.vehicle_id,
            vn.name as vehicle_name,
            ic.icon, ve.plate, br.brand, mo.model, ve.color


        FROM units as u
        LEFT JOIN units_names as vn ON vn.id = u.name_id

        LEFT JOIN users_units as uu ON uu.unit_id = u.id

        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id

        LEFT JOIN brands as br ON br.id = ve.brand_id
        LEFT JOIN models as mo ON mo.id = ve.model_id

        INNER JOIN devices as de ON de.id = u.device_id
        INNER JOIN devices_names as dn ON dn.name = de.device_name


        LEFT JOIN icons as ic ON ic.id = u.icon_id

        LEFT JOIN accounts as ac ON ac.id = u.account_id
        LEFT JOIN clients as cl ON cl.id = ac.client_id
        /*INNER JOIN tracking as t ON t.id = u.tracking_id*/
        ORDER BY u.id
        ";
		$result = $cn->execute();
		
        
        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[$rs['unit_id']] = $rs;
        }


        return $data;
    }

	private function saveCommand(){

	}
}