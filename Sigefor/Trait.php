<?php
namespace Sigefor;


trait traitMenuDB{
	protected $tMenus = "_sg_menus";
	protected $tMenuItems = "_sg_menu_items";
	private $cn = null;

	public function loadMenu($name){
		$cn = $this->cn;

		$cn->query = "
			SELECT menu, title,class, params, config, datetime
			FROM $this->tMenus 
			WHERE menu = '$name'";
        
            
       

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}
			$params = \Sevian\S::vars($this->config);
			$config = json_decode($params);
			if($config){
				foreach($config as $k => $v){
					$this->$k = $v;
				}
			}


			//$this->_menu = json_decode($this->config, true);

			
			//$this->_menu["caption"] = $this->_config["caption"]??$this->title;
			//$this->_menu["class"] = $this->_config["class"] ?? $this->class;

			
			$this->loadCfgItems($name);
			//print_r($this->_config);
		}
	}

	public function loadCfgItems($name){
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tMenuItems 
			WHERE menu = '$name' order by `order`";
        
            

		$result = $cn->execute();
		$opt = [];

		$items = [];
		$json = [];
		
		while($rs = $cn->getDataAssoc($result)){
			if($rs["action"]){
				$action = "Sevian.send(".$rs["action"].");";
				$action = "S.send(".$rs["action"].");";
			}else{
				$action = "";
			}

			$index = $rs["index"];
			$parent = $rs["parent"];
			
			$items[$index] = [
				"caption" => $rs["title"],

				"action" => $action,

			];
			

			if($parent != ""){
				if(!isset($items[$parent]["items"])){
					$items[$parent]["items"] = [];
				}
				
				$items[$parent]["items"][] = &$items[$index];
			}else{
				
				$json[] = &$items[$index];
			}

			
			


			$opt[] = [
				"caption" => $rs["title"],
				"index" => $rs["index"],
				"parent" => $rs["parent"],
				"action" => $action,

			];
			
			



			
		
		}
		$this->items = $json;
		//print_r($items);
		//print_r(json_encode($json, JSON_PRETTY_PRINT));

	}
}


trait traitConfigField{
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
	private function getDefaultInput($meta, &$input, &$type){
		$input = 'input';
		switch($meta){
			case 'I':
			case 'C':
				$type = 'text';
				break;
			case 'D':
				$input = 'date';
				$type = 'calendar';
				break;
			case 'B':
				$type =  'textarea';
				break;

		}
	}
}

trait traitFormDB{
	use traitConfigField;
    protected $tForms = "_sg_form";
	protected $tFields = "_sg_fields";
	
	private $cn = null;
	private $query = '';
	private $infoQuery = null;
	private $menuName = '';
	public $mode = 0;

	public function loadForm($name){
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

		
		$_fields = $this->infoQuery->fields;

		foreach($_fields as $k => $v){
			
			$fields[$k] = new \Sevian\Sigefor\InfoField($v);
			$fields[$k]->input = 'input';
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
			if(isset($fields[$rs['field']])){
				$fields[$rs['field']]->update($rs);
			}
			if($rs['params']){
				$params = json_decode(\Sevian\S::vars($rs['params']));
				foreach($params as $k => $v){
					$fields[$rs['field']]->$k = $v;
				}
			}

			
		}

		$this->fields = [];
		foreach($fields as $field){
			$this->fields[] = $field;
		}

		return $this->fields;
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

	
}


?>