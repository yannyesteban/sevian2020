<?php
namespace GT;

require_once MAIN_PATH.'gt/Trait.php';

class Event
    extends \Sevian\Element
	implements
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\UserInfo

{


    use DBEvent;



    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;



	private $_jsonRequest = null;

	static $patternJsonFile = '';




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
			case 'init':
				$this->load();
				break;
			
			case 'get-event':

				$eventId = $this->eparams->eventId?? 0;
				$result = $this->getEvent($this->getUser(), $eventId);

				hx($this->getUser(). $eventId);
				$this->addResponse([
					'type'=>'',
					'id'=>$this->id,
					'data'=>[
						
					],
					'iToken'=>$this->iToken
				]);
				break;

				break;
			case 'load':
				//$this->load();
				//hx($this->loadDataEvent($this->eparams->lastEventId?? 0, $this->getUser()));
				//$this->load();
				$this->setRequest($this->loadDataEvent($this->eparams->lastEventId?? 0, $this->getUser()));
				break;
			case 'update-status':
				$userInfo = $this->getUserInfo();
				$this->setStatus($this->eparams->eventId?? 0, $this->eparams->status?? 0, $userInfo->user);
				$this->setRequest([
					"eventId"=>$this->eparams->eventId?? 0,
					"status"=>$this->eparams->status?? null,
					"windowId"=>$this->eparams->windowId?? 0,
					'mode'=>$this->eparams->mode?? 0,
					'user'=>$userInfo->user?? '',
					]);
				break;
			case 'update-all-status':
				$userInfo = $this->getUserInfo();
				$this->setStatusAll($this->eparams->eventId?? 0, $this->eparams->status?? 0, $userInfo->user, $this->eparams->windowId?? 0);
				$this->setRequest([
					"eventId"=>$this->eparams->eventId?? 0,
					"status"=>$this->eparams->status?? null,
					"windowId"=>$this->eparams->windowId?? 0,
					'mode'=>$this->eparams->mode?? 0,
					'user'=>$userInfo->user?? '',
					]);
				break;
            case 'load-sites':


                $this->_name = $this->name;
                $this->_type = 'GTHistory';
                $this->_mode = '';
                $this->_info = [
					'dataMain'		=> $this->loadGeofences(),

					'popupTemplate' => $this->popupTemplate,
					'infoTemplate'	=> $this->infoTemplate,

					'pathImages'	=> PATH_IMAGES,
					'caption'		=> 'Historial',
					'id'            => 'ks',
					'followMe'		=> true,
					'delay'			=> 60000,
				];
			case 'tracking':

				break;
			default:
				break;

		}

		return true;
	}

	public function init(){

		$form =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/history', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);


		return [
			'form'     => $form,

			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES."sites/",
			'caption'		=> 'Historial',
			'id'            => 'ks',
			'followMe'		=> true,
			'delay'			=> 60000,
		];
	}

	private function load(){


		$infoForm = new \Sigefor\InfoForm([

			//'id'		=> $this->containerId,
			'containerId'=>null,
			'panelId'	=> $this->id,
			'name'		=> '/gt/infoForm/event',
			'method'	=> 'load',
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);
		$infoForm->load();

		//hx($infoForm->getInit());

		//$this->setInit($this->info);
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'Event',
			'iClass'	=> 'GTEvent',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                'id'			=>$this->id,
                'panel'			=>$this->id,
                'caption'		=> 'Event',
                'socketId'		=>$this->eparams->socketId?? '',
                'unitPanelId'	=>$this->eparams->unitPanelId?? '',
				'infoForm' 		=> $infoForm->getInit(),
				'mapName'     	=> $this->eparams->mapName ?? '',
                
                
            ]

		]);

    }

    public function jsonSerialize() {
        return [
			'name'	=> $this->_name,
			'type'	=> $this->_type,
			'mode'	=> $this->_mode,
			'info'	=> $this->_info
		];
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

	public function getEvent($user, $eventId){
        $cn = $this->cn;
		$path = PATH_IMAGES;
        $cn->query = "SELECT
        u.id as unitId,
        ac.client_id as client_id,
        cl.name as client,
        u.account_id,
        ac.name as account,
        u.device_id,
        de.name as device_name,
        u.vehicle_id,
        vn.name as vehicle_name,
        CASE WHEN t.id IS NULL THEN 1 ELSE 0 END as noTracking,
        CASE WHEN t.id IS NULL THEN 0 ELSE 1 END as valid,
        vn.name as unitName,
        CONCAT('$path', ic.icon, '.png') as image, ve.plate, br.name as brand, mo.name as model, ve.color,#,
        ' - ' as date_time, ' -' as longitude, ' -' as latitude,
        ' -' as heading, ' -' as satellite, '- ' as speed, u.conn_status as connected



        FROM unit as u
		INNER JOIN tracking as t ON t.unit_id = u.id AND t.date_time = u.tracking_date #t.id = u.tracking_id
		INNER JOIN event as e ON t.unit_id = e.unit_id AND t.date_time = e.date_time
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN unit_name as vn ON vn.id = u.name_id

        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id

        LEFT JOIN vehicle_brand as br ON br.id = ve.brand_id
        LEFT JOIN vehicle_model as mo ON mo.id = ve.model_id

        INNER JOIN device as de ON de.id = u.device_id
        INNER JOIN device_name as dn ON dn.name = de.name


        LEFT JOIN icon as ic ON ic.id = u.icon_id

        LEFT JOIN account as ac ON ac.id = u.account_id
        LEFT JOIN client as cl ON cl.id = ac.client_id

        
        WHERE uu.user = '$user' and e.id = '$eventId'
        ORDER BY client, account, vehicle_name

        ";
		$result = $cn->execute();
        
        return $cn->getDataAll($result);
        $data = $cn->getDataAll($result);
		//hx($data);

        $s = [];
        foreach($data as $unitId => $v){
            if($v['trackId']){
                $s[] = $v['trackId'];
            }

        }

        $this->getUnitInput($data, $s);

        return $data;
    }
	

}