<?php

namespace GT;

class Unit extends \Sevian\Element{

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
			
			default:
				break;

		}
		
		return true;
	}

	private function loadUnits(){
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
	private function load(){

	}

}