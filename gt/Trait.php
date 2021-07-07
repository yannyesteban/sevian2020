<?php
/*

set @k=19;

SELECT BIT_AND(((@k & POW(2, number)) DIV POW(2, number))=ai.mode) as _and,
BIT_OR(((@k & POW(2, number)) DIV POW(2, number))=ai.mode) as _or,
number,ai.input_id,ai.mode,
(@k & POW(2, number)) DIV POW(2, number) as v

FROM units as u
INNER JOIN alarm_unit as au ON au.unit_id=u.id

INNER JOIN unit_input ui ON ui.unit_id = u.id
INNER JOIN alarm_input as ai ON ai.alarm_id = au.alarm_id AND ai.input_id = ui.input_id


WHERE u.id = 2417

*/


namespace GT;


trait DBClient{

	private $cn = null;

	private function loadClients($user=""){
        $cn = $this->cn;

        $cn->query = "SELECT cl.id, cl.name as client

        FROM unit as u
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
        #INNER JOIN tracking as t ON t.id = u.tracking_id
        WHERE uu.user='$user'
		GROUP BY cl.name
		ORDER BY 2

        ";
		$result = $cn->execute();


        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[] = $rs;
        }


        return $data;
    }

}

trait DBAccount{

	private $cn = null;

	private function loadAccounts($user=""){
        $cn = $this->cn;

        $cn->query = "

        SELECT ac.id, ac.name as account, ac.client_id

        FROM unit as u
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN unit_name as vn ON vn.id = u.name_id

        LEFT JOIN account as ac ON ac.id = u.account_id
        #LEFT JOIN client as cl ON cl.id = ac.client_id
        #INNER JOIN tracking as t ON t.id = u.tracking_id

        WHERE uu.user = 'panda'
        GROUP BY ac.id
        ORDER BY account

        ";
		$result = $cn->execute();


        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[] = $rs;
        }


        return $data;
    }


}

trait DBUnit{
	private $cn = null;
    /**
     * load all units of a user
     *
     */
    public function loadUnits($user){
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
        ' -' as heading, ' -' as satellite, '- ' as speed
        #t.id as trackId,
        #t.longitude, t.latitude


        FROM unit as u
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
        #INNER JOIN tracking as t ON t.id = u.tracking_id
        LEFT JOIN tracking as t ON t.unit_id = u.id AND t.date_time = u.tracking_date #t.id = u.tracking_id
        WHERE uu.user = '$user'
        ORDER BY client, account, vehicle_name
        #LIMIT 10
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

    public function loadUnitInputs($user){
        $cn = $this->cn;
        $cn->query = "SELECT ui.unit_id as unitId, CONCAT(CASE type WHEN 1 THEN 'i' ELSE 'o' END, number) as input, input_id as inputId
            FROM unit_input as ui
            INNER JOIN user_unit as uu ON uu.unit_id = ui.unit_id
            WHERE user='$user'
            ORDER BY unitId, type, number";
        $data = [];
        $result = $cn->execute();
        while($rs = $cn->getDataAssoc($result)){
            $data[$rs["unitId"]][$rs["input"]] = $rs["inputId"];
        }
        return $data;
    }

    public function infoInput(){
        $cn = $this->cn;

        $cn->query = "

            SELECT id as inputId, type, name, value_on as valueOn, value_off as valueOff FROM input;
        ";
		$result = $cn->execute();


        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[$rs["inputId"]] = $rs;
        }
        return $data;



    }
	public function loadUnits2(){
        $cn = $this->cn;

        $cn->query = "SELECT
            u.id as unit_id,
            ac.client_id as client_id,
            cl.name as client,
            u.account_id,
            ac.name as account,
            u.device_id,
            de.name as device_name,
            u.vehicle_id,
            vn.name as vehicle_name,
            ic.icon, ve.plate, br.name as brand, mo.name as model, ve.color,
            t.id as trackId


            FROM unit as u
            LEFT JOIN unit_name as vn ON vn.id = u.name_id

            LEFT JOIN user_unit as uu ON uu.unit_id = u.id

            LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id

            LEFT JOIN vehicle_brand as br ON br.id = ve.brand_id
            LEFT JOIN vehicle_model as mo ON mo.id = ve.model_id

            INNER JOIN device as de ON de.id = u.device_id
            INNER JOIN device_name as dn ON dn.name = de.name


            LEFT JOIN icon as ic ON ic.id = u.icon_id

            LEFT JOIN account as ac ON ac.id = u.account_id
            LEFT JOIN client as cl ON cl.id = ac.client_id
            LEFT JOIN tracking as t ON t.id = u.tracking_id
            ORDER BY client, account, vehicle_name
            #LIMIT 10
        ";
		$result = $cn->execute();


        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[$rs['unit_id']] = $rs;
        }

        $s = [];
        foreach($data as $unitId => $v){
            if($v['trackId']){
                $s[] = $v['trackId'];
            }

        }

        $this->getUnitInput($data, $s);

        return $data;
    }

    public function infoUnit($unitId){
        $cn = $this->cn;

        $cn->query = "

        SELECT
            u.id as unit_id,
            ac.client_id as client_id,
            cl.name as client,
            u.account_id,
            ac.name as account,
            u.device_id,
            de.name as device_name,
            u.vehicle_id,
            vn.name as vehicle_name,
            ic.icon, ve.plate, br.name as brand, mo.name as model, ve.color, t.id as trackId


        FROM unit as u
        LEFT JOIN unit_name as vn ON vn.id = u.name_id

        LEFT JOIN user_unit as uu ON uu.unit_id = u.id

        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id

        LEFT JOIN vehicle_brand as br ON br.id = ve.brand_id
        LEFT JOIN vehicle_model as mo ON mo.id = ve.model_id

        INNER JOIN device as de ON de.id = u.device_id
        INNER JOIN device_name as dn ON dn.name = de.name


        LEFT JOIN icon as ic ON ic.id = u.icon_id

        LEFT JOIN account as ac ON ac.id = u.account_id
        LEFT JOIN client as cl ON cl.id = ac.client_id
        INNER JOIN tracking as t ON t.id = u.tracking_id
        WHERE u.id = '$unitId'
        ORDER BY u.id
        ";
		$result = $cn->execute();



		if($rs = $cn->getDataAssoc($result)){
            return $rs;
        }
        return false;



    }
    public function infoUnitInput($unitId){
        $cn = $this->cn;

        $cn->query = "SELECT
            u.unit_id,
            CASE u.type WHEN 1 THEN 'i' WHEN 2 THEN 'o' ELSE '-' END type,
            number, i.name,
            CASE m.mode WHEN 1 THEN m.name ELSE null END as mode_on,
            CASE m0.mode WHEN 0 THEN m0.name ELSE null END as mode_off

            FROM unit_input as u
            INNER JOIN input as i on i.id = u.input_id
            INNER JOIN input_mode as m on m.input_id = i.id and m.mode = 1
            INNER JOIN input_mode as m0 on m0.input_id = i.id and m0.mode = 0

            WHERE u.unit_id = '$unitId'
            ORDER BY u.type, number

        ";

		$result = $cn->execute();
        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[$rs['type']][$rs['number']] = [
                'input'=>$rs['name'],
                'on'=>$rs['mode_on'],
                'off'=>$rs['mode_off']
            ];
        }


        return $data;

		return $cn->getDataAll($result);

    }
    public function listUnit(){
        $cn = $this->cn;

        $cn->query = "
        SELECT
            u.id as unit_id,
            COALESCE(vn.name, '  -- undefined --') as vehicle_name

        FROM unit as u
        LEFT JOIN unit_name as vn ON vn.id = u.name_id
        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id

        ORDER BY vehicle_name
        ";
		$result = $cn->execute();


        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[$rs['unit_id']] = $rs;
        }


        return $data;
    }

    public function statusUnits($lastDate = '0000-00-00 00:00:00'){

        $cn = $this->cn;

        $cn->query = "SELECT u.id as unit_id, NOW() as last_date,
        CONCAT(
            TIMESTAMPDIFF(DAY, TIMESTAMP(u.conn_date), NOW()) ,'d ',
            MOD(TIMESTAMPDIFF(HOUR, TIMESTAMP(u.conn_date), NOW()), 24), ':',
            MOD(TIMESTAMPDIFF(MINUTE, TIMESTAMP(u.conn_date), NOW()), 60), ':',
            MOD(TIMESTAMPDIFF(SECOND, TIMESTAMP(u.conn_date), NOW()), 60),'' ) AS delay,

            vn.name as vehicle_name, de.name as device_name, CASE u.conn_status WHEN 1 THEN 'Conectado' ELSE '-' END as status, date_format(u.conn_date,'%d/%m/%Y') as date, date_format(u.conn_date,'%H:%m:%s') as time
        FROM unit as u
        LEFT JOIN unit_name as vn ON vn.id = u.name_id
        LEFT JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id
        INNER JOIN device as de ON de.id = u.device_id
        LEFT JOIN tracking as t ON t.unit_id = u.id AND u.tracking_date = t.date_time
        WHERE u.conn_date > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        AND u.conn_date > '$lastDate'
        AND u.conn_status = 1
        ORDER BY 2";
        //hx($cn->query);

        $result = $cn->execute();
        //    hr($cn->getDataAll($result));
        return $cn->getDataAll($result);
    }
    private function getConfigInput($unitId){
        $cn = $this->cn;

        $cn->query = "SELECT CASE i.type WHEN 1 THEN 'i' ELSE 'o' END as ctype, i.type,ui.number, i.id as input_id, i.name,ui.unit_id, value_on, value_off
        FROM unit_input as ui
        INNER JOIN input as i ON i.id = ui.input_id
        WHERE ui.unit_id = '$unitId'
        ORDER BY i.type, number";
        $result = $cn->execute();
		$data = $cn->getDataAll($result);
        $data2 = [];

        foreach($data as $k=>$v){
            $data2[$v['ctype'].$v['number']] = $v;
        }
        /*
        $f = array_map(fn($item)=>[
            'name'=>$item['itype'],
            'caption'=>$item['name'],
            'options'=>[
                $item['value_on'], $item['value_off']
            ]
        ], $data);
        */
        return $data2;

    }
    private function loadTracking4($unitId, $from = null, $to = null){
        /**
         * test:2020-07-01 09:20:34
         * 2020-07-01 12:09:50
         */
        $cn = $this->cn;

        $cn->query = "

        SELECT
            t.unit_id as unitId, t.device_id as deviceId, t.date_time,
            t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
            t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
            t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

            e.event_id as mainEvent,
            date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
            date_format(t.date_time, '%T') as uTime,
            date_format(t.date_time, '%d/%m/%Y') as uDate,
            UNIX_TIMESTAMP(t.date_time) as ts, e.title as myEvent, de.name as event,

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

        FROM tracking as t

        LEFT JOIN unit as u ON u.id = t.unit_id
        LEFT JOIN device as v ON v.id = u.device_id
        LEFT JOIN device_event de ON de.version_id = v.version_id AND de.event_id = t.event_id

        LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time

        WHERE t.unit_id = '$unitId' AND t.date_time>='$from' AND t.date_time<='$to'



        ";
        //#WHERE t.id >= 12699 ORDER BY t.id LIMIT 235
        //print_r( $cn->query);exit;
		$result = $cn->execute();
		$data = $cn->getDataAll($result);
        $data2 = $this->getConfigInput(2336);

        $data = array_map(function($item) use($data2){
            $item['iInputs'] = [];
            foreach($data2 as $k => $v){
                if(isset($item[$k]) && $item[$k]==1){
                    $item['in'.$v['input_id']] = "on";
                }else{
                    $item['in'.$v['input_id']] = "off";
                }

                $item['iInputs'][] = [
                    'name'=>$v['name'],
                    'value'=>(isset($item[$k]) && $item[$k]==1)? $v['value_on']: $v['value_off']
                ];
            }
            return $item;
        }, $data);

        //hx($f);
        //$fields = $cn->fieldsName($result);

        return $data;
    }
}

trait DBInput{
    private $cn = null;


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

    private function getDataInput($user, $tracking){
        $dataUnitInput = $this->loadConfigInput($user);

        $data = array_map(function($item) use($dataUnitInput){

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

    public function getInputs(){
        $cn = $this->cn;

        $cn->query = "SELECT";
    }
}

trait DBTracking{
	private $cn = null;

    private function lastTracking($user, &$lastDateTime){

        $cn = $this->cn;

        $cn->query = "SELECT
            t.unit_id as unitId, t.device_id as deviceId, t.date_time,
            t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
            t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
            t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

            e.event_id as mainEvent,
            date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
            date_format(t.date_time, '%T') as uTime,
            date_format(t.date_time, '%d/%m/%Y') as uDate,
            UNIX_TIMESTAMP(t.date_time) as ts, e.title as myEvent, de.name as event,

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

        FROM tracking as t

        INNER JOIN unit as u ON u.id = t.unit_id AND u.tracking_date = t.date_time
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN device as v ON v.id = u.device_id
        LEFT JOIN device_event de ON de.version_id = v.version_id AND de.event_id = t.event_id

        LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time

        WHERE uu.user='$user'
        ORDER BY t.date_time DESC
        ";



		$result = $cn->execute();
		$tracking = $cn->getDataAll($result);
        if(isset($tracking[0])){
            $lastDateTime = $tracking[0]['date_time'];
        }


        return $this->getDataInput($user, $tracking);


        $data2 = $this->getConfigInput(2336);

        $data = array_map(function($item) use($data2){
            $item['iInputs'] = [];
            foreach($data2 as $k => $v){
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
            }
            return $item;
        }, $data);

        //hx($f);
        //$fields = $cn->fieldsName($result);

        return $data;
    }

    private function updateTracking($user, &$lastDateTime){

        $cn = $this->cn;

        $cn->query = "SELECT t.id,
        UNIX_TIMESTAMP(now()) as ants,
            t.unit_id as unitId, t.device_id as deviceId, t.date_time,
            t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
            t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
            t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

            e.event_id as mainEvent,
            date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
            date_format(t.date_time, '%T') as uTime,
            date_format(t.date_time, '%d/%m/%Y') as uDate,

            UNIX_TIMESTAMP(now()) as ts,
            e.title as myEvent, de.name as event,

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

        FROM tracking as t

        INNER JOIN unit as u ON u.id = t.unit_id
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN device as v ON v.id = u.device_id
        LEFT JOIN device_event de ON de.version_id = v.version_id AND de.event_id = t.event_id

        LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time

        WHERE uu.user='$user' AND t.date_time > '$lastDateTime'
        ORDER BY t.date_time
        ";

        //hx($cn->query);

		$result = $cn->execute();
		$tracking = $cn->getDataAll($result);

        $len = count($tracking);
        if($len > 0){
            $lastDateTime = $tracking[$len - 1]['date_time'];
            //hx($lastDateTime);
        }

        return $this->getDataInput($user, $tracking);
    }


    private function loadTraceTracking($user, $unitId, &$infoResult){

        $cn = $this->cn;

        $cn->query = "SELECT
        UNIX_TIMESTAMP(now()) as ants,
        TIMESTAMPDIFF(HOUR, t.date_time, now()) as xx, t.id,
        t.unit_id as unitId, t.device_id as deviceId, t.date_time,
        t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
        t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
        t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

        e.event_id as mainEvent,
        date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
        date_format(t.date_time, '%T') as uTime,
        date_format(t.date_time, '%d/%m/%Y') as uDate,
        UNIX_TIMESTAMP(t.date_time) as ts, e.title as myEvent, de.name as event,

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

        FROM tracking as t

        INNER JOIN unit as u ON u.id = t.unit_id
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        INNER JOIN device as v ON v.id = u.device_id
        LEFT JOIN device_event de ON de.version_id = v.version_id AND de.event_id = t.event_id

        LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time
        WHERE uu.user='$user' AND t.unit_id = '$unitId'

        AND TIMESTAMPDIFF(second, t.date_time, now())  < 200

        order by t.id

        ";


        $result = $cn->execute();
		$tracking = $cn->getDataAll($result);

        $infoResult = $cn->infoResult($result);

        return $this->getDataInput($user, $tracking);




    }

    private function fullTracking($unitId, $from = null, $to = null){
        /**
         * test:2020-07-01 09:20:34
         * 2020-07-01 12:09:50
         */
        $cn = $this->cn;

        $cn->query = "

        SELECT
            t.unit_id as unitId, t.device_id as deviceId, t.date_time,
            t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
            t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
            t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

            e.event_id as mainEvent,
            date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
            date_format(t.date_time, '%T') as uTime,
            date_format(t.date_time, '%d/%m/%Y') as uDate,
            UNIX_TIMESTAMP(t.date_time) as ts, e.title as myEvent, de.name as event,

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

        FROM tracking as t

        LEFT JOIN unit as u ON u.id = t.unit_id
        LEFT JOIN device as v ON v.id = u.device_id
        LEFT JOIN device_event de ON de.version_id = v.version_id AND de.event_id = t.event_id

        LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time

        WHERE t.unit_id = '$unitId' AND t.date_time>='$from' AND t.date_time<='$to'



        ";
        //#WHERE t.id >= 12699 ORDER BY t.id LIMIT 235
        //print_r( $cn->query);exit;
		$result = $cn->execute();
		$data = $cn->getDataAll($result);
        $data2 = $this->getConfigInput(2336);

        $data = array_map(function($item) use($data2){
            $item['iInputs'] = [];
            foreach($data2 as $k => $v){
                if(isset($item[$k]) && $item[$k]==1){
                    $item['in'.$v['input_id']] = "on";
                }else{
                    $item['in'.$v['input_id']] = "off";
                }

                $item['iInputs'][] = [
                    'name'=>$v['name'],
                    'value'=>(isset($item[$k]) && $item[$k]==1)? $v['value_on']: $v['value_off']
                ];
            }
            return $item;
        }, $data);

        //hx($f);
        //$fields = $cn->fieldsName($result);

        return $data;
    }


    private function loadTracking2(){

        $cn = $this->cn;

        $cn->query = "SELECT u.id as unit_id, i.type, number as 'index', i.name,
            longitude, latitude, heading, speed, satellite,
            date_format(t.date_time, '%d/%m/%Y %T') as date_time,
            CASE i.type WHEN 1 THEN 'input' ELSE 'output' end ctype,
            CASE i.type
            WHEN 1 THEN CASE (input_status >> (number-1)) % 2 WHEN 1 THEN value_on ELSE value_off END
            WHEN 2 THEN CASE (output_status >> (number-1)) % 2 WHEN 1 THEN value_on ELSE value_off END END as value
            FROM unit as u

            INNER JOIN tracking as t ON u.id = t.unit_id AND u.tracking_date = t.date_time
            LEFT JOIN unit_input as ui ON ui.unit_id = u.id
            LEFT JOIN input as i ON i.id = ui.input_id

            ORDER BY u.id#, ui.type

        ";
		$result = $cn->execute();

        $data = [];
		while($rs = $cn->getDataAssoc($result)){

            if(!isset($data[$rs['unit_id']])){
                $data[$rs['unit_id']] = [
                    'unitId'=>$rs['unit_id'],
                    'latitude'=>$rs['latitude'],
                    'longitude'=>$rs['longitude'],
                    'date_time'=>$rs['date_time'],
                    'heading'=>$rs['heading'],
                    'speed'=>$rs['speed'],
                    'satellite'=>$rs['satellite']

                ];
            }
            $data[$rs['unit_id']][$rs['ctype']][] = [
                //'type'=>$rs['type'],
                'name'=>$rs['name'],
                'value'=>$rs['value'],
            ];
        }
        //hx($data);

        /*$s = [];
        foreach($data as $unitId => $v){
            $s[] = $v['id'];
        }

        $this->getUnitInput($data, $s);

        //hx(json_encode($data,JSON_PRETTY_PRINT));
        */
        return $data;
    }

	private function loadTracking(){

        $cn = $this->cn;

        $cn->query = "

        SELECT

        t.*, date_format(date_time, '%d/%m/%Y %T') as date_time

        FROM tracking as t
        INNER JOIN unit as u ON u.tracking_id = t.id
        ORDER BY unit_id
        limit 10

        ";
		$result = $cn->execute();

        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[$rs['unit_id']] = $rs;
        }
        //hr($data);
        $s = [];
        foreach($data as $unitId => $v){
            $s[] = $v['id'];
        }

        $this->getUnitInput($data, $s);

        //hx(json_encode($data,JSON_PRETTY_PRINT));
        return $data;
    }

    private function getInfoTracking($unitId, $dateTime = null){


        $cn = $this->cn;
		if($dateTime){
            $cn->query =
                "SELECT tk.unit_id, i.name as des, m.name, number, 'input' as type
                FROM tracking as tk
                INNER JOIN unit_input as ui on ui.unit_id = tk.unit_id and ui.type=1
                INNER JOIN input as i on i.id = ui.input_id
                INNER JOIN input_mode as m on m.input_id=i.id and (input_status & POW(2, number-1)) div POW(2, number-1) = m.mode
                WHERE tk.unit_id = '$unitId' and tk.date_time='$dateTime'

                UNION

                SELECT tk.unit_id, i.name as des, m.name, number, 'ouput' as type
                FROM tracking as tk
                INNER JOIN unit_input as ui on ui.unit_id = tk.unit_id and ui.type=2
                INNER JOIN input as i on i.id = ui.input_id
                INNER JOIN input_mode as m on m.input_id=i.id and (output_status & POW(2, number-1)) div POW(2, number-1) = m.mode
                WHERE tk.unit_id = '$unitId' and tk.date_time='$dateTime'
                ;";

        }else{
            $cn->query =
            "SELECT tk.unit_id, i.name as des, m.name, number, 'input' as type
            FROM unit as u
            #INNER JOIN tracking as tk ON tk.id = u.tracking_id
            INNER JOIN tracking as tk ON tk.unit_id = u.id and tk.date_time=u.tracking_date
            INNER JOIN unit_input as ui on ui.unit_id = tk.unit_id and ui.type=1
            INNER JOIN input as i on i.id = ui.input_id
            INNER JOIN input_mode as m on m.input_id=i.id and (input_status & POW(2, number-1)) div POW(2, number-1) = m.mode


            UNION

            SELECT tk.unit_id, i.name as des, m.name, number, 'ouput' as type
            FROM unit as u
            INNER JOIN tracking as tk ON tk.unit_id = u.id and tk.date_time=u.tracking_date
            INNER JOIN unit_input as ui on ui.unit_id = tk.unit_id and ui.type=2
            INNER JOIN input as i on i.id = ui.input_id
            INNER JOIN input_mode as m on m.input_id=i.id and (input_status & POW(2, number-1)) div POW(2, number-1) = m.mode

            ;";


            $cn->query = "SELECT u.id as unit_id, i.type, number as 'index', i.name,
            longitude, latitude,
            CASE i.type
            WHEN 1 THEN CASE (input_status >> (number-1)) % 2 WHEN 1 THEN value_on ELSE value_off END
            WHEN 2 THEN CASE (output_status >> (number-1)) % 2 WHEN 1 THEN value_on ELSE value_off END END as value
            FROM unit as u

            LEFT JOIN tracking as t ON u.id = t.unit_id AND u.tracking_date = t.date_time
            LEFT JOIN unit_input as ui ON ui.unit_id = u.id
            LEFT JOIN input as i ON i.id = ui.input_id
            ORDER BY u.id#, ui.type";
        }



        //hx($cn->query);
        $result = $cn->execute();

		while($rs = $cn->getDataAssoc($result)){
            //$data[$rs['unit_id']][$rs['type']][] = $rs;
            $data[$rs['unit_id']][$rs['type']][$rs['name']] = $rs['value'];
        }
        hx($data);
        return $data;

    }

    private function getUnitInput(&$data, $trackIds){
        if(!$trackIds){
            return;

        }

        $ids = implode(',', $trackIds);
        //hx($ids);
        $cn = $this->cn;

        $cn->query =
        "SELECT tk.unit_id, i.name as des, m.name, number, 'input' as type

        FROM tracking as tk
        INNER JOIN unit_input as u on u.unit_id = tk.unit_id and u.type=1
        INNER JOIN input as i on i.id = u.input_id
        INNER JOIN input_mode as m on m.input_id=i.id and (input_status & POW(2, number-1)) div POW(2, number-1) = m.mode
        WHERE tk.id IN ($ids)

        UNION

        SELECT tk.unit_id, i.name as des, m.name, number, 'input' as type

        FROM tracking as tk
        INNER JOIN unit_input as u on u.unit_id = tk.unit_id and u.type=2
        INNER JOIN input as i on i.id = u.input_id
        INNER JOIN input_mode as m on m.input_id=i.id and (input_status & POW(2, number-1)) div POW(2, number-1) = m.mode
        WHERE tk.id IN ($ids)
        ;";

        $cn->query =
        "SELECT tk.unit_id, i.name as des, m.name, number, 'input' as type
        FROM unit as u
        #INNER JOIN tracking as tk ON tk.id = u.tracking_id
        INNER JOIN tracking as tk ON tk.unit_id = u.id and tk.date_time=u.tracking_date
        INNER JOIN unit_input as ui on ui.unit_id = tk.unit_id and ui.type=1
        INNER JOIN input as i on i.id = ui.input_id
        INNER JOIN input_mode as m on m.input_id=i.id and (input_status & POW(2, number-1)) div POW(2, number-1) = m.mode


        UNION

        SELECT tk.unit_id, i.name as des, m.name, number, 'ouput' as type
        FROM unit as u
        INNER JOIN tracking as tk ON tk.unit_id = u.id and tk.date_time=u.tracking_date
        INNER JOIN unit_input as ui on ui.unit_id = tk.unit_id and ui.type=2
        INNER JOIN input as i on i.id = ui.input_id
        INNER JOIN input_mode as m on m.input_id=i.id and (input_status & POW(2, number-1)) div POW(2, number-1) = m.mode

        ;";

        //hx($cn->query);
        $result = $cn->execute();

		while($rs = $cn->getDataAssoc($result)){
            //$data[$rs['unit_id']][$rs['type']][] = $rs;
            $data[$rs['unit_id']][$rs['type']][$rs['des']] = $rs['name'];
        }
        return $data;

    }
    private function updateTrackingNO(){
        $cn = $this->cn;

        $cn->query = "

        SELECT

        t.*, date_format(date_time, '%d/%m/%Y %T') as date_time

        FROM tracking as t
        INNER JOIN unit as u ON u.tracking_id = t.id
        ORDER BY unit_id

        ";
		//$result = $cn->execute();
		$this->cn->execute();
		return $this->cn->getDataAll();
        $data = [];
		while($rs = $cn->getDataAll($result)){
            $data[$rs['unit_id']] = $rs;
        }


        return $data;
    }
}

trait DBSite{
    private $cn = null;

    private function loadSite($id, $user){

        $cn = $this->cn;

        $cn->query = "SELECT m.id, m.name, m.description, m.longitude, m.latitude, image, COALESCE(scale, 1.0) as scale, m.geojson, m.address, phone1,
            phone2, phone3, fax, email, web, note, scope, m.id as siteId

            FROM mark as m

            WHERE m.user = '$user' and m.id = '$id'
            ";

        $result = $this->cn->execute();
        return $cn->getDataAssoc($result);
    }

    private function listSites($user=""){

        $cn = $this->cn;
        $cn->query = "SELECT id, name
            FROM mark as m
            WHERE user = '$user'
            ";

        $result = $this->cn->execute();
        return $this->cn->getDataAll();
    }

    private function test(){

        $cn = $this->cn;


        $cn->query = "SELECT *
            FROM geofences WHERE type='polygon'";

        $result = $cn->execute();

        while($rs = $cn->getDataAssoc($result)){
            //lat lng
            $coord = $rs['coords'];
            $id = $rs['id'];
            $points = explode(',', $rs['coords']);

            $points[] = $points[0];
            $coord .= ','.$points[0];
            hr($coord);


            $cn->query = "UPDATE geofences SET coords='$coord'  WHERE id='$id' and type='polygon'";
            $cn->execute();


        }


        return [];
    }
    private function loadSites($user=""){

        $cn = $this->cn;

        $cn->query = "SELECT m.*, c.name as category
            FROM mark as m
            INNER JOIN mark_category as c ON c.id = m.category_id
            #INNER JOIN icon as i ON i.id = m.icon_id
            WHERE m.user = '$user'";

        $result = $cn->execute();

        $data = [];
        while($rs = $cn->getDataAssoc($result)){
            $data[$rs['id']] = $rs;
        }


        return $data;
    }
    private function loadRecord($id){

        $cn = $this->cn;

        $id = $cn->addSlashes($id);
        $cn->query = "SELECT m.*,
                c.name as category
            FROM mark as m
            INNER JOIN mark_category as c ON c.id = m.category_id

            WHERE m.id = '$id'";

        $result = $cn->execute();

        if($rs = $cn->getDataAssoc($result)){
            return $rs;
        }


        return [];
    }
    private function listCategorys($user=""){

        $cn = $this->cn;

        $cn->query = "SELECT c.id, c.name
            FROM mark_category as c
            WHERE c.user = '$user'
            ORDER BY 2";

        $result = $cn->execute();
        return $this->cn->getDataAll();
    }
    private function loadCategorys($user=""){

        $cn = $this->cn;

        $cn->query = "SELECT c.id, c.name as category
            FROM mark_category as c
            #INNER JOIN mark as m as c ON c.id = m.category_id

            WHERE c.user = '$user'
            GROUP BY c.id ORDER BY 2";

        $result = $cn->execute();
        return $this->cn->getDataAll();
    }
}

trait DBGeofence{
    private $cn = null;

    private function loadGeofences($user=""){

        $cn = $this->cn;

        /*
        $cn->query = "select * from geofences";

        $result = $cn->execute();


        $value = [];
        while($rs = $cn->getDataAssoc($result)){
            $coord = explode(",",$rs['coords']);
            $str = [];
            foreach($coord as $c){
                $aux = explode(" ",$c);
                $str[] = [$aux[1]*1,$aux[0]*1];
            }
            $value[$rs['id']] = $str;
        }

        foreach($value as $k => $v){

            $v = json_encode($v);

            $cn->query = "update geofences set

            config = '$v'

            where id=$k and type='circle'";

            $result = $cn->execute();

        }

        */
        $cn->query = "SELECT g.id, g.name, g.description, g.geojson
            FROM geofence as g
            #WHERE type='polygon'
            #WHERE g.user = 'Rmartinez'
            ";

        $result = $this->cn->execute();
        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $rs['geojson'] = json_decode($rs['geojson']);
            $data[$rs['id']] = $rs;
        }


        return $data;
    }

    private function listGeofences($user=""){

        $cn = $this->cn;
        $cn->query = "SELECT id, name

            FROM geofence as g


            ";

        $result = $this->cn->execute();
        $data = [];

        return $this->cn->getDataAll();
    }

    private function loadRecord($id){

        $cn = $this->cn;

        $id = $cn->addSlashes($id);
        $cn->query = "SELECT g.*, g.id as geofenceId
            FROM geofence as g


            WHERE g.id = '$id'";

        $result = $cn->execute();

        if($rs = $cn->getDataAssoc($result)){
            return $rs;
        }


        return [];
    }


}

trait DBAlarm{
    private $cn = null;

    private function loadAlarm($id, $user=""){

        $cn = $this->cn;

        $cn->query = "SELECT a.*
        FROM alarm as a
        WHERE a.user = '$user' and a.id = '$id'";

        $result = $this->cn->execute();

        if($rs = $cn->getDataAssoc($result)){
            return $rs;
        }
        return null;
    }

    private function listAlarms($user=""){

        $cn = $this->cn;

        $cn->query = "SELECT a.*
        FROM alarm as a
        WHERE a.user = '$user'";

        $result = $this->cn->execute();


        return $this->cn->getDataAll();
    }

    private function listGeofences($id=0, $user=""){

        $cn = $this->cn;
        $cn->query = "SELECT g.id, g.name, a.mode
            FROM geofence as g
            LEFT JOIN alarm_geofence as a ON a.geofence_id = g.id and a.alarm_id = '$id'
            WHERE g.user = '$user'
            ";

        $result = $this->cn->execute();


        return $this->cn->getDataAll();
    }
    private function listMarks($id=0, $user=""){

        $cn = $this->cn;
        $cn->query = "SELECT m.id, m.name, radius, COALESCE(mode, 0) as mode
        FROM mark as m
        LEFT JOIN alarm_mark as a ON a.mark_id = m.id and a.alarm_id = '$id'
        WHERE abs(longitude) < 90 and abs(latitude) < 90
        AND m.user = '$user'
            ";

        $result = $this->cn->execute();


        return $this->cn->getDataAll();
    }

    private function listInputs($id=0, $user=""){

        $cn = $this->cn;
        $cn->query = "SELECT id, name, value_on, value_off, type, CASE WHEN mode IS NULL then 2 ELSE mode END as mode
        FROM input as i
        LEFT JOIN alarm_input as a ON a.input_id = i.id and a.alarm_id = '$id'
            ";

        $result = $this->cn->execute();


        return $this->cn->getDataAll();
    }

    private function listUnits($id=0, $user=""){

        $cn = $this->cn;
        $cn->query = "SELECT u.id, COALESCE(n.name, u.name) as name, case WHEN a.unit_id IS NOT NULL THEN 1 ELSE 0 END as mode
        FROM unit as u

        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN unit_name as n ON n.id = u.name_id
        LEFT JOIN alarm_unit as a ON a.unit_id = u.id and a.alarm_id = '$id'

        AND uu.user = '$user'
        ";

        $result = $this->cn->execute();


        return $this->cn->getDataAll();
    }

    private function deleteConfig($id){

        $cn = $this->cn;

        $cn->query = "DELETE FROM alarm_geofence WHERE alarm_id = '$id'";
        $cn->execute();

        $cn->query = "DELETE FROM alarm_input WHERE alarm_id = '$id'";
        $cn->execute();

        $cn->query = "DELETE FROM alarm_mark WHERE alarm_id = '$id'";
        $cn->execute();

        $cn->query = "DELETE FROM alarm_unit WHERE alarm_id = '$id'";
        $cn->execute();

    }


}

trait DBImage{
    private $cn = null;
    private function load(){

        $path = PATH_IMAGES.'marks/';
        $cn = $this->cn;
        $cn->query = "SELECT name, CONCAT('$path', image) as src FROM image";

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


}


trait DBHistory{
	private $cn = null;


	public function __loadUnits(){
        $cn = $this->cn;

        $cn->query = "SELECT
            u.id as unit_id,
            ac.client_id as client_id,
            cl.name as client,
            u.account_id,
            ac.name as account,
            u.device_id,
            de.name as device_name,
            u.vehicle_id,
            vn.name as vehicle_name,
            ic.icon, ve.plate, br.name as brand, mo.name as model, ve.color, t.id as trackId


            FROM unit as u
            LEFT JOIN unit_name as vn ON vn.id = u.name_id

            LEFT JOIN user_unit as uu ON uu.unit_id = u.id

            LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id

            LEFT JOIN vehicle_brand as br ON br.id = ve.brand_id
            LEFT JOIN vehicle_model as mo ON mo.id = ve.model_id

            INNER JOIN device as de ON de.id = u.device_id
            INNER JOIN device_name as dn ON dn.name = de.name


            LEFT JOIN icon as ic ON ic.id = u.icon_id

            LEFT JOIN account as ac ON ac.id = u.account_id
            LEFT JOIN client as cl ON cl.id = ac.client_id
            INNER JOIN tracking as t ON t.id = u.tracking_id
            ORDER BY u.id";
		$result = $cn->execute();


        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[$rs['unit_id']] = $rs;
        }

        $s = [];
        foreach($data as $unitId => $v){
            $s[] = $v['trackId'];
        }

        $this->getUnitInput($data, $s);

        return $data;
    }

    public function __listUnit(){
        $cn = $this->cn;

        $cn->query = "
        SELECT
            u.id as unit_id,
            COALESCE(vn.name, '  -- undefined --') as vehicle_name

        FROM units as u
        LEFT JOIN units_names as vn ON vn.id = u.name_id
        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id

        ORDER BY vehicle_name
        ";
		$result = $cn->execute();


        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[$rs['unit_id']] = $rs;
        }


        return $data;
    }

    private function loadTracking($unitId, $from = null, $to = null){
        /**
         * test:2020-07-01 09:20:34
         * 2020-07-01 12:09:50
         */
        $cn = $this->cn;

        $cn->query = "

        SELECT
            t.unit_id as unitId, t.device_id as deviceId, t.date_time,
            t.longitude, t.latitude, t.speed, t.heading, t.altitude, t.satellite,
            t.event_id as eventId, t.mileage, t.input_status as inputStatus, t.voltage_level_i1 as voltageI1, t.voltage_level_i2 as voltageI2,
            t.output_status as outputStatus, t.battery_voltage as batteryVoltage,

            e.event_id as mainEvent,
            date_format(t.date_time, '%d/%m/%Y %T') as dateTime,
            date_format(t.date_time, '%T') as uTime,
            date_format(t.date_time, '%d/%m/%Y') as uDate,
            UNIX_TIMESTAMP(t.date_time) as ts, e.title as myEvent, de.name as event,

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

        FROM tracking as t

        LEFT JOIN unit as u ON u.id = t.unit_id
        LEFT JOIN device as v ON v.id = u.device_id
        LEFT JOIN device_event de ON de.version_id = v.version_id AND de.event_id = t.event_id

        LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time

        WHERE t.unit_id = '$unitId' AND t.date_time>='$from' AND t.date_time<='$to'



        ";
        //#WHERE t.id >= 12699 ORDER BY t.id LIMIT 235
        //print_r( $cn->query);exit;
		$result = $cn->execute();
		$data = $cn->getDataAll($result);
        $data2 = $this->getConfigInput(2336);

        $data = array_map(function($item) use($data2){
            $item['iInputs'] = [];
            foreach($data2 as $k => $v){
                if(isset($item[$k]) && $item[$k]==1){
                    $item['in'.$v['input_id']] = "on";
                }else{
                    $item['in'.$v['input_id']] = "off";
                }

                $item['iInputs'][] = [
                    'name'=>$v['name'],
                    'value'=>(isset($item[$k]) && $item[$k]==1)? $v['value_on']: $v['value_off']
                ];
            }
            return $item;
        }, $data);

        //hx($f);
        //$fields = $cn->fieldsName($result);

        return $data;
    }

    private function getInputLayers($unitId, $dateFrom = null, $dateTo = null, $input = null){

        $cn = $this->cn;

        $cn->query = "

        SELECT DISTINCT u.number, CONCAT(i.name, ' ', i.value_on) as layer

        #,t.id,t.input_status,t.input_status & u.number,u.*, i.name, i.value_on,t.input_status

        FROM tracking as t
        INNER JOIN unit_input as u ON u.unit_id = t.unit_id AND t.input_status & u.number AND u.type = 1
        INNER JOIN input as i ON i.id = u.input_id


        #WHERE t.id=1
        WHERE
        t.unit_id=17
        #t.input_status & 100
        #ORDER BY t.id
        LIMIT 1000



        ";

		$result = $cn->execute();
		$data = $cn->getDataAll($result);

        return $data;
    }

    private function getOutputLayers($unitId, $dateFrom = null, $dateTo = null, $input = null){

        $cn = $this->cn;

        $cn->query = "

        SELECT u.number, CONCAT(i.name, ' ', i.value_on) as layer

        #,t.id,t.input_status,t.input_status & u.number,u.*, i.name, i.value_on,t.output_status

        FROM tracking as t
        INNER JOIN unit_input as u ON u.unit_id = t.unit_id AND t.output_status & u.number AND u.type = 2
        INNER JOIN input as i ON i.id = u.input_id


        WHERE t.unit_id = 27
        #WHERE
        #t.unit_id=17
        #t.input_status & 100
        #ORDER BY t.id
        LIMIT 1000



        ";

		$result = $cn->execute();
		$data = $cn->getDataAll($result);

        return $data;
    }

    private function getEventLayers($unitId, $dateFrom = null, $dateTo = null, $input = null){

        $cn = $this->cn;

        $cn->query = "

        SELECT e.event_id, e.name
        FROM tracking as t
        INNER JOIN unit as u ON u.id = t.unit_id
        INNER JOIN device as v ON v.id = u.device_id
        INNER JOIN device_event e ON e.version_id = v.version_id AND e.event_id = t.event_id
        WHERE
        t.unit_id=2002
        AND t.date_time >='2001-07-12 17:41:00'
        GROUP BY t.event_id




        ";

		$result = $cn->execute();
		$data = $cn->getDataAll($result);

        return $data;
    }

    private function getAlarmLayers($unitId, $dateFrom = null, $dateTo = null, $input = null){

        $cn = $this->cn;

        $cn->query = "

        SELECT DISTINCT e.event_id, title as name, CASE e.event_id WHEN 205 THEN 5 WHEN 206 THEN 6 ELSE 5 END 'group'

        FROM tracking as t
        INNER JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time
        #WHERE e.event_id = 205 OR e.event_id = 206
        ;";

		$result = $cn->execute();
		$data = $cn->getDataAll($result);

        return $data;
    }

    private function getInputName($unitId){
        $cn = $this->cn;

        $cn->query = "SELECT CASE i.type WHEN 1 THEN 'i' ELSE 'o' END as ctype, i.type, i.id as input_id, i.name, value_on, value_off

        FROM input as i

        ORDER BY i.type, name";
        $result = $cn->execute();
		$data = $cn->getDataAll($result);
        $f = array_map(fn($item)=>[
            'name'=>'in'.$item['input_id'],
            'caption'=>$item['ctype'].'-'.$item['name'],
            'options'=>[
                $item['value_on'], $item['value_off']
            ]
        ], $data);

        return $f;

    }

    private function getConfigInput($unitId){
        $cn = $this->cn;

        $cn->query = "SELECT CASE i.type WHEN 1 THEN 'i' ELSE 'o' END as ctype, i.type,ui.number, i.id as input_id, i.name,ui.unit_id, value_on, value_off
        FROM unit_input as ui
        INNER JOIN input as i ON i.id = ui.input_id
        WHERE ui.unit_id = '$unitId'
        ORDER BY i.type, number";
        $result = $cn->execute();
		$data = $cn->getDataAll($result);
        $data2 = [];

        foreach($data as $k=>$v){
            $data2[$v['ctype'].$v['number']] = $v;
        }
        /*
        $f = array_map(fn($item)=>[
            'name'=>$item['itype'],
            'caption'=>$item['name'],
            'options'=>[
                $item['value_on'], $item['value_off']
            ]
        ], $data);
        */
        return $data2;

    }

    private function updateConfig($user, $config){
        $cn = $this->cn;
		$config = json_encode($config, JSON_PRETTY_PRINT);
        //hx($user);
        $cn->query = "UPDATE user_config SET layer = '$config'
            WHERE user = '$user'";

        $cn->execute();


    }

}


trait DBEvent{
    private $cn = null;

    private function loadDataEvent($lastId=0){

        $cn = $this->cn;
        $cn->query = "SELECT e.id, e.event_id, e.user, e.status,
        vn.name, 1 as type, 'x' as cType, e.info,
        t.id as track_id, e.date_time, u.id as unitId,
        e.mode, e.title,

        dn.name as device_name,


                CONCAT(
                    TIMESTAMPDIFF(DAY, TIMESTAMP(e.date_time), NOW()) ,'d ',
                    MOD(TIMESTAMPDIFF(HOUR, TIMESTAMP(e.date_time), NOW()), 24), ':',
                    MOD(TIMESTAMPDIFF(MINUTE, TIMESTAMP(e.date_time), NOW()), 60), ':',
                    MOD(TIMESTAMPDIFF(SECOND, TIMESTAMP(e.date_time), NOW()), 60),'' ) AS time
        FROM event as e
        LEFT JOIN unit as u ON u.id = e.unit_id
        LEFT JOIN device as de ON de.id = u.device_id
        LEFT JOIN device_name as dn ON dn.name = de.name
        LEFT JOIN unit_name as vn ON vn.id = u.name_id
        LEFT JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN tracking as t ON t.unit_id = u.id AND t.date_time = e.date_time
        WHERE

        e.status != 2
        AND ('$lastId'= 0 or e.id > '$lastId')
        ORDER BY 1
        #ORDER BY 1 desc
        #LIMIT 5
        ";

        //hx($cn->query);

        $result = $this->cn->execute();
        //hx($cn->getDataAll($result));
        return $cn->getDataAll($result);

    }

    private function setStatus($eventId, $status=0, $user=""){
        $cn = $this->cn;
        $cn->query = "UPDATE event SET status='$status', `user`='$user' WHERE id='$eventId'";
        $this->cn->execute();
    }
    private function setStatusAll($eventId, $status=0, $user="", $mode=""){
        $cn = $this->cn;
        $cn->query = "UPDATE event SET status='$status', `user`='$user' WHERE id<='$eventId' AND mode & '$mode'>0";
        $this->cn->execute();
    }

}

trait DBConfig{
    private $cn = null;
    private function loadUserConfig($user){

        $cn = $this->cn;
        $cn->query = "SELECT * FROM user_config WHERE user='$user'";

        $result = $this->cn->execute();
        $json = null;
		if($rs = $cn->getDataAssoc($result)){
            $json = json_decode($rs['layer']);


        }


        return $json;
    }


}