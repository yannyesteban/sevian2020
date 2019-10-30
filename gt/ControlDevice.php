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
        
        
        $q = "SELECT id, command FROM devices_commands where version_id=1";

        $data = $this->getDataField([$q]);
        
        $formsFields = $this->formParams(1);

        $forms = [
            'caption'=>'uncfg',
            
            'fields'=> $formsFields
        ];

        $info = [
            "id"=>$form->id,
            "cmdData"=> $data,
            'paramForm'=>$forms

        ];
        $this->typeElement = 'ControlDevice';
        $this->info = $info;//$form->getInfo();
    }

    private function formParams($commandId){
        $cn = $this->cn;
        $cn->query = "SELECT * FROM devices_comm_params where command_id = 1 order by `order`;";
        
        $result = $cn->execute();
        $fields = [];
        while($rs = $cn->getDataAssoc($result)){

			$fields[] = [
                "input"=>'input',
                "config"=>[
                    "type"=>"text",
                    "name"=>"param_".$rs["id"],
                    "caption"=>$rs["param"]
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