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
    
    protected $_jsElement = [];
	
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
    
    public function _getJsConfigPanel():jsConfigPanel{
        
        return new jsConfigPanel([
            "panel"   => $this->id,
            "type"    => "sgPanel",
            "options" => []
            
        ]);
        
    }
    
    public function _addJsElement($opt){
		
		$this->_jsElement[] = $opt;
	
	}
	public function _getJsElement(){

		return $this->_jsElement;

	}
}

class EmptyElement extends Element{
	public function __construct(){
		$this->main =  \Sevian\HTML('');
	}
	
} 


?>