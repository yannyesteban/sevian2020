<?php
namespace SIGEFOR;

require_once MAIN_PATH.'Sigefor/DBTrait/Module3.php';
//require_once MAIN_PATH.'Sigefor/JasonFile.php';
//require_once MAIN_PATH.'Sigefor/DBTrait/DataRecord.php';
//require_once MAIN_PATH.'Sigefor/DBTrait/Form.php';

//require_once "Component/Form2.php";

//require_once "Component/FormSave.php";

class Module3 extends \sevian\element 
    implements 
        //\sevian\JasonComponent,
        \Sevian\DBInfo,
		\Sevian\PanelsAdmin
		//\Sevian\CSSDocAdmin,
		//\Sevian\JsDocAdmin
{
    public $userData = [];

    private $_dbINFO = [];
    use	DBTrait\Module3{
		DBTrait\Module3::init as public loadModule;
	}
    static public $patternJsonFile = '';
    
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
                $info = $this->loadModule($this->name, self::$patternJsonFile);


                if($this->vars){
                    foreach($this->vars as $k => $v){
                        $config = \Sevian\S::setSes($k, $v);
                       
                    }
                }
				$this->infoPanels[] = new \Sevian\InfoParam([
					'id'=>0,
					'element'=>'',
					'method'=>'load',
					'name'=>$this->structure
					
				]);
				break;
            break;

        }

        return false;
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