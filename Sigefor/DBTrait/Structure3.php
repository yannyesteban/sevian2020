<?php
namespace Sigefor\DBTrait;
require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';
require_once 'Template3.php';

trait Structure3 {
	
	use template3;
	use JasonFileInfo;

	private $cn = null;
	private $infoItems = null;
	
	private $structure = '';
	private $methods = null;
	private $template = '';
	private $templateName = '';
	private $tStructures = "_sg_structures";
    private $tStrEle = "_sg_str_ele";
    private $tTemplates = "_sg_templates";
	private $cssDocuments = [];
	private $jsDocuments = [];
	private $userData = [];

	private $infoElements = [];

	private $_wins = null;

	public function loadStructure($name, $pattern = null){
		
		if($info = $this->loadJsonInfo($name, $pattern)){
		
			$this->setInfoStructure($info);
			
			$this->infoElements = $info->elements;
		}else{
		
			$info = $this->loadDBStructure($name);
			$this->setInfoStructure($info);
			$this->infoElements = $this->loadElements($this->name);
			
		}
		
	}

	public function setInfoStructure($info){
		
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

		if($this->wins){
			if(is_string($this->wins)){
				$this->_wins = json_decode(\Sevian\S::vars($this->wins));
			}else{
				$this->_wins = $this->wins;
			}
		}
	}
	
	public function loadJsonStructure($file){hr($file);
		return json_decode(file_get_contents($file, true));
	}

	public function loadDBStructure($name){
		
		$cn = $this->cn;

		$name = $cn->addSlashes($name);
		$cn->query = "
			SELECT structure, title, template as templateName, theme_template as themeTemplate, 
			class, main_panel as mainPanel, params, wins 
			FROM $this->tStructures 
			WHERE structure = '$name'
		";

		$this->cn->execute();
		return $this->cn->getDataAssoc();
	}

	public function loadElements($structure){
		
		$structure = $this->cn->addSlashes($structure);
		$this->cn->query = "
			SELECT 
				id, element, name, method,
				eparams, type, class, debug, design
				
			FROM $this->tStrEle as s
			WHERE structure = '$structure'
		";
                
        $this->cn->execute();
		return $this->cn->getDataAll();

	}

}