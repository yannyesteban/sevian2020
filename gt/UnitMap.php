<?php
//AIzaSyDZ4BkTZxNRh8GZTqmgGfDI4c2PgcbSuMM
namespace GT;


class UnitMap extends \Sevian\Element implements \Sevian\UserInfo{

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

		$infoPopup = new \Sigefor\InfoForm([

			
			'containerId'=>null,
			'panelId'	=> $this->id,
			'name'		=> '/gt/infoForm/unit_popup',
			'method'	=> 'load',
			'mode'		=> 1,
			'userData'=> [],

			
		]);
		$infoPopup->load();
		
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'MAP',
			'iClass'	=> 'GTUnitMap',
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                'caption'=>'Unidades',
				'infoMapPopup'	=> $infoPopup->getInit(),
                'unitStoreId' => $this->eparams->unitStoreId ?? null,
                'mapAdminId'	=> $this->eparams->mapAdminId ?? null,
				'msgErrorTracking'=> "La Unidad no presenta datos de Posición!!!",
            ]
			
		]);
		
	}

	private function getTime(){
		$cn = $this->cn;
        $cn->query = "SELECT now() as time";

        $result = $this->cn->execute();
		$time = "";
		if($rs = $cn->getDataAssoc($result)){
			$time = $rs['time'];
		}

        return $time;
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