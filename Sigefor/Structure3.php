<?php
namespace sigefor;

require_once 'DBTrait/user.php';
require_once 'DBTrait/structure3.php';
require_once 'DBTrait/groupelement.php';

class structure3 
	extends \Sevian\Element
	implements 
		\Sevian\UserAdmin,	
		\Sevian\TemplateAdmin,
		\Sevian\PanelsAdmin,
		\Sevian\UserInfo,
		\Sevian\CSSDocAdmin,
		\Sevian\JsDocAdmin,
		\Sevian\WindowsAdmin
		
{

	use	DBTrait\User;
	use	DBTrait\Structure3;
	use DBTrait\GroupElement;

	private $publicRole = true;
	private $infoPanels = null;
	
	static public $patternJsonFile = '';
	static public $patternTemplateFile = '';
	static public $verificationRoles = 'db';
	static public $usePublicRole = true;
	private $_userInfo = null;

	private $msgError = '';
	
	

	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();
		
	}

	public function config(){
		
	}
	
	public function evalMethod($method = false): bool{

		if($method){
			$this->method = $method;
		}

		switch($this->method){
			
			case 'load':
				//hr(JasonFile::getNameJasonFile($this->name, self::$patternJsonFile));
				$info = $this->loadStructure3($this->name, self::$patternJsonFile);
				break;
			case 'login':
				$userInfo = $this->login();
				
				break;
			case 'load-panel':
				//$this->loadPanel($this->eparams->panelId);
			break;
		}
		return true;		
	}
	public function login(){
		$user = \Sevian\S::getReq('user')?? '';
		$pass = \Sevian\S::getReq('pass')?? '';
	
		$error = $this->dbUserConfig($user, $pass);
		
		if($error === 0){
			
			$this->loadStructure3($this->name, 'load');
			
			$info = new \Sevian\InfoUser;
			$info->user = $user;
			$info->pass = $pass;
			$info->roles = $this->dbUserRoles($user);
			$info->auth = true;
			
			$this->setUserInfo($info);
			
			
				$this->addFragment(new \Sevian\iMessage([
					'caption'	=> $this->title,
					'text'		=> 'User Valid OK'
				]));
			
		
			return $info;
		}else{
			$this->setUserInfo(null);
		
			$this->addFragment(new \Sevian\iMessage([
				'caption'	=> $this->title,
				'text'		=> 'User Invalid'
			]));
		
		}
	}

	public function loadStructure3($name, $method = false){
		$this->loadStructure($name, self::$patternJsonFile);
		$allow = $this->isValidGroup($this->element, $this->structure, $method?? $this->method, $this->getUserInfo()->roles);
		
		
		
		$this->userData['title'] = $this->title;
		$this->userData['class'] = $this->class;
		$this->userData['structure'] = $this->structure;
		
		

		if($name){
			
			
			if($allow or $this->publicRole){
				
				foreach($this->infoElements as $k => $v){
					$v = (object)$v;
					if(is_string($v->eparams)){
						$v->eparams = \Sevian\S::vars($v->eparams);
					}
					
					$this->infoPanels[] = new \Sevian\InfoElement($v);
				}
				
				$this->loadTemplate($this->templateName, self::$patternTemplateFile);
			}else{
				$this->msgError = "You don't have permission to enter";
			}

			if($this->msgError){
				$this->addFragment(new \Sevian\iMessage([
					'caption'	=> $this->title,
					'text'		=> $this->msgError
				]));
			}
		}
	}

	/* implementing \Sevian\TemplateAdmin */
	public function getTemplate(){
		return $this->htmlTemplate;
	}
	
	/* implementing \Sevian\TemplateAdmin */
	public function getThemeTemplate(){
		return '';
	}
	
	/* implementing \Sevian\PanelsAdmin */
	public function getPanels(){
        return $this->infoPanels;
	}
	
	/* Implementing \Sevian\UserRoles */
    public function setUserInfo($info){
        $this->_userInfo = $info;
	}
	public function getUserInfo(){
        return $this->_userInfo;
	}

	/* Implementing \Sevian\CSSDocAdmin */
	public function getCSSDocuments(){
		return $this->cssDocuments;
	}
	/* Implementing \Sevian\JsDocAdmin */
	public function getJsDocuments(){
		return (array)$this->jsDocuments;
	}
	/* Implementing \Sevian\WindowsAdmin */
	public function getWindows(){
        return $this->_wins;
    }
}