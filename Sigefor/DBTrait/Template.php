<?php
namespace Sigefor\DBTrait;

trait Template{
	
	private $cn = null;
	private $tTemplates = '_sg_templates';
	
	private $htmlTemplate = '';
	
	public function loadTemplate($name){
		
		if($name){
			if(substr($name, 0, 1) == '#'){

			}else{
				$info = $this->loadDBTemplate($name);
			}
			
			$this->htmlTemplate = $info['htmlTemplate'] ?? '';
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

	public function loadJsonStructure($file){
		
		$info = json_decode(file_get_contents($file, true));
		return $this->jsonConfig($info);
	}

	public function loadDBTemplate($name){
		
		$name = $this->cn->addSlashes($name);
		
		$this->cn->query = "
			SELECT html as htmlTemplate, params 
			FROM $this->tTemplates 
			WHERE template = '$name'";

		$result = $this->cn->execute();
		return $this->cn->getDataAssoc($result);
	}
	
}