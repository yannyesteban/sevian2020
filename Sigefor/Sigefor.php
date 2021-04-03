<?php
namespace Sigefor;

require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';


Trait Sigefor{

    use DBTrait\JasonFileInfo;
    
    private $userData = [];
    private $methods = null;

    public function loadConfigData($name, $pattern = null){
		
		if($info = $this->loadJsonInfo($name, $pattern)){
			//$this->infoFields = $info->infoFields;
			
		}else{
			//$info = $this->loadDBInfo($name);
			//$this->infoFields = $this->loadDBFields($name);
		}

		$this->setConfigData($info);
	}


    public function setConfigData($info){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
		
		$params = \Sevian\S::vars($this->params);
		$config = json_decode($params);

		if($config){
			foreach($config as $k => $v){
				$this->$k = $v;
			}
		}
		
		if($this->methods){
			if(is_string($this->methods)){
				$subConfig = \Sevian\S::vars($this->methods);
				$subConfig = json_decode($subConfig, true);
			}else{
				$subConfig = (array)$this->methods;
			}
			
			if($subConfig and $subConfig[$this->method]?? false){
				foreach($subConfig[$this->method] as $k => $v){
					$this->$k = $v;
				}
			}
		}


	}


}