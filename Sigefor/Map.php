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
            default:
				$this->create();
				break;
				
        }

        return true;
    }

    private function create(){


        $clients = $this->loadClients();
        $accounts = $this->loadAccounts();
        //$devices = $this->loadDevices();
        $tracking = $this->loadTracking();
        //$events = $this->loadAlarmsEvents();

        

        $form = new \Sevian\Panel('div');
        $form->id = "map_".$this->id;

        

       

        $this->panel = $form;
        $info = [
            "id"        => $form->id,
            "clients"=>$clients,
            "accounts"=>$accounts,
            "units"   => $this->loadDevices(),
            "tracking"  => $tracking,
            "events"  => $this->loadAlarmsEvents()

        ];


        $this->typeElement = 'sgMap';
		$this->info = $info;//$form->getInfo();
    }
    private function loadClients(){
        $cn = $this->cn;
		
        $cn->query = "SELECT cl.id, cl.client 
        
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


    private function loadTracking(){
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT

        t.*

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
        $cn = $this->cn;
		
        $cn->query = "
        
        SELECT

        t.date_time,
        t.unit_id, longitude, latitude, heading, event_id, input_status, output_status,

        IFNULL(t.date_time, NOW()) AS delay,
        al.name as alarm, al.type

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
}


