<?php
namespace Sigefor\DBTrait;

require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';

trait ICatalogue {
	
	use JasonFileInfo;

	private $cn = null;
	
	private $tICatalogue = "_sg_i_catalogue";
	private $userData = [];
	private $msgError = null;
	private $methods = null;

	public function init($name, $pattern = null){
		
		$info = $this->loadJsonInfo($name, $pattern);
		
		if(!$info){
			$info = $this->loadDB($name);
		}

		$this->setInfoInit($info);
	}

	public function setInfoInit($info){
		if(!$info){
			return ;
		}
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}

		if(isset($this->params)){
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

	public function loadDB($name){
		$name = $this->cn->addSlashes($name);
		
		$this->cn->query = "
		SELECT name, caption, form, catalogue, params, class, methods
		FROM $this->tICatalogue 
		WHERE name = '$name'
		";
		$this->cn->execute();
		return $this->cn->getDataAssoc();
	}

} // end trait