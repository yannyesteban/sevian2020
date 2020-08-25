<?php
namespace GT;

require_once MAIN_PATH.'Sigefor/DBTrait/DataRecord.php';
require_once MAIN_PATH.'Sigefor/Component/Form2.php';
require_once MAIN_PATH.'Sigefor/JasonFile.php';

//require_once MAIN_PATH.'Sigefor/DBTrait/Form.php';
//require_once "Component/Form2.php";
require_once MAIN_PATH.'Sigefor/Component/FormSave.php';

class HCommand extends \sevian\element {
    
    use \Sigefor\DBTrait\DataRecord;

    public $jsClassName = 'Form2';

    private $userData = [];
    
    static public $patternJsonFile = '';

    public function __construct($info = []){
		
        foreach($info as $k => $v){
			$this->$k = $v;
		}
		
        $this->cn = \Sevian\Connection::get();
    }
	public function config(){
		$this->initDataRecord();
	}
    public function evalMethod($method = false): bool{
        if($method){
            $this->method = $this->method;
        }
		
        switch($this->method){
            case 'request':
                $this->requestForm();

			break;
			case 'load-config':
				$this->requestForm(3);
			break;
			case 'save':
				$this->save();
			break;

            			                
        }

        return true;

    }

    public function requestForm($value = 1){

        if($this->eparams->mainId?? false){
            $this->containerId = $this->eparams->mainId;
        }

        if(!$this->containerId){
            $this->containerId = 'form-main-'.$this->id;
		}
		
		$form = (object)$this->paramsLoad($value, $this->eparams->commandId??0, $this->eparams->unitId??0);
		$form->id = $this->containerId;
        $this->setInit($form);
       
    }
	
	
	private function paramsLoad($dataType = 1, $commandId, $unitId, $h_id=0, $description = ''){
		$command = '';

		$cn = $this->cn;
		$cn->query = "SELECT * FROM devices_commands WHERE id = '$commandId';";
		$result = $cn->execute();
		if($rs = $cn->getDataAssoc($result)){
			$command = $rs['command'];
        }

		$cn->query = 
			"SELECT v.param_id, v.value, v.title, p.param, c.command, type_value
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
		if($dataType == 1){
			$cn->query = "SELECT p.*, '' as value, 1 param_mode, 0 as exist,
			'' as h_command_id, '' as param_id
			FROM devices_comm_params as p
			
			WHERE p.command_id = '$commandId'
			order by `order`;";
		}elseif($dataType == 2){
			$cn->query = 
				"SELECT p.*, co.value, CASE WHEN co.param_id IS NOT NULL THEN 2 ELSE 1 END as param_mode,
				CASE WHEN co.param_id IS NOT NULL THEN 1 ELSE 0 END as exist,
				co.h_command_id, co.param_id
				FROM devices_comm_params as p
				LEFT JOIN h_commands as h ON h.command_id = p.command_id and h.id = '$h_id'
				LEFT JOIN h_commands_values as co ON co.param_id = p.id AND co.h_command_id = h.id
				WHERE p.command_id = '$commandId'
				order by `order`;";
		}elseif($dataType == 3){
			$cn->query = "SELECT p.*, co.value, 1 as param_mode,
					CASE WHEN co.param_id IS NOT NULL THEN 1 ELSE 0 END as exist
				FROM units as u
				INNER JOIN devices as d ON d.id = u.device_id
				INNER JOIN devices_commands as c ON c.version_id = d.version_id
				INNER JOIN devices_comm_params as p ON p.command_id = c.id
				LEFT JOIN devices_config as co ON co.param_id = p.id AND co.unit_id = u.id
				WHERE c.id = '$commandId' AND u.id = '$unitId'
				ORDER BY `order`;";
		}elseif($dataType == 4){

		}
        
        
        $result = $cn->execute();
		$fields = [];
		
		$mode = 1;
		$records = [];
		$exist = 0;
		while($rs = $cn->getDataAssoc($result)){

			$input = 'input';
			$type = 'text';
			$data = [];
			$doValues = false;
			$events = false;
			$mode = $rs['param_mode'];

			if(isset($dataFields[$rs['id']])){
				$input = 'multi';
				
				$data = $dataFields[$rs['id']];
				if($rs['type_value'] != '2'){
					$type = 'radio';
					$input = 'input';
					$type = 'select';
				}else{
					$type = 'checkbox';
					$doValues = 'let sum = 0; for(let x of inputs){sum += +x.value;} return sum;';
					$events = ['change' => "db (event.currentTarget.value,'red')"];
				}

			}

			$fields[] = [
                'input'		=> $input,
				'type'		=> $type,
				'name'		=> 'param_'.$rs['id'],
				'caption'	=> $rs['param'],
				'data' 		=> $data,
				'id' 		=> 'param_'.$rs['id'].'_'.$this->id,
				'doValues'	=> $doValues,
				'events' 	=> $events,
				'dataset'	=> ['cmd'=> $rs['id']],
				'value'		=> $rs['value']
			];
			//hr($mode);
			if($mode == 2){
				$records[] = ['h_command_id'=>$rs['h_command_id'], 'param_id'=>$rs['param_id']];
			}

			$exist = $rs['exist'];
			
		}// end while
		$fields[] = [
			'input'		=> 'hidden',
			'type'		=> 'hidden',
			'name'		=> 'id',
			'caption'	=> 'id',
			'value'		=> ($mode == 2)? $h_id: ''
		];
		$fields[] = [
			'input'		=> 'hidden',
			'type'		=> 'hidden',
			'name'		=> 'command_name',
			'caption'	=> 'command_name',
			'value'		=> $command
		];
		$fields[] = [
			'input'		=> 'hidden',
			'type'		=> 'hidden',
			'name'		=> 'command_id',
			'caption'	=> 'command_id',
			'value'		=> $commandId
		];
		$fields[] = [
			'input'		=> 'input',
			'type'		=> 'text',
			'name'		=> 'description',
			'caption'	=> 'Description',
			'value'		=> $description
		];
		$fields[] = [
			'input'		=> 'hidden',
			'type'		=> 'hidden',
			'name'		=> 'param_mode',
			'caption'	=> 'param_mode',
			'value'		=> $mode
		];
		$fields[] = [
			'input'		=> 'input',
			'type'		=> 'textarea',
			'name'		=> '_detail',
			'caption'	=> 'Detalle',
			'value'		=> $description
		];

		$form = [
			'caption'=>"Command: <span class=\"command_name\">$command</span>",
			'fields'=>$fields,
			'menu'=> new \Sigefor\Component\Menu(['name'=>'/gt/menus/form_param'])
			//'menu'=> new \Sigefor\Component\Menu(['name'=>'gt_params'])
		];

		//print_r($records);exit;
		//$this->setDataRecord('detail', $records);
		//$this->records2 = $records;

		if($dataType == 3){
			if($exist){
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>'Command: '.$command,
					'text'=>"loading correctly"
				]));
				//print_r($result);
				
			}else{
				//print_r($result);
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>'Command: '.$command,
					'text'=>"Record don't exist"
				]));

			}
		}
		
		return $form;

		$opt[] = [
			'method'  => 'setFormParams',
			'value'=>$form,
			
		];
		$this->info = $opt;//$form->getInfo();

        //return $form;
	}

	private function save(){
		$data = (object)\Sevian\S::getVReq();
		$data->unit_id = $this->eparams->unitId;
		//$data->command_id = $data->command_idx;
		$data->status = 1;
		$data->pending = '0';
		$data->device_id = '0';
		$data->__mode_ = $data->param_mode;

		if($data->param_mode == 1){
			$data->__record_ = new \stdClass;
		}else{
			$data->__record_ = $this->getLastRecord();
		}
		

		//print_r($data->__record_);exit;

		
		$dataKeys["master"] = [];//$this->getDataRecord('grid');
		$dataKeys["detail"] = [];//$this->getDataRecord('detail');
		//print_r($dataKeys["detail"]);exit;
		
		$g =  new \Sigefor\Component\FF([
			'name'	=>	\Sigefor\JasonFile::getNameJasonFile('/forms/gt/h_commands', self::$patternJsonFile),//'/forms/gt/h_commands',
			'dataKeys'=>&$dataKeys,
			'dataKeysId'=>'master',
			'data'=>[$data]
		]);
		//hx($g);
		//print_r($data->__record_);
		//print_r($g->getResult());
		foreach($g->getResult() as $k => $v){
			//hr("$v->error");
			if($v->error){
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>'Error '.$g->getCaption(),
					'text'=>"Record wasn't saved!!!"
				]));
				//print_r($result);
				
			}else{
				//print_r($result);
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>$g->getCaption(),
					'text'=>'Record was saved!!!'
				]));

			}

		}
	}
	
    public function getPanel(){
        $div = new \SEVIAN\HTML('div');
        $div->id = $this->containerId;
		//$this->setPanel($div);
		//$div->innerHTML = "klo";
        return $div;
    }
}