<?php

namespace GT;

include_once '../sigefor/Component/Menu.php';
include_once '../sigefor/Component/Form.php';

class Command extends \Sevian\Element{

	private $records = null;
	private $lastRecord = null;

	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();
		
	}
	public function config(){

		if(!$this->getSes('_records')){
			$this->setSes('_records', []);
		}
		if(!$this->getSes('_lastRecords')){
			$this->setSes('_lastRecords', []);
		}

		$this->records = &$this->getSes('_records');
		$this->lastRecord = &$this->getSes('_lastRecords');

		//hr($this->lastRecord);
	}
	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
        }
		switch($method){
			case 'create':
				$this->load();
			break;
			case 'load_commands':
				\Sevian\S::setSes('unit_idx', \Sevian\S::getReq('unit_idx'));

				$this->loadCommans();
				//print_r(\Sevian\S::getVReq());
				
			break;
			case 'load_form':
				$this->loadForm();
				//print_r(\Sevian\S::getVReq());
				
			break;
			case 'edit_form':
				//$this->loadForm();
				$this->editForm();
				//print_r(\Sevian\S::getVReq());exit;
				
			break;
			case 'form_commands':
				//print_r(\Sevian\S::getVReq());
				$this->formParams('xxx',\Sevian\S::getReq('command_id'),\Sevian\S::getReq('unit_id'));
			break;
			case 'save_command':
				$this->save_command();
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
	}

	public function loadCommans(){
		$this->lastRecord = null;
		$g =  new \Sigefor\Component\Grid([
			'panelId'=>$this->id,
			'name'=>'h_commands',
			'method'=>'list'
		]);

		$this->records = $g->getDataKeys();

		$opt[] = [
			'method'  => 'setGrid',
			'value'=>$g,
			'_args' => [1,1,1]
		];
		$this->info = $opt;//$form->getInfo();
	}
	
	public function loadForm(){

		
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

		
		$this->lastRecord = null;
		$g =  new \Sigefor\Component\Form([
			'panelId'=>$this->id,
			'name'=>'h_commands',
			'mode'=>2,
			'method'=>'load',
			'record'=>$this->getRecord()
		]);
		$opt[] = [
			'method'  => 'setForm',
			'value'=>$g,
			'_args' => [1,1,1]
		];
		$this->info = $opt;//$form->getInfo();
	}

	private function formParams($cmd, $commandId, $unitId, $h_id=0){
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
        $cn->query = "SELECT p.*, co.value, CASE WHEN co.param_id IS NOT NULL THEN 2 ELSE 1 END as param_mode
			FROM devices_comm_params as p
			LEFT JOIN h_commands as h ON h.command_id = p.command_id and h.id = '$h_id'
			LEFT JOIN h_commands_values as co ON co.param_id = p.id AND co.h_command_id = h.id
			WHERE p.command_id = '$commandId'
			order by `order`;";
        $result = $cn->execute();
		$fields = [];
		
		//\Sevian\S::db($cn->query);

		$fields[] = [
			'input'=>'hidden',
			'type'=>'hidden',
			'name'=>'param_cmd_id',
			'caption'=> 'cmd_id',
			'value'=>$commandId
		];

		$fields[] = [
			'input'=>'hidden',
			'type'=>'hidden',
			'name'=>'param_unit_id',
			'caption'=> 'param_unit_id',
			'value'=>$unitId
		];

		$fields[] = [
			'input'=>'hidden',
			'type'=>'hidden',
			'name'=>'param_tag',
			'caption'=> 'tag'
		];
	
		$fields[] = [
			'input'=>'hidden',
			'type'=>'hidden',
			'name'=>'param_pass',
			'caption'=> 'pass',
			'value'=>'0000'
		];

		$fields[] = [
			'input'=>'input',
			'type'=>'text',
			'name'=>'param_name',
			'caption'=> 'Name',
			'value'=>$cmd
		];

		$fields[] = [
			'input'=>'input',
			'type'=>'textarea',
			'name'=>'x',
			'caption'=> 'x',
			'value'=>'x'
		];
		
		$mode = 1;
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
                'input'=>$input,
				'type'=>$type,
				'name'=>'param_'.$rs['id'],
				'caption'=>$rs['param'],
				'data' => $data,
				'id' => 'param_'.$rs['id'].'_'.$this->id,
				'doValues' => $doValues,
				'events' => $events,
				'dataset'=>['cmd'=> $rs['id']],
				'value'=> $rs['value']
            ];
		}
		
		$fields[] = [
			'input'=>'input',
			'type'=>'text',
			'name'=>'param_mode',
			'caption'=> 'param_mode',
			'value'=>$mode
		];

		$form = [
			'caption'=>"Command: <span class=\"command_name\">$command</span>",
			'fields'=>$fields,
			'menu'=> new \Sigefor\Component\Menu(['name'=>'gt_params'])
		];

		$opt[] = [
			'method'  => 'setFormX',
			'value'=>$form,
			
		];
		$this->info = $opt;//$form->getInfo();

        //return $form;
	}

	public function getRecord(){

		if($this->lastRecord){
			return $this->lastRecord;
		}
		$__id_ = \Sevian\S::getReq("__id_");

		if(!$__id_){
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
		
		$g =  new \Sigefor\Component\FS([
			'name'	=>	'h_commands',
			'data'=>[(object)\Sevian\S::getVReq()]
		]);
		
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
		
		foreach($result as $k => $v){
			//hr("$v->error");
			if($v->error){
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>'Error '.$g->caption,
					'text'=>"Record wasn't saved!!!"
				]));
				//print_r($result);
				
			}else{
				//print_r($result);
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>$g->caption,
					'text'=>'Record was saved!!!'
				]));

			}

		}
	}

}

?>