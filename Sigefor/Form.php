<?php
namespace Sevian\Sigefor;
include 'ConfigMenu.php';
include 'FormSave.php';


class InfoPage{

	public $type = "";
	public $name = "";
	public $config = [];
	public $pages = [];
	public $menu = "";


}

class InfoInput{


	public $control = "std";
	public $type = "text";
	public $id = "text";
	public $name = "text";

	public $value = false;
	public $data = false;
	public $events = false;
	public $propertys = false;
	public $config = false;
}


class InfoField{
	public $set = 'field';
	
	//public $form = '';
	public $field = '';
	public $name = '';
	//public $method = '';

	public $params = '';
	public $caption = false;
	public $class = '';
	public $placeholder = '';
	public $input = '';//['input'=>'text'];
	public $inputType = '';//['input'=>'text'];
	public $value = '';
	
	public $modeValue = '';
	public $default = '';
	public $data = false;
	public $parent = false;
	public $childs = false;
	public $rules = false;
	
	public $events = false;
	public $info = false;
	
	public $config = false;
	public $inputConfig = false;
	public $onSave = false;
	
	public $subform = false;

	//public $mtype = false;
	//public $key = false;
	//public $serial = false;
	//public $length = false;
	//public $table = false;


	
	public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;	
			}
		}

		if($this->caption === false){
			$this->caption = $this->name;
		}
		
	}

	public function update($opt = []){
		self::__construct($opt);
	}

}


class SubForm{

	private $type = "list";
	private $table = "";
	private $master = "";
	private $detail = "";
	private $setOrder = "";

	public $dataRecord = [];

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}

        
        $this->cn = \Sevian\Connection::get();
	}

	private function getListValue(){

		$cn = $this->cn;

		$where = "";
		foreach($this->master as $key => $value){
			$where .= (($where != '')? " AND ":"")."$key = '".$cn->addslashes($value)."'";
		}
		$query = "SELECT * FROM $this->table

		WHERE $where ";
		//hr($query);
		$result = $cn->execute($query);

		$data = [];
		
		

		$length = count($this->dataRecord);
		$index = $length;
		while($rs = $cn->getData($result)){

			$this->dataRecord[$index] = (object)[
				"id"=>$rs["id"],
				"$this->detail"=>$rs[$this->detail]
			];
			$data[] = [
				$this->detail 	=> $rs[$this->detail],
				"__mode_"		=> 4,
				"__id_"		=> $index++];
		}
		//hr($this->dataRecord,"red");
		return ($data);
	}

	public function getValue(){
		if($this->type == 'list'){
			return $this->getListValue();
		}

	}
}


class Form extends \Sevian\Element implements \Sevian\JsPanelRequest{


	private $mode = '1';//'update'
	private $render = 'form';//'list'


	private $query = '';//'list'

	//private $eparams = [];

	public $showCaption = true;
	public $menus = [];
    
    protected $tForms = "_sg_form";
	protected $tFields = "_sg_fields";
	
	protected $tMenus = "_sg_menus";
    protected $tMenuItems = "_sg_menu_items";

	protected $_pages = [];

	private $menu = '';

	private $infoQuery = false;


	private $page = 1;
	private $searchFor = false;
	private $totalPages = 0;
	private $maxPages = 5;

    public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}

        
        $this->cn = \Sevian\Connection::get();
	}

	public function config(){

		

		if(!$this->getSes('_rec')){
			hr("error");
			$this->setSes('_rec', []);

			$this->_rId = &$this->getSes('_rec');
			//$this->_rId["ddd"] = "eee";
			$this->_rId_n = 0;

			//print_r($this->_vPanel);exit;
		}else{
			
			$this->_rId = $this->getSes('_rec');
			$this->_rId_n = count($this->_rId);
			//hr($this->_rId, "white","purple");
		}
	}
	private function resetRId(){
		$this->_rId = [];
		$this->_rId_n = 0;
		$this->_rId = &$this->getSes('_rec');
	}
	private function addRId($record){
		$this->_rId[$this->_rId_n++] = $record;
	}
	private function getRId($id){
		return $this->_rId[$id]?? false;
	}
    public function evalMethod($method = false): bool{
		
		if($method === false){
            $method = $this->method;
        }
		if(!$this->async){
			if($this->method == "list_page"){
				$method = "list";
			}
		}	
		
		//hr($this->id."....".$method);
        

		//$method = 'list';
        //hr($this->method);
        switch($method){
			case 'create':
				$this->mode = '1';
			case 'load':
				$this->mode = '2';
			case 'request':
				$this->createForm();
				break;
			case 'list':
				$this->createGrid();
				break;
			case 'list_set':
			case 'save':

				
				/*$f = loadJson("save_form.json");
				$save = 'Sevian\Sigefor\FormSave';
				$save::send($f, $f->data, $f->masterData);
				*/

				if(\Sevian\S::getReq('__data_')){
					$this->saveGrid();
				}else{
					$this->save();
				}
				
				break;
			case 'select_record':
				$id = \Sevian\S::getReq('__id_');
hr($id,"red");
				//$this->gVars["record_id"] = $this->pVars['records'][$id]??false;
				$this->gVars["record_id"] = $this->getRId($id);
				break;
			case 'get_record':

                
                
			
				
                break;
            case 'delete':
                break;
            case 'get_field_data':
                break;
			case 'list_page':
				$this->createGrid2();
				break; 
                
                
		}
		
		//hr($this->getSes('_rec'),"purple");
		//hr($this->_rId, "pink","purple");
		//print_r($this->_vPanel);
        return true;	
    }
	public function getMain(){
		return true;
	}

	private function loadConfig(){
		$cn = $this->cn;

		$cn->query = "
			SELECT 
			form, caption, class, query, params, method, pages, f.groups,
			caption as title
			FROM $this->tForms as f
			WHERE form = '$this->name'
		";

		$result = $cn->execute();

		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}

			$config = json_decode($this->params);
			if($config){
				foreach($config as $k => $v){
					$this->$k = $v;
				}
			}

		}

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

    private function _config(){

		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tForms 
			WHERE form = '$this->name'";
        
          
       

		$result = $cn->execute();
		$_info = [];
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}

			$config = json_decode($this->params);
			if($config){
				foreach($config as $k => $v){
					$this->$k = $v;
				}
			}
			

			$info = [
				
				"caption"	=>	$this->title,
				"className"	=>	$this->class,
				
			];
			$this->_menu = json_decode($this->params, true);
			$this->_menu["caption"] = $this->_config["caption"]??$this->caption;
			$this->_menu["class"] = $this->_config["class"] ?? $this->class;


		}
		$_info["caption"] = $this->_menu["caption"];
		$_info["id"] = "sg_form_".$this->id;
		$_info["elements"] = [];
		$this->p['elements'] = [];
		if($this->pages){
			$pages = json_decode(\Sevian\S::vars($this->pages));
			$this->createPages($this->p['elements'], $pages);

			
		}


	
		if($this->groups){
			
			$groups = json_decode(\Sevian\S::vars($this->groups), true);
			
		}

		

		$info = $this->cn->infoQuery($this->query);

		//print_r($info);

		$data = $this->getRecord($info, $this->eparams);

		$fields = $info->fields;

		foreach($fields as $k => $v){
			$this->fields[$k] = new \Sevian\Sigefor\InfoField($v);
		}
		
		
		$q = "
			SELECT * 
			FROM $this->tFields 
			WHERE form = '$this->name'";

		$result = $cn->execute($q);
		//\Sevian\S::$ses["a"]="yanny";
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
		
		$page = &$this->_menu["elements"];
		
		foreach($this->fields as $k => $field){
			$field->id = "{$field->name}_f{$this->id}";
			if($field->default){
				$field->value = $field->default;
				
				
			}
			if(isset($data[$k])){
				$field->value = $data[$k];
			}
			if($field->class){
				$field->className = $field->class;
			}
			if($field->data){
				$data = json_decode(\Sevian\S::vars($field->data));
				$field->data = $this->getDataField($data);
			}
			if(isset($groups[$k])){
				if($groups[$k]){
					$page = &$this->_pages[$groups[$k]]->elements;
				}else{
					$page = &$this->_menu["elements"];
				}
			}

			$page[] = $field;
		
		}

		$this->_menu["elements"] = array_merge($this->_menu["elements"], $this->p["elements"]);
		$menu = $this->createMenu($this->menu);
		$menu['set'] = 'menu';
		$menu['name'] = 'menu';
		$this->_menu["elements"][] = $menu;
		//print_r($this->p);
		//print_r($this->_pages);
		//print_r($this->_menu["elements"]);
	}

	
	private function createPages(&$cont, $pages, $tab = false){

		foreach($pages as $page){

			$page->config->set = $page->type;
			$this->_pages[$page->name] = $page->config;
			$cont[] = &$this->_pages[$page->name];
			if(isset($page->pages)){
				$this->createPages($this->_pages[$page->name]->elements, $page->pages);
			}


		}

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

	private function getDataGrid($search = ''){

		$cn = $this->cn;

		if($search !='' and $this->searchFor){
			$this->query = $cn->evalFilters($this->query, $search, $this->searchFor);
		}

		$cn->query = $this->query;
		$cn->page = $this->eparams->page?? 1;
		$cn->pagination = true;
		$cn->pageLimit = $this->maxPages;

		$result = $cn->execute();

		$this->totalPages = $cn->pageCount;
		$data = $cn->getDataAll($result);

		$keys = $this->infoQuery->keys;
		$i = 0;
		//$this->pVars["records"] = []; 

		$this->resetRId();
		foreach($data as $k => $record){
			
			foreach($keys as $key){

				$data[$k]['__record_']=[
					$key=>$record[$key]
				];
				$data[$k]['__mode_'] = 2;
				$data[$k]['__id_'] = $k;
				$this->gridKey[$k+1] = [
					$key=>$record[$key]
				];

				//$this->pVars["records"][$k + 1] = (object)$data[$k]['__record_'];
			
				$this->addRId((object)[
					$key=>$record[$key]
				]);
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

		//print_r($data);exit;

		$cn->pageLimit = false;
		return $data;

		



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
			'input'	=> 'input',
			'page'	=> '',
			'config'=> [
				'type'	=> 'text',
				"name"	=> '__mode_',
				'value'	=> $this->mode,
				'default'=> '1'
			]
			
		];
		$fields['__id_'] = [
			'input'	=> 'hidden',
			'page'	=> '',
			'config'=> [
				'type'	=> 'text',
				"name"	=> '__id_',
				'value'	=> '1'
			]
			
		];
		
		return $fields;
	}

	private function createForm(){
		
		
		$this->loadConfig();

		$record = false;
		if(isset($this->eparams->record)){
			
			$record = $this->eparams->record;
		}elseif(isset($this->eparams->recordId)){
			$index = $this->eparams->recordId;
			if($index == '0'){

				if(isset($this->gVars['record_id'])){
					
					$record = $this->gVars['record_id'];
				}else{
					
					$__id_ = \Sevian\S::getReq("__id_");
					hr($this->_rId,"orange");
					hr($this->getRId($__id_),"red");
					//$record = $this->pVars['records'][$__id_]?? false;
					$record = $this->getRId($__id_);
				}
				
				
				
			}else{
				//$record = $this->pVars['records'][$index]?? false;
				$record = $this->getRId($index);
			}
		}
		
		$values = $this->getRecord($this->infoQuery, $record);
		
		$fields = [];
		$groups = json_decode(\Sevian\S::vars($this->groups));
		$pages = json_decode(\Sevian\S::vars($this->pages));
		/*

		foreach($this->fields as $f){

			if($f->params){
				//hr($f->params);

				$params = \Sevian\S::varCustom($f->params, $values, '&');
				$params = json_decode(\Sevian\S::vars($params));

				foreach($params as $k => $v){
					$f->$k = $v;
				}
			}


			$id = "{$f->name}_f{$this->id}";
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
				
				
				
				$s = (object)[
					"type"=>"list",
					"table"=>$f->subform->table,
					"master"=>$f->subform->master,
					"detail"=>$f->subform->detail,
					//"dataRecord" =>  &$this->getSes('_rec')
				];

				
				$sf = new SubForm($f->subform);
				$sf->dataRecord =  &$this->getSes('_rec');
				
				$f->value = $sf->getValue();
				print_r($this->getSes('_rec'));
				$config->subForm = [
					//"data"=>$f->value,
					"type"=>"list",
					"detail"=>$f->subform->detail,
					//"master"=>["id"=>"1"],
				];
			}

			if(!$f->input){
				$this->getDefaultInput($this->infoQuery->fields[$f->field]->mtype, $input, $type);
			}else{
				$input = $f->input;
				$type = $f->inputType;
			}

			$config->type = $type;
			
			$config->id = $id;
			$config->name = $f->field;
			$config->caption = $f->caption;
			$config->data = $data;
			$config->value = $f->value?? '';
			$config->className = $config->className?? $f->class?? '';
			//$rules = json_decode($f->rules);
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

			$fields[] = [
				'input'	=> $input,
				'page'	=> $page,
				'config'=> $config
			];
			
		}
		
		
		$fields[] = [
			'input'	=> 'input',
			'page'	=> '',
			'config'=> [
				'type'=>'text',
				"name"=>'__mode_',
				'value'=>$this->mode
			]
			
		];
		$fields[] = [
			'input'	=> 'hidden',
			'page'	=> '',
			'config'=> [
				'type'=>'text',
				"name"=>'__id_',
				'value'=>'1'
			]
			
		];
		*/

		$info = [
			'caption'	=> $this->caption,
			'className'	=> $this->class,
			'id'		=> 'sg_form_'.$this->id,
			'fields'	=> $this->createFields($values),
			'pages'		=> $pages,
			'menu'		=> $this->createMenu($this->menu),
			'className' => ($this->mode == '1')? 'mode-insert': 'mode-update'
			
		];

		$form = new \Sevian\Panel('div');

		$form->id = 'sg_form_'.$this->id;
		$form->title = $this->caption;
		$this->typeElement = 'Form';
		$this->info = $info;//$form->getInfo();
		/*
		$input = $form->add("input");
		$input->type = "text";
		$input->name = "__mode_";
		$input->value = "2";

		$input = $form->add("input");
		$input->type = "text";
		$input->name = "__id_";
		$input->value = "1";

		*/
		//print_r($info);
		$this->panel = $form;

		if(isset($this->eparams->record)){
			\Sevian\S::setSes("f_id",$this->eparams->record );
		}


	}
		
	private function createMenu($name){
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tMenus 
			WHERE menu = '$name'";
        
            
       

		$result = $cn->execute();
		$config = new \stdClass;
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$config->$k = $v;
			}
			//\Sevian\S::vars($config->config)
			$menu = json_decode($config->config, true);

			
			$menu["caption"] = $this->_config["caption"]?? $config->title;
			$menu["class"] = $this->_config["class"] ?? $config->class;
			$menu['tagLink'] = 'button';


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
					$rs['action'] = \Sevian\S::varParam($rs['action'], (array)$this);
					$rs['action'] = \Sevian\S::vars($rs['action']);
					$action = "S.send(".$rs['action'].");";
					
				}else{
					$action = '';
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
					"caption" 	=> $rs["title"],
					"index" 	=> $rs["index"],
					"parent"	=> $rs["parent"],
					"action" 	=> $action,

				];
				
				



				
			
			}



			$menu["items"] = $json;



			//print_r($menu);
			return $menu;
		}
		return false;
	}

	private function createGrid(){

		
		$q = $this->eparams->q?? '';
		$this->loadConfig();
		
		$dataGrid = $this->getDataGrid($q);

		$grid = new \Sevian\HTML("div");
		$grid->id = "sg_form_".$this->id;
		
		$p = new \Sevian\Panel("div");
		$p->title = $this->caption;
		$p->appendChild($grid);

		$this->panel = $p;
		$fields = [];
		
		foreach($this->fields as $f){

			$id = "{$f->name}_f{$this->id}";
			$value = '';

			if(isset($groups->{$f->field})){
				$page = $groups->{$f->field};
			}

			$data = false;
			if($f->data){
				$data = $this->getDataField(json_decode(\Sevian\S::vars($f->data)));
			}
			
			$config = new \stdClass;
			
			if(!$f->input){
				$this->getDefaultInput($this->infoQuery->fields[$f->field]->mtype, $input, $type);
			}else{
				$input = $f->input;
				$type = $f->inputType;
			}

			$config->type = $type;
			
			//$config->id = $id;
			$config->name = $f->field;
			$config->caption = $f->caption;
			$config->data = $data;
			$config->default = $f->default;
			$config->className = $config->className?? $f->class?? '';
			//$rules = json_decode($f->rules);
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
				
				'config'=> $config
			];
			
		}
		
		$fields['__mode_'] = [
			'input'	=> 'hidden',
			'page'	=> '',
			'config'=> [
				'type'=>'text',
				'name'=>'__mode_',
				'caption'=>'__mode_',
				'default'=>'1',
				'value'=>''
			]
			
		];
		$fields['__id_'] = [
			'input'	=> 'hidden',
			'page'	=> '',
			'config'=> [
				'type'=>'text',
				'name'=>'__id_',
				'caption'=>'__id_',
				'default'=>'',
				'value'=>''
			]
			
		];
		
		\Sevian\S::action(new \Sevian\InfoAction([

			"async"=>false,
			"panel"=>4,
			"confirm"=>"hola?",
			"action"=> new \Sevian\InfoActionParams([
				"t"=>"setPanel",
				"id"=>$this->id,
				"element"=>"form",
				"name"=>$this->name,
				"method"=>"page",
				"eparams" => "
				
				
				"

				
				
			])
		]));

		$paginator = [
			'page'=> $this->eparams->page?? $this->page,
			'totalPages'=>	$this->totalPages,
			'maxPages'=>	$this->maxPages,
			'change'=>"S.send(
				{
					async: true,
					panel:$this->id,
					valid:false,
					confirm_: 'seguro?',
					params:	[
						{t:'setMethod',
							id:$this->id,
							element:'sgForm',
							method:'list_page',
							name:'$this->name',
							eparams:{

								page:page,
								q:this.getSearchValue(),
								
							   
							}
						}
						
					]
				});"
		];

		//print_r($this->createFields([]));exit;
		
		$opt = [
			 'id' 			=> $grid->id,
			 'menu'			=> $this->createMenu($this->menu),
			 'caption'		=> $this->caption,
			 'paginator'	=> $paginator,
			 'data'			=> $dataGrid,
			 'fields'		=> $this->createFields([]),
			 'searchValue'	=> $q,

			 'optionText' => [
				"new"		=> "+",
				"edit"		=> "/",
				"delete"	=> "&#215;",
				"save"		=> "guardar",
				"search"	=> "...buscar",
				"search_go"	=> "ir",
				"delete_confirm"=>"seguro que desea eliminar el registro?",
				"select_record"=>"debe elejir un registro, por favor!"
			 	],

			 'search'		=>"
			 S.send(
                {
                    async: false,
                    panel:$this->id,
                    valid:false,
                    confirm_: 'seguro?',
                    params:	[
                        {t:'setMethod',
                            id:$this->id,
                            element:'sgForm',
                            method:'list',
                            name:'$this->name',
                            eparams:{
                               
                                token:'search',
                                q:q
                            }
                        }
                        
                    ]
                });
				 
			 "
		];

		$this->typeElement = "Grid";
		$this->info = $opt;//$form->getInfo();
		//print_r($this->info);
		//print_r($fields);
		//hr($this->eparams, "red");
		//$this->eparams->token = "juan";

	}

	private function createGrid2(){
		
		$this->loadConfig();
		$q = $this->eparams->q?? '';
		
		$dataGrid = $this->getDataGrid($q);

		//$this->panel = new \Sevian\HTML("");
		$fields = [];
		
		foreach($this->fields as $f){

			$id = "{$f->name}_f{$this->id}";
			$value = '';

			if(isset($groups->{$f->field})){
				$page = $groups->{$f->field};
			}

			$data = false;
			if($f->data){
				$data = $this->getDataField(json_decode(\Sevian\S::vars($f->data)));
			}
			
			$config = new \stdClass;
			
			if(!$f->input){
				$this->getDefaultInput($this->infoQuery->fields[$f->field]->mtype, $input, $type);
			}else{
				$input = $f->input;
				$type = $f->inputType;
			}

			$config->type = $type;
			
			//$config->id = $id;
			$config->name = $f->field;
			$config->caption = $f->caption;
			$config->data = $data;
			$config->default = $f->default;
			$config->className = $config->className?? $f->class;

			if($f->inputConfig){
				foreach($f->inputConfig as $k => $v){
					$config->$k = $v;
				}
				
			}

			$fields[$f->name] = [
				'input'	=> $input,
				
				'config'=> $config
			];
			
		}
		
		$paginator = [
			'page'=> $this->eparams->page?? $this->page,
			'totalPages'=>	$this->totalPages,
			'maxPages'	=>	$this->maxPages,
		];
		
		$opt_ = [
			 'id' 		=> "sg_form_".$this->id,
			 'menu'		=> $this->createMenu($this->menu),
			 'caption'	=> $this->caption,
			 'paginator'=> $paginator,
			 'data'		=> $dataGrid,
			 'fields'	=> $fields,
		];


		$opt__[] = [
			'method'  => 'msg',
			'value' => 'Hola Yanny Esteban'

		];
		

		
		$opt[] = [
			'method'  => 'setCaption',
			'value' => "Bienvenidos  al GRID #".$this->eparams->page


		];
		$opt_[] = [
			'method'  => 'setCaption',
			'args' => ['chao Yanny Esteban','Cambiando el Caption de nuevo']
		];
		$opt[] = [
			'method'  => 'setData',
			'value' => $dataGrid
		];

		$opt[] = [
			'method'  => 'setPage',
			'value' => $this->eparams->page?? $this->page
		];
		$this->typeElement = "Grid";
		$this->info = $opt;//$form->getInfo();
		//print_r($this->info);
		//print_r($fields);

	}

	private function _save($data){
		$this->loadConfig();
		//print_r($data);exit;
		//hr($this->pVars['records']);
		//hr(\Sevian\S::getSes("f_id"));
		//print_r($this->fields);

		foreach($this->fields as $k => $v){
			if($v->subform){

				$infoQuery = $this->cn->infoQuery("SELECT * FROM test_edo");
				$this->infoQuery->fields[$k]->detail = $infoQuery;
				$infoQuery->fields["id"]->master = 'id';
			}
		}
		//$_data = (object)\Sevian\S::getVReq();
		//$_data->__record_ = \Sevian\S::getSes("f_id");
		
		$info = new InfoRecord([
			'cn'		=> '_default',
			'mode'		=> 'update',
			'tables'	=> $this->infoQuery->tables,
			'fields'	=> $this->infoQuery->fields,
			'data' 		=> $data,
		]);

		$save = 'Sevian\Sigefor\FormSave';
		//$save::setDictRecords($this->pVars['records']);
		$save::setDictRecords($this->getSes('_rec'));
		
		$result = $save::send($info, $data, []);
		//hr($this->pVars['records'],"red");

		foreach($result as $k => $v){

			if(!$v->error){
				//print_r($result);
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>$this->caption,
					'text'=>'Record was saved!!!'
				]));
			}else{
				//print_r($result);
				$this->addFragment(new \Sevian\iMessage([
					'caption'=>'Error '.$this->caption,
					'text'=>"Record wasn't saved!!!"
				]));

			}

		}
	}

	private function save(){
		$this->loadConfig();

		$_data = (object)\Sevian\S::getVReq();
		//print_r([$_data]);
		$this->_save([$_data]);
	}
	
	private function saveGrid(){

		$aux = json_decode(\Sevian\S::getReq('__data_'));
		$dataForDelete = [];
		$data = [];

		foreach($aux as $_data){

			if($_data->__mode_ == '3'){
				$dataForDelete[] = $_data;
			}else{
				$data[] = $_data;
			}

		}

		$_data = array_merge($dataForDelete, $data);
		$this->_save($_data);
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
		$this->resetRId();
		$this->addRId($record);
		$cn->query = $this->query." WHERE $filter;";

		$result = $cn->execute();
		
		$i = 0;
		if($rs = $cn->getDataRow($result)){
			$data = [];
			foreach($info->fields as $k => $v){
				$data[$k] = $rs[$i++];
			}
			return $data;
		}
		return false;
		
	}
	
	public function getJsConfigPanel():\Sevian\jsConfigPanel{
        return new \Sevian\jsConfigPanel([
            "panel"   => $this->id,
            "type"    => "sgForm",
            "options" => []
            
        ]);
    }
    public function getJsType(){}
	
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
	
}// end class
function loadJson($path){
	return json_decode(file_get_contents($path, true));
		
		//$a= file_get_contents("json/mod_principal.json", true);
		//$_forms = json_decode(file_get_contents("json/mod_principal.json", true), true);
		
		
		
	}


?>