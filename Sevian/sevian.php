<?php
namespace Sevian;

include 'info.php';

include 'Tool.php';
include 'Connection.php';
include 'HTML.php';

include 'Menu.php';

include 'Document.php';
include 'Structure.php';
include 'interfaces.php';
include 'Element.php';
include 'Panel.php';

include 'Input.php';
include 'Page.php';
include 'Form.php';

function targetId($nombre=""){
	return "Hooooola: $nombre";
}




class S{
	public static $title = 'SEVIAN 2017.10';
	public static $theme = [];
	public static $templateName = '';
	
	public static $elements = [];
	
	public static $cfg = [];
	
	public static $ses = [];
	public static $req = [];
	public static $exp = [];
	
	private static $ins = false;
	private static $onAjax = false;
	
	public static $_js = [];
	private static $_css = [];
	
	private static $_str = false;
	private static $_templates = false;
	private static $_themes = [];
	private static $_template = false;
	private static $_strPanels = false;
	private static $_templateChanged = false;
	
	private static $_elements = [];
	private static $_inputs = [];
	
	
	private static $_info = [];// se guarda la informacion de cada panel ;
	
	private static $_infoClasses = [];
	private static $_infoInputs = [];
	private static $_pSigns = [];
	private static $_signs = false;
	private static $_commands = false;
	private static $_actions = false;
	private static $_fragments = false;
	private static $script = '';
	
	private static $_clsElement = [];
	private static $_mainPanels = [];
	
	private static $lastAction = false;
	private static $lamda = false;
	public static function setSes($key, $value){
		self::$ses[$key] = $value;
	}
	public static function setReq($key, $value){
		self::$req[$key] = $value;
	}
	public static function setExp($key, $value){
		self::$exp[$key] = $value;
	}
	public static function &getSes($key){
		return self::$ses[$key];
	}
	public static function &getReq($key){
		return self::$req[$key];
	}
	public static function &getExp($key){
		return self::$exp[$key];
	}
	public static function &getVSes(){
		return self::$ses;
	}
	public static function &getVReq(){
		return self::$req;
	}
	public static function &getVExp(){
		return self::$exp;
	}
	public static function jsInit($js = []){
		self::$_js = $js;
	}
	public static function cssInit($css = []){
		self::$_css = $css;
	}
	public static function configInit($opt){
		foreach($opt as $k => $v){
			if(property_exists(__CLASS__, $k)){
				self::$$k = $v;
			}
		}
	}
	public static function sessionInit(){
		self::$lamda = function($nombre){
			static $i=0;
			$i++;
			echo $i;
			return $i;
		};
		
		
		
		if(isset($_REQUEST['__sg_ins'])){
			self::$ins = $_REQUEST['__sg_ins'];
		}else{
			self::$ins = uniqid('p');
		}

		session_name(self::$ins);
		session_start();
		
		self::$cfg = &$_SESSION;
		self::$req = &$_REQUEST;
		


		

		self::$ses = &self::$cfg['VSES'];
		self::$onAjax = self::getReq('__sg_async');
		
		if(!isset(self::$cfg['INIT'])){
			
			self::$cfg['INIT'] = true;
			self::$cfg['SW'] = 1;
			self::$cfg['INFO'] = [];
			self::$cfg['AUTH'] = false;
			
			self::$cfg['VSES'] = [];
			self::$cfg['TEMPLATE'] = &self::$_template;
			self::$cfg['STR_PANELS'] = &self::$_strPanels;
			
			self::$_infoClasses = self::$_elements;
			/*
			if(isset($opt['clsInput'])){
				self::$_infoInputs = $opt['clsInput'];
			}
			if(isset($opt['commands'])){
				self::$_commands = $opt['commands'];
			}
			if(isset($opt['actions'])){
				self::$_actions = $opt['actions'];
			}
			if(isset($opt['commands'])){
				self::$_commands = $opt['commands'];
			}
			if(isset($opt['actions'])){
				self::$_actions = $opt['actions'];
			}
			if(isset($opt['signs'])){
				self::$_signs = $opt['signs'];
			}
			*/
			foreach(self::$elements as $k => $e){
				self::setPanel(new InfoParam($e));
			}

			
			self::$cfg['INFO_CLASSES'] = &self::$_infoClasses;
			self::$cfg['INFO_INPUTS'] = &self::$_infoInputs;
			self::$cfg['LISTEN_PANEL'] = &self::$_pSigns;
			self::$cfg['LISTEN'] = &self::$_signs;
			self::$cfg['COMMANDS'] = &self::$_commands;
			self::$cfg['ACTIONS'] = &self::$_actions;
			self::$cfg['INFO'] = &self::$_info;
		}else{
			
			self::$cfg['INIT'] = false;
			
			self::$cfg['SW'] = (self::$cfg['SW'] == '1')? '0': '1';
			
			self::$_infoClasses = &self::$cfg['INFO_CLASSES'];
			self::$_infoInputs = &self::$cfg['INFO_INPUTS'];
			
			self::$_info = &self::$cfg['INFO'];
			self::$_template = &self::$cfg['TEMPLATE'];
			self::$_strPanels = &self::$cfg['STR_PANELS'];
			
			self::$_signs = &self::$cfg['LISTEN'];
			
			self::$_pSigns = &self::$cfg['LISTEN_PANEL'];
			self::$_commands = &self::$cfg['COMMANDS'];
			self::$_actions = &self::$cfg['ACTIONS'];
		}
		
		foreach(self::$_info as $info){
			$info->update = false;
		}
		
		foreach(self::$_infoClasses as $name => $info){
			self::setClassElement($name, $info);
		}
		
		foreach(self::$_infoInputs as $name => $info){
			self::setClassInput($name, $info);
		}
		/*
		if(self::$cfg['INIT'] and isset($opt['sequenceInit'])){
			self::sequence($opt['sequenceInit']);
		}
		
		if(isset($opt['sequence'])){
			self::sequence($opt['sequence']);
		}
		*/
		
	}
	public static function iMethod($params){

		$info = new InfoParam($params);

		
		if($info->panel != '' and $info->panel != '0' and self::$_info[$info->panel] ?? false){
			
			
			//self::$_info[$info->panel]->method = $info->method;
			
			
			self::$_info[$info->panel]->eparams = array_merge(self::$_info[$info->panel]->eparams, $info->eparams);
			
			$elem = self::getElement(self::$_info[$info->panel]); 
			
			$result = $elem->evalMethod($info->method);
		
			


		}

	}
	public static function evalMethod($params){
		$info = new InfoParam($params);
		if($info->panel != '' and $info->panel != '0'){
			if($info->element == ''){
				$info->element = self::$_info[$info->panel]->element;
			}
			if($info->name == ''){
				$info->name = self::$_info[$info->panel]->name;
			}
			$elem = self::getElement($info); 
			
			self::setPanel($info, true);
			
			$result = $elem->evalMethod($info->method);
			
			self::$_str->addPanel($info->panel, $elem);

			if($elem instanceof \Sevian\Sigefor\Form){
				hr("si","purple");
			}
			if($elem instanceof \Sevian\UserAdmin){
				hr("ADMIN","purple");
			}

			if($elem->getMain()){

			}
		}
	
	}

	public static function _evalMethod($info){
		$elem = self::getElement($info);
		$result = $elem->evalMethod($info->method);
		if($elem instanceof \Sevian\Sigefor\Form){
			hr("si","purple");
		}
		if($elem instanceof \Sevian\UserAdmin){
			hr("ADMIN","purple");
		}
		if($result){
			self::setPanel($info, true);
			if(!self::$onAjax){
				self::$_str->addPanel($info->panel, $elem);

				return $elem;
			}
		}
		return false;

	}

	public static function init($opt = []){

		self::$onAjax = self::getReq('__sg_async');

		if(!self::$onAjax){
			self::$_str = new Structure();
		}

	

		
		
	}

	public static function addClassInput($name, $info){

		if(isset($info["file"]) and $info["file"] != ""){
			require_once($info["file"]);
		}

		self::$_inputs[$name] = $info;


	}
	public static function inputsLoad($inputs){

		foreach($inputs as $k => $v){

			self::addClassInput($k, $v);
		}


		
	}
	public static function elementsLoad($elements){
		self::$_elements = $elements;
	}
	public static function themesLoad($themes){
		self::$_themes = $themes;
	}
	public static function commandsLoad($inputs){
		
	}
	public static function vars($q){
		return Tool::vars($q, [
			[
				'token' 	=> '@',
				'data' 		=> self::$ses,
				'default' 	=> false
			],
			[
				'token'		=> '\#',
				'data' 		=> self::$req,
				'default' 	=> false
			],
			[
				'token' 	=> '&EX_',
				'data' 		=> self::$exp,
				'default' 	=> false
			],
		]);
	}

	public static function params($q){
		$params = false;
		$q = self::vars($q);
		\Sevian\Tool::param($q, $params);
		return $params;
	}
	public static function sequence($seq){

//		foreach($seq as $cmd => $params){

		foreach($seq as $line){

			
			self::command(key($line), current(($line)));
			//self::command($cmd, $params);

		
		}
		
	}
	public static function command($cmd, $params){
		
		
		
		switch($cmd){
			case "vses":
			
				self::setSes(key($params), current($params));
				
				break;			
			case "vexp":
				$this->_setVars($this->exp, $params);
				break;	
			case "vreq":
				$this->_setVars($this->req, $params);
				break;
			case "set_params":
				$this->params = array_merge($this->params, $this->cmd->get_param($value));
				break;
			case "setPanel":
				self::setPanel(new InfoParam($params), true);
				break;
			case "setMethod":
				
				self::evalMethod($params);
				
				break;
			case "iMethod":
				self::iMethod($params);
				break;
			case "signs":
				$this->evalSigns($params);
				break;
			default:
				break;
				if(isset(self::_commands[$cmd])){
					self::evalAction($cmd, $params);
				}else if(is_string($params) and isset(self::_actions[$cmd][$params])){
					self::sequence(self::_actions[$cmd][$params]);
				}
				break;
		}
		
	}
	public static function evalParams(){
	

		$aux = '[
			{"setMethodx":{
				"panel":9,
				"element":"sgForm",
				"name":"login",
				"method":"request"

			}},
			{"iMethod":{"panel":8, "method":"test","eparams":{"h":8}}},
			{"vses":{"xc":"Prueba 1"}}

		]';
		//self::$req["__sg_params"] = $aux;
		

		if(isset(self::$req["__sg_params"]) and self::$req["__sg_params"] != ""){

			self::sequence(json_decode(self::$req["__sg_params"], true));
			
		}
	}
	public static function setTemplate($template = ''){
		self::$_template = $template;
		self::$_templateChanged = true;
	}
	public static function getTemplate(){
		return self::$_template;
	}
	public static function evalTemplate(){

		return;

		/*$div = new HTML('div');
		$div->text = self::getTemplate();
		return $div;
		*/
		
		$request = false;
		
		$str = self::$_str;//new Structure();
		
		$str->setTemplate(self::vars(self::getTemplate()));
		
		if(self::$_templateChanged){
			self::$_strPanels = $str->getStrPanels();
			foreach(self::$_strPanels as $panel){
				if(!isset(self::$_info[$panel])){
					self::setPanel(new InfoParam(['panel' => $panel]));
				}
			}
		}
		foreach(self::$_info as $panel => $e){
			self::resetPanelSigns($panel);
			$elem = self::getElement($e); 
			$elem->addConfig([
				'__sg_panel'	=>$panel,
				'__sg_sw'		=>self::$cfg['SW'],
				'__sg_sw2'		=>self::$cfg['SW'],
				'__sg_ins'		=>self::$ins,
				'__sg_params'	=>'',
				'__sg_async'	=>'',
				'__sg_action'	=>self::$lastAction,
				'__sg_thread'	=>'']);

			$elem->evalMethod();
			$str->addPanel($panel, $elem);


		}


		return $str;
		foreach(self::$_info as $panel => $e){
			
			self::resetPanelSigns($panel);
			if($e->update){
				hr($panel);
				$elem = $str->getElement($panel);
			}else{
				$elem = self::getElement($e); 
			}
			
			
			$aux = self::configInputs([
				'__sg_panel'	=>$panel,
				'__sg_sw'		=>self::$cfg['SW'],
				'__sg_sw2'		=>self::$cfg['SW'],
				'__sg_ins'		=>self::$ins,
				'__sg_params'	=>'',
				'__sg_async'	=>'',
				'__sg_action'	=>self::$lastAction,
				'__sg_thread'	=>''
			
			]);
			
			$form = new HTML(['tagName'=>'form', 'action'=>'', 'name'=>"form_p$panel", 'id'=>'form_p$panel', 'method'=> 'POST', 'enctype'=>'multipart/form-data']);
			$form->add($elem);
			$form->add($aux);
			
			//self::setMainPanel($panel, "ImgDir", $elem->getMain());
			
			if(isset(self::$_strPanels[$panel])){
				$div = new HTML(['tagName'=>'div', 'id'=>"panel_p$panel"]);
				$div->add($form);
				$str->addPanel($panel, $div);
			}else{
				
				$win = new InfoWindow([
					'caption'=>'hola $panel'	
				]);

				$elem->setWinParams($win);

				$request[] = new InfoRequest([
					'panel'		=> $panel,
					'targetId'	=> "panel_p$panel",
					'html'		=> $form->render(),
					'script'	=> $form->getScript(),
					'css'		=> $form->getCss(),
					'typeAppend'=> 1,
					'hidden'	=> false,
					'title'		=> $elem->title,
					'window'	=> $elem->getWinParams(),
				]);
			}
			
		}
		
		$opt = new \stdClass;
		$opt->INS = self::$ins;
		$opt->SW = self::$cfg['SW'];
		$opt->mainPanel = 1;
		
		if($request){
			$opt->request = $request;
		}
		
		$opt->fragments = self::getFragment();
		
		$json = json_encode($opt, JSON_PRETTY_PRINT);
		
		self::$script = "\nsevian.init($json);";
		
		self::$cfg['INFO'] = self::$_info;
		
		return $str;
		
	}
	
	public static function sgInput($info){
		
		if(is_array($info)){
			$info = new InfoInput($info);
		}
		
		if(isset(self::$_inputs[$info->input])){
			$info->type = self::$_inputs[$info->input]["type"];
			$obj = new self::$_inputs[$info->input]["class"]($info);
		}else{
			$obj = new Input($info);
		}

		return $obj;

	}
	
	public static function setMainPanel($panel, $type, $main){
		
		self::$_mainPanels[$panel] = [
			"panel"=>$panel,
			"type"=>$type,
			"opt"=>$main
		] ;
	}
	
	private static function configInputs($_vconfig){
		$div = new HTML('');
		
		foreach($_vconfig as $k => $v){
			$input = $div->add([
				'tagName'	=>	'input',
				'type'		=>	'hidden',
				'name'		=>	$k,
				'value'		=>	$v
			]);
		}
	
		return $div;
		
	}
	public static function getFragment(){
		return self::$_fragments;
		
	}
	
	/*Método para incluir los archivos de las clases que vamos a utilizar*/
	public static function setClassElement($name, $info){
	
		if($info['file'] ?? '' != ''){
			require_once($info['file']);
		}
		self::$_clsElement[$name] = $info['class'];
	}
	public static function sgElement($info){
		
		if(isset($this->_clsElement[$info->element])){
			$obj = new $this->_clsElement[$info->element]($info);
			
		}else{
			$obj = new SgPanel($info);
			
		}
		return $obj;

	}
	public static function getElement($info){
		
		if(isset(self::$_clsElement[$info->element])){
		
			$obj = new self::$_clsElement[$info->element]($info);
			
		}else{
		
			$obj = new Panel2($info);
			
		}
		return $obj;
		//return $this->sgElement($info);
		
	}
	public static function setPanel($info, $update = false){
		
		if($info->panel){
			$info->update = $update;
			self::$_info[$info->panel] = $info; 
		}
		return $info;
		
	}
	public static function getPanel($panel){
		return self::$_info[$info->panel];
	}

	public static function resetPanelSigns($panel){
		
		if(isset(self::$_pSigns[$panel])){
			unset(self::$_pSigns[$panel]);
		}
	}
	public static function htmlDoc(){
		global $sevian;
		
		
		$doc = new Document();
		/*
		$meta1 = new HTML('meta');
		$meta1->{'http-equiv'} = 'Content-Type';
		$meta1->content = 'text/html; charset=utf-8';

		$meta2 = new HTML('meta');
		$meta2->name = 'viewport';
		$meta2->content = 'width=device-width, initial-scale=1';
		
		$doc->addMeta($meta1);
		$doc->addMeta($meta2);
		*/

		$doc->setTitle(self::$title);
		
		foreach(self::$_css as $v){
			$doc->appendCssSheet($v);
		}
		foreach(self::$_js as $k=> $v){
			$doc->appendScriptDoc($v['file'], $v['begin']);
		}

		$templates = [];
		
		if(isset(self::$_themes[self::$theme])){
			$theme = new InfoThemes(self::$_themes[self::$theme]);
			foreach($theme->css as $css){
				$doc->appendCssSheet($css);
			}
			foreach($theme->templates as $k => $v){
				self::$_templates[$k] = $v;
			}
			$templates = $theme->templates;
		}
		
		if(!self::getTemplate()){
			if(self::$templateName and isset($templates[self::$templateName])){
				self::setTemplate(file_get_contents($templates[self::$templateName]));
			}else{
				self::setTemplate(self::$template);
			}
		}
		/*
		$template_x = self::evalTemplate();

		
if(1==0){
	$_body = $template_x->render();
		$_script = $template_x->getScript();
		$_css = $template_x->getCss();
		
		$doc->appendCssStyle($_css);
		$doc->appendScript($_script, true);
		
		$doc->body->text = $_body;
}else{
	$doc->body->appendChild($template_x);
}
		
		*/

		self::$_str->setTemplate(self::vars(self::getTemplate()));
		
		if(self::$_templateChanged){
			self::$_strPanels = self::$_str->getStrPanels();
			foreach(self::$_strPanels as $panel){
				
				if(!isset(self::$_info[$panel])){
				
					self::evalElement(self::setPanel(new InfoParam(['panel' => $panel])));
				}
			}
		}
		
		
		$doc->body->add(self::$_str);
				
		$doc->appendScript(self::$script, true);
		//hr(self::$_mainPanels, "green");
		$json = json_encode(self::$_mainPanels, JSON_PRETTY_PRINT);
		$script = "//Sevian.loadPanels($json)";
		
		$doc->appendScript($script, true);
		
		return $doc->render();
		/* 
		foreach($this->cssSheetsDefault as $v){
			$doc->appendCssSheet($v);
		}
		
		if(isset($this->themes[$this->theme])){
			foreach($this->themes[$this->theme]['css'] as $v){
				//$doc->appendCssSheet($this->themes[$this->theme]['path_css'].$v);
				$doc->appendCssSheet($v);
			}
			foreach($this->themes[$this->theme]['templates'] as $k => $v){
				//$this->_templates[$k] = $this->themes[$this->theme]['path_html'].$v;
				$this->_templates[$k] = $v;
			}
		}
		
		foreach($this->cssSheets as $v){
			$doc->appendCssSheet($v);
		}
		
		foreach($this->jsFilesDefault as $v){
			$doc->appendScriptDoc($v['file'], $v['begin']);//
		}
		
		foreach($this->jsFiles as $v){
			$doc->appendScriptDoc($v, true);
		}
		if(!$sevian->getTemplate()){
			if($this->templateName and isset($this->_templates[$this->templateName])){
				$this->template = file_get_contents($this->_templates[$this->templateName]);
			}
			$sevian->setTemplate($this->template);
		}
		
		
		$doc->body->add($sevian->evalTemplate());
		
		$doc->appendScript($sevian->script, true);
		
		$doc->setTitle($sevian->title);
		
		return $doc->render(); */
	}
	public static function evalElement($info){
		$elem = self::getElement($info); 
		//self::resetPanelSigns($panel);
		
		if($elem->evalMethod()===true){
			
			$elem->addConfig([
				'__sg_panel'	=>$info->panel,
				'__sg_sw'		=>self::$cfg['SW'],
				'__sg_sw2'		=>self::$cfg['SW'],
				'__sg_ins'		=>self::$ins,
				'__sg_params'	=>'',
				'__sg_async'	=>'',
				'__sg_action'	=>self::$lastAction,
				'__sg_thread'	=>'']);

			
			self::$_str->addPanel($info->panel, $elem);





		}
	}
	
	public static function evalElements(){
		foreach(self::$_info as $panel => $e){
			self::evalElement($e);
		}
	}

	public static function render(){
		//1.-
		self::sessionInit();
		//2.-
		self::init();
		//3.-
		self::evalParams();
		//4.-
		self::evalElements();
		//5.-
		return self::htmlDoc();
	}
}



