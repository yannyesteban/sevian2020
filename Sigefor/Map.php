<?php
namespace Sevian\Sigefor;


class Map extends \Sevian\Element{


    
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
		if(!$this->async){
			if($this->method == "list_page"){
				$method = "list";
			}
        }
hr(5);
        switch($method){

			case 'load_cmd':
				$var = $this->eparams->cmd;
				$f = new \Sevian\iFragment([
					'targetId'=>'sg_form_5',
					'html'=>$var,
					'script'=>""

				]);
				//$this->addFragment($f);
				;

				$this->typeElement = "ControlDevice";
                /*
                $form = $this->loadParamsForm($this->eparams->cmd, $this->eparams->cmdId);//$form->getInfo();
				
				$this->info = [[
					'method'  => 'loadCmdForm',
					'value' => $form
                ]];
                */
				
				break;
			case 'create':
            case 'load':
                $this->create();
                break;
            case 'load-events':

                $events = $this->loadAlarmsEvents();
                $opt[] = [
                    'method'  => 'eventsData',
                    'value' => $events
                ];
                $this->typeElement = "sgMap";
		        $this->info = $opt;//$form->getInfo();
                break;
            default:
				$this->create();
				break;
				
        }

        return true;
    }

    private function create(){


        //$this->loadClients()$clients = $this->loadClients();
        //$accounts = $this->loadAccounts();
        //$devices = $this->loadDevices();
        //$tracking = $this->loadTracking();
        //$events = $this->loadAlarmsEvents();

        

        $form = new \Sevian\Panel('div');
        $form->id = "map_".$this->id;

        

       

        $this->panel = $form;
        $info = [
            "id"        => $form->id,
            "clients"=>$this->loadClients(),
            "accounts"=>$this->loadAccounts(),
            "units"   => $this->loadDevices(),
            "tracking"  => $this->loadTracking(),
            "events"  => $this->loadAlarmsEvents(),
            "marks"  => [
                "marks"=> $this->loadMarks(),
                "groups"=>$this->loadMarksGroups(),
                "scales"=>$this->loadMarksScales(),
                "icons"=>$this->loadMarksIcons()
            ],
            "geofences"=>$this->loadGeofences(),
            "alarms"=>[
                "alarms"=>$this->loadAlarms(),
                "types"=>$this->loadAlarmsTypes(),
            ]

        ];


        $this->typeElement = 'sgMap';
		$this->info = $info;//$form->getInfo();
    }
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


        LEFT JOIN icons as ic ON ic.id = u.icon_id

        LEFT JOIN accounts as ac ON ac.id = u.account_id
        LEFT JOIN clients as cl ON cl.id = ac.client_id
        INNER JOIN tracking as t ON t.id = u.tracking_id
        
        ";
		$result = $cn->execute();
		
        
        $data = [];
		while($rs = $cn->getDataAssoc($result)){
            $data[] = $rs;
        }


        return $data;
    }

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


        LEFT JOIN icons as ic ON ic.id = u.icon_id

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

    private function loadMenu(){
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
            ic.icon, ve.plate, br.brand, mo.model, ve.color


        FROM units as u
        LEFT JOIN users_units as uu ON uu.unit_id = u.id

        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id
        LEFT JOIN vehicles_names as vn ON vn.id = ve.name_id
        LEFT JOIN brands as br ON br.id = ve.brand_id
        LEFT JOIN models as mo ON mo.id = ve.model_id

        INNER JOIN devices as de ON de.id = u.device_id
        INNER JOIN devices_names as dn ON dn.name = de.device_name


        LEFT JOIN icons as ic ON ic.id = u.icon_id

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


        return $data;
    }
    
    private function loadDevices(){
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
            ic.icon, ve.plate, br.brand, mo.model, ve.color


        FROM units as u
        LEFT JOIN units_names as vn ON vn.id = u.name_id

        LEFT JOIN users_units as uu ON uu.unit_id = u.id

        LEFT JOIN vehicles as ve ON ve.id = u.vehicle_id

        LEFT JOIN brands as br ON br.id = ve.brand_id
        LEFT JOIN models as mo ON mo.id = ve.model_id

        INNER JOIN devices as de ON de.id = u.device_id
        INNER JOIN devices_names as dn ON dn.name = de.device_name


        LEFT JOIN icons as ic ON ic.id = u.icon_id

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


        return $data;
    }


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


        return $data;
    }


    private function loadAlarmsEvents(){

        if(!$this->getSes('hora')){
			$this->setSes('hora', date("Y-m-d h:i:s"));
        }

        $this->setSes('hora', date("Y-m-d h:i:s"));
        $hora = $this->getSes('hora');
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT

        t.date_time,
        t.unit_id,
        longitude+FLOOR(RAND()*100)/1000 as longitude,
        latitude+FLOOR(RAND()*100)/1000 as latitude,
        heading, event_id, input_status, output_status,

        IFNULL(t.date_time, NOW()) AS delay,
        al.name as alarm, al.type, 'pulsing-dot' as micon, '$hora' as hora

        FROM alarms_events as ae
        INNER JOIN alarms as al ON al.id = ae.alarm_id
        INNER JOIN tracking as t ON t.id = ae.tracking_id
                
        ";

        


		$result = $cn->execute();
		
        $data = [];
		if($rs = $cn->getDataAll($result)){
            $data = $rs;
        }


        return $data;
    }

    private function loadMarksScales(){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT * FROM marks_scales 
                
        ";
		$result = $cn->execute();
		
        $data = [];
		if($rs = $cn->getDataAll($result)){
            $data = $rs;
        }


        return $data;
    }

    private function loadMarksIcons(){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT * FROM icons 
                
        ";
		$result = $cn->execute();
		
        $data = [];
		if($rs = $cn->getDataAll($result)){
            $data = $rs;
        }


        return $data;
    }

    private function loadMarksGroups(){
        $cn = $this->cn;
		
        $cn->query = "
        SELECT g.* 
        FROM marks as m 
        INNER JOIN marks_groups as g ON g.id = m.group_id 
        WHERE m.user='Cobecac' 
                
        ";
		$result = $cn->execute();
		
        $data = [];
		if($rs = $cn->getDataAll($result)){
            $data = $rs;
        }


        return $data;
    }

    private function loadMarks(){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT * FROM marks WHERE user='Cobecac' 
                
        ";
		$result = $cn->execute();
		
        $data = [];
		if($rs = $cn->getDataAll($result)){
            $data = $rs;
        }


        return $data;
    }


    private function loadGeofences(){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT *
        FROM geofences as gf
        WHERE user='tay2000'
                
        ";
		$result = $cn->execute();
		
        $data = [];
		if($rs = $cn->getDataAll($result)){
            $data = $rs;
        }


        return $data;
    }
    
    private function loadAlarmsTypes(){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT id, name
        FROM alarms_types as al
        /*
        WHERE user ='tay2000'
        */
        ORDER BY name;
                
        ";
		$result = $cn->execute();
		
        $data = [];
		if($rs = $cn->getDataAll($result)){
            $data = $rs;
        }


        return $data;
    }

    private function loadAlarms(){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT id, name, type_id
        FROM alarms as al
        /*
        WHERE user ='tay2000'
        */
        ORDER BY name;
                
        ";
		$result = $cn->execute();
		
        $data = [];
		if($rs = $cn->getDataAll($result)){
            $data = $rs;
        }


        return $data;
    }
}


