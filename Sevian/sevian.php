<?php
namespace Sevian;

date_default_timezone_set ( 'America/Caracas' );
ini_set('max_execution_time', 180);
ini_set('memory_limit','512M');
ini_set("session.gc_maxlifetime","18000");
include 'JasonFileInfo.php';
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
include 'Form2.php';


class S{

	public static $user = 'pepe';
	public static $role = 'public';

	public static $userInfo = null;
	public static $env = [];

	public static $title = 'SEVIAN 2017.10';
	public static $theme = [];
	public static $templateName = '';

	public static $elements = [];
	public static $panels = [];
	public static $windows = [];// not using

	public static $defaultPanel = 4;

	public static $cfg = [];

	public static $ses = [];
	public static $req = [];
	public static $exp = [];
	public static $frm = [];


	/* private */
	private static $_init = [];
	private static $_e = [];
	private static $_p = [];
	// save all fragments
	private static $_f = [];
    // save all js Elements
	private static $_jsElement = [];
	// save all js modules
	private static $_modules = [];
	// save all js Componets
	private static $_jsComponets = [];
    // save all js main Elements
	private static $_jsPanel = [];
	private static $_jsConfigPanel = [];

	private static $ins = false;
	private static $onAjax = 0;

	public static $_js = [];
	private static $_css = [];

	private static $_str = false;
	private static $_templates = [];
	private static $_themes = [];
	private static $_template = false;
	private static $_strPanels = false;
	private static $_templateChanged = false;


	private static $_response = [];
	private static $_elements = [];
	private static $_inputs = [];


	private static $_info = [];// se guarda la informacion de cada panel ;
	private static $_panels = [];
	private static $_windows = [];
	private static $_jsonRequest = null;


	private static $_userData = [];// variables de sesion para cada panel
	private static $_pVars = [];// variables de sesion para cada panel
	private static $_gVars = [];// variables de sesion del modulo

	private static $_infoClasses = [];
	private static $_infoInputs = [];

	private static $_tasks = [];

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

	private static $_db = [];

	private static $config = [];
	private static $moduleMode = false;

	public static function setConfigInit($file, $userData = null){
		$info = JasonFileInfo::load($file, $userData);

		foreach($info as $config){

			self::$config[$config->type] = (array)JasonFileInfo::load($config->file, $userData);
		}
		//hx(self::$config);
		self::loadConfigInit(self::$config);

	}
	public static function loadConfigInit($config){
		foreach($config as $key => $config){
			switch($key){
				case "css":
					self::cssInit($config);
					break;
				case "js":
					self::jsInit($config);
					break;
				case "command":
					self::commandsLoad($config);
					break;
				case "inputs":
					self::inputsLoad($config);
					break;
				case "commands":
					self::commandsLoad($config);
					break;
				case "themes":
					self::themesLoad($config);
					break;
				case "bd":
					Connection::load($config);
					break;
				case "elements":
					self::elementsLoad($config, true);
					break;
				case "init":
					self::configInit($config);
					break;

				}
		}

	}

	public static function setSes($key, $value){
		self::$ses[$key] = $value;
	}

	public static function setReq($key, $value){
		self::$req->{$key} = $value;
	}

	public static function addSes($ses){
		self::$ses = array_merge(self::$ses, $ses);
	}

	public static function addReq($req){
		self::$req = array_merge(self::$req, $req);
	}

	public static function setExp($key, $value){
		self::$exp[$key] = $value;
	}
	public static function &getSes($key){
		return self::$ses[$key];
	}
	public static function &getReq($key){
		return self::$req->{$key};
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
	public static function &getVFrm(){
		return self::$frm;
	}
	public static function jsInit($js = []){
		self::$_js = array_merge(self::$_js, $js);
	}

	public static function addJs($js = []){
		self::$_js = array_merge(self::$_js, $js);
	}

	public static function cssInit($css = []){
		self::$_css = array_merge(self::$_css, $css);
	}
	public static function addCss($css = []){
		self::$_css = array_merge(self::$_css, $css);
	}
	public static function setRole($role){

	}
	public static function getRole(){

	}
	public static function setEnvData($data){
		self::$env = $data;
	}

	public static function setUserInfo($userInfo){
		self::setSes("SS_USER", $userInfo->user);
		self::$userInfo = $userInfo;
	}
	public static function getUserInfo(){
		return self::$userInfo;
	}

	public static function configInit($opt){
		foreach($opt as $k => $v){
			if(property_exists(__CLASS__, $k)){
				self::$$k = $v;
			}
		}

		self::$_init = new InfoInit($opt);

	}

	public static function addResponse($response){
		self::$_response = array_merge(self::$_response, $response);
	}

	public static function addTask($id, $task){

		self::$_tasks[$id] = $task;
	}

	public static function &getTasks($id, $task){

		return self::$_tasks[$id];
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
		self::$frm = &$_REQUEST;
		self::$req = (object)$_REQUEST;

		self::$ses = &self::$cfg['VSES'];
		self::$onAjax = self::getReq('__sg_async');
		//\Sevian\S::setSes("nombre1", "f-2000");

		self::setExp("TODAY", date("Y-m-d"));
		self::setExp("TIME", date("H:i:s"));

		if(!self::$onAjax){

			//self::db(self::$req);
			self::$_str = new HtmlStructure();
		}else{

			self::$_str = new AsyncStructure();
		}

		self::$_str->ins = self::$ins;
		//hr($_SESSION);
		//hr(isset(self::$cfg['INIT']));
		//unset(self::$cfg['INIT']);
		//hx($_REQUEST);

		if(isset($_REQUEST['__sg_ins']) && !isset(self::$cfg['INIT'])){
			self::reset();
		}
		if(!isset(self::$cfg['INIT'])){
			self::$userInfo = new InfoUser();



			self::$cfg['INIT'] = true;
			self::$cfg['SW'] = 1;
			self::$cfg['INFO'] = [];
			self::$cfg['AUTH'] = false;

			self::$cfg['USER_INFO'] = &self::$userInfo;

			self::$cfg['VSES'] = [];
			self::$cfg['TEMPLATE'] = &self::$_template;
			self::$cfg['STR_PANELS'] = &self::$_strPanels;

			self::$_str->sw = self::$cfg['SW'];

			foreach(self::$env as $k => $v){
				self::setSes($k, $v);
			}

			foreach(self::$_info as $info){
				$info->update = false;
			}
			if(!self::$onAjax){
				foreach(self::$_init->elements as $k => $e){

					self::setElement($e);
				}
			}


			foreach(self::$panels as $k => $p){
				hr(8888);
				self::setPanel(new InfoPanel($p));
			}


			self::$cfg['TASKS'] = &self::$_tasks;
			self::$cfg['LISTEN_PANEL'] = &self::$_pSigns;
			self::$cfg['LISTEN'] = &self::$_signs;
			self::$cfg['COMMANDS'] = &self::$_commands;
			self::$cfg['ACTIONS'] = &self::$_actions;
			self::$cfg['INFO'] = &self::$_info;
			self::$cfg['PANELS'] = &self::$_panels;
			self::$cfg['WINDOWS'] = &self::$_windows;

			self::$cfg['P_VARS'] = &self::$_pVars;
			self::$cfg['G_VARS'] = &self::$_gVars;

			self::$cfg['USER_DATA'] = &self::$_userData;

		}else{
			self::$cfg['INIT'] = false;

			self::$cfg['SW'] = (self::$cfg['SW'] == '1')? '0': '1';
			self::$_str->sw = self::$cfg['SW'];

			self::$userInfo = &self::$cfg['USER_INFO'];

			self::$_info = &self::$cfg['INFO'];
			self::$_panels = &self::$cfg['PANELS'];
			self::$_windows = &self::$cfg['WINDOWS'];

			self::$_template = &self::$cfg['TEMPLATE'];
			self::$_strPanels = &self::$cfg['STR_PANELS'];

			self::$_signs = &self::$cfg['LISTEN'];

			self::$_tasks = &self::$cfg['TASKS'];

			self::$_pSigns = &self::$cfg['LISTEN_PANEL'];
			self::$_commands = &self::$cfg['COMMANDS'];
			self::$_actions = &self::$cfg['ACTIONS'];

			self::$_pVars = &self::$cfg['P_VARS'];
			self::$_gVars = &self::$cfg['G_VARS'];


			self::$_userData = &self::$cfg['USER_DATA'];

			//self::evalElements();
			foreach(self::$_info as $info){
				$info->update = false;
			}
		}
		self::setSes("MAIN_PATH", MAIN_PATH);
		self::setSes("IMAGES_PATH", IMAGES_PATH);
		self::setSes("PATH_IMAGES", PATH_IMAGES);
		//print_r(self::$userInfo);
		//hx(self::getVSes());
		//print(4);

	}




	public static function setElement($info, $update = false){



		if($info->id === 0 or $info->id === "0"){
			$info->id = self::getReq("__sg_panel")?? self::$defaultPanel;
		}else if($info->id === -1 or $info->id === "-1"){
			$info->id = self::$defaultPanel;
		}

		if(isset(self::$_info[$info->id])){
			if(!$info->element){
				$info->element = self::$_info[$info->id]->element;
			}

			if(!$info->name){
				$info->name = self::$_info[$info->id]->name;
			}
		}

		if(!isset(self::$_clsElement[$info->element])){
			return;
		}

		$info->async = self::$onAjax;

		self::$_info[$info->id] = $info;



		if(!isset(self::$_userData[$info->id])){
			self::$_userData[$info->id] = [];
		}
		$info->_data_user = self::$_userData[$info->id];
		/*
		$info = [
			"name"=>'',
			'eparams=>'',
			'id'=>'',
			'debug'='',
			'design'=>'',
			'userData'=>[]
		]

		*/

		self::setExp("ID_", $info->id);
		self::setExp("ELEMENT_", $info->element);
		self::setExp("NAME_", $info->name);
		self::setExp("ASYNC_", $info->async);
		if($info->eparams){
			foreach($info->eparams as $k => $v){
				//hr("$k -> $v");
				self::setExp($k, $v);
			}
		}


		$e = self::$_e[$info->id] = new self::$_clsElement[$info->element](new InfoElement($info));


		if(!isset(self::$_pVars[$info->id])){
			self::$_pVars[$info->id] = [];
		}
		$e->pVars = &self::$_pVars[$info->id];
		$e->setVPanel(self::$_pVars[$info->id]);
		$e->gVars = &self::$_gVars;


		if($e instanceof \Sevian\UserInfo){
			$e->setUserInfo(self::getUserInfo());
		}
		$e->config();
		$e->getSequenceBefore();
		$e->evalMethod();
		$e->getSequenceAfter();


		if($e instanceof \Sevian\ListenSigns){
			self::addTask($info->id, $e->getTaskXSigns());
		}

		if($e instanceof \Sevian\DBInfo){
			$dbInfo = $e->getDBInfo();
			foreach($dbInfo as $k => $v){
				Connection::set($k, $v);
			}
		}

		if($e instanceof \Sevian\CSSDocAdmin){
			self::addCss($e->getCSSDocuments());
		}

		if($e instanceof \Sevian\JsDocAdmin){
			self::addJs($e->getJsDocuments());
		}

		self::addFrament($e->getResponse());
		if($e instanceof \Sevian\UserAdmin and $userInfo = $e->getUserInfo()){
			self::setUserInfo($userInfo);
		}

		if($e instanceof \Sevian\TemplateAdmin){
			if($html = $e->getTemplate()){
				self::setTemplate($html);
			}elseif($e->getThemeTemplate()){
				self::$templateName = $e->getThemeTemplate();
			}
		}

		if($e instanceof \Sevian\WindowsAdmin and $windows = $e->getWindows()){
			self::$_windows = $windows;
		}

		if($e instanceof \Sevian\JsonRequest){// and $_jsonRequest = $e->getRequest()
			self::$_jsonRequest = $e->getRequest();
		}

		self::$_response = array_merge(self::$_response, $e->getResponse());

		if($e instanceof \Sevian\PanelsAdmin and $panels = $e->getPanels()){
			foreach($panels as $k => $p){
				self::setElement($p);
			}
		}

		if($info->mode == 'panel'){

			self::addPanel($e);
			//self::$_str->addPanel($info->id, $e->getPanel());
			self::$_str->addPanel($info->id, $e);
			$info->update = true;
			$info->isPanel = true;
		}


		$sign = "$info->element:$info->name:$info->method";

		foreach(self::$_tasks as $_id => $task){
			//hr($sign,"blue");
			//hx($task,"red");


			if(isset($task[$sign])){
				self::sequence($task[$sign]);
			}
		}



	}


	public static function addFrament($frag){
		self::$_f = array_merge(self::$_f, $frag);
	}
    public static function addJsComponents($info){
		if($info){
			self::$_jsComponets = array_merge(self::$_jsComponets, $info);
		}

	}

    public static function getJsComponents(){
		return self::$_jsComponets;
	}


    public static function addJsElement($opt){
		self::$_jsElement = array_merge(self::$_jsElement, $opt);
	}

    public static function getJsElement(){
		return self::$_jsElement;
	}

    public static function addJsPanel($opt){
		self::$_jsPanel[] = $opt;//array_merge(self::$_jsPanel, $opt);
	}
	public static function addJsConfigPanel($opt){
		self::$_jsConfigPanel[] = $opt;//array_merge(self::$_jsPanel, $opt);
	}
    public static function getJsPanel(){
		return self::$_jsPanel;
	}
	public static function getJsConfigPanel(){
		return self::$_jsConfigPanel;
	}

	public static function db($db){
		self::$_db[] = $db;
	}
	public static function getDB($frag){
		return self::$_db;
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



	public static function init($opt = []){}

	public static function inputsLoad($inputs){
		foreach($inputs as $k => $v){
			self::addClassInput($k, $v);
		}
	}
	public static function inputsLoad2($inputs){
		foreach($inputs as $k => $v){
			self::addClassInput($k, $v);
		}
	}
	public static function addClassInput2($name, $info){
		if($info->file ?? '' != ''){
			require_once($info->file);
		}
		self::$_inputs[$name] = $info;
	}
	public static function addClassInput($name, $info){
		$info = (array)$info;
		if($info['file'] ?? '' != ''){
			require_once($info['file']);
		}
		self::$_inputs[$name] = $info;
	}

	public static function elementsLoad($elements, $v2=false){

		if($v2){

			foreach($elements as $info){
				$info = (array)$info;
				$name = $info['name'];
				if($info['enable']){
					self::setClassElement($name, $info);

					if($info['js']??false){
						self::addJs($info['js']);
					}
					if($info['css']??false){
						self::addCss($info['css']);
					}
					if($info['module']??false){
						self::$_modules[] = [
							"name"=>$info['module']->name,
							"src"=>$info['module']->src,
							"alias"=>$info['module']->alias?? null
						];
					}
				}
			}
			return;
		}



		foreach($elements as $name => $info){
			if($info['enable']){
				self::setClassElement($name, $info);

				if($info['js']??false){
					self::addJs($info['js']);
				}
				if($info['css']??false){
					self::addCss($info['css']);
				}
				if($info['module']??false){
					self::$_modules[] = $info['module'];
				}
			}
		}
	}

	public static function setClassElement($name, $info){
		if($info['file'] ?? '' != ''){
			require_once($info['file']);
		}
		self::$_clsElement[$name] = $info['class'];

		self::$_clsElement[$name]::setElementName($name);
		//self::$_clsElement[$name]::$_element = $name;

		if(isset($info['init'])){
			// asigning static propertys at the class
			foreach($info['init'] as $k => $v){
				self::$_clsElement[$name]::${$k} = $v;
			}
		}
	}
	public static function themesLoad($themes){
		self::$_themes = $themes;
	}
	public static function commandsLoad($inputs){

	}

	public static function evalExp($q){


		return Tool::evalExp(self::vars($q));

	}
	public static function vars($q, $default = false){
		return Tool::vars($q, [
			[
				'token' 	=> '@',
				'data' 		=> self::$ses,
				'default' 	=> $default
			],
			[
				'token'		=> '\#',
				'data' 		=> self::$req,
				'default' 	=> $default
			],
			[
				'token'		=> '\&F_',
				'data' 		=> self::$frm,
				'default' 	=> $default
			],
			[
				'token' 	=> '&EX_',
				'data' 		=> self::$exp,
				'default' 	=> $default
			],
		]);
	}

	public static function varParam($q, $data, $default = false){
		return Tool::vars($q, [
			[
				'token' 	=> '&P_',
				'data' 		=> $data,
				'default' 	=> $default
			]
		]);
	}

	public static function varCustom($q, $data, $token, $default = false){
		return Tool::vars($q, [
			[
				'token' 	=> $token,
				'data' 		=> $data,
				'default' 	=> $default
			]
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
			self::command((object)$cmd);


		}

	}
	public static function command($cmd){

		switch($cmd->t){

			case "getDataForm":

				$data = [];
				if($cmd->fields?? false){
					foreach($cmd->fields as $key => $value){
						$data[$value] = self::getReq($key);
					}
				}else{
					$data = self::getVReq();
				}

				self::addResponse([[
					"type"=>"dataForm",
					"dataForm" => $data
				]]);

				break;
			case "addSes":
				self::addSes((array)$cmd->param);
				break;
			case "addReq":
				self::addReq((array)$cmd->param);
				break;
			case "vexp":
				//$this->_setVars($this->exp, $params);
				break;
			case "vreq":
				//$this->_setVars($this->req, $params);
				break;
			case "set_params":
				//$this->params = array_merge($this->params, $this->cmd->get_param($value));
				break;
			case "setPanel":


				//self::setElement($params, true);
				//self::setPanel(new InfoParam($params), true);
				$cmd['mode'] = 'panel';
				self::setElement(new InfoParam($cmd), true);
				break;
			case "setMethod":
				//hx($cmd);
				//self::setElement(new InfoElement($cmd), true);
				self::setElement(new InfoParam($cmd), true);
				//self::evalMethod($params);

				break;
			case "iMethod":
				self::iMethod($cmd);
				break;
			case "signs":
				self::evalSigns($params);
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



		if(isset(self::$req->{"__sg_params"}) and self::$req->{"__sg_params"} != ""){
			self::sequence(json_decode(self::$req->{"__sg_params"}));
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

	private static function addPanel($panel){
		//self::$_panels[] = $panel;
	}

	public static function htmlDoc3(){

		global $sevian;


		$doc = new Document();


		$doc->setTitle(self::$title);

		foreach(self::$_css as $v){
			$doc->appendCssSheet($v);
		}
		$modules = [];
		foreach(self::$_js as $k=> $v){

			$v = (object)$v;
			if(isset($v->file)){
				$doc->appendScriptDoc($v->file, $v->begin?? true, $v->attrib?? []);
			}
			if(isset($v->module)){
			//	$modules[] = ["name"=>]

			}
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

		$templates = (array)$templates;
		if(!self::getTemplate()){
			if(self::$templateName and isset($templates[self::$templateName])){
				self::setTemplate(@file_get_contents($templates[self::$templateName]));
			}else{
				self::setTemplate(self::$template);
			}
		}


		self::$_str->setTemplate(self::vars(self::getTemplate()));

		//if(self::$_templateChanged){

		/*
		self::$_strPanels = self::$_str->getStrPanels();
		foreach(self::$_strPanels as $panel){

			if(!isset(self::$_info[$panel])){
				self::$_str->addPanel($panel, new \Sevian\HTML(''));
			}
		}
		*/
		//}



		$js = [];
		//print_r(self::$_e);exit;
		$initConfig = [];
		foreach(self::$_e as $k => $v){
			//hr("$k");
			$initConfig[] = $v->getInfoElement();

			if($v->getInit())
			$js[] = [
				'id'=>$k,
				'type'=>$v->getJSClass(),
				'option'=>$v->getInit()

			];
			//hr($v->getInit());
		}



		$doc->body->add(self::$_str);

		$doc->appendScript(self::$script, true);
		//hr(self::$_mainPanels, "green");
		//$json = json_encode(self::$_mainPanels, JSON_PRETTY_PRINT);
		//$script = "//Sevian.loadPanels($json)";
		$win = json_encode(self::$_windows, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
		$json = json_encode(self::getJsPanel(), JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);

		$json = json_encode($js, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);

		$data = [];
		$data['instance'] = self::$ins;
		$data['sw'] = self::$cfg['SW'];
		$data['sw2'] = self::$cfg['SW'];
		$data['defaultPanel'] = self::$defaultPanel;
		$data['wins'] = self::$_windows;
		$data['elements'] = self::$_response;//$initConfig;//$js;
		$data['request'] = [
			//'panels'=>$p,
			//'config'=> self::getJsPanel(),//json_encode(self::getJsPanel(), JSON_PRETTY_PRINT),
			//'update'=> self::getJsConfigPanel(),
			'fragments'=>self::$_f,
			'debug'=>self::$_db
		];
		$data['jsComponents'] = self::getJsComponents();

		$json = json_encode($data, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
		$mainPath = MAIN_PATH;
		$script = "\nimport {S} from '{$mainPath}build/Sevian/ts/Sevian.js';";
		$script .= "\nwindow.S = S;";

		//hx(self::$_modules);
		foreach(self::$_modules as $module){

			$script .= "\nimport { $module[name] } from '$module[src]';";
			//$script .= "\nwindow.$module[name] = $module[name];";
			$name = $module['alias']?? $module['name'];
			$script .= "\nS.register(\"$name\", $module[name]);";
		}
		$script .= "\nS.load3($json);";
		$doc->appendScript($script, true, ["type"=>"module"]);

		return $doc->render();

	}
	public static function jsonDoc3(){



		//$elems = self::$_str->getElements();

		$p = 	self::$_str->render();

		//echo json_encode(self::$_f, JSON_PRETTY_PRINT);
		$js = [];
		$up = [];
		foreach(self::$_e as $k => $v){

			if($v->getInit()){

				$js[] = [
					'mode'=>self::$_info[$k]->mode,
					'id'=>$k,
					'type'=>$v->getJSClass(),
					'option'=>$v->getInit()

				];
			}

			if($v->getJSActions()){
				$up[] = ['id'=>$k, 'actions'=>$v->getJSActions()];
			}
			//hr($v->getInit());
		}



		$response = [
			'panels'	=> $p,
			'config'	=> $js,//self::getJsPanel(),//json_encode(self::getJsPanel(), JSON_PRETTY_PRINT),
			//'update'	=> self::getJsConfigPanel(),
			'update'	=> $up,
			'fragments'	=> self::$_f,
			'components'=> self::getJsComponents(),
			'debug'		=> self::$_db
			];



			//$json = json_encode(self::getJsPanel(), JSON_PRETTY_PRINT);
			//$script = "Sevian.action.initPanel($json)";

			//echo $script;exit;

		//echo	$json = json_encode(self::getJsPanel(), JSON_PRETTY_PRINT);
		return json_encode(self::$_response, JSON_PRETTY_PRINT 
		#| JSON_NUMERIC_CHECK
	);

	}

	public static function htmlDoc(){

		if(self::$moduleMode){
			return self::htmlDoc2();
		}
		global $sevian;


		$doc = new Document();


		$doc->setTitle(self::$title);

		foreach(self::$_css as $v){
			$doc->appendCssSheet($v);
		}

		foreach(self::$_js as $k=> $v){

			$v = (object)$v;
			if(isset($v->file)){
				$doc->appendScriptDoc($v->file, $v->begin?? true, $v->attrib?? []);
			}

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
				self::setTemplate(@file_get_contents($templates[self::$templateName]));
			}else{
				self::setTemplate(self::$template);
			}
		}


		self::$_str->setTemplate(self::vars(self::getTemplate()));

		//if(self::$_templateChanged){

		/*
		self::$_strPanels = self::$_str->getStrPanels();
		foreach(self::$_strPanels as $panel){

			if(!isset(self::$_info[$panel])){
				self::$_str->addPanel($panel, new \Sevian\HTML(''));
			}
		}
		*/
		//}


		$js = [];
		foreach(self::$_e as $k => $v){
			if($v->getInit())
			$js[] = [
				'id'=>$k,
				'type'=>$v->getJSClass(),
				'option'=>$v->getInit()

			];
			//hr($v->getInit());
		}


		$doc->body->add(self::$_str);

		$doc->appendScript(self::$script, true);
		//hr(self::$_mainPanels, "green");
		//$json = json_encode(self::$_mainPanels, JSON_PRETTY_PRINT);
		//$script = "//Sevian.loadPanels($json)";
		$win = json_encode(self::$_windows, JSON_PRETTY_PRINT);
		$json = json_encode(self::getJsPanel(), JSON_PRETTY_PRINT);

		$json = json_encode($js, JSON_PRETTY_PRINT);

		$script = "Sevian.action.initPanel($json)";
		$script = "S.instance = '".self::$ins."';S.sw = '".self::$cfg['SW']."';S.sw2 = '".self::$cfg['SW']."';S.defaultPanel= '".self::$defaultPanel."';S.winInit($win);S.init($json);";

		$response = [
			//'panels'=>$p,
			//'config'=> self::getJsPanel(),//json_encode(self::getJsPanel(), JSON_PRETTY_PRINT),
			//'update'=> self::getJsConfigPanel(),
			'fragments'=>self::$_f,
			'debug'=>self::$_db
			];
		$json = json_encode($response, JSON_PRETTY_PRINT);
		$json2 = json_encode(self::getJsComponents(), JSON_PRETTY_PRINT);
		$script .= "S.requestPanel($json);S.setComponents($json2)";
		$doc->appendScript($script, true);

		return $doc->render();

	}
	public static function htmlDoc2(){

		global $sevian;


		$doc = new Document();


		$doc->setTitle(self::$title);

		foreach(self::$_css as $v){
			$doc->appendCssSheet($v);
		}
		$modules = [];
		foreach(self::$_js as $k=> $v){

			$v = (object)$v;
			if(isset($v->file)){
				$doc->appendScriptDoc($v->file, $v->begin?? true, $v->attrib?? []);
			}
			if(isset($v->module)){
			//	$modules[] = ["name"=>]

			}
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

		$templates = (array)$templates;
		if(!self::getTemplate()){
			if(self::$templateName and isset($templates[self::$templateName])){
				self::setTemplate(@file_get_contents($templates[self::$templateName]));
			}else{
				self::setTemplate(self::$template);
			}
		}


		self::$_str->setTemplate(self::vars(self::getTemplate()));

		//if(self::$_templateChanged){

		/*
		self::$_strPanels = self::$_str->getStrPanels();
		foreach(self::$_strPanels as $panel){

			if(!isset(self::$_info[$panel])){
				self::$_str->addPanel($panel, new \Sevian\HTML(''));
			}
		}
		*/
		//}



		$js = [];

		foreach(self::$_e as $k => $v){
			if($v->getInit())
			$js[] = [
				'id'=>$k,
				'type'=>$v->getJSClass(),
				'option'=>$v->getInit()

			];
			//hr($v->getInit());
		}


		$doc->body->add(self::$_str);

		$doc->appendScript(self::$script, true);
		//hr(self::$_mainPanels, "green");
		//$json = json_encode(self::$_mainPanels, JSON_PRETTY_PRINT);
		//$script = "//Sevian.loadPanels($json)";
		$win = json_encode(self::$_windows, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
		$json = json_encode(self::getJsPanel(), JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);

		$json = json_encode($js, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);

		$data = [];
		$data['instance'] = self::$ins;
		$data['sw'] = self::$cfg['SW'];
		$data['sw2'] = self::$cfg['SW'];
		$data['defaultPanel'] = self::$defaultPanel;
		$data['wins'] = self::$_windows;
		$data['elements'] = $js;
		$data['request'] = [
			//'panels'=>$p,
			//'config'=> self::getJsPanel(),//json_encode(self::getJsPanel(), JSON_PRETTY_PRINT),
			//'update'=> self::getJsConfigPanel(),
			'fragments'=>self::$_f,
			'debug'=>self::$_db
		];
		$data['jsComponents'] = self::getJsComponents();

		$json = json_encode($data, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
		$mainPath = MAIN_PATH;
		$script = "\nimport {S} from '{$mainPath}build/Sevian/ts/Sevian.js';";
		$script .= "\nwindow.S = S;";

		//hx(self::$_modules);
		foreach(self::$_modules as $module){

			$script .= "\nimport { $module[name] } from '$module[src]';";
			//$script .= "\nwindow.$module[name] = $module[name];";
			$name = $module['alias']?? $module['name'];
			$script .= "\nS.register(\"$name\", $module[name]);";
		}
		$script .= "\nS.load($json);";
		$doc->appendScript($script, true, ["type"=>"module"]);

		return $doc->render();

		$script = "Sevian.action.initPanel($json)";
		$script = "import * as sev from '../../build/Sevian/ts/Sevian.js';let S = sev.S;window.S = S;";
		$script .= "S.instance = '".self::$ins."';S.sw = '".self::$cfg['SW']."';S.sw2 = '".self::$cfg['SW']."';S.defaultPanel= '".self::$defaultPanel."';S.winInit($win);S.init($json);";

		$response = [
			//'panels'=>$p,
			//'config'=> self::getJsPanel(),//json_encode(self::getJsPanel(), JSON_PRETTY_PRINT),
			//'update'=> self::getJsConfigPanel(),
			'fragments'=>self::$_f,
			'debug'=>self::$_db
			];
		$json = json_encode($response, JSON_PRETTY_PRINT);
		$json2 = json_encode(self::getJsComponents(), JSON_PRETTY_PRINT);
		$script .= "


		S.requestPanel($json);S.setComponents($json2)";
		$doc->appendScript($script, true, ["type"=>"module"]);

		return $doc->render();

	}
	public static function jsonDoc(){



		//$elems = self::$_str->getElements();

		$p = 	self::$_str->render();

		//echo json_encode(self::$_f, JSON_PRETTY_PRINT);
		$js = [];
		$up = [];
		foreach(self::$_e as $k => $v){

			if($v->getInit()){

				$js[] = [
					'mode'=>self::$_info[$k]->mode,
					'id'=>$k,
					'type'=>$v->getJSClass(),
					'option'=>$v->getInit()

				];
			}

			if($v->getJSActions()){
				$up[] = ['id'=>$k, 'actions'=>$v->getJSActions()];
			}
			//hr($v->getInit());
		}



		$response = [
			'panels'	=> $p,
			'config'	=> $js,//self::getJsPanel(),//json_encode(self::getJsPanel(), JSON_PRETTY_PRINT),
			//'update'	=> self::getJsConfigPanel(),
			'update'	=> $up,
			'fragments'	=> self::$_f,
			'components'=> self::getJsComponents(),
			'debug'		=> self::$_db
			];



			//$json = json_encode(self::getJsPanel(), JSON_PRETTY_PRINT);
			//$script = "Sevian.action.initPanel($json)";

			//echo $script;exit;

		//echo	$json = json_encode(self::getJsPanel(), JSON_PRETTY_PRINT);
		return json_encode($response, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);

	}
	public static function evalElement($info){}

	public static function evalElements(){


		if(self::$onAjax){
			return true;
		}

		foreach(self::$_info as $id => $info){
			//hr($id);
			if($info->isPanel and !$info->update){
				//hr($id,"red");
				//hr($id,"yellow","red");
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
		self::evalElements();
		//5.-

		if(!self::$onAjax){
			return self::htmlDoc3();
		}


		if(self::$_jsonRequest !== null){
			header('Content-Type: application/json; charset=utf-8');
			return json_encode(self::$_jsonRequest, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
		}

		if(self::$onAjax == 2){
			header('Content-Type: application/json; charset=utf-8');
			return json_encode(self::$_jsonRequest, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
		}

		if(self::$onAjax){
			//header('Content-Type: application/json; charset=utf-8');
			return self::jsonDoc3();
		}else{
			return self::htmlDoc();
		}

	}

	public static function debug($info){
		self::addResponse([[
			"type"=>"debug",
			"info" => $info
		]]);


	}
	public static function setMainPanel($panel, $type, $main){

		self::$_mainPanels[$panel] = [
			"panel"=>$panel,
			"type"=>$type,
			"opt"=>$main
		] ;
	}

	public static function action($info){

		$json = json_encode($info = new InfoAction($info));
		//hr($json);
		return "Sevian.action.send($json)";

	}

	public static function reset(){
		header("Location: ".$_SERVER["PHP_SELF"]);
		exit;
	}
}




