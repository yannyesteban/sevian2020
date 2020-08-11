<?php
namespace Sigefor\DBTrait;

require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';

require_once MAIN_PATH.'Sigefor/InfoField.php';
require_once "Field.php";

trait Form2{
	use ConfigField;
	use JasonFileInfo;

	public $mode = 2;
	public $recordIndex = 0;
	public $method = '';
	public $fields = [];
	public $caption = '';

	private $cn = null;
	private $tForms = "_sg_form";
	private $tFields = "_sg_fields";
	private $query = '';
	private $infoQuery = null;
	private $menuName = '';
	private $record = null;
	private $dataKeys = [];
	private $methods = null;
	private $lastRecord = null;
	private $recordFrom = false;
	private $_values = null;
	
	public function init($name, $record, $pattern = null){
		
		if($info = $this->loadJsonInfo($name, $pattern)){
			$this->infoFields = $info->infoFields;
			
		}else{
			$info = $this->loadDBForm($name);
			$this->infoFields = $this->loadDBFields($name);
		}

		$this->setInfoForm($info);

	}

	public function loadForm2($record){
		$this->setInfoFields($this->infoFields, $record);
	}
	
	public function loadForm($name, $record, $pattern = null){
		
		if($info = $this->loadJsonInfo($name, $pattern)){
		
			$this->setInfoForm($info);
			$this->setInfoFields($info->infoFields, $record);
		}else{
		
			$info = $this->loadDBForm($name);
			$this->setInfoForm($info);
			
			$infoField = $this->loadDBFields($name);
			$this->setInfoFields($infoField, $record);
		}
	}

	public function infoRecord($name, $pattern = null){
		
		if($info = $this->loadJsonInfo($name, $pattern)){
			
			$this->setInfoForm($info);
			$this->setInfoRecordFields($info->infoFields);
		}else{
			
			$info = $this->loadDBForm($name);
			$this->setInfoForm($info);
			
			$infoField = $this->loadDBFields($name);
			$this->setInfoRecordFields($infoField);
		}
	}




	public function loadDBForm($name){
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

	public function loadDBFields($name, $record = null){
		$name = $this->cn->addSlashes($name);
		
		$this->cn->query = "
			SELECT 
			field as name, alias, coalesce(caption, '') as caption, input, input_type as \"type\",
			cell, cell_type as \"cellType\",
			class, `default`, mode_value as \"modeValue\",data, params,method,rules,events,info 
			FROM $this->tFields 
			WHERE form = '$name'
		";
		
		$fields = [];
		$this->cn->execute();

		
		return $this->cn->getDataAll();

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
				$config = (array)$this->methods;
			}
			
			if($config and $config[$this->method]?? false){
				foreach($config[$this->method] as $k => $v){
					$this->$k = $v;
				}
			}
		}

		$this->query = \Sevian\S::vars($this->query);
		$this->infoQuery = $this->cn->infoQuery($this->query);

	}

	public function getFields($query, $record = null){
		$cn = $this->cn;
		
		$query = \Sevian\S::vars($query);

		$this->infoQuery = $cn->infoQuery($query);

		$values = [];

		if($this->record){
			$this->_values = $values = $this->getRecord($this->infoQuery, (object)$this->record);
		}

		$f = $this->infoQuery->fields;
		$_fields = [];
		foreach($this->infoQuery->fields as $key => $info){
			$_fields[$key] = new \Sevian\Sigefor\InfoField($info);
		}
	}

	public function setInfoFields($infoField, $record = null){
		$cn = $this->cn;
		
		//$this->query = \Sevian\S::vars($this->query);

		//$this->infoQuery = $cn->infoQuery($this->query);

		$values = [];
		//hr($this->userData);
		
		if($this->record){
			$this->_values = $values = $this->getRecord((object)$record);
		}elseif($this->recordFrom and $this->method == 'load-from'){
			$this->_values = $values = $this->getRecord($this->recordFrom);
		}
		
		$_fields = [];
		$this->fields = [];

		foreach($this->infoQuery->fields as $key => $info){
			$this->fields[] = $_fields[$key] = new \Sevian\Sigefor\InfoField($info);
			$this->getDefaultInput($_fields[$key]->mtype, $_fields[$key]->input, $_fields[$key]->type);
			$_fields[$key]->value = $values[$key]?? '';
		}
		
		foreach($infoField as $info){
			$info = (object)$info;
			$name = $info->name;

			if(!isset($_fields[$name])){
				continue;
			}

			$field = $_fields[$name];

			$field->update($info);
			
			if($info->params?? false){
				if(is_string($info->params)){
					$params = \Sevian\S::varCustom($info->params, $values, '&');
					$params = json_decode(\Sevian\S::vars($params));
				}else{
					$params = $info->params;
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

			if($field->modeValue == '1' or !$values){
				
				//$default = \Sevian\S::varCustom($_fields[$key]['params'], $values, '&');
				//$params = \Sevian\S::varCustom($_fields[$key]['params'], $values, '&');
				$field->value = $params = \Sevian\S::vars($field->default);
			
			}

			if($field->events && is_string($field->events)){
				$params = str_replace("\r\n", '\\n', $field->events);
				$params = str_replace("\t", '',  ($params));
				$params = \Sevian\S::varCustom($params, $this->userData, '&P_');
				$params = \Sevian\S::varCustom($params, $values, '&');
				$params = json_decode(\Sevian\S::vars($params));
			
				$field->events = (object)[];
				foreach($params as $k => $v){
					$field->events->$k = $v;
				}
				
			}
			
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
			'value'		=> $this->recordIndex
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
			$field = new \Sigefor\InfoRecordField($info);
			
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

	public function getRecord($record){
		
		if(!$record){
			return [];
		}

		$cn = $this->cn;
		$filter = '';
		$info = $this->infoQuery;
		foreach($info->keys as $k => $v){

			if(isset($record->$k) and isset($info->fields[$k])){
				$table = $info->fields[$k]->orgtable;
				$filter = $table.'.'.$cn->addQuotes($k)."='".$cn->addSlashes($record->$k)."'";
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

	public function getTables(){
		return $this->infoQuery->tables;
	}
	
}