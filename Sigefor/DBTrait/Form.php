<?php
namespace Sigefor\DBTrait;
include_once "../Sigefor/DBTrait/Field.php";


trait Form{
	use ConfigField;
	private $cn = null;
	
	private $tForms = "_sg_form";
	private $tFields = "_sg_fields";
	
	
	private $query = '';
	private $infoQuery = null;
	private $menuName = '';
	private $record = null;
	private $dataKeys = [];
	public $mode = 2;
	public $fields = [];
	
	public function loadForm($name){


		$cn = $this->cn;

		$cn->query = "
			SELECT 
			form, caption, class, query, params, method, pages, f.groups
			FROM $this->tForms as f
			WHERE form = '$name'
		";
		
		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){
			foreach($rs as $k => $v){
				$this->$k = $v;
			}
			
			$params = \Sevian\S::vars($this->params);
			$config = json_decode($params);
			
			if($config){
				foreach($config as $k => $v){
					$this->$k = $v;
				}
			}
			$this->query = \Sevian\S::vars($this->query);

		}
		

	}

	public function loadFields($name, $values = []){
		
		$cn = $this->cn;
		
		$cn->query = "
			SELECT 
			field, alias, caption, input, input_type as \"type\", cell, cell_type as \"cellType\",
			class, `default`, mode_value as \"modeValue\",data, params,method,rules,events,info 
			FROM $this->tFields 
			WHERE form = '$name'
		";

		$result = $cn->execute();

		$_fields = [];
		while($rs = $cn->getDataAssoc($result)){
			$_fields[$rs['field']] = $rs;
		}

		$this->infoQuery = $cn->infoQuery($this->query);
			//hr($this->record)	;
		//$values = $this->getRecord($this->infoQuery, (object)["codpersona"=>16666]);
		$values = $this->getRecord($this->infoQuery, $this->record);
		
		$f = $this->infoQuery->fields;
		$this->fields = [];
		foreach($f as $key => $info){
			$field = new \Sevian\Sigefor\InfoField($info);
			
			if(isset($_fields[$key])){
				$field->update($_fields[$key]);

				if($_fields[$key]['params']){
					$params = \Sevian\S::varCustom($_fields[$key]['params'], $values, '&');
					$params = json_decode(\Sevian\S::vars($params));
					
					foreach($params as $k => $v){
						$field->$k = $v;
					}
					
				}
				
				if($field->data){
					
					$field->data = $this->getDataField(json_decode(\Sevian\S::vars($field->data)));
				}
				
			}
			
			if($field->modeValue == '1' or !$values){
				$field->value = $field->default;
			}else if(isset($values[$key])){
				$field->value = $values[$key];
			}

			if(!$field->input){
				$this->getDefaultInput($info->mtype, $field->input, $field->type);
			}

			$this->fields[] = $field;

		}
		$this->fields[] = new \Sevian\Sigefor\InfoField([
			'input'	=> 'input',
			'cell'	=> 'text',
			'page'	=> '',
			'type'	=> 'text',
			"name"	=> '__mode_',
			"field"	=> '__mode_',
			'value'	=> $this->mode,
			'default'=> '1'
		]);

		$this->fields[] = new \Sevian\Sigefor\InfoField([
			'input'	=> 'input',
			'cell'	=> 'text',
			'page'	=> '',
			'type'	=> 'text',
			"name"	=> '__id_',
			"field"	=> '__id_',
			'value'	=> '1'
		]);

		return $this->fields;
	}

	public function configFields($name){
		
		$cn = $this->cn;
		
		$cn->query = "
			SELECT 
			field, alias, caption, input, input_type as \"type\", cell, cell_type as \"cellType\",
			class, `default`, mode_value as \"modeValue\",data, params,method,rules,events,info 
			FROM $this->tFields 
			WHERE form = '$name'
		";

		$result = $cn->execute();

		$_fields = [];
		while($rs = $cn->getDataAssoc($result)){
			$_fields[$rs['field']] = $rs;
		}

		$this->infoQuery = $cn->infoQuery($this->query);
		$f = $this->infoQuery->fields;
		$this->fields = [];

		foreach($f as $key => $info){
			$field = new \Sevian\Sigefor\InfoRecordField($info);
			
			if(isset($_fields[$key])){
				$field->update($_fields[$key]);

				if($_fields[$key]['params']){
					$params = \Sevian\S::varCustom($_fields[$key]['params'], $values, '&');
					$params = json_decode(\Sevian\S::vars($params));
					
					foreach($params as $k => $v){
						$field->$k = $v;
					}
				}
			}

			$this->fields[] = $field;
		}

		return $this->fields;
	}

	public function getRecord($info, $record){
		
		if(!$record){
			return [];
		}

		$cn = $this->cn;
		$filter = '';
		
		foreach($info->keys as $k => $v){
			if(isset($record->$k)){
				if(isset($info->fields[$k])){
					$table = $info->fields[$k]->orgtable;
					$filter = $table.'.'.$cn->addQuotes($k)."='".$cn->addSlashes($record->$k)."'";
				}
			}
		}
		//$this->pVars["records"][1] = $record;
		//$this->resetRId();
		//$this->addRId($record);

		$this->dataKeys = [$record];
		$cn->query = $this->query." WHERE $filter;";

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){
			return $rs;
		}
		return [];
		
	}
	
	public function getDataKeys(){
		return $this->dataKeys;
	}
}