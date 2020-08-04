<?php
namespace Sigefor\DBTrait;

require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';

trait Module3 {
    use JasonFileInfo;

	private $cn = null;
	private $methods = null;
    private $tModules = "_sg_modules";
	//private $template = '';
	//private $templateName = '';
	//private $tStructures = "_sg_structures";
    //private $tStrEle = "_sg_str_ele";
	//private $cssDocuments = [];
	//private $jsDocuments = [];
    
    public function init($name, $pattern = null){
		
		if(!($info = $this->loadJsonInfo($name, $pattern))){
			$info = $this->loadDBModule($name);
		}

		$this->setInfoModule($info);

	}

	public function setInfoModule($info){
		
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

	public function loadDBModule($name){
		
		$cn = $this->cn;

		$name = $cn->addSlashes($name);
		$cn->query = "
			SELECT module, title, structure, params, methods, theme, debug, design
			
			FROM $this->tModules 
			WHERE module = '$name'
		";

		$this->cn->execute();
		return $this->cn->getDataAssoc();
    }
    
}