<?php
namespace Sigefor\DBTrait;

trait Template{
	
	private $cn = null;
	private $tTemplates = '_sg_templates';
	
	private $htmlTemplate = '';
	
	static public $patternTemplateFile = '';

	public function loadTemplate($name){
		
		if($name){
			if(substr($name, 0, 1) == '#'){
				$name = substr($name, 1);

		
				$path = str_replace('{name}', $name, self::$patternTemplateFile);
				
				$this->htmlTemplate = $this->loadFileTemplate($path);
				
				

			}else{
				$this->htmlTemplate = $this->loadDBTemplate($name);
			}
			
			//$this->htmlTemplate = $info['htmlTemplate'] ?? '';
		}
	}

	public function setConfigStructure($info){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}

		$params = \Sevian\S::vars($this->params);
		$params = json_decode($params);
		
		if($params){
			foreach($params as $k => $v){
				$this->$k = $v;
			}
		}

		return $info;
	}

	public function loadFileTemplate($file){
		return @file_get_contents($file, true);
	}

	public function loadDBTemplate($name){
		
		$name = $this->cn->addSlashes($name);
		
		$this->cn->query = "
			SELECT html as htmlTemplate 
			FROM $this->tTemplates 
			WHERE template = '$name'";

		$result = $this->cn->execute();

		if($rs = $this->cn->getDataAssoc($result)){
			return $rs['htmlTemplate'];
		}
		return '';
	}
	
}