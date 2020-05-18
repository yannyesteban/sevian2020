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
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-catalogue-'.$this->id;

		$html = $this->evalTemplate($this->htmlTemplate, 'master');

		if(!$html){
			$html = 'Error';
		}
		//hr($html);

		//exit;
		$this->panel->innerHTML = $html;
		
		//$this->typeElement = 'GTUnit';

		$this->info = [
			'id'=>$this->panel->id,
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

	public function setRequest($data){
		$this->_jsonRequest = $data;
	}
	
	public function getRequest(){
		return $this->_jsonRequest;
	}

	

}