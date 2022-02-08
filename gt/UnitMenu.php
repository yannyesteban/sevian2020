<?php
//AIzaSyDZ4BkTZxNRh8GZTqmgGfDI4c2PgcbSuMM
namespace GT;
require_once MAIN_PATH.'gt/Trait/DBConfig.php';

class UnitMenu extends \Sevian\Element implements \Sevian\UserInfo{

	public $jsClassName = '';
	
	use DBConfig;
	
	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();
	}

	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
		}

		switch($method){
			case 'load':
				$this->load();
				break;
		}

		return true;
	}


	public function load(){
		

		$user = $this->getUser();

		
		
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'MAP',
			'iClass'	=> 'GTUnitMenu',
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                'caption'=>'Unidades',
                'unitData' => $this->loadUnits($user),
                'unitStoreId' => $this->eparams->unitStoreId ?? null
            ]
			
		]);

       
		
	}

    private function loadUnits($user){

        $cn = $this->cn;
        $cn->query = "SELECT
        u.id as unitId, vn.name as unitName,
        ac.client_id as client_id,
        cl.name as client,
        u.account_id,
        ac.name as account

        FROM unit as u
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        INNER JOIN account as ac ON ac.id = u.account_id
        INNER JOIN client as cl ON cl.id = ac.client_id
        LEFT JOIN unit_name as vn ON vn.id = u.name_id

        WHERE uu.user = '$user'
        ORDER BY client, account, unitName";

        $result = $this->cn->execute();

        return $cn->getDataAll($result);
    }

	public function setUserInfo($info){
        $this->_userInfo = $info;
    }
   
	public function getUserInfo(){
        return $this->_userInfo;
    }
	
	public function getUser(){
        return $this->_userInfo->user;
    }
}