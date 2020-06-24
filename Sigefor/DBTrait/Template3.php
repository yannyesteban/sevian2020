<?php
namespace Sigefor\DBTrait;
require_once 'HTMLFileInfo.php';

trait Template3{
	use HTMLFileInfo;
	private $cn = null;
	private $tTemplates = '_sg_templates';
	
	private $htmlTemplate = '';
	
	static public $patternTemplateFile = '';
	public function loadTemplate($name, $pattern = null){
		/*
		if($html = $this->loadHTMLInfo($name, $pattern)){
		

		}else{
		
			$html = $this->loadDBTemplate($name);
		}*/
		
		$this->htmlTemplate = $this->loadHTMLInfo($name, $pattern) ?: $this->loadDBTemplate($name);
		
	}

	public function loadDBTemplate($name){
		
		$name = $this->cn->addSlashes($name);
		
		$this->cn->query = "
			SELECT html as htmlTemplate 
			FROM $this->tTemplates 
			WHERE template = '$name'";

		$result = $this->cn->execute();

		if($rs = $this->cn->getDataAssoc($result)){
			$rs['htmlTemplate'] = \Sevian\S::varCustom($rs['htmlTemplate'], $this->userData, '&P_');
			return $rs['htmlTemplate'];
		}
		return '';
	}
	
}