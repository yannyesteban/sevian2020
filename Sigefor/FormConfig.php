<?php
namespace Sigefor;

trait FormInfoJSON{



	function loadJson($path){
	
		return json_decode(file_get_contents($path, true));
			
			//$a= file_get_contents("json/mod_principal.json", true);
			//$_forms = json_decode(file_get_contents("json/mod_principal.json", true), true);
			
			
			
	}
}

class JsonForm{
	use FormInfoJSON;

	public $path = "../json/commands.json";
	public function __construct($info = []){

		print_r($this->loadJson($this->path));

	}


}

trait FormInfoDB{

	public $cn;
	public $fields = [];

    protected $tForms = "_sg_form";
	protected $tFields = "_sg_fields";
	
	protected $tMenus = "_sg_menus";
	protected $tMenuItems = "_sg_menu_items";
	
	public $dataKeys = [];
	public $searchFor = [];
	public $pagination = true;
	public $pageLimit = 10;

	private $totalPages = 0;

	public function loadFormDB($name){


		$cn = $this->cn;

		$cn->query = "
			SELECT 
			form, caption, class, query, params, method, pages, f.groups,
			caption as title
			FROM $this->tForms as f
			WHERE form = '$name'
		";

		$result = $cn->execute();
		//print_r(\Sevian\S::getVSes());
		
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
		//hr($this->query);
		$this->infoQuery = $cn->infoQuery($this->query);

		
		$fields = $this->infoQuery->fields;

		foreach($fields as $k => $v){
			
			$this->fields[$k] = new \Sevian\Sigefor\InfoField($v);
			$this->fields[$k]->input = 'input';
		}

		$cn->query = "
			SELECT 
			field, alias, caption, input, input_type as \"inputType\", cell, cell_type as \"cellType\",
			class, `default`, mode_value as \"modeValue\",data, params,method,rules,events,info 
			FROM $this->tFields 
			WHERE form = '$name'
		";

		$result = $cn->execute();
		
		while($rs = $cn->getDataAssoc($result)){
			if(isset($this->fields[$rs['field']])){
				$this->fields[$rs['field']]->update($rs);
			}
			if($rs['params']){
				$params = json_decode(\Sevian\S::vars($rs['params']));
				foreach($params as $k => $v){
					$this->fields[$rs['field']]->$k = $v;
				}
			}

			
		}

		$fields = [];
		foreach($this->fields as $field){
			$fields[] = $field;
		}

		return $fields;

	}

	private function getDataGrid($search = '', $page = 1){

		$cn = $this->cn;

		if($search !='' and $this->searchFor){
			//hr($this->searchFor);
			$this->query = $cn->evalFilters($this->query, $search, $this->searchFor);
		}
//hr($this->query);
		$cn->query = $this->query;
		$cn->page = $page;
		$cn->pagination = $this->pagination;
		$cn->pageLimit = $this->pageLimit;//$this->maxPages;

		$result = $cn->execute();

		$this->totalPages = $cn->pageCount;
		$data = $cn->getDataAll($result);

		$keys = $this->infoQuery->keys;
		$i = 0;
		//$this->pVars["records"] = []; 

		//$this->resetRId();
		
		$this->dataKeys = [];

		foreach($data as $k => $record){
			
			foreach($keys as $key){

				$data[$k]['__record_'] = [
					$key=>$record[$key]
				];
				$data[$k]['__mode_'] = 2;
				$data[$k]['__id_'] = $k;
				$this->gridKey[$k+1] = [
					$key=>$record[$key]
				];
				$this->dataKeys[] = [
					$key=>$record[$key]
				];
				//print_r("\n".$key."=".$record[$key]);
				//$this->pVars["records"][$k + 1] = (object)$data[$k]['__record_'];
				
				/*
				$this->addRId((object)[
					$key=>$record[$key]
				]);
				*/
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

		//print_r($this->dataKeys);
		//print_r($data);

		$cn->pageLimit = false;
		return $data;

		



	}


}


class InfoForm{


	public function __construct($info){

	}

	public function addField(){

	}

	public function json(){

	}



}


class FormConfig{
	private $name = "";

    protected $tForms = "_sg_form";
	protected $tFields = "_sg_fields";
	
	protected $tMenus = "_sg_menus";
    protected $tMenuItems = "_sg_menu_items";


	public function loadFormDB($name){


		$cn = $this->cn;

		$cn->query = "
			SELECT 
			form, caption, class, query, params, method, pages, f.groups,
			caption as title
			FROM $this->tForms as f
			WHERE form = '$name'
		";

		$result = $cn->execute();
		//print_r(\Sevian\S::getVSes());
		
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
		//hr($this->query);
		$this->infoQuery = $cn->infoQuery($this->query);

		
		$fields = $this->infoQuery->fields;

		foreach($fields as $k => $v){
			$this->fields[$k] = new \Sevian\Sigefor\InfoField($v);
		}

		$cn->query = "
			SELECT 
			field, alias, caption, input, input_type as \"inputType\", cell, cell_type as \"cellType\",
			class, `default`, mode_value as \"modeValue\",data, params,method,rules,events,info 
			FROM $this->tFields 
			WHERE form = '$this->name'
		";

		$result = $cn->execute();
		
		while($rs = $cn->getDataAssoc($result)){
			if(isset($this->fields[$rs['field']])){
				$this->fields[$rs['field']]->update($rs);
			}
			if($rs['params']){
				
				$params = json_decode(\Sevian\S::vars($rs['params']));
				foreach($params as $k => $v){
					$this->fields[$rs['field']]->$k = $v;
				}
			}

		}

	} 

	private function createFields($values){
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
			
			$config = new \stdClass;
			
			if($f->subform){
				
				$sf = new SubForm($f->subform);
				$sf->dataRecord =  &$this->getSes('_rec');
				
				$f->value = $sf->getValue();

				$config->subForm = [
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

			$config->type = $type;
			$config->cell = $f->cell;
			//$config->id = $id;
			$config->name = $f->field;
			$config->caption = $f->caption;
			$config->data = $data;
			$config->value = $f->value?? '';
			$config->className = $config->className?? $f->class?? '';
			$config->childs = $f->childs;
			
			$config->placeholder = $f->placeholder;
			if($f->parent){
				$config->parent = $f->parent;
				$config->parentValue = $this->fields[$f->parent]->value?? '';
			}

			if($f->rules != null){
				$config->rules = json_decode($f->rules);
			}

			if($f->inputConfig){
				foreach($f->inputConfig as $k => $v){
					$config->$k = $v;
				}
			}

			$fields[$f->name] = [
				'input'	=> $input,
				'page'	=> $page,
				'config'=> $config
			];
			
		}

		$fields['__mode_'] = [
			'input'	=> 'hidden',
			'cell'	=> 'hidden',
			'page'	=> '',
			'config'=> [
				'type'	=> 'hidden',
				"name"	=> '__mode_',
				'value'	=> $this->mode,
				'default'=> '1'
			]
			
		];
		$fields['__id_'] = [
			'input'	=> 'hidden',
			'cell'	=> 'hidden',
			'page'	=> '',
			'config'=> [
				'type'	=> 'text',
				"name"	=> '__id_',
				'value'	=> '1'
			]
			
		];
		
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

?>