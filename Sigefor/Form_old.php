<?php
namespace Sevian\Sigefor;

class InfoField{
	public $form = '';
	public $field = '';
	public $name = '';
	public $method = '';
	public $title = '';
	public $class = '';
	public $params = '';
	public $input = ['input'=>'text'];
	public $config = false;
	public $data = false;
	public $init_value = '';
	public $default = '';

	public $parent = false;
	public $childs = false;
	public $rules = false;
	public $value = '';
	public $events = false;
	public $info = false;
	
	public $mtype = false;
	public $key = false;
	public $serial = false;
	public $length = false;
	public $table = false;


	
	public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;	
			}
		}
	}

	public function update($opt = []){
		self::__construct($opt);
	}

}

class Form extends \Sevian\Panel implements \Sevian\UserAdmin{
	public $form = false;
	public $title = false;
	public $class = false;
	public $query = '';
	public $params = '';
	public $tabs = '';
	public $pages = '';
	public $masterData = [];

	public $jsonFile = 'form.json';
	
	
	public $fields = [];
	
	public $showCaption = true;

	
	private $main = false;
	

	protected $tForms = "_sg_forms";
	protected $tFormFields = "_sg_form_fields";
	protected $_params = false;


	public function login(){
		echo 4;
	}

	public function __construct($opt = array()){
		
		foreach($opt as $k => $v){
			$this->$k = $v;
		}
		
		$this->main = new \Sevian\HTML('div');
		
		$this->cn = \Sevian\Connection::get();
	}
	
	public function getMain(){
		return $this->main;
	}
	public function evalMethod($method = ''){
		
		
		//$this->loadForm();
		$this->load();
		
		switch($method){
				
				
			case 'request':
				$this->main = $this->form();
				break;
			case 'load':
				break;
			case 'list':
				break;
			case 'save':
				break;
			case 'delete':
				break;
			case 'get_field_data':
				break;
				
				
				
		}
		
	}
	
	private function getInfoFields($query){

		return $this->cn->infoQuery($query);
		
	}
	
	private function load(){
		
		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tForms 
			WHERE form = '$this->name'";
		
		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}
			
		}
		\Sevian\S::setSes("f", 'USA');
		/* leemos el campo params y remplaamos la informacion del objeto */
		$this->_params = \Sevian\S::params($this->params);
		
		if($this->_params){
			
			foreach($this->_params as $k => $v){
				$this->$k = $v;
			}
		}


		$info = $this->getInfoFields($this->query);
		$fields = $info->fields;

		foreach($fields as $k => $v){
			
			$this->fields[$k] = new \Sevian\Sigefor\InfoField($v);
		}

		$q = "
			SELECT * 
			FROM $this->tFormFields 
			WHERE form = '$this->name'";

		$result = $cn->execute($q);

		while($rs = $cn->getDataAssoc($result)){
			if(isset($this->fields[$rs['field']])){
				$this->fields[$rs['field']]->update($rs);
			}
			
		
		}

		//print_r($this->fields);
		
	}
	
	private function loadForm(){
		
		
		
		$_forms = json_decode(file_get_contents($this->jsonFile, true), true);
		
		$opt = $_forms[$this->name];
		
		foreach($opt as $k => $v){
			$this->$k = $v;
		}
		//echo $this->query;
		
		$this->infoFields = $this->getInfoFields($this->query);
		
		
		
		
	}
	
	public function render(){
		
		
		
		
		
		$this->evalMethod($this->method);
		
		
		return $this->main->render();
		
		
		
		
		
		
	}
	
	
	
	public function form(){
		
		$f = new \Sevian\Form();
		if($this->showCaption){
			$f->setCaption($this->title);
		}
		
		
		foreach($this->fields as $k => $field){
			
			$input = new \Sevian\InfoInput([

				'type'=>'text',
				'name'=>$field->name,
				'id'=>$field->name."_p{$this->panel}",
				'className'=>$field->class,
				'events'=>$field->events,
				'value'=>123,
				'parent'=>$field->parent,
				'childs'=>$field->childs,
				'data'=>$field->data,
				'masterData'=>$this->masterData,



			]);
			$field->input = $input;
			$field->caption = $field->name;
			$f->addField($field);
			
		}
		
		
		return $f;
	}
	
	
}




?>