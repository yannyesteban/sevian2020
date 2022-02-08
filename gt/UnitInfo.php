<?php

namespace GT;


class UnitInfo extends \Sevian\Element implements \Sevian\UserInfo{

	public $jsClassName = '';
	
	
	
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


        $infoForm = new \Sigefor\InfoForm([

			//'id'		=> $this->containerId,
			'containerId'=>null,
			'panelId'	=> $this->id,
			'name'		=> '/gt/infoForm/unit_info',
			'method'	=> 'load',
			'mode'		=> 1,
			'userData'=> [],
            

			//'record'=>$this->getRecord()
		]);
		$infoForm->load();
		
		
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'MAP',
			'iClass'	=> 'GTUnitInfo',
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                'caption'=>'Info',
                //'unitData' => $this->loadUnits($user),
                'unitStoreId' => $this->eparams->unitStoreId ?? null,
                'infoForm'		=> $infoForm->getInit(),
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