<?php
namespace Sigefor\DBTrait;
require_once MAIN_PATH.'Sigefor/DBTrait/Field.php';


trait JsonForm{
	use ConfigField;
	private $cn = null;

	private $query = '';
	private $infoQuery = null;
	private $menuName = '';
	private $record = null;
	private $dataKeys = [];
	public $mode = 2;
	public $fields = [];

	private $lastRecord = null;
	


	public function loadForm($file){

		$config = json_decode(file_get_contents($file, true));

		foreach($config as $k => $v){
			$this->$k = $v;
		}

		$params = \Sevian\S::vars($this->params);
		$params = json_decode($params);
		
		if($params){
			foreach($params as $k => $v){
				$this->$k = $v;
			}
		}

		$this->query = \Sevian\S::vars($this->query);

		return $config;
	}

	public function loadFields($info, $record = null){
		
		
		$_fields = [];
		if($info->fields){
			foreach($info as $k => $f){
				$_fields[$f->name] = $f;
			}
		}
		
		
		$this->infoQuery = $this->cn->infoQuery($this->query);

		$values = [];
		//
		if($this->record){
			$values = $this->getRecord($this->infoQuery, (object)$this->record);
		}
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
				
				
				
			}
			if($field->data){
					
				$field->data = $this->getDataField(json_decode(\Sevian\S::vars($field->data)));
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
			'cell'	=> 'text',
			'page'	=> '',
			'type'	=> 'text',
			"name"	=> '__mode_',
			"field"	=> '__mode_',
			'value'	=> $this->mode,
			'default'=> '1'
		]);

		$this->fields[] = new \Sevian\Sigefor\InfoField([
			'input'	=> 'hidden',
			'cell'	=> 'text',
			'page'	=> '',
			'type'	=> 'text',
			"name"	=> '__id_',
			"field"	=> '__id_',
			'value'	=> '0'
		]);

		return $this->fields;
	}

	public function configFields($info){
		
	

		$_fields = [];
		if($info->fields){
			foreach($info as $k => $f){
				$_fields[$f->name] = $f;
			}
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
		//$this->lastRecord = $record;

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