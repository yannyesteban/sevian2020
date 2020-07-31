<?php

namespace Sigefor;

class P{
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

class Procedure extends \Sevian\Element{

    protected $tProcedures = "_sg_procedures";
    

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			$this->$k = $v;
		}
        $this->cn = \Sevian\Connection::get();
    }

    public function evalMethod($method = ""){
        $this->dbConfig();

        $x = '
            [

                {"a":"54", "b":$if(4>5){"uno"}{"dos"}}

            ]
        
        
        ';
        
        $c = \Sevian\Tool::evalExp($x);

       //hr($c);

        //exit;
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
			FROM $this->tProcedures 
			WHERE `procedure` = '$this->name'";

        $result = $cn->execute();
		//hx ($cn->query);
		if($rs = $cn->getDataAssoc($result)){
            $commands = json_decode($rs["commands"]);
            if($commands){
                foreach($commands as $cmd){
                    $this->commands($cmd);
                } 
            }
            
			
        }

    }


    private function commands($cmd){
        
        switch($cmd->cmd){
            case "vses":

                foreach($cmd->value as $k => $v){
                    \Sevian\S::setSes($k, \Sevian\S::evalExp($v));
                }
                break;
            case "vreq":
                foreach($cmd->value as $k => $v){
                    \Sevian\S::setReq($k, \Sevian\S::evalExp($v));
                }
                break;
                case "vexp":
                    foreach($cmd->value as $k => $v){
                        \Sevian\S::setReq($k, \Sevian\S::evalExp($v));
                    }
                    break;    
            case "master-q":
                break;
            case "q":
                if(is_array($cmd->value)){
                    foreach($cmd->value as $q){
                      $this->evalQuery($q);  
                    }
                }else{
                    $this->evalQuery($cmd->value);
                }
                
                break;
        }

        //$params = json_decode(\Sevian\S::vars($rs['params']));
        //$params = \Sevian\S::varCustom($f->params, $record, '&');
    }


    public function evalQuery($q){
        $cn = $this->cn;


        $q = \Sevian\S::vars($q);

		$cn->query = \Sevian\S::evalExp($q);
        //hr($q);
        $var = &\Sevian\S::getVSes();
        $result = $cn->execute();
        if($cn->fieldCount){
            if($rs = $cn->getDataAssoc($result)){
                $var = array_merge(\Sevian\S::getVSes(), $rs); 

            }
        }else{

        }
        //print_r($var) ;
    }
}// end class