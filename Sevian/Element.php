<?php
namespace Sevian;

class Element{
	public $id = null;
	public $name = '';
	public $method = '';
	public $eparams = [];

	public $async = false;
	protected $onDesing = true;
	protected $onDebug = true;

	static private $_elementName = [];
	
	
	public $element = "default";
	public $updated = false;
	public $title = '';
	public $panel = null;
	public $containerId = null;

	public $_data_user = [];

	protected $_signs = null;
	protected $_listen = null;
	protected $_secBefore = null;
	protected $_secAfter = null;
	protected $_config = [];
	protected $_response = [];
	protected $_jsElement = [];
	protected $_components = null;
	protected $typeElement = "panel";
	protected $info = null;
	protected $panelActions = null;
	protected $_configInput = null;
	
	protected $_vPanel = [];
	
	public function __construct($opt = []){

		foreach($opt as $k => $v){
			$this->$k = $v;
		}

	}
	
	public function config(){
	
	}
	
	public function evalMethod(){
		
	}

	public function configPanel(){
		return new jsConfigPanel([
			"panel" => $this->id,
			"type"	=> $this->typeElement,
			"option"=> $this->info,
			"debug" => "hola",
			
		]);
	}

	public function updatePanel(){
		return new jsUpdatePanel([
			"panel" => $this->id,
			"actions"=> $this->panelActions??$this->info,
			"debug" => "hola",
			
		]);	
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

	static public function setElementName($name){
		self::$_elementName[get_called_class()] = $name;
	}
	static public function getElementName(){
		return self::$_elementName[get_called_class()];
	}
	public function getPanelId(){
		return self::$_elementName[get_called_class()].'_'.$this->id;
		//return get_called_class().'_'.$this->id;
		//return static::$_element'_'.$this->id;
	}

	public function getConfigPanel(){
		return $this->_configPanel;
	}
	
	public function request($method=false){
		

		return new iPanel([
			'panel'	=> $this->id,
			'title'	=> $this->title,
			'html'	=> $this->panel->html,
			'script'=> $this->panel->script,
			'css'	=> $this->panel->css,
			'class'	=> 'yyy',
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

	public function configInput(){
		return $this->_configInput;
	}
	public function addJasonComponent($component){
		$this->_components[] = $component;
		return;

		//try{
			if($component instanceof \Sevian\JasonComponent){
				$this->_components[] = $component->jasonRender();
			}else{
				throw new \Exception('Object is Not implemented \sevian\JsComponent interfaces');
			}
		//}catch(\Exception $e) {
		//	hr($e->getMessage());

		//}
		


		
	}
	public function getJsonComponents(){
		return $this->_components?? [];
	}
	public function setVPanel(&$var){
		$this->_vPanel = &$var;
	}
	public function &getVPanel(){
		return $this->_vPanel;
	}
	public function setSes($key, $value){
		$this->_vPanel[$key] = $value;
	}
	public function &getSes($key){
		return $this->_vPanel[$key];
	}
}

class EmptyElement extends Element{
	public function __construct(){
		$this->main =  \Sevian\HTML('');
	}
	
} 


abstract class JsComponent  implements \Sevian\JasonComponent{
	
	static $_element = false;
	protected $type = '';

	public $async = false;
	public $panelId = false;
	public $id = false;
	public $element = "default";
	
	public $name = '';
	public $method = '';
	public $eparams = [];

	
	
	public $caption = '';

	protected $onDesing = true;
	protected $onDebug = true;

	public function __construct($opt = []){

		foreach($opt as $k => $v){
			$this->$k = $v;
		}

	}
	

	public function configPanel(){
		return new jsConfigPanel([
			"panel" => $this->id,
			"type"	=> $this->typeElement,
			"option"=> $this->info,
			"debug" => "hola",
			
		]);
	}

	public function updatePanel(){
		return new jsUpdatePanel([
			"panel" => $this->id,
			"actions"=> $this->info,
			"debug" => "hola",
			
		]);	
	}


	public function evalMethod(){
		
	}
	public function createID($name){
		return $name."".$this->id;
	}
	public function addFragment($frag){
		
		$this->_response[]=$frag;
	
	}
	public function getResponse(){

		return $this->_response;

	}

	



	
	
	public function request($method=false){
		

		return new iPanel([
			'panel'	=> $this->id,
			'title'	=> $this->title,
			'html'	=> $this->panel->html,
			'script'=> $this->panel->script,
			'css'	=> $this->panel->css,
			'class'	=> 'yyy',
		]);
		
	}
    
    public function _getJsConfigPanel():jsConfigPanel{
        
        return new jsConfigPanel([
            "panel"   => $this->id,
            "type"    => "sgPanel",
            "options" => []
            
        ]);
        
    }
    
    

	public function setVPanel(&$var){
		$this->_vPanel = &$var;
	}
	public function &getVPanel(){
		return $this->_vPanel;
	}
	public function setSes($key, $value){
		$this->_vPanel[$key] = $value;
	}
	public function &getSes($key){
		return $this->_vPanel[$key];
	}
}

?>