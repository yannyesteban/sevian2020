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
	public $caption = false;
	public $class = '';
	//public $params = '';
	public $input = 'std';//['input'=>'text'];
	public $type = 'text';//['input'=>'text'];
	public $value = '';
	
	//public $init_value = '';
	public $default = '';
	public $data = false;
	public $parent = false;
	public $childs = false;
	public $rules = false;
	
	public $events = false;
	public $info = false;
	
	public $config = false;
	public $onSave = false;
	
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

class Form extends \Sevian\Element implements \Sevian\JsPanelRequest{


	private $mode = 'new';//'load'
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

    public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			$this->$k = $v;
		}

		
        
        $this->cn = \Sevian\Connection::get();
	}

    public function evalMethod($method = false): bool{
		

		
		//print_r($f->data);
        if($method === false){
            $method = $this->method;
        }


        
        switch($method){
			case 'create':
			case 'load':

				//print_r($this->eparams);

			case 'list':
				$this->createGrid();
				break;
			case 'list_set':
			case 'save':

				/*$f = loadJson("save_form.json");
				$save = 'Sevian\Sigefor\FormSave';
				$save::send($f, $f->data, $f->masterData);
				*/
			case 'get_record':

                
                
			case 'request':
			
				$this->_config();
				$this->panel = $this->createForm();//$this->html;
				
                break;
            case 'delete':
                break;
            case 'get_field_data':
                break;
                
                
                
        }
        return true;	
    }
	public function getMain(){
		return true;
	}

	private function loadConfig(){
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tForms 
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
			SELECT * 
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
					$data = array_merge($data, $_data);
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

	private function getDataGrid(){

		$cn = $this->cn;

		$cn->query = $this->query;
		$cn->pagination = true;
		$cn->pageLimit = 20;

		$result = $cn->execute();
		$data = $cn->getDataAll($result);

		$keys = $this->infoQuery->keys;
		
		foreach($data as $k => $record){
			
			foreach($keys as $key){

				$data[$k]['__record_']=[
					$key=>$record[$key]
				];
				$data[$k]['__mode_'] = 2;
				$data[$k]['__id_'] = $k + 1;
				$this->gridKey[$k+1] = [
					$key=>$record[$key]
				];
			}


		}
		
		return $data;

		



	}

	private function createField($info){
	}

	private function createForm(){
		
		//$opt = $this->_form;

		$opt =$this->_menu;

		//print_r($this->_menu);
		$opt["id"] = "sg_form_".$this->id;
		$form = new \Sevian\HTML("div");

		$form->id = "sg_form_".$this->id;
		$this->typeElement = "Form";
		$this->info = $opt;//$form->getInfo();

		//print_r($this->fields);
		//$menu->class = "uva";
		//print_r($opt);
		$this->panel = $form;

		return $form;


		$f = new \Sevian\Form2();
		if($this->showCaption){
			$f->setCaption($this->title);
		}
		
		
		foreach($this->fields as $k => $field){
			
			$input = new \Sevian\InfoInput([

				'type'=>'text',
				'name'=>$field->name,
				'id'=>$field->name."_p{$this->id}",
				'className'=>$field->class,
				'events'=>$field->events,
				'value'=>'',
				'parent'=>$field->parent,
				'childs'=>$field->childs,
				'data'=>$field->data,
				'masterData'=>$this->masterData ?? [],



			]);
			$field->input = $input;
			$field->caption = $field->title;
			$f->addField($field);
			
		}
		loadJson("json/mod_principal.json");
		$menu = (new ConfigMenu())->getConfig('login');
		//$menu->getConfig('login');
		$div = new \Sevian\HTML('div');
		foreach($menu['items'] as $k => $v){
			$buttom = new \Sevian\HTML('input');
			$buttom->type = 'button';
			$buttom->value = $v['caption'];
			$div->appendChild($buttom);
			
		}
		
		
		$f->addNav($div);
		return $f;
		//return $f->render();
		
	}// end function
	
	
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

			$menu = json_decode($config->config, true);

			
			$menu["caption"] = $this->_config["caption"]?? $config->title;
			$menu["class"] = $this->_config["class"] ?? $config->class;


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
					$action = "Sevian.action.send(".$rs["action"].");";
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


				foreach($rs as $k => $v){
				//	$this->$k = $v;
				}
				
				
				


				$opt[] = [
					"caption" => $rs["title"],
					"index" => $rs["index"],
					"parent" => $rs["parent"],
					"action" => $action,

				];
				
				



				
			
			}



			$menu["items"] = $json;



			//print_r($menu);
			return $menu;
		}
		return false;
	}

	private function createGrid(){
		
		$this->loadConfig();
		$data = $this->getDataGrid();

		$grid = new \Sevian\HTML("div");
		$grid->id = "sg_form_".$this->id;
		$this->panel = $grid;

		
		$opt = [
			 'id' => $grid->id,
			 'data'=>$data,
			 'caption'=>$this->caption,
			 'fields'=>$this->fields,

		];

		$this->typeElement = "Grid";
		$this->info = $opt;//$form->getInfo();

		//print_r($this->fields);

	}
	public function getRecord($info, $eparams){

		$eparams = json_decode($eparams);
		$cn = $this->cn;
		//print_r($eparams);
		$record = $eparams->record;
		
		$filter = '';
		foreach($info->keys as $k => $v){
			if(isset($record->$k)){
				
				if(isset($info->fields[$k])){
					$table = $info->fields[$k]->orgtable;
					
					$filter = $table.".".$cn->addQuotes($k)."=".$cn->addSlashes($record->$k);
				}


			}
			
		}


		$cn->query = $this->query." WHERE $filter;";
        
          
       

		$result = $cn->execute();
		$data = [];
		$i = 0;
		if($rs = $cn->getDataRow($result)){
			foreach($info->fields as $k => $v){
				$data[$k] = $rs[$i++];
			}
			
		}

		return $data;
	}
	
	public function getJsConfigPanel():\Sevian\jsConfigPanel{
        return new \Sevian\jsConfigPanel([
            "panel"   => $this->id,
            "type"    => "sgForm",
            "options" => []
            
        ]);
    }
    public function getJsType(){
        
    }
	
}// end class
function loadJson($path){
	return json_decode(file_get_contents($path, true));
		
		//$a= file_get_contents("json/mod_principal.json", true);
		//$_forms = json_decode(file_get_contents("json/mod_principal.json", true), true);
		
		
		
	}


?>