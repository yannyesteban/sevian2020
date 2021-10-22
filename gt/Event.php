<?php
namespace GT;



class Event
    extends \Sevian\Element
	implements
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\UserInfo

{






    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;



	private $_jsonRequest = null;

	static $patternJsonFile = '';


	public $maxRecords = 100;
	public $maxTime = 5;


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

				//hx($this->getUser(). $eventId);
				$this->addResponse([
					'type'=>'',
					'id'=>$this->id,
					'data'=>$result,
					'iToken'=>$this->iToken
				]);


				break;
			case 'load':
				//$this->load();
				//hx($this->loadDataEvent($this->eparams->lastEventId?? 0, $this->getUser()));
				//$this->load();
				$unitId = $this->eparams->unitId?? 0;
				

				$data = [];
				$data[1] = $this->getLastEvents(1);
				$data[2] = $this->getLastEvents(2);
				$data[4] = $this->getLastEvents(4);
				if($unitId > 0){
					$data[9999] = $this->getUnitEvents($unitId);
					
				}
				//$data[] = $this->getLastEvents(2);
				//$this->setRequest($this->getLastEvents(1));

				$this->addResponse([
                    'id'	=> $this->id,
                    'data'	=> $data,
                    'iToken'=> $this->iToken
                ]);
				//$this->setRequest($this->loadDataEvent($this->eparams->lastEventId?? 0, $this->getUser()));
				break;
			case 'update-status':
				$userInfo = $this->getUserInfo();
				$this->setStatus($this->eparams->eventId?? 0, $this->eparams->status?? 0, $userInfo->user);
				
				
				$data = [];
				//$data[1] = $this->getLastEvents(1);
				//$data[2] = $this->getLastEvents(2);
				$data[$this->eparams->windowId] = $this->getLastEvents($this->eparams->windowId);
				$this->addResponse([
                    'id'	=> $this->id,
                    'data'	=> [
						"eventId"=>$this->eparams->eventId?? 0,
						"status"=>$this->eparams->status?? null,
						"windowId"=>$this->eparams->windowId?? 0,
						'mode'=>$this->eparams->mode?? 0,
						'user'=>$userInfo->user?? '',
						'data'=>$data
						],
                    'iToken'=> $this->iToken
                ]);
				
			case 'update-all-status':
				
				$userInfo = $this->getUserInfo();
				$this->setStatusAll($this->eparams->firstId?? 0, $this->eparams->lastId?? 0, $this->eparams->mode?? 0, $this->eparams->status?? 0);
				$data = [];
				//$data[1] = $this->getLastEvents(1);
				//$data[2] = $this->getLastEvents(2);
				$data[$this->eparams->windowId] = $this->getLastEvents($this->eparams->windowId);
				$this->addResponse([
                    'id'	=> $this->id,
                    'data'	=> [
						"eventId"=>$this->eparams->eventId?? 0,
						"status"=>$this->eparams->status?? null,
						"windowId"=>$this->eparams->windowId?? 0,
						'mode'=>$this->eparams->mode?? 0,
						'user'=>$userInfo->user?? '',
						'data'=>$data
						],
                    'iToken'=> $this->iToken
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

        vn.name as unitName,
        CONCAT('$path', ic.icon, '.png') as image,
		ve.plate, br.name as brand, mo.name as model, ve.color,
        t.date_time, t.longitude, t.latitude,
        t.heading, t.satellite, t.speed, u.conn_status as connected

        FROM event as e

        INNER JOIN tracking as t ON t.unit_id = e.unit_id AND t.date_time = e.date_time
        INNER JOIN unit as u ON t.unit_id = u.id
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        INNER JOIN device as de ON de.id = u.device_id
        INNER JOIN device_name as dn ON dn.name = de.name

        LEFT JOIN unit_name as vn ON vn.id = u.name_id
        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id
        LEFT JOIN vehicle_brand as br ON br.id = ve.brand_id
        LEFT JOIN vehicle_model as mo ON mo.id = ve.model_id
        LEFT JOIN icon as ic ON ic.id = u.icon_id
        LEFT JOIN account as ac ON ac.id = u.account_id
        LEFT JOIN client as cl ON cl.id = ac.client_id

        WHERE uu.user = '$user' and e.id = '$eventId'
        ORDER BY client, account, vehicle_name

        ";

		$result = $cn->execute();

		if($rs = $cn->getDataAssoc($result)){
			return $rs;
		}


        return [];
        $data = $cn->getDataAll($result);


        $s = [];
        foreach($data as $unitId => $v){
            if($v['trackId']){
                $s[] = $v['trackId'];
            }

        }

        $this->getUnitInput($data, $s);

        return $data;
    }


	private function loadDataEvent($lastId=0, $user=""){

        $cn = $this->cn;
        $cn->query = "SELECT e.id, e.event_id, e.user, e.status,
        vn.name, 1 as type, 'x' as cType, e.info,
        e.date_time, u.id as unitId,
        e.mode, e.title, dn.name as device_name, e.stamp,
        date_format(e.stamp, '%d/%m/%Y') as fdate,
        date_format(e.stamp, '%T') as ftime, t.speed, t.id as tracking_id,
        CONCAT(
            TIMESTAMPDIFF(DAY, TIMESTAMP(e.stamp), NOW()) ,'d ',
            MOD(TIMESTAMPDIFF(HOUR, TIMESTAMP(e.stamp), NOW()), 24), ':',
            MOD(TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.stamp), NOW()), 60), ':',
            MOD(TIMESTAMPDIFF(SECOND, TIMESTAMP(e.stamp), NOW()), 60),'' ) AS time
        FROM event as e
        LEFT JOIN unit as u ON u.id = e.unit_id
        LEFT JOIN device as de ON de.id = u.device_id
        LEFT JOIN device_name as dn ON dn.name = de.name
        LEFT JOIN unit_name as vn ON vn.id = u.name_id
        LEFT JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN tracking as t ON t.date_time = e.date_time AND t.unit_id = e.unit_id

        WHERE

        e.status != 2
        AND ('$lastId'= 0 or e.id > '$lastId')
        AND uu.user = '$user'

        ORDER BY 1 desc
        LIMIT $this->maxRecords
        ";



        $result = $this->cn->execute();
        //hx($cn->getDataAll($result));
        return $cn->getDataAll($result);

    }

	private function getLastEvents($mode){
		
		/*
		CONCAT(
            TIMESTAMPDIFF(DAY, TIMESTAMP(e.stamp), NOW()) ,'d ',
            MOD(TIMESTAMPDIFF(HOUR, TIMESTAMP(e.stamp), NOW()), 24), ':',
            MOD(TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.stamp), NOW()), 60), ':',
            MOD(TIMESTAMPDIFF(SECOND, TIMESTAMP(e.stamp), NOW()), 60),'' ) AS delay,
			 */
		$user = $this->getUser();

        $cn = $this->cn;

		$cn->query = "SELECT date_add(now(), INTERVAL - '$this->maxTime' MINUTE) as date_now;";
		$result = $this->cn->execute();
		$now = "0000-00-00 00:00:00";
		if($rs = $cn->getDataAssoc($result)){
            $now = $rs['date_now'];
        }

        //hx($cn->getDataAll($result));
       

        $cn->query = "SELECT * FROM (SELECT e.id, e.event_id, e.user, e.status,
        vn.name, 1 as type, 'x' as cType, e.info,
        e.date_time, u.id as unitId,
        e.mode, e.title, dn.name as device_name, e.stamp,

		

        date_format(e.stamp, '%d/%m/%Y') as fdate,
        date_format(e.stamp, '%T') as ftime, t.speed, t.id as tracking_id,
		#TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.stamp), attend) as attend,
		#TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.stamp), now()) as delay,
        CONCAT(

			LPAD(TIMESTAMPDIFF(HOUR, TIMESTAMP(e.stamp), NOW()),2,0), ':',
			LPAD(MOD(TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.stamp), NOW()), 60),2,0), ':',
			LPAD(MOD(TIMESTAMPDIFF(SECOND, TIMESTAMP(e.stamp), NOW()), 60),2,0),'' ) AS delay,
		CONCAT(

			LPAD(TIMESTAMPDIFF(HOUR, TIMESTAMP(e.attend), NOW()),2,0), ':',
			LPAD(MOD(TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.attend), NOW()), 60),2,0), ':',
			LPAD(MOD(TIMESTAMPDIFF(SECOND, TIMESTAMP(e.attend), NOW()), 60),2,0),'' ) AS attend


        FROM event as e
        LEFT JOIN unit as u ON u.id = e.unit_id
        LEFT JOIN device as de ON de.id = u.device_id
        LEFT JOIN device_name as dn ON dn.name = de.name
        LEFT JOIN unit_name as vn ON vn.id = u.name_id
        LEFT JOIN user_unit as uu ON uu.unit_id = u.id AND uu.user = '$user'
        LEFT JOIN tracking as t ON t.date_time = e.date_time AND t.unit_id = e.unit_id

        WHERE

        e.status != 2
        #AND TIMESTAMPDIFF(MINUTE, e.stamp, now()) < 5
		AND e.stamp > '$now'
        AND uu.user = '$user' 
		AND (e.mode & '$mode') = '$mode'
		

        ORDER BY 1 desc
        LIMIT $this->maxRecords) as e 
		ORDER BY e.id 
        ";
		

		//hx($cn->query);
        $result = $this->cn->execute();
        //hx($cn->getDataAll($result));
        return $cn->getDataAll($result);

    }

	private function getUnitEvents($unitId){
		$user = $this->getUser();
		$mode = 1;
		$maxTime = 10;//$this->maxTime / 2;
		/*
		CONCAT(
            TIMESTAMPDIFF(DAY, TIMESTAMP(e.stamp), NOW()) ,'d ',
            MOD(TIMESTAMPDIFF(HOUR, TIMESTAMP(e.stamp), NOW()), 24), ':',
            MOD(TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.stamp), NOW()), 60), ':',
            MOD(TIMESTAMPDIFF(SECOND, TIMESTAMP(e.stamp), NOW()), 60),'' ) AS delay,
			 */
		

        $cn = $this->cn;

		$cn->query = "SELECT date_add(now(), INTERVAL - '$maxTime' MINUTE) as date_now;";
		$result = $this->cn->execute();
		$now = "0000-00-00 00:00:00";
		if($rs = $cn->getDataAssoc($result)){
            $now = $rs['date_now'];
        }

        //hx($cn->getDataAll($result));
       

        $cn->query = "SELECT * FROM (SELECT e.id, e.event_id, e.user, e.status,
        vn.name, 1 as type, 'x' as cType, e.info,
        e.date_time, u.id as unitId,
        e.mode, e.title, dn.name as device_name, e.stamp,

		

        date_format(e.stamp, '%d/%m/%Y') as fdate,
        date_format(e.stamp, '%T') as ftime, t.speed, t.id as tracking_id,
		#TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.stamp), attend) as attend,
		#TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.stamp), now()) as delay,
        CONCAT(

			LPAD(TIMESTAMPDIFF(HOUR, TIMESTAMP(e.stamp), NOW()),2,0), ':',
			LPAD(MOD(TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.stamp), NOW()), 60),2,0), ':',
			LPAD(MOD(TIMESTAMPDIFF(SECOND, TIMESTAMP(e.stamp), NOW()), 60),2,0),'' ) AS delay,
		CONCAT(

			LPAD(TIMESTAMPDIFF(HOUR, TIMESTAMP(e.attend), NOW()),2,0), ':',
			LPAD(MOD(TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.attend), NOW()), 60),2,0), ':',
			LPAD(MOD(TIMESTAMPDIFF(SECOND, TIMESTAMP(e.attend), NOW()), 60),2,0),'' ) AS attend


        FROM event as e
        LEFT JOIN unit as u ON u.id = e.unit_id
        LEFT JOIN device as de ON de.id = u.device_id
        LEFT JOIN device_name as dn ON dn.name = de.name
        LEFT JOIN unit_name as vn ON vn.id = u.name_id
        LEFT JOIN user_unit as uu ON uu.unit_id = u.id AND uu.user = '$user'
        LEFT JOIN tracking as t ON t.date_time = e.date_time AND t.unit_id = e.unit_id

        WHERE

        e.status != 2
        #AND TIMESTAMPDIFF(MINUTE, e.stamp, now()) < 5
		AND e.unit_id = '$unitId'
		AND e.stamp > '$now'
        AND uu.user = '$user' 
		AND (e.mode & '$mode') = '$mode'
		

        ORDER BY 1 desc
        LIMIT $this->maxRecords) as e 
		ORDER BY e.id 
        ";
		

		//hx($cn->query);
        $result = $this->cn->execute();
        //hx($cn->getDataAll($result));
        return $cn->getDataAll($result);

    }


	private function setStatus($eventId, $status=0, $user=""){
		$user = $this->getUser();
        $cn = $this->cn;
        $cn->query = "UPDATE event 
			SET status='$status', `user`='$user', attend = IFNULL(attend, now())
			WHERE id='$eventId'";
        $this->cn->execute();
    }

    private function setStatusAll($firstId, $lastId, $mode, $status){
		$user = $this->getUser();
        $cn = $this->cn;
        $cn->query = "UPDATE event 
            SET status='$status', `user`='$user', attend = IFNULL(attend, now())

            WHERE id >= '$firstId' and id <= '$lastId' AND mode & '$mode' > 0;";
        $this->cn->execute();

		
    }
}