<?php
namespace Sigefor;


class FCatalogue
    extends \Sevian\Element
	implements 
		\sevian\JasonComponent,
		\sevian\JsonRequest
	
{

    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;
	
	private $_jsonRequest = null;
	private $tFCatalogues = '_sg_f_catalogues';
	private $form = '';
	private $catalogue = '';

	private $getVForm = null;
	private $getEparam = null;


	public $jsClassName = 'SGFCatalogue';

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

		$this->userData = [
			'panelId'=>$this->id,
			'element'=>$this->element,
			'elementName'=>$this->name,
			'elementMethod'=>$this->method
			
		];


		$this->loadInfoInfo($this->name);
		switch($method){
			case 'load':
				$this->load();
				//$this->loadCatalogue('');
				break;
			case 'load_info':

				$this->info[] = [
					'method'  => 'loadCatalogue',
					'value'=>$this->loadCatalogue(''),
					'_args' => [1,1,1]
				];

				//$this->loadCatalogue('');
				break;

			default:
				break;

		}
		
		return true;
	}
	
	public function loadDBInfo($name){
		
		$cn = $this->cn;

		$name = $cn->addSlashes($name);
		$cn->query = "
			SELECT name, caption, form, catalogue, params, class, methods
			FROM $this->tFCatalogues 
			WHERE name = '$name'
		";

		$this->cn->execute();
		return $this->cn->getDataAssoc();
	}
	
	public function loadInfoInfo($name){
		if($this->getJsonFileName($name)){
			//$info = $this->loadJsonCatalogue($name);
		}else{
			$info = $this->loadDBInfo($name);
		}
		
		$this->setInfoInfo($info);
		
	}

	public function setInfoInfo($info){
		if(!$info){
			return ;
		}
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
		if(is_string($this->params)){
			$params = \Sevian\S::vars($this->params);
			$config = json_decode($params);
		}else{
			$config = $this->params;
		}
		
		if($config){
			foreach($config as $k => $v){
				$this->$k = $v;
			}
		}

		/*
		if($this->getVForm){
			foreach($this->getVForm as $k => $v){
				\Sevian\S::setSes($v, \Sevian\S::getReq($k));
			}
		}
		if($this->getEparam){
			foreach($this->getEparam as $k => $v){
				\Sevian\S::setSes($v, \Sevian\S::getReq($k));
			}
		}
		*/

		
		if($this->methods){
			if(is_string($this->methods)){
				$config = \Sevian\S::vars($this->methods);
				$config = json_decode($config, true);
			}else{
				$config = $this->methods;
			}
			
			if($config and $config[$this->method]?? false){
				foreach($config[$this->method] as $k => $v){
					$this->$k = $v;
				}
			}
		}

		
	}
	

	
	private function load(){

		
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = $this->getPanelId();
		//$this->panel->innerHTML = 'gt-unit-'.$this->id;
		$this->typeElement = 'SGFCatalogue';

		$g =  new \Sigefor\Component\Form2([
			'panelId'=>$this->id,
			//'name'=>$this->name,
			'name'=>$this->form,
			'method'=>'request',
			'mode'=>1,
			'userData'=>$this->userData
			//'record'=>$this->getRecord()
		]);

		$this->info = [
			'id'=>$this->getPanelId(),
			'panel'=>$this->id,
			'tapName'=>'yanny',
			'form'	=> $g,
			'catalogue'=>$this->loadCatalogue('')
		];

		$this->setPanel($this->panel);
		$this->setInit($this->info);

	}
	
	private function loadCatalogue($unit_id){

		
		//$this->loadInfoInfo($this->name);

		

		$cat = new \Sigefor\Catalogue([
			'id'=>$this->id,
			'name'=>$this->catalogue,
			'method'=>'load'
		]);
		$cat->evalMethod();
		return $cat->getComponent();
		$this->info[] = [
			'method'  => 'loadCatalogue',
			'value'=>$cat->getComponent(),
			'_args' => [1,1,1]
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
	private function getJsonFileName($name = ''){
		
		if($name and substr($name, 0, 1) == '#'){
			$name = substr($name, 1);

	
			$path = str_replace('{name}', $name, self::$patternJsonFile);
		}
		
	}


}