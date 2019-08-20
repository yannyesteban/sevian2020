<?php
namespace Sevian;

class Element{
	
	static $_element = false;
	
	public $id = false;

	public $element = "default";
	
	public $name = "";
	public $method = "";
	public $eparams = [];

	

	public $async = false;
	public $updated = false;
	public $title = "";

	public $panel = false;

	protected $onDesing = true;
	protected $onDebug = true;

	protected $_signs = false;
	protected $_listen = false;

	protected $_secBefore = false;
	protected $_secAfter = false;
	protected $_config = [];
	protected $_response = [];
	public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			$this->$k = $v;
		}
		
	}

	public function config(){

	}
	public function evalMethod(){
		
	}

	public function addFragment($frag){
		$this->_response[]=$frag;
	}
	public function getResponse(){


		return $this->_response;
	}
	public function getSequenceBefore(){
		return $this->_secBefore;
		
	}

	public function getSequenceAfter(){
		return $this->_secAfter;
	}

	public function addConfig($config){
		$this->_config = array_merge($this->_config, $config);
	}

	public function getPanel(){
		return $this->panel ;
	}



	private function getInfoRequest(){
		
		$info = new iPanel([
			'panel'=> $this->panel,
			'title'=> $this->title,
			'html'=> $this->html,
			'script'=> $this->script,
			'css'=> $this->css,
			'class'=> $this->class,
		]);
		
		return $info;
		
	}
	
	public function request($method=false){
		

		return new iPanel([
			'panel'=> $this->id,
			'title'=> $this->title,
			'html'=> $this->panel->html,
			'script'=> $this->panel->script,
			'css'=> $this->panel->css,
			'class'=> 'xxx',
		]);
		
	}
}

class ElementPanel extends HTML{
	public $main = false;

	public function render(){
		if($this->dinamic){
			$form = new HTML([
				'tagName'=>'form',
				'action'=>'',
				'name'=>'form_p{$this->id}',
				'id'=>'form_p{$this->id}',
				'method'=> 'GET',
				'enctype'=>'multipart/form-data'
				]);

			if(!$this->main instanceof  HTML){
				$this->main = new HTML('');
			}	
			$form->add($this->main);
			$form->add($this->configInputs());
			$this->html = $form->render();
			$this->script = $this->main->getScript();
			//$this->_main = $this->form;
		}else{
			$this->html = $this->main->render();
		}
		
		return $this->html;
	}

	public function addConfig($config){

		$this->_config = array_merge($this->_config, $config);
	}
	private function configInputs($config){
		$div = new HTML('');
		
		foreach($config as $k => $v){
			$input = $div->add(array(
				'tagName'	=>	'input',
				'type'		=>	'hidden',
				'name'		=>	$k,
				'value'		=>	$v
			));
		}
	
		return $div;
		
	}


}




class Element1{

    static $_element = false;
	
	public $panel = false;
	public $element = "default";
	public $name = "";
	public $method = "";
	public $eparams = array();

	public $typePanel = "normal";
	public $async = false;
	public $updated = false;
	public $title = "";
	

	public $html = "";
	public $script = "";
	public $css = "";
	
	private $onDesing = true;
	private $onDebug = true;
	
	private $winParams = false;
	
	private $_signs = false;
	private $_infoRequest = false;

    public function evalMethod($method = ""){

    }

}

?>