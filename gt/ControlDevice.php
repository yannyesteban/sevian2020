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
        //$form->text = "control-device";
        $form->id = "gt_control_".$this->id;
        
        $this->panel = $form;
        
        
        $q = "SELECT id, command FROM devices_commands where version_id=1 ORDER BY 1";

		$data = $this->getDataField([$q]);
		
		$clientData = $this->getDataField([['','. seleccione',''], "SELECT id, client FROM clients ORDER BY 2;"]);
		$accountData = $this->getDataField([['','. seleccione','*'], "SELECT id, name, client_id FROM accounts a ORDER BY name;"]);
		$deviceData = $this->getDataField([['','. seleccione','*'], "SELECT codvehiculo, concat('veh - ', codvehiculo) as v, coddato  FROM cuenta_vehiculos order by coddato, codvehiculo;"]);
		


        $info = [
			"id"=>$form->id,
			'panel'=>$this->id,
            "cmdData"=> $data,
			'paramForm'=> $this->loadParamsForm('xxx', "5"),
			'clientData' => $clientData,
			'accountData' => $accountData,
			'deviceData' => $deviceData

        ];
        $this->typeElement = 'ControlDevice';
        $this->info = $info;//$form->getInfo();
	}
	
	private function loadParamsForm($cmd, $cmdId){

		$formsFields = $this->formParams($cmd, $cmdId);

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

    private function formParams($cmd, $commandId){
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
				"caption"=> 'pass'
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
					'events' => $events
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

}