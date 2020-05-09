<?php

namespace GT;
include_once '../sigefor/DBTrait/DataRecord.php';
include_once '../sigefor/Component/Menu.php';
include_once '../sigefor/Component/Form.php';
include_once '../sigefor/Component/Grid.php';

use \sigefor\DBTrait\DataRecord;

class Command extends \Sevian\Element{
	use DataRecord;


	private $records = null;
	private $records2 = null;
	private $lastRecord = null;

	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();
		
	}
	public function config2(){

		if(!$this->getSes('_records')){
			$this->setSes('_records', []);
		}
		if(!$this->getSes('_lastRecords')){
			$this->setSes('_lastRecords', []);
		}

		if(!$this->getSes('_records2')){
			$this->setSes('_records2', []);
		}

		$this->records = &$this->getSes('_records');
		$this->lastRecord = &$this->getSes('_lastRecords');

		$this->records2 = &$this->getSes('_records2');
		//hr($this->records);
	}

	public function config(){
		$this->initDataRecord();
	}
	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
        }
		switch($method){
			case 'create':
				$this->load();
				break;
			case 'unit_init':
				\Sevian\S::setSes('unit_idx', \Sevian\S::getReq('unit_idx'));
				$this->hCommands();
				$this->loadCommands();
				break;
			case 'h_commands':
				\Sevian\S::setSes('unit_idx', \Sevian\S::getReq('unit_idx'));
				$this->hCommands();
				break;
			case 'load_commands':
				\Sevian\S::setSes('unit_idx', \Sevian\S::getReq('unit_idx'));
				
				$this->loadCommands();
				//print_r(\Sevian\S::getVReq());
				
				break;
			case 'load_form':
				//$this->loadForm();
				//print_r(\Sevian\S::getVReq());
				
				break;
			case 'edit_form':
				//$this->loadForm();
				//print_r(\Sevian\S::getVReq());exit;
				$this->editForm();
				//print_r(\Sevian\S::getVReq());exit;
				
				break;
			case 'form_commands':
				//print_r(\Sevian\S::getVReq());
				$form = $this->paramsLoad(2,\Sevian\S::getReq('command_id'),\Sevian\S::getReq('unit_id'));
				$opt[] = [
					'method'  => 'setFormX',
					'value'=>$form,
					
				];
				$this->info = $opt;//$form->getInfo();
				break;
			case 'save_command':
				$this->save_command();
				break;
			case "get_data":
				$this->setPage($this->eparams->q, $this->eparams->page);
				break;
			case "search":
				$this->setPage($this->eparams->q, 1);
				break;
			case 'params_load':
				

				$form = $this->paramsLoad(1,\Sevian\S::getReq('command_idx'),\Sevian\S::getReq('unit_idx'));
				$opt[] = [
					'method'  => 'setFormParams',
					'value'=>$form,
					
				];
				$this->info = $opt;//$form->getInfo();
				break;
			case 'load_config':
				$this->loadConfig();
				break;

		}

		return true;
	}
	
	public function load(){
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-command-'.$this->id;
		$this->typeElement = 'Command';

		$g =  new \Sigefor\Component\Form([
			'panelId'=>$this->id,
			//'name'=>$this->name,
			'name'=>'main_command',
			'method'=>'request',
			'mode'=>1
			//'record'=>$this->getRecord()
		]);


		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'form'=>$g
		];
		/*
		$f = new  \Sigefor\sform([
			'containerId'=>'list-commands',
			"id"=>$this->id,
			//"id"=>$this->panel->id,
			"name"=>"h_commands",
			"method"=>"request",
			'eparams' => &$this->eparams
		]);

		$f->evalMethod('request');
		$this->addJasonComponent($f);
		*/
	}

	public function hCommands(){
		
		$f = new  \Sigefor\sform([
			
			'containerId'	=> 'list-commands',
			'id'			=> $this->id,
			'name'			=> 'form_command',
			'method'		=> 'request',
			'eparams'		=> &$this->eparams
		
		]);

		$f->evalMethod('request');
		$this->info[] = [
			'method'  => 'setFormCommand',
			'value'=>$f->info
		];
		//$this->info = $opt;//$form->getInfo();
		return;

		//$this->typeElement = 'Command';
		//$this->info = ["a"=>2, "id"=>$this->getPanelId()];
		//$f->evalMethod("request");
		//print_r($f->info);
		//$this->panel->appendChild($f->panel); 
		$this->addJasonComponent($f);

		$this->info[] = [
			'method'  => 'clearForm',
			'value'=> null,
			
		];
		$this->info = $opt;//$form->getInfo();
	}

	public function listCommands(){

	}

	public function loadCommands(){
		$this->lastRecord = null;
		$g =  new \Sigefor\Component\Grid([
			'element'=>$this->element,
			'panelId'=>$this->id,
			'name'=>'h_commands',
			'method'=>'list'
		]);

		//$this->records = $g->getDataKeys();
		//$records=$grid->getDataKeys();
		$records=$g->getDataKeys();
		
		$this->setDataRecord('grid', $records);
		$this->info[] = [
			'method'  => 'setGrid',
			'value'=>$g,
			'_args' => [1,1,1]
		];
		//$this->info = $opt;//$form->getInfo();
	}

	public function setPage($q, $page){
		$g =  new \Sigefor\Component\Grid([
			'element'=>$this->element,
			'panelId'=>$this->id,
			'name'=>'h_commands',
			'method'=>'list'
		]);
		$data = $g->getDataGrid($q, ($page<=0)? 1: $page);
		$opt[] = [
			'method'  => 'setData',
			'args' => [$data, ($page<=0)? 1: $page, $g->getTotalPages()]
		];
		
		$this->records = $g->getDataKeys();
		$this->typeElement = "";
		$this->info = $opt;//$form->getInfo();

	}
	
	public function loadForm(){
		hr(1111);
		
		$this->lastRecord = null;
		$g =  new \Sigefor\Component\Form([
			'panelId'=>$this->id,
			'name'=>'h_commands',
			'mode'=>1,
			'method'=>'request'
		]);
		$opt[] = [
			'method'  => 'setForm',
			'value'=>$g,
			'_args' => [1,1,1]
		];
		$this->info = $opt;//$form->getInfo();
	}
	public function editForm(){


		//print_r(\sevian\s::getVreq());exit;
		$__id_ = \Sevian\S::getReq("__id_");

		if(!isset($__id_)){
			$__id_ = 0;
		}

		$record = $this->getRecord('grid', $__id_);

		//print_r ($record);

		$this->lastRecord = null;
		/**/
		$g =  new \Sigefor\Component\Form([
			'panelId'=>$this->id,
			'name'=>'h_commands',
			'mode'=>2,
			'method'=>'load',
			'record'=>$record
		]);

		$values = $g->getValues();
		$this->records = $g->getDataKeys();
		$opt_[] = [
			'method'  => 'setForm',
			'value'=>$g,
			'_args' => [1,1,1]
		];
		$opt[] = [
			'method'  => 'setFormParams',
			'value'=>$this->paramsLoad(2,$values['command_id'],$values['unit_id'],$record->id, $values['description'])
			
		];
		$this->info = $opt;//$form->getInfo();
	}

	public function loadConfig(){

		//print (\sevian\s::getReq('command_idx').' '. \sevian\s::getReq('unit_idx'));
		
		$opt[] = [
			'method'  => 'setFormParams',
			'value'=>$this->paramsLoad(3, \sevian\s::getReq('command_idx'), \sevian\s::getReq('unit_idx'))
			
		];
		$this->info = $opt;//$form->getInfo();
	}

	private function formParams($cmd, $commandId, $unitId, $h_id=0, $description = ''){
		
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

        $cn->query = "SELECT p.*, co.value
			FROM devices_comm_params as p
			LEFT JOIN devices_config as co ON co.param_id = p.id
			LEFT JOIN units as u ON u.device_id = co.device_id AND u.id = '$unitId'
			WHERE p.command_id = '$commandId' 
			order by `order`;";
        $cn->query = "SELECT p.*, co.value, CASE WHEN co.param_id IS NOT NULL THEN 2 ELSE 1 END as param_mode,
			co.h_command_id, co.param_id
			FROM devices_comm_params as p
			LEFT JOIN h_commands as h ON h.command_id = p.command_id and h.id = '$h_id'
			LEFT JOIN h_commands_values as co ON co.param_id = p.id AND co.h_command_id = h.id
			WHERE p.command_id = '$commandId'
			order by `order`;";
        $result = $cn->execute();
		$fields = [];
		
		$mode = 1;
		$records = [];
		
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
			
		}// end while
		$fields[] = [
			'input'		=> 'input',
			'type'		=> 'text',
			'name'		=> 'id',
			'caption'	=> 'id',
			'value'		=> $h_id
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

		$form = [
			'caption'=>"Command: <span class=\"command_name\">$command</span>",
			'fields'=>$fields,
			'menu'=> new \Sigefor\Component\Menu(['name'=>'gt_params'])
		];

		//print_r($records);exit;
		$this->records2 = $records;
		return $form;

		$opt[] = [
			'method'  => 'setFormParams',
			'value'=>$form,
			
		];
		$this->info = $opt;//$form->getInfo();

        //return $form;
	}

	public function getRecord2(){

		if($this->lastRecord){
			return $this->lastRecord;
		}


		$__id_ = \Sevian\S::getReq("__id_");

		if(!isset($__id_)){
			return null;
		}

		$record = $this->records[$__id_];
		/*
			OJO :
			evita el error cuando el usuario pulsa F5/Refresh
			$this->records[$__id_] = $record;
		*/
		//$this->records[$__id_] = $record;
		$this->lastRecord = $record;
		return $record;
	}

	public function save_command(){

		$data = (object)\Sevian\S::getVReq();
		$data->unit_id = $data->unit_idx;
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

		
		$dataKeys["master"] = $this->getDataRecord('grid');
		$dataKeys["detail"] = $this->getDataRecord('detail');
		//print_r($dataKeys["detail"]);exit;

		$g =  new \Sigefor\Component\FS([
			'name'	=>	'h_commands',
			'dataKeys'=>&$dataKeys,
			'dataKeysId'=>'master',
			'data'=>[$data]
		]);
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
		$this->info = [];
		//$g->save();


		//print_r(\Sevian\S::getVReq());

		return;

		$this->records = [];
		$g =  new \Sigefor\Component\FormSave(
			[
				'panelId'	=> $this->id,
				'name'		=> 'h_commands',
				'dataKeys'	=> &$this->records
			]);
			//\Sevian\S::setReq("__record_", (object)["id"=>48])	;

			//$g::setDictRecords($this->records);	
		$_data = (object)\Sevian\S::getVReq();
		$_data->__mode_ = 1;
		$_data->__id_ = 0;
		//print_r([$_data]);
		$result = $g->send([$_data]);
		//hr("hola2");
		//hr($result);
		
		//$this->lastRecord = $this->records[0];
		
		
		//hr($this->records);
		//print_r($result);exit;
		
		
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

		$form = [
			'caption'=>"Command: <span class=\"command_name\">$command</span>",
			'fields'=>$fields,
			'menu'=> new \Sigefor\Component\Menu(['name'=>'gt_params'])
		];

		//print_r($records);exit;
		$this->setDataRecord('detail', $records);
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

}

?>