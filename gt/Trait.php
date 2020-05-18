<?php

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


        LEFT JOIN icons as ic ON ic.id = u.icon_id

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

