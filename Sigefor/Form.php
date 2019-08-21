<?php
namespace Sevian\Sigefor;
include 'ConfigMenu.php';



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

class Form extends \Sevian\Element{

	public $showCaption = true;
	public $menus = [];
    
    protected $tForms = "_sg_forms";
	protected $tFormFields = "_sg_form_fields";
	
	protected $tMenus = "_sg_menus";
    protected $tMenuItems = "_sg_menu_items";

    public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			$this->$k = $v;
		}

		
        
        $this->cn = \Sevian\Connection::get();
	}

    public function evalMethod($method = false): bool{
		

        if($method === false){
            $method = $this->method;
        }


        
        switch($method){
            case 'create':

                
                
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

    private function _config(){

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

			$this->_menu = (array)json_decode($this->params);
			$this->_menu["caption"] = $this->_config["caption"]??$this->title;
			$this->_menu["class"] = $this->_config["class"] ?? $this->class;


		}
		
		
		$info = $this->cn->infoQuery($this->query);
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

	}

	private function createForm(){
		
		$f = new \Sevian\Form();
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
	
	
	private function createMenu($menu){

		
	}
	
	
}// end class
function loadJson($path){
		
		
		//$a= file_get_contents("json/mod_principal.json", true);
		$_forms = json_decode(file_get_contents("json/mod_principal.json", true), true);
		
		
		
	}


?>