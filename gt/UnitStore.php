<?php

namespace GT;


class UnitStore extends \Sevian\Element implements \Sevian\UserInfo{

	public $jsClassName = '';
	private $updateDelay = 10;

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

			case 'get-unit-data':
				$this->addResponse([
					'type'=>'',
					'id'=>$this->id,
					'data'=>[
						'unitData'	=> $this->getUnitData($this->getUser(), $this->eparams->unitId?? 0),
						
						
					],
					'iToken'=>$this->iToken
				]);	
				break;
			case 'tracking':
				$time = $this->eparams->lastTime;

				$this->addResponse([
					'type'=>'',
					'id'=>$this->id,
					'data'=>[
						'lastTime'	=> $this->getTime(),
						'tracking'	=> $this->updateTracking($this->getUser(), $time)
						
						
					],
					'iToken'=>$this->iToken
				]);	

				break;				
		}

		return true;
	}

	public function load(){

		$user = $this->getUser();
		
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'Store',
			'iClass'	=> 'GTUnitStore',
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                'caption'=>'Store',
				'lastTime'		=> $this->getTime(),
				'delay'			=> $this->updateDelay,
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

	public function getUnitData($user, $unitId){

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
        CONCAT('$path', ic.icon, '.png') as image, ve.plate, br.name as brand, mo.name as model, ve.color,
        u.conn_status as connected,

		t.id as trackId,
        t.date_time,
            t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
            t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
            t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

            e.event_id as mainEvent,
            date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
            date_format(t.date_time, '%T') as uTime,
            date_format(t.date_time, '%d/%m/%Y') as uDate,

            UNIX_TIMESTAMP(now()) as ts,
            IFNULL(e.title,'') as myEvent,
            de.name as event,m.name as device_model, v.version,IFNULL(v.name, '') as protocol, 0 as active


        FROM unit as u
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN unit_name as vn ON vn.id = u.name_id

        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id

        LEFT JOIN vehicle_brand as br ON br.id = ve.brand_id
        LEFT JOIN vehicle_model as mo ON mo.id = ve.model_id

        LEFT JOIN device as de ON de.id = u.device_id
        LEFT JOIN device_version as v on v.id = de.version_id
        LEFT JOIN device_model as m ON m.id = v.id_model
        LEFT JOIN device_name as dn ON dn.name = de.name


        LEFT JOIN icon as ic ON ic.id = u.icon_id

        LEFT JOIN account as ac ON ac.id = u.account_id
        LEFT JOIN client as cl ON cl.id = ac.client_id

        LEFT JOIN tracking as t ON t.unit_id = u.id AND t.date_time = u.tracking_date
      	LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time
        WHERE uu.user = '$user' and u.id = '$unitId'
        ORDER BY client, account, vehicle_name

        ";
		
		$result = $cn->execute();
		$data = $cn->getJson($result);

        //hx($data);
		if($data->trackId??false){
			$io = $this->evalInput($user, $unitId, $data->inputStatus, $data->outputStatus);
			$data->inputs = $io['inputs'] ?? [];
			$data->outputs = $io['outputs'] ?? [];
		}
		
		//hx($cn->query);
        //print_r(json_decode(json_encode($data)));
        return json_decode(json_encode($data, JSON_NUMERIC_CHECK));
        
    }

	private function evalInput($user, $unitId, $input, $output){
		
        $cn = $this->cn;

        $cn->query = "SELECT ui.unit_id as unitId,

		ui.type,

		'i' as ctype, number, ui.input_id as inputId, i.name,
		($input >> (number - 1 ))%2 as `on`,
		CASE ($input >> (number - 1 ))%2 WHEN 1 THEN value_on ELSE value_off END as value
				FROM unit_input as ui
				INNER JOIN input as i ON i.id = ui.input_id
				INNER JOIN user_unit as uu ON uu.unit_id = ui.unit_id
				WHERE uu.user = '$user' AND ui.unit_id = '$unitId' AND ui.type = 1

		union

		SELECT ui.unit_id as unitId,

		ui.type,

		'o' as ctype, number, ui.input_id as inputId, i.name,
		($output >> (number - 1 ))%2 as `on`,
		CASE ($output >> (number - 1 ))%2 WHEN 1 THEN value_on ELSE value_off END as value
				FROM unit_input as ui
				INNER JOIN input as i ON i.id = ui.input_id
				INNER JOIN user_unit as uu ON uu.unit_id = ui.unit_id
				WHERE uu.user = '$user' AND ui.unit_id = '$unitId' AND ui.type = 2

			ORDER BY unitId, type, number

		";

        $result = $cn->execute();
		$data = $cn->getDataAll($result);
		$inputs = [];
		$outputs = [];

		if(is_array($data)){

			$inputs = array_filter( $data, function( $v ) {
				return $v['type'] == 1;
			});

			$outputs = array_filter( $data, function( $v ) {
				return $v['type'] == 2;
			});
		}

		return [
			'inputs' => array_values($inputs),
			'outputs' => array_values($outputs),
		];



    }

	private function updateTracking($user, $time){

        $cn = $this->cn;

        $cn->query = "SELECT u.id as unitId, u.conn_status as connected, t.id as tracking_id,
        	UNIX_TIMESTAMP(now()) as ants, now() as time_now,
			u.conn_status  as connected,
        	CASE u.conn_status WHEN 1 THEN 'Conectado' ELSE '-' END as str_status,
             t.device_id as deviceId, t.date_time,
            t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
            t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
            t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

            e.event_id as mainEvent,
            date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
            date_format(t.date_time, '%T') as uTime,
            date_format(t.date_time, '%d/%m/%Y') as uDate,

            UNIX_TIMESTAMP(now()) as ts,
            IFNULL(e.title,'') as myEvent, de.name as event,

         (input_status >> (1-1)) % 2 as i1,
         (input_status >> (2-1)) % 2 as i2,
         (input_status >> (3-1)) % 2 as i3,
         (input_status >> (4-1)) % 2 as i4,
         (input_status >> (5-1)) % 2 as i5,
         (input_status >> (6-1)) % 2 as i6,
         (input_status >> (7-1)) % 2 as i7,
         (input_status >> (8-1)) % 2 as i8,

         (output_status >> (1-1)) % 2 as o1,
         (output_status >> (2-1)) % 2 as o2,
         (output_status >> (3-1)) % 2 as o3,
         (output_status >> (4-1)) % 2 as o4,
         (output_status >> (5-1)) % 2 as o5,
         (output_status >> (6-1)) % 2 as o6,
         (output_status >> (7-1)) % 2 as o7,
         (output_status >> (8-1)) % 2 as o8

        FROM unit as u
        INNER JOIN user_unit as uu ON uu.unit_id = u.id


        INNER JOIN tracking as t ON u.id = t.unit_id AND t.date_time = u.tracking_date

        LEFT JOIN device as v ON v.id = u.device_id
        LEFT JOIN device_event de ON de.version_id = v.version_id AND de.event_id = t.event_id

        LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time

        WHERE  uu.user='$user' and u.time > '$time'

        ORDER BY t.date_time
        ";



		$result = $cn->execute();
		$tracking = $cn->getDataAll($result);
       
		
        return $this->getDataInput($user, $tracking);
    }

	private function getDataInput($user, $tracking){
        $dataUnitInput = $this->loadConfigInput($user);
        if(count($dataUnitInput ) <= 0){
            return $tracking;
        }

        $data = array_map(function($item) use($dataUnitInput){

            if(!isset($item['unitId']) or !isset($dataUnitInput[$item['unitId']])){
                return $item;
            }
            $dataInput = $dataUnitInput[$item['unitId']];

            $item['iInputs'] = [];
            $item['inputs'] = [];
            $item['outputs'] = [];
            foreach($dataInput as $k => $v){
                if(isset($item[$k]) && $item[$k]==1){
                    $item['in'.$v['input_id']] = "on";
                }else{
                    $item['in'.$v['input_id']] = "off";
                }

                $item['iInputs'][] = [
                    'id'=>$v['input_id'],
                    'on'=>(isset($item[$k]) && $item[$k]==1),
                    'name'=>$v['name'],
                    'value'=>(isset($item[$k]) && $item[$k]==1)? $v['value_on']: $v['value_off'],
                    'type'=>$v['ctype']
                ];
                if($v['ctype'] == 'i'){
                    $item['inputs'][] = [
                        'id'=>$v['input_id'],
                        'on'=>(isset($item[$k]) && $item[$k]==1),
                        'name'=>$v['name'],
                        'value'=>(isset($item[$k]) && $item[$k]==1)? $v['value_on']: $v['value_off'],
                        'type'=>$v['ctype']
                    ];
                }
                if($v['ctype'] == 'o'){
                    $item['outputs'][] = [
                        'id'=>$v['input_id'],
                        'on'=>(isset($item[$k]) && $item[$k]==1),
                        'name'=>$v['name'],
                        'value'=>(isset($item[$k]) && $item[$k]==1)? $v['value_on']: $v['value_off'],
                        'type'=>$v['ctype']
                    ];
                }

            }
            return $item;
        }, $tracking);

        return $data;
    }

	private function loadConfigInput($user){
        $cn = $this->cn;

        $cn->query = "SELECT CASE i.type WHEN 1 THEN 'i' ELSE 'o' END as ctype, i.type,ui.number, i.id as input_id, i.name,ui.unit_id, value_on, value_off
        FROM unit_input as ui
        INNER JOIN input as i ON i.id = ui.input_id
        INNER JOIN user_unit as uu ON uu.unit_id = ui.unit_id
        WHERE uu.user = '$user'
        ORDER BY i.type, number";
        $result = $cn->execute();
		$data = $cn->getDataAll($result);
        $dataInput = [];

        foreach($data as $k => $v){
            $dataInput[$v['unit_id']][$v['ctype'].$v['number']] = $v;
        }

        return $dataInput;

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