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
	public $method = '';
	public $fields = [];
	private $methods = null;
	public $caption = '';
	private $lastRecord = null;
	private $_values = null;
	
	public function infoDBForm($name){
		$name = $this->cn->addSlashes($name);
		
		$this->cn->query = "
			SELECT 
			form, caption, class as className, query, params, methods, pages, f.groups
			FROM $this->tForms as f
			WHERE form = '$name'
		";
		$this->cn->execute();
		return $this->cn->getDataAssoc();
	}

	public function infoDBFields($name, $record = null){
		$name = $this->cn->addSlashes($name);
		
		$this->cn->query = "
			SELECT 
			field, alias, caption, input, input_type as \"type\", cell, cell_type as \"cellType\",
			class, `default`, mode_value as \"modeValue\",data, params,method,rules,events,info 
			FROM $this->tFields 
			WHERE form = '$name'
		";
		
		$fields = [];
		$this->cn->execute();
		while($rs = $this->cn->getDataAssoc()){
			$fields[$rs['field']] = $rs;
		}
		
		return $fields;
	}

	public function setInfoForm($info){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
		
		$params = \Sevian\S::vars($this->params);
		$config = json_decode($params);

		if($config){
			foreach($config as $k => $v){
				$this->$k = $v;
			}
		}
		
		if($this->methods){
			if(is_string($this->methods)){
				$config = \Sevian\S::vars($this->methods);
				$config = json_decode($config, true);
			}else{
				$config = $this->methods;
			}
			
			if($config and $config[$this->method]?? false){
				foreach($config[$this->method] as $k => $v){
					$this->$k = $v;
				}
			}
		}
	}

	public function setInfoFields($infoField, $record = null){
		$cn = $this->cn;
		
		$this->query = \Sevian\S::vars($this->query);

		$this->infoQuery = $cn->infoQuery($this->query);

		$values = [];

		if($this->record){
			$this->_values = $values = $this->getRecord($this->infoQuery, (object)$this->record);
		}

		$f = $this->infoQuery->fields;
		$this->fields = [];
		//
		foreach($f as $key => $info){
			$field = new \Sevian\Sigefor\InfoField($info);
			
			if(isset($infoField[$key])){
				$field->update($infoField[$key]);

				if($infoField[$key]['params']){
					if(is_string($infoField[$key]['params'])){
						$params = \Sevian\S::varCustom($infoField[$key]['params'], $values, '&');
						$params = json_decode(\Sevian\S::vars($params));
					}else{
						$params = $infoField[$key]['params'];
					}
					
					foreach($params as $k => $v){
						$field->$k = $v;
					}
				}
				
				if($field->data){
					if(is_string($field->data)){
						$field->data = $this->getDataField(json_decode(\Sevian\S::vars($field->data)));
					}elseif(is_array($field->data)){
						$field->data = $this->getDataField($field->data);
					}
				}
			}
			
			if($field->modeValue == '1' or !$values){
				
				//$default = \Sevian\S::varCustom($_fields[$key]['params'], $values, '&');
				//$params = \Sevian\S::varCustom($_fields[$key]['params'], $values, '&');
				$field->value = $params = \Sevian\S::vars($field->default);
			}else if(isset($values[$key])){
				$field->value = $values[$key];
			}

			if(!$field->input){
				$this->getDefaultInput($info->mtype, $field->input, $field->type);
			}

			if($field->events){
				
				$params = str_replace("\r\n", '\\n', $field->events);
				$params = str_replace("\t", '',  ($params));
			
				$params = \Sevian\S::varCustom($params, $values, '&');
				$params = json_decode(\Sevian\S::vars($params));

				$field->events = (object)[];
				foreach($params as $k => $v){
					$field->events->$k = $v;
				}
				
			}


			$this->fields[] = $field;

		}
		
		$this->fields[] = new \Sevian\Sigefor\InfoField([
			'input'		=> 'hidden',
			'cell'		=> 'hidden',
			'page'		=> '',
			'type'		=> 'hidden',
			"name"		=> '__mode_',
			"field"		=> '__mode_',
			'value'		=> $this->mode,
			'default'	=> '1'
		]);

		$this->fields[] = new \Sevian\Sigefor\InfoField([
			'input'		=> 'hidden',
			'cell'		=> 'hidden',
			'page'		=> '',
			'type'		=> 'hidden',
			"name"		=> '__id_',
			"field"		=> '__id_',
			'value'		=> '0'
		]);

		return $this->fields;
	}

	public function setInfoRecordFields($infoField){
		$cn = $this->cn;
		
		$this->query = \Sevian\S::vars($this->query);

		$this->infoQuery = $cn->infoQuery($this->query);

		

		$f = $this->infoQuery->fields;
		$this->fields = [];
		//
		foreach($f as $key => $info){
			$field = new \Sevian\Sigefor\InfoRecordField($info);
			
			if(isset($infoField[$key])){
				foreach($infoField[$key] as $k => $v){
					$field->$k = $v;
				}

				if($infoField[$key]['params']){
					if(is_string($infoField[$key]['params'])){
						$params = json_decode(\Sevian\S::vars($infoField[$key]['params']));
					}else{
						$params = $infoField[$key]['params'];
					}

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
		
		$this->dataKeys = [$record];
		
		$cn->query = $this->query." WHERE $filter;";

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){
			return $rs;
		}
		return [];
		
	}
	
	public function getRecords($search = '', $page = 1){

		$this->page = $page;

		$cn = $this->cn;

		if($search !='' and $this->searchFor){
			$this->query = $cn->evalFilters($this->query, $search, $this->searchFor);
		}

		$cn->query = $this->query;
		$cn->page = $page;
		$cn->pagination = $this->pagination;
		$cn->pageLimit = $this->pageLimit;//$this->maxPages;

		$result = $cn->execute();

		$this->totalPages = $cn->pageCount;
		$data = $cn->getDataAll($result);

		$keys = $this->infoQuery->keys;
		
		$this->dataKeys = [];

		foreach($data as $k => $record){
			
			foreach($keys as $key){
				
				$data[$k]['__mode_'] = 2;
				$data[$k]['__id_'] = $k;
				
				$this->dataKeys[] = (object)[
					$key => $record[$key]
				];
				
			}

			foreach($this->fields as $f){
				if($f->subform){
					if($f->params){
						$params = \Sevian\S::varCustom($f->params, $record, '&');
						$params = json_decode(\Sevian\S::vars($params));
		
						foreach($params as $kk => $v){
							$f->$kk = $v;
						}
					}
					$sf = new SubForm($f->subform);
					$sf->dataRecord =  &$this->getSes('_rec');
					
					$data[$k][$f->field] = $sf->getValue();
					
				}
			}
			

		}

		$cn->pageLimit = false;
		return $data;

	}

	public function getValues(){
		return $this->_values;
	}
	public function getDataKeys(){
		return $this->dataKeys;
	}
	public function loadJsonFile($file){
		
		return json_decode(file_get_contents($file, true), true);
		//return $this->jsonConfig($info);
	}
}