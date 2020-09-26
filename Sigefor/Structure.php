<?php
namespace Sigefor;

include "DBTrait/GroupElement.php";

class StructureInfo{
    

    public $structure;
    public $title;
    public $template;
    public $class;
    public $main_panel;
    public $params = [];
    public $wins = [];
    

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}

}
class Structure 
    extends \Sevian\Element 
    implements  \Sevian\WindowsAdmin,
                \Sevian\PanelsAdmin,
                \Sevian\TemplateAdmin,
                \Sevian\UserInfo
                {
    // public static $cn;
    
    use \Sigefor\DBTrait\GroupElement;
    
    private $tStructures = "_sg_structures";
    private $tStrEle = "_sg_str_ele";
    private $tTemplates = "_sg_templates";

    protected $info;
    protected $infoPanels = [];
    protected $template_html = "";
    protected $themeTemplate = "";

    private $_wins = [];

    private $_roles = [];
    private $_userInfo = [];

    public function __construct($opt = []){
		hr("Structure.php");
		foreach($opt as $k => $v){
			$this->$k = $v;
		}
        $this->cn = \Sevian\Connection::get();
    }
    /* Implementing : \Sevian\UserRoles */
    public function setUserInfo($info){
        $this->_userInfo = $info;
    }

    public function getUserInfo(){
        return $this->_userInfo;
    }

    public function evalMethod($method = ""){
        $this->_roles = $this->dbGroupElement($this->element, $this->name, $this->method);
        
        $userInfo = $this->getUserInfo();
        $n_roles = count(array_intersect($userInfo->roles, $this->_roles));

        hr(count($this->_roles),"red");
        if($n_roles == 0 or $n_roles > 0){
            
            hr("errror");
        }
        
        

        $this->dbConfig();
        
        switch($method){
            case "login":
                break;
            case "load":
                break;

        }
    }
    private function dbConfig(){

		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tStructures 
			WHERE structure = '$this->name'";

		$result = $cn->execute();
        //print_r($this->getUserInfo());
        
        
		if($rs = $cn->getDataAssoc($result)){
            $this->info = new StructureInfo($rs);
            

            $wins = \Sevian\S::vars($this->info->wins);
            $this->_wins = json_decode($wins);

            if($template = $this->info->template){
                $cn->query = "
                    SELECT * 
                    FROM $this->tTemplates 
                    WHERE template = '$template'";

                
                $result = $cn->execute();
            
                if($rs = $cn->getDataAssoc($result)){
                    $this->template_html = $rs['html'];
                   
                }
            }
           


            
            $cn->query = "
                SELECT 
                    id, element, name, method,
                    eparams, type, class, debug, design
                    
                FROM $this->tStrEle as s
                WHERE structure = '$this->name'";

                
            $result = $cn->execute();
		
		    while($rs = $cn->getDataAssoc($result)){
                $rs['eparams'] = \Sevian\S::vars($rs['eparams']);
                $this->infoPanels[] = new \Sevian\InfoElement($rs);
            }


		}

    }// end function
    
    public function getTemplate(){
        return  $this->template_html;

    }
    public function getThemeTemplate(){
        return  $this->themeTemplate;

    }
    public function getPanels(){
        return $this->infoPanels;
    }

    public function getWindows(){
        return $this->_wins;
    }
}// end class