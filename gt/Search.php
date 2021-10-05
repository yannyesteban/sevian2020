<?php
namespace GT;

require_once MAIN_PATH.'gt/Trait.php';

class Search
    extends \Sevian\Element
	implements
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\UserInfo

{

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
			case 'load':
				$this->load();
				break;
            case 'search':
				;


				$this->addResponse([
					'id'	=> $this->id,
					'data'	=> $this->search($this->eparams->q?? '', $this->getUser()),
					'iToken'=> $this->iToken
				]);
				break;
			default:
				break;

		}

		return true;
	}

	public function init(){


	}

	private function load(){
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'Search',
			'iClass'	=> 'GTSearch',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                'id'			=>$this->id,
                'panel'			=>$this->id,
                'caption'		=> 'Search...',
                'unitPanelId'	=>$this->eparams->unitPanelId?? '',
            ]
		]);
    }

	public function search($q, $user){

		if($q == ''){
			//return [];
		}
		$cn = $this->cn;
		$path = PATH_IMAGES;
        $cn->query = "SELECT u.id as unitId,
		de.name,vn.name as vehicle_name, plate, br.name as brand,

				u.id as unitId,
				ac.client_id as client_id,
				cl.name as client,
				u.account_id,
				ac.name as account,
				u.device_id,
				de.name as deviceName,
				u.vehicle_id,
				vn.name as vehicle_name,
				CASE WHEN t.id IS NULL THEN 1 ELSE 0 END as noTracking,
				CASE WHEN t.id IS NULL THEN 0 ELSE 1 END as valid,
				vn.name as unitName,
				CONCAT('$path', ic.icon, '.png') as image, ve.plate, br.name as brand, mo.name as model, ve.color,#,
				' - ' as date_time, ' -' as longitude, ' -' as latitude,
				' -' as heading, ' -' as satellite, '- ' as speed, u.conn_status as connected



				FROM unit as u
				LEFT JOIN tracking as t ON t.unit_id = u.id AND t.date_time = u.tracking_date #t.id = u.tracking_id

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

				WHERE uu.user = '$user' AND

				(de.name like '%$q%' OR
				vn.name like '%$q%' OR
				plate like '%$q%' OR
				mo.name like '%$q%' OR
				br.name like '%$q%')

				ORDER BY client, account, vehicle_name

        ";

		//hx($cn->query);
		$result = $cn->execute();

        return $cn->getDataAll($result);





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


}