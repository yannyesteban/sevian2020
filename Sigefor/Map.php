<?php
namespace Sevian\Sigefor;


class Map extends \Sevian\Element{


    
    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}
        $this->cn = \Sevian\Connection::get();

        $form = new \Sevian\Panel('div');
        $form->id = "map_".$this->id;
        
        $this->panel = $form;
        $info = [
            "id"=>$form->id

        ];

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
        $this->typeElement = 'sgMap';
		$this->info = $info;//$form->getInfo();
    }
    
    private function loadDevices(){
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
    }


}


