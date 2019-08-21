<?php

namespace Sevian;

include 'Types.php';
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


class S{

	public static $user = 'pepe';
	public static $role = 'public';

	public static $title = 'SEVIAN 2017.10';
	public static $theme = [];
	public static $templateName = '';
	
	public static $elements = [];
	public static $panels = [];
	
	public static $cfg = [];
	
	public static $ses = [];
	public static $req = [];
	public static $exp = [];
	
	/* private */
	private static $_init = [];
	private static $_e = [];
	private static $_p = [];
	// save all fragments
	private static $_f = [];


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

	public static function setRole($role){

	}
	public static function getRole(){
		
	}
	public static function setAuth($auth){

	}
	public static function getAuth(){
		
	}

	public static function configInit($opt){
		foreach($opt as $k => $v){
			if(property_exists(__CLASS__, $k)){
				self::$$k = $v;
			}
		}

		self::$_init = new InfoInit($opt);
		
	}
	public static function sessionInit(){
		
		
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
		

		if(!self::$onAjax){
			self::$_str = new Structure();
		}else{
			
			self::$_str = new JsonStructure();
		}
		
		self::$_str->ins = self::$ins;

		if(!isset(self::$cfg['INIT'])){
			
			self::$cfg['INIT'] = true;
			self::$cfg['SW'] = 1;
			self::$cfg['INFO'] = [];
			self::$cfg['AUTH'] = false;
			
			self::$cfg['VSES'] = [];
			self::$cfg['TEMPLATE'] = &self::$_template;
			self::$cfg['STR_PANELS'] = &self::$_strPanels;

			self::$_str->sw = self::$cfg['SW'];

			if(!self::$onAjax){
				foreach(self::$_init->elements as $k => $e){
				
					self::setElement($e);
				}
			}
			

			foreach(self::$panels as $k => $p){
				self::setPanel(new InfoPanel($p));
			}

			self::$cfg['LISTEN_PANEL'] = &self::$_pSigns;
			self::$cfg['LISTEN'] = &self::$_signs;
			self::$cfg['COMMANDS'] = &self::$_commands;
			self::$cfg['ACTIONS'] = &self::$_actions;
			self::$cfg['INFO'] = &self::$_info;
		}else{
			
			self::$cfg['INIT'] = false;
			
			self::$cfg['SW'] = (self::$cfg['SW'] == '1')? '0': '1';
			self::$_str->sw = self::$cfg['SW'];
			
			self::$_info = &self::$cfg['INFO'];
			self::$_template = &self::$cfg['TEMPLATE'];
			self::$_strPanels = &self::$cfg['STR_PANELS'];
			
			self::$_signs = &self::$cfg['LISTEN'];
			
			self::$_pSigns = &self::$cfg['LISTEN_PANEL'];
			self::$_commands = &self::$cfg['COMMANDS'];
			self::$_actions = &self::$cfg['ACTIONS'];
			self::evalElements();
		}
		
		

		foreach(self::$_info as $info){
			$info->update = false;
		}
		
		
		
		

		


	}

	public static function addFrament($frag){
		self::$_f = array_merge(self::$_f, $frag);
	}

	public static function setElement($info, $update = false){

		if(isset(self::$_clsElement[$info->element])){
			self::$_info[$info->id] = $info;
			$e = self::$_e[$info->id] = new self::$_clsElement[$info->element]($info);
			
			$e->config();
			$e->getSequenceBefore();
			$e->evalMethod();
			$e->getSequenceAfter();

			self::addFrament($e->getResponse());

			if($e instanceof \Sevian\TemplateAdmin){
				if($html = $e->getTemplate()){
					self::setTemplate($html);
				}elseif($e->getThemeTemplate()){
					self::$templateName = $e->getThemeTemplate();
				}
			}

			if($e instanceof \Sevian\PanelsAdmin){
				$panels = $e->getPanels();
				foreach($panels as $k => $p){
					self::setElement($p);
				}
			}

			if($e->panel){
				self::$_p[$info->id] = true;
				self::$_info[$info->id]->isPanel = true;
				// if this->mail panel then title = this->title
				self::$_str->addPanel($info->id, $e->getPanel());
				
			}
			


		}

		
		
	}


	public static function iMethod($params){

		$info = new InfoParam($params);

		
		if($info->panel != '' and $info->panel != '0' and self::$_info[$info->panel] ?? false){
			
			
			//self::$_info[$info->panel]->method = $info->method;
			
			
			self::$_info[$info->panel]->eparams = array_merge(self::$_info[$info->panel]->eparams, $info->eparams);
			
			$elem = self::getElement(self::$_info[$info->panel]); 
			
			$result = $elem->evalMethod($info->method);
		
			self::addFrament($elem->getResponse());


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
			self::addFrament($elem->getResponse());
			//echo $elem->render();exit;

			
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



	public static function init($opt = []){

	
		
	}
	public static function inputsLoad($inputs){
		foreach($inputs as $k => $v){
			self::addClassInput($k, $v);
		}
	}

	public static function addClassInput($name, $info){
		if($info['file'] ?? '' != ''){
			require_once($info['file']);
		}
		self::$_inputs[$name] = $info;
	}

	public static function elementsLoad($elements){
		foreach($elements as $name => $info){
			self::setClassElement($name, $info);
		}
	}

	public static function setClassElement($name, $info){
		if($info['file'] ?? '' != ''){
			require_once($info['file']);
		}
		self::$_clsElement[$name] = $info['class'];
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

		foreach($seq as $cmd){

			
			//self::command(key($line), current(($line)));
			self::command($cmd);

		
		}
		
	}
	public static function command($cmd){
		
		
		
		switch($cmd['t']){
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

			
				//self::setElement($params, true);
				//self::setPanel(new InfoParam($params), true);
				break;
			case "setMethod":
				
				self::setElement(new InfoElement($cmd), true);
				//self::evalMethod($params);
				
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
	
	
	
	public static function getElement($info){
		
		if(isset(self::$_clsElement[$info->element])){
		
			$obj = new self::$_clsElement[$info->element]($info);
			
		}else{
		
			$obj = new Element($info);
			
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
		

		self::$_str->setTemplate(self::vars(self::getTemplate()));
		
		//if(self::$_templateChanged){
			self::$_strPanels = self::$_str->getStrPanels();
			foreach(self::$_strPanels as $panel){
				
				if(!isset(self::$_info[$panel])){
					self::$_str->addPanel($panel, new \Sevian\HTML(''));
				}
			}
		//}
		
		
		$doc->body->add(self::$_str);
				
		$doc->appendScript(self::$script, true);
		//hr(self::$_mainPanels, "green");
		$json = json_encode(self::$_mainPanels, JSON_PRETTY_PRINT);
		$script = "//Sevian.loadPanels($json)";
		
		$doc->appendScript($script, true);
		
		return $doc->render();
		
	}

	public static function jsonDoc(){
		
		
		//$elems = self::$_str->getElements();
		
		$p = 	self::$_str->render();
		
		//echo json_encode(self::$_f, JSON_PRETTY_PRINT);
		
		$response = [
			'panels'=>$p,
			'fragments'=>self::$_f
			];

		return json_encode($response, JSON_PRETTY_PRINT);
		
	}
	public static function evalElement($info){
		

	}
	
	public static function evalElements(){


		if(self::$onAjax){
			return true;
		}
		foreach(self::$_info as $id => $info){
			if($info->isPanel){
				self::setElement($info);
			}
			
		}
	}


	public static function evalElementX($info){
		
		$elem = self::getElement($info); 
		
		
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

			self::addFrament($elem->getResponse());
			self::$_str->addPanel($info->panel, $elem);
	
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
		//self::evalElements();
		//5.-

		if(self::$onAjax){
			return self::jsonDoc();
		}else{
			return self::htmlDoc();
		}
		
	}

	public static function setMainPanel($panel, $type, $main){
		
		self::$_mainPanels[$panel] = [
			"panel"=>$panel,
			"type"=>$type,
			"opt"=>$main
		] ;
	}
}



