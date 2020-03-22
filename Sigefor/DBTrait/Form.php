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
	
	public $mode = 0;
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
				
		$values = $this->getRecord($this->infoQuery, (object)["codpersona"=>16666]);
		
		$f = $this->infoQuery->fields;

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
			'input'	=> 'hidden',
			'cell'	=> 'hidden',
			'page'	=> '',
			
				'type'	=> 'hidden',
				"name"	=> '__mode_',
				"field"	=> '__mode_',
				'value'	=> $this->mode,
				'default'=> '1'
			
			
		]);
		$this->fields[] = new \Sevian\Sigefor\InfoField([
			'input'	=> 'hidden',
			'cell'	=> 'hidden',
			'page'	=> '',
			
				'type'	=> 'text',
				"name"	=> '__id_',
				"field"	=> '__id_',
				'value'	=> '1'
			
			
		]);

		return $this->fields;
	}

	private function _createFields($values){
		$fields = [];
		$groups = json_decode(\Sevian\S::vars($this->groups));
		
		foreach($this->fields as $f){
			
			if($f->params){
				$params = \Sevian\S::varCustom($f->params, $values, '&');
				$params = json_decode(\Sevian\S::vars($params));

				foreach($params as $k => $v){
					$f->$k = $v;
				}
			}

			//$id = "{$f->name}_f{$this->id}";
			$value = '';
			$page = '';
			if($f->modeValue == '1' or !$values){
				$f->value = $f->default;
			}else if(isset($values[$f->field])){
				$f->value = $values[$f->field];
			}

			if(isset($groups->{$f->field})){
				$page = $groups->{$f->field};
			}

			$data = false;
			if($f->data){
				$data = $this->getDataField(json_decode(\Sevian\S::vars($f->data)));
			}
			
			
			if($f->subform){
				
				$sf = new SubForm($f->subform);
				$sf->dataRecord =  &$this->getSes('_rec');
				
				$f->value = $sf->getValue();

				$f->subForm = [
					"type"=>"list",
					"detail"=>$f->subform->detail,
				];
			}

			if(!$f->input){
				$this->getDefaultInput($this->infoQuery->fields[$f->field]->mtype, $input, $type);
			}else{
				$input = $f->input;
				$type = $f->inputType;
			}

			$f->type = $type;
			//$config->cell = $f->cell;
			//$config->id = $id;
			$f->name = $f->field;
			//$f->caption = $f->caption;
			$f->data = $data;
			$f->value = $f->value?? '';
			$f->className = $f->className?? $f->class?? '';
			//$f->childs = $f->childs;
			
			//$f->placeholder = $f->placeholder;
			if($f->parent){
				//$f->parent = $f->parent;
				$f->parentValue = $this->fields[$f->parent]->value?? '';
			}

			if($f->rules != null){
				$f->rules = json_decode($f->rules);
			}

			if($f->inputConfig){
				foreach($f->inputConfig as $k => $v){
					$f->$k = $v;
				}
			}
			/*
			$fields[$f->name] = [
				'input'	=> $input,
				'page'	=> $page,
				'config'=> $config
			];
			*/
			$fields[] = $f;
			
		}

		$fields[] = [
			'input'	=> 'hidden',
			'cell'	=> 'hidden',
			'page'	=> '',
			
				'type'	=> 'hidden',
				"name"	=> '__mode_',
				'value'	=> $this->mode,
				'default'=> '1'
			
			
		];
		$fields[] = [
			'input'	=> 'hidden',
			'cell'	=> 'hidden',
			'page'	=> '',
			
				'type'	=> 'text',
				"name"	=> '__id_',
				'value'	=> '1'
			
			
		];
		
		return $fields;
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
		$cn->query = $this->query." WHERE $filter;";

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){
			return $rs;
		}
		return [];
		
	}
	
}