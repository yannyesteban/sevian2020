<?php

namespace Sigefor;

class UserInfo{
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

class User extends \Sevian\Element{


    protected $auth = false;
    private $_user = 'pepe';
    private $_pass = '123';
    private $_error = 0;
    private $_roles = 0;

    protected $tUsers = "_sg_users";
    protected $tGroups = "_sg_groups";
    protected $tGroUsr = "_sg_grp_usr";
    protected $info;

    public function __construct($opt = []){
		foreach($opt as $k => $v){
			$this->$k = $v;
		}
        $this->cn = \Sevian\Connection::get();
    }

    public function evalMethod($method = ""){
        

        switch($this->method){
            case "login":
                if(\Sevian\S::getReq('user')){
                    $this->_user = \Sevian\S::getReq('user');
                }
                if(\Sevian\S::getReq('pass')){
                    $this->_pass = \Sevian\S::getReq('pass');
                    
                }
                $this->dbConfig();
                break;
            case "load":
                break;

        }
    }

    private function dbConfig(){

		$cn = $this->cn;
        $security = 'md5';
        $user = $cn->addSlashes($this->_user);
		$cn->query = "
			SELECT * 
			FROM $this->tUsers 
			WHERE user = '$user'";
        //hr($cn->query);
		$result = $cn->execute();
        $auth = false;
        
		if($rs = $cn->getDataAssoc($result)){

            if($rs['pass'] === $security($this->_pass)){

                if($rs['status'] != 1){
                    // user not active
                    $this->_error = 3;  
                }elseif($rs['expiration'] != '' and $rs['expiration'] != '0000-00-00' and $rs['expiration'] < date("Y-m-d")) {
                    // the pass is expired
                    $this->_error = 4; 
                }else{
                    $auth = true;
                    // OK
                    $this->_error = 0;
                }
                
            }else{
                // pass is wrong
                $this->_error = 2; 
            }
            
		}else{
            // user not found
		    $this->_error = 1;
        }
        if($this->_error === 0){
            $this->_roles = $this->dbRoles();
           
        }
        // hr( $this->_error);
    }
    private function dbRoles(){

		$cn = $this->cn;
        $security = 'md5';
        $user = $cn->addSlashes($this->_user);
		$cn->query = "
			SELECT * 
			FROM $this->tGroUsr 
			WHERE user = '$user'";

		$result = $cn->execute();
        $roles = [];
        
		while($rs = $cn->getDataAssoc($result)){
            $roles[] = $rs['group'];
        }
        return $roles;
        
    }
    public function getRoles(){
        return $this->_roles;
    }
}// end class