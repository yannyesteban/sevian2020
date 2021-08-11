<?php
namespace GT;

require_once MAIN_PATH.'Sigefor/JasonFile.php';
require_once MAIN_PATH.'gt/Trait.php';

class Report
    extends \Sevian\Element
	implements
		
		
		\Sevian\UserInfo

{

    private $unitId = 0;
    private $index = 0;

	static public $patternJsonFile = '';
    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();
	}
	
    public function config(){

	}

	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
		}

		switch($method){
			case 'load':
				$this->load();
				break;
            case 'get-config':
                $unitId = $this->eparams->unitId ?? $this->unitId;
                $index = $this->eparams->index ?? $this->index;
                $this->addResponse([
					'id'	=> $this->id,
					'data'	=> [
                        "commandConfig" => $this->getEventConfig( $unitId),
                        "unitConfig"    => $this->getUnitConfig( $unitId),
                        "unitPending"   => $this->getUnitCommand( $unitId, $index),
                        "eventList"     => $this->getEventList($unitId)
                    ],
					'iToken'=> $this->iToken
				]);
                
                break;    
			
			default:
				break;

		}

		return true;
	}



	private function load(){


		//$this->setInit($this->info);
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'Report',
			'iClass'	=> 'GTReport',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                'id'=>$this->id,
                'panel'=>$this->id,
                'tapName'=>'yanny',
                'caption'		=> 'Report',
            ]
                
		]);

    }
	

	public function setRequest($data){
		$this->_jsonRequest = $data;
	}

	public function getRequest(){
		return $this->_jsonRequest;
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

    private function getEventList($unitId){

        $cn = $this->cn;

        $cn->query = "SELECT c.index as event_id, IFNULL(c.name, '') as name, c.status
        FROM unit u
        INNER JOIN device as d on d.id = u.device_id
        INNER JOIN device_version as v ON v.id = d.version_id
        INNER JOIN device_command as dc ON dc.version_id = v.id
        INNER JOIN unit_command as c ON c.command_id = dc.id
        WHERE u.id = '$unitId' AND dc.rol_id = 1";

        
        $result = $this->cn->execute();
        return $cn->getDataAll($result);
        
    }
    
    private function getEventConfig($unitId){

        $cn = $this->cn;

        $cn->query = "SELECT c.*
        FROM unit u
        INNER JOIN device as d on d.id = u.device_id
        INNER JOIN device_version as v ON v.id = d.version_id
        INNER JOIN device_command as dc ON dc.version_id = v.id
        INNER JOIN command as c ON c.command_id = dc.id
        WHERE u.id = '$unitId' AND dc.rol_id = 1";

        $data = [];
        $result = $this->cn->execute();
        if($data = $cn->getDataAssoc($result)){
            $data['params'] = json_decode($data["params"]);
        }
        return $data;
    }
    private function getCommandConfig($commandId){

        $cn = $this->cn;

        $cn->query = "SELECT * FROM command as c WHERE command_id = '$commandId'";

        $data = [];
        $result = $this->cn->execute();
        if($data = $cn->getDataAssoc($result)){
            $data['params'] = json_decode($data["params"]);
        }
        return $data;
    }
    private function getUnitConfig($unitId){

        $cn = $this->cn;

        $cn->query = "SELECT * FROM unit_config as uc WHERE unit_id = '$unitId'";

        $data = [];
        $result = $this->cn->execute();
        if($data = $cn->getDataAssoc($result)){
            $data['event'] = json_decode($data["event"]);
        }
        return $data;
    }
    private function getUnitCommand($unitId, $index){

        $cn = $this->cn;

        $cn->query = "SELECT c.id, u.id as unit_id, dc.id as command_id, '$index' as `index`,
            c.name, c.params,
            IFNULL(c.status, 0) as status,
            1 as __mode_, '' as __record_

            FROM unit u
            INNER JOIN device as d on d.id = u.device_id
            INNER JOIN device_Version as v ON v.id = d.version_id
            INNER JOIN device_command as dc ON dc.version_id = v.id
            LEFT JOIN unit_command as c ON c.command_id = dc.id and c.unit_id = u.id AND c.index = '$index'

            WHERE u.id = '$unitId' AND dc.rol_id = 1";

        //hx($cn->query);
        $result = $this->cn->execute();
        if($data = $cn->getDataAssoc($result)){
            if($data['id']){
                $data['params'] = json_decode($data["params"]);
                $data['__mode_'] = 2;
                $data['__record_'] = ["id"=>$data["id"]];
            }
        }
        return $data;
    }
}