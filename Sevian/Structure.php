<?php

namespace Sevian;
	
	
class Structure extends HTML{
	public $template = "";
	
	private $_ele = array();
	private $_panels = array();
	public function setTemplate($template){
		$this->template = $template;
	}
	
	public function addPanel($panel, $e){
		$this->_ele[$panel] = $e;
		$this->add($e);
	} 
	public function getElement($panel){
		return $this->_ele[$panel];
		
	} 
	public function getStrPanels($template = ""){
		
		if($template == ""){
			$template = $this->template;
		}
		
		$exp = "|--([0-9]+)--|";
		$this->_panels = array();
		if(preg_match_all($exp, $template, $c)){
			foreach($c[1] as $a => $b){
				$this->_panels[trim($b)] = trim($b);
			}// next
		}// next
		return $this->_panels;

	}
	
	public function render(){
		$template = $this->template;
		foreach($this->_ele as $panel => $e){
			$template = str_replace("--$panel--", $e->render(), $template);
		}
		return $this->html = $template;
	}
}


?>