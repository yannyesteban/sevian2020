<?php
//AIzaSyDZ4BkTZxNRh8GZTqmgGfDI4c2PgcbSuMM
namespace GT;
require_once MAIN_PATH.'gt/Trait/DBConfig.php';

class MapAdmin extends \Sevian\Element implements \Sevian\UserInfo{

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
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-map-'.$this->id;

		//$this->typeElement = 'GTMapAdmin';

		$config = $this->loadUserConfig($this->getUser());

		$ACCESS_TOKEN = "";

		if(\Sevian\S::getSes('ACCESS_TOKEN')){
            
            $ACCESS_TOKEN = \Sevian\S::getSes('ACCESS_TOKEN');
        }

		$this->info = [
			'id'			=> $this->id,//$this->panel->id,
			'panel'			=> $this->id,
			'name'			=> $this->name,
			'markImages' 	=> $this->loadImage(),
			'layerImages'	=> $config->images,
			'controls'		=> $this->eparams->controls?? [],
			'unitAdminId' 	=> $this->eparams->unitAdminId ?? null,
			'clients' 		=> $this->eparams->clients ?? [],
			'iconImages'	=> [
				['source' => PATH_IMAGES.'vehicle_004.png','name'=>'vehiculo_004', 'sfd'=>false],
				['source' => PATH_IMAGES.'arrow_001.png','name'=>'arrow_001', 'sfd'=>false],
				['source' => PATH_IMAGES.'arrow_002.png','name'=>'arrow_002', 'sfd'=>false]
			],
			'markDefaultImage' => 'img_35',
			'ACCESS_TOKEN' => $ACCESS_TOKEN
		];

		//$this->setInit($this->info);return;
		
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'MAP',
			'iClass'	=> 'GTMapAdmin',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> $this->info
			
		]);
		
	}

	private function loadImage(){

        $path = PATH_IMAGES.'marks/';
        $cn = $this->cn;
        $cn->query = "SELECT name, CONCAT('$path', image,'.png') as src FROM image";

        $result = $this->cn->execute();

		return $cn->getDataAll($result);

    }

    private function load2(){

        $cn = $this->cn;
        $cn->query = "SELECT * FROM image";

        $result = $this->cn->execute();
        $data = [];
		while($rs = $cn->getDataAssoc($result)){

            $data[$rs['name']] = PATH_IMAGES."marks/".$rs['image'];
        }

        return $data;
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