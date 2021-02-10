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

	private function loadClients(){
        $cn = $this->cn;
		
        $cn->query = "SELECT cl.id, cl.name as client

        FROM unit as u
        LEFT JOIN user_unit as uu ON uu.unit_id = u.id
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

	private function loadAccounts(){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT ac.id, ac.name as account, cl.id as client_id

        FROM unit as u
        LEFT JOIN user_unit as uu ON uu.unit_id = u.id
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


        ORDER BY cl.name, account
        
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

    public function loadUnits(){
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
        CONCAT(CASE WHEN t.id IS NULL THEN '* ' ELSE '' END, vn.name) as vehicle_name,
        ic.icon, ve.plate, br.name as brand, mo.name as model, ve.color,#,
        ' - ' as date_time, ' -' as longitude, ' -' as latitude, 
        ' -' as heading, ' -' as satellite, '- ' as speed
        #t.id as trackId,
        #t.longitude, t.latitude


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
        #INNER JOIN tracking as t ON t.id = u.tracking_id
        LEFT JOIN tracking as t ON t.unit_id = u.id AND t.date_time = u.tracking_date #t.id = u.tracking_id
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

    public function statusUnits(){
        
        $cn = $this->cn;
		
        $cn->query = "SELECT u.id, vn.name as vehicle_name, de.name as device_name, CASE u.conn_status WHEN 1 THEN 'Conectado' ELSE '-' END as status, date_format(u.conn_date,'%d/%m/%Y') as date, date_format(u.conn_date,'%H:%m:%s') as time 
        FROM unit as u 
        LEFT JOIN unit_name as vn ON vn.id = u.name_id 
        LEFT JOIN user_unit as uu ON uu.unit_id = u.id 
        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id  
        INNER JOIN device as de ON de.id = u.device_id 
        INNER JOIN tracking as t ON t.id = u.tracking_id 
        WHERE u.conn_date > DATE_SUB(NOW(), INTERVAL 12 HOUR) /*AND u.conn_status = 1*/ ORDER BY 2";
        $result = $cn->execute();
                
        return $cn->getDataAll($result);        
    }
}

trait DBTracking{
	private $cn = null;

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
    private function updateTracking(){
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


    private function loadSites(){

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
        $cn->query = "SELECT m.*,
                c.name as category
            FROM mark as m
            INNER JOIN mark_category as c ON c.id = m.category_id
            #INNER JOIN icon as i ON i.id = m.icon_id
            WHERE m.user = 'panda'";

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
    private function loadCategorys(){

        $cn = $this->cn;

        $cn->query = "SELECT c.id, c.name as category
            FROM mark_category as c
            #INNER JOIN mark as m as c ON c.id = m.category_id

            WHERE c.user = 'panda'
            GROUP BY c.id ORDER BY 2";

        $result = $cn->execute();
        return $this->cn->getDataAll(); 
    }
}

trait DBGeofence{
    private $cn = null;
    private function loadGeofences(){

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
        $cn->query = "SELECT g.*
            #, concat(name, ' ', type) as name
            FROM geofences as g
            WHERE type='polygon'
            #WHERE g.user = 'Rmartinez'
            ";

        $result = $this->cn->execute();
        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $rs['config'] = json_decode($rs['config']);
            $data[$rs['id']] = $rs;
        }


        return $data;
    }

    private function loadRecord($id){

        $cn = $this->cn;

        $id = $cn->addSlashes($id);
        $cn->query = "SELECT *
            FROM geofences as g
           
           
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
    private function loadAlarms(){

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
        $cn->query = "SELECT * FROM alarm";

        $result = $this->cn->execute();
        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            
            $data[] = $rs;
        }


        return $data;
    }

    
}

trait DBImage{
    private $cn = null;
    private function load(){

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

    private function loadTracking($unitId, $dateFrom = null, $dateTo = null, $input = null){

        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT

        t.*, date_format(date_time, '%d/%m/%Y %T') as date_time, UNIX_TIMESTAMP(date_time) as ts, e.name as event

        FROM tracking as t
        LEFT JOIN unit_event as ue ON ue.unit_id = t.unit_id and ue.event = t.event_id
        LEFT JOIN event as e on e.id = ue.event_id

        WHERE t.id >= 12699
        ORDER BY unit_id
        
        
                
        ";
        
		$result = $cn->execute();
		$data = $cn->getDataAll($result);
       
        return $data;
    }


}