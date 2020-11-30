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
		
        $cn->query = "SELECT cl.id, cl.client

        FROM units as u
        LEFT JOIN users_units as uu ON uu.unit_id = u.id
        LEFT JOIN units_names as vn ON vn.id = u.name_id
        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id

        LEFT JOIN brands as br ON br.id = ve.brand_id
        LEFT JOIN models as mo ON mo.id = ve.model_id

        INNER JOIN devices as de ON de.id = u.device_id
        INNER JOIN devices_names as dn ON dn.name = de.device_name


        LEFT JOIN icon as ic ON ic.id = u.icon_id

        LEFT JOIN accounts as ac ON ac.id = u.account_id
        LEFT JOIN clients as cl ON cl.id = ac.client_id
        INNER JOIN tracking as t ON t.id = u.tracking_id

		GROUP BY cl.id, cl.client
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

        FROM units as u
        LEFT JOIN users_units as uu ON uu.unit_id = u.id
        LEFT JOIN units_names as vn ON vn.id = u.name_id
        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id
        LEFT JOIN brands as br ON br.id = ve.brand_id
        LEFT JOIN models as mo ON mo.id = ve.model_id

        INNER JOIN devices as de ON de.id = u.device_id
        INNER JOIN devices_names as dn ON dn.name = de.device_name


        LEFT JOIN icon as ic ON ic.id = u.icon_id

        LEFT JOIN accounts as ac ON ac.id = u.account_id
        LEFT JOIN clients as cl ON cl.id = ac.client_id
        INNER JOIN tracking as t ON t.id = u.tracking_id


            ORDER BY cl.client, account
        
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
		
        $cn->query = "
        
        SELECT
            u.id as unit_id,
            ac.client_id as client_id,
            cl.client,
            u.account_id,
            ac.name as account,
            u.device_id,
            de.device_name,
            u.vehicle_id,
            vn.name as vehicle_name,
            ic.icon, ve.plate, br.brand, mo.model, ve.color, t.id as trackId


        FROM units as u
        LEFT JOIN units_names as vn ON vn.id = u.name_id

        LEFT JOIN users_units as uu ON uu.unit_id = u.id

        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id

        LEFT JOIN brands as br ON br.id = ve.brand_id
        LEFT JOIN models as mo ON mo.id = ve.model_id

        INNER JOIN devices as de ON de.id = u.device_id
        INNER JOIN devices_names as dn ON dn.name = de.device_name


        LEFT JOIN icon as ic ON ic.id = u.icon_id

        LEFT JOIN accounts as ac ON ac.id = u.account_id
        LEFT JOIN clients as cl ON cl.id = ac.client_id
        INNER JOIN tracking as t ON t.id = u.tracking_id
        ORDER BY u.id
        ";
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

    public function infoUnit($unitId){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT
            u.id as unit_id,
            ac.client_id as client_id,
            cl.client,
            u.account_id,
            ac.name as account,
            u.device_id,
            de.device_name,
            u.vehicle_id,
            vn.name as vehicle_name,
            ic.icon, ve.plate, br.brand, mo.model, ve.color, t.id as trackId


        FROM units as u
        LEFT JOIN units_names as vn ON vn.id = u.name_id

        LEFT JOIN users_units as uu ON uu.unit_id = u.id

        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id

        LEFT JOIN brands as br ON br.id = ve.brand_id
        LEFT JOIN models as mo ON mo.id = ve.model_id

        INNER JOIN devices as de ON de.id = u.device_id
        INNER JOIN devices_names as dn ON dn.name = de.device_name


        LEFT JOIN icon as ic ON ic.id = u.icon_id

        LEFT JOIN accounts as ac ON ac.id = u.account_id
        LEFT JOIN clients as cl ON cl.id = ac.client_id
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

}

trait DBTracking{
	private $cn = null;

	private function loadTracking(){

        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT

        t.*, date_format(date_time, '%d/%m/%Y %T') as date_time

        FROM tracking as t
        INNER JOIN units as u ON u.tracking_id = t.id
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


    private function getUnitInput(&$data, $trackIds){

        $ids = implode(',', $trackIds);
        $cn = $this->cn;
		
        $cn->query = 
        "SELECT tk.unit_id, i.name as des, m.name, number, 'input' as type

        FROM tracking as tk
        INNER JOIN unit_input as u on u.unit_id = tk.unit_id and u.type=1
        INNER JOIN input as i on i.id = u.input_id
        INNER JOIN input_mode as m on m.input_id=i.id and (input_status & d) div d = m.mode
        WHERE tk.id IN ($ids)

        UNION 

        SELECT tk.unit_id, i.name as des, m.name, number, 'input' as type

        FROM tracking as tk
        INNER JOIN unit_input as u on u.unit_id = tk.unit_id and u.type=2
        INNER JOIN input as i on i.id = u.input_id
        INNER JOIN input_mode as m on m.input_id=i.id and (input_status & d) div d = m.mode
        WHERE tk.id IN ($ids)
        ;";

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
        INNER JOIN units as u ON u.tracking_id = t.id
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

            #WHERE m.user = 'panda'
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
        $cn->query = "SELECT *
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
		
        $cn->query = "
        
        SELECT
            u.id as unit_id,
            ac.client_id as client_id,
            cl.client,
            u.account_id,
            ac.name as account,
            u.device_id,
            de.device_name,
            u.vehicle_id,
            vn.name as vehicle_name,
            ic.icon, ve.plate, br.brand, mo.model, ve.color, t.id as trackId


        FROM units as u
        LEFT JOIN units_names as vn ON vn.id = u.name_id

        LEFT JOIN users_units as uu ON uu.unit_id = u.id

        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id

        LEFT JOIN brands as br ON br.id = ve.brand_id
        LEFT JOIN models as mo ON mo.id = ve.model_id

        INNER JOIN devices as de ON de.id = u.device_id
        INNER JOIN devices_names as dn ON dn.name = de.device_name


        LEFT JOIN icon as ic ON ic.id = u.icon_id

        LEFT JOIN accounts as ac ON ac.id = u.account_id
        LEFT JOIN clients as cl ON cl.id = ac.client_id
        INNER JOIN tracking as t ON t.id = u.tracking_id
        ORDER BY u.id
        ";
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