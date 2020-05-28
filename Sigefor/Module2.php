<?php
namespace Sigefor;


require_once MAIN_PATH.'Sigefor/DBTrait/Module.php';

class Module2
	extends \Sevian\Element
	implements 
		\Sevian\DBInfo,
		\Sevian\PanelsAdmin
		//\Sevian\CSSDocAdmin,
		//\Sevian\JsDocAdmin
		
{
	use	DBTrait\Module;

	
	private $infoPanels = null;
	private $_dbINFO = [];
	
	static public $patternJsonFile = '';
	static public $elementStructure = '';
	

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
				$info = $this->loadModule($this->name);

				$this->infoPanels[] = new \Sevian\InfoElement([
					'id'=>0,
					'element'=>self::$elementStructure,
					'method'=>'load',
					'name'=>$this->structure
					
				]);
				break;

		}
		return true;		
	}
	

	public function loadModule($name){
		
		if($name){
			if(substr($this->name, 0, 1) == '#'){
				$name = substr($this->name, 1);
				$path = str_replace('{name}', $name, self::$patternJsonFile);
				$info = $this->loadJsonModule($path);
			}else{
				$info = $this->loadDBModule($this->name);
			}

			$this->setInfoModule($info);
			if($this->DBInfo){
				$this->setDBInfo($this->DBInfo);
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
	
	/* Implementing \Sevian\DBInfo */
	public function setDBInfo($info){
		$this->_dbINFO = $info;
	}
    public function getDBInfo(){
		return $this->_dbINFO;
	}
}