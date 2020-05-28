<?php

namespace Sigefor;

class ModuloInfo{
    public $module;
    public $title;
    public $structure;
    public $params = [];
    public $theme;
    public $debug = 0;
    public $design = 0;

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}
}

class Module extends \Sevian\Element{

    static public $patternJsonFile = '';

    protected $tModules = '_sg_modules';
    protected $info;

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
			FROM $this->tModules 
			WHERE module = '$this->name'";

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){
			$this->info = new ModuloInfo($rs);
		}
    }
}// end class