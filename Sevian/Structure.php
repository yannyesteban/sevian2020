<?php

namespace Sevian;
	
	
class Structure extends HTML{
	public $template = '';
	

	public $sw = '';
	public $ins = '';

	private $_ele = array();
	private $_panels = array();
	public function setTemplate($template){
		$this->template = $template;
	}
	
	public function addPanel($id, $e){

		$form = new HTML([
			'tagName'		=> 'form',
			'action'		=> '',
			'name'			=> "form_p{$id}",
			'id'			=> "form_p{$id}",
			'method'		=> 'GET',
			'data-sg-panel'	=> $id,
			'data-sg-type'	=> 'panel',
			'enctype'		=> 'multipart/form-data'
			]);
			
		$form->add($e);

		$form->add($this->configInputs([
				'__sg_panel'	=> $id,
				'__sg_sw'		=> $this->sw,
				'__sg_sw2'		=> $this->sw,
				'__sg_ins'		=> $this->ins,
				'__sg_params'	=> '',
				'__sg_async'	=> '',
				'__sg_action'	=> '',
				'__sg_thread'	=> '']
		));
		
		$this->_ele[$id] = $form;
		$this->add($form);

	} 

	public function getElement($panel){
		return $this->_ele[$panel];
		
	} 
	public function getStrPanels($template = ''){
		
		if($template == ''){
			$template = $this->template;
		}
		
		$exp = '|--([0-9]+)--|';
		$this->_panels = [];
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


	private function configInputs($config){
		$div = new HTML('');
		
		foreach($config as $k => $v){
			$input = $div->add(array(
				'tagName'	=>	'input',
				'type'		=>	'hidden',
				'name'		=>	$k,
				'value'		=>	$v
			));
		}
	
		return $div;
		
	}
}

class JsonStructure{
	public $template = '';
	public $sw = '';
	public $ins = '';
	private $_ele = array();
	private $_panels = array();
	public function setTemplate($template){
		
		//$this->template = $template;
	}
	
	public function addPanel($panel, $e){
		
		$this->_ele[$panel] = $e;
		//$this->add($e);
	} 
	public function getElement($panel){
		return $this->_ele[$panel];
		
	} 
	public function getStrPanels($template = ''){
		
		if($template == ''){
			$template = $this->template;
		}
		
		$exp = '|--([0-9]+)--|';
		$this->_panels = array();

		return $this->_panels;

	}
	
	public function render(){
		$j = [];
		foreach($this->_ele as $id => $e){
			
			$form = new \Sevian\HTML('');
			$form->add($e);
			$form->add($this->configInputs([
				'__sg_panel'	=> $id,
				'__sg_sw'		=> $this->sw,
				'__sg_sw2'		=> $this->sw,
				'__sg_ins'		=> $this->ins,
				'__sg_params'	=> '',
				'__sg_async'	=> '',
				'__sg_action'	=> '',
				'__sg_thread'	=> '']
			));

			
			$html = $form->render();
			$script = $form->getScript();
			$css = $form->getCss();
			$j[] = [
				'id'=> $id,
				'title'=> $e->title ?? '',
				'html'=> $html,
				'script'=> $script,
				'css'=> $css,
				'class'=> 'xyz',
			];
		}
		return $j;
	}

	public function getElements(){
		return $this->_ele;
	}

	private function configInputs($config){
		$div = new HTML('');
		
		foreach($config as $k => $v){
			$input = $div->add(array(
				'tagName'	=>	'input',
				'type'		=>	'hidden',
				'name'		=>	$k,
				'value'		=>	$v
			));
		}
	
		return $div;
		
	}
}
?>