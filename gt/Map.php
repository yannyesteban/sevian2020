<?php

namespace GT;
require_once MAIN_PATH.'gt/Trait.php';

class Map extends \Sevian\Element implements \Sevian\UserInfo{

	public $jsClassName = 'GTMap';
	use DBConfig;
	use DBImage {
		load as loadImage;
	}
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
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-map-'.$this->id;

		$this->typeElement = 'GTMap';

		$config = $this->loadUserConfig($this->getUser());

		$this->info = [
			'id'			=> $this->panel->id,
			'panel'			=> $this->id,
			'name'			=> $this->name,
			'markImages' 	=> $this->loadImage(),
			'layerImages'	=> $config->images,
			'controls'		=> $this->eparams->controls?? [],
			'iconImages'	=> [
				['source' => PATH_IMAGES.'vehicle_004.png','name'=>'vehiculo_004', 'sfd'=>false],
				['source' => PATH_IMAGES.'arrow_001.png','name'=>'arrow_001', 'sfd'=>false],
				['source' => PATH_IMAGES.'arrow_002.png','name'=>'arrow_002', 'sfd'=>false]
			],
			'markDefaultImage' => 'img_35'
		];

		$this->setInit($this->info);


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