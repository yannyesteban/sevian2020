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
				$this->loadParamsForm($this->eparams->cmd, $this->eparams->cmdId);
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
        
        
        $q = "SELECT id, command FROM devices_commands where version_id=1 ORDER  BY command DESC";

		$data = $this->getDataField([$q]);
		
		$clientData = $this->getDataField([['','. seleccione',''], "SELECT id, client FROM clients ORDER BY client;"]);
		$accountData = $this->getDataField([['','. seleccione',''], "SELECT id, name, client_id FROM accounts a ORDER BY name;"]);
		$deviceData = $this->getDataField([['','. seleccione',''], "SELECT codvehiculo, concat('veh - ', codvehiculo) as v, coddato  FROM cuenta_vehiculos order by coddato, codvehiculo;"]);
		
        $formsFields = $this->formParams(1);

        $forms = [
            'caption'=>'uncfg',
            
            'fields'=> $formsFields
        ];

        $info = [
			"id"=>$form->id,
			'panel'=>$this->id,
            "cmdData"=> $data,
			'paramForm'=> $forms,
			'clientData' => $clientData,
			'accountData' => $accountData,
			'deviceData' => $deviceData

        ];
        $this->typeElement = 'ControlDevice';
        $this->info = $info;//$form->getInfo();
	}
	
	private function loadParamsForm($cmd, $cmdId){

		$formsFields = $this->formParams($cmdId);

        $forms = [
            'caption'=> "COMMAND: $cmd",
            
            'fields'=> $formsFields
        ];

		$opt[] = [
			'method'  => 'loadCmdForm',
			'value' => $forms
		];
		$this->typeElement = "ControlDevice";
		$this->info = $opt;//$form->getInfo();
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
				"name"=>"param_pass",
				"caption"=> 'pass'
			]

		];
		$fields[] = [
			"input"=>'input',
			"config"=>[
				"type"=>"text",
				"name"=>"param_tag",
				"caption"=> 'tag'
			]

		];

        while($rs = $cn->getDataAssoc($result)){

			$input = 'input';
			$type = 'text';
			$data = [];
			if(isset($dataFields[$rs['id']])){
				$input = 'multi';
				$type = 'select';
				$data = $dataFields[$rs['id']];
			}
			$fields[] = [
                "input"=>$input,
                "config"=>[
                    "type"=>$type,
                    "name"=>"param_".$rs["id"],
					"caption"=>$rs["param"],
					'data' => $data 
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