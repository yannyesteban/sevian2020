<?php
namespace sigefor;

require_once 'DBTrait/Catalogue.php';


class Catalogue
    extends \Sevian\Element
	implements 
		\sevian\JasonComponent,
		\sevian\JsonRequest
	
{

    use	DBTrait\Catalogue;
    

    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;
	
	private $_jsonRequest = null;
	private $html = '';
	private $caption = '';
	private $class = '';

    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}
		
        $this->cn = \Sevian\Connection::get();
	}
	public function config(){
		
	}

	public function evalMethod($method = false): bool{
		
		if($method === false){
            $method = $this->method;
		}
		//hr(\Sevian\S::getVReq());exit;
		$this->load();
		
		
		return true;
	}
	
	private function load(){
		$this->loadCatalogue($this->name);

		$this->html = $this->evalTemplate($this->htmlTemplate, 'master');
		/*

		
		//$this->typeElement = 'GTUnit';
		*/
		$this->info = [
			'id'=>'gt-catalogue-'.$this->id,
			'panel'=>$this->id,
			'tapName'=>'yanny'
		];

    }
    
    public function jsonSerialize() {  
        return [
			'name'	=> $this->_name,
			'type'	=> $this->_type,
			'mode'	=> $this->_mode,
			'info'	=> $this->_info
		];  
	}

	public function getComponent(){
		return [
			'id'		=> 'gt-catalogue-'.$this->id,
			'caption'	=> $this->caption,
			'className'	=> $this->class,
			'html'		=> $this->getHTML(),
		];
	}
	public function setRequest($data){
		$this->_jsonRequest = $data;
	}
	
	public function getRequest(){
		return $this->_jsonRequest;
	}

	public function getHTML(){
		return ($this->html)? $this->html: $this->msgError->any??'error';
		
	}

	public function getPanel(){
		
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-catalogue-'.$this->id;
		
		$this->panel->innerHTML = $this->getHTML();

		return $this->panel;	
	}
	

}