<?php
namespace Sigefor\DBTrait;

trait User{
	private $cn = null;
	
	private $_user = '';
	private $_pass = '';
	
	private $_auth = false;

    protected $tUsers = "_sg_users";
    protected $tGroups = "_sg_groups";
    protected $tGroUsr = "_sg_grp_usr";

	private function dbUserConfig($user, $pass){
		$this->_user = $user;
		$this->_pass = $pass;
		
		$cn = $this->cn;
		
        $security = 'md5';
        $_user = $cn->addSlashes($this->_user);
		$cn->query = "
			SELECT * 
			FROM $this->tUsers 
			WHERE user = '$_user'";
        //hr($cn->query);
		$result = $cn->execute();
        $this->_auth = false;
        // error = 1 to user not found
        $error = 1;
		if(($rs = $cn->getDataAssoc($result)) and $this->_user != ''){
           
            if($rs['pass'] === $security($pass)){

                if($rs['status'] != 1){
                    // user not active
                    $error = 3;  
                }elseif($rs['expiration'] != '' and $rs['expiration'] != '0000-00-00' and $rs['expiration'] < date("Y-m-d")) {
                    // the pass is expired
                    $error = 4; 
                }else{
                    $this->_auth = true;
                    // OK
                    $error = 0;
                }
                
            }else{
                // pass is wrong
                $error = 2; 
            }
        }
        if($error === 0){
            //$this->_roles = $this->dbUserRoles();
           
        }
        return $error;//hr( $this->_error);
    }

	private function dbUserRoles(){

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
    

    public function getUserInfo(){
        $info = new \Sevian\InfoUser;
        $info->user = $this->_user;
        $info->pass = $this->_pass;
        $info->roles = $this->getRoles();
        $info->auth = $this->_auth;
        return $info;
    }


}