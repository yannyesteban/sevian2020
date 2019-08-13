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
class Structure extends \Sevian\MainElement implements \Sevian\PanelsAdmin{
    // public static $cn;
    
    protected $tStructure = "_sg_structures";
    protected $tStrEle = "_sg_str_ele";

    protected $info;
    protected $infoPanels = [];

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
			FROM $this->tStructure 
			WHERE structure = '$this->name'";

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){
            $this->info = new StructureInfo($rs);
            
            
            $cn->query = "
                SELECT * 
                FROM $this->tStrEle 
                WHERE structure = '$this->name'";

                
            $result = $cn->execute();
		
		    while($rs = $cn->getDataAssoc($result)){
                $this->infoPanels[] = new \Sevian\InfoPanel($rs);
            }


		}

    }// end function
    
    public function getPanels(){
        return $this->infoPanels;

    }

}// end class