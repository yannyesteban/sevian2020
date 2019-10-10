<?php
namespace Sigefor;

class StructureInfo{
    public $structure;
    public $title;
    public $template;
    public $class;
    public $main_panel;
    public $params = [];
    

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}

}
class Structure extends \Sevian\Element implements \Sevian\PanelsAdmin, \Sevian\TemplateAdmin{
    // public static $cn;
    
    protected $tStructures = "_sg_structures";
    protected $tStrEle = "_sg_str_ele";
    protected $tTemplates = "_sg_templates";

    protected $info;
    protected $infoPanels = [];
    protected $template_html = "";
    protected $themeTemplate = "";

    public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			$this->$k = $v;
		}
        $this->cn = \Sevian\Connection::get();
    }

    public function evalMethod($method = ""){
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
		
		if($rs = $cn->getDataAssoc($result)){
            $this->info = new StructureInfo($rs);
            
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
		
		    if($rs = $cn->getDataAssoc($result)){
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
}// end class