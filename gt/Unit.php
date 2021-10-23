<?php
namespace GT;

require_once MAIN_PATH.'gt/Trait.php';

class Unit
    extends \Sevian\Element
	implements
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\UserInfo

{

    use DBClient;
	use DBAccount;
    use DBUnit;
    use DBTracking;
	use DBConfig;
	use DBInput;


    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;

	private $_jsonRequest = null;
	private $popupTemplate = '';

	private $infoTemplate = '';

	private $traceTime = 60*10;

    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();
	}
	public function config(){

	}

	public function evalMethod($method = false): bool{

		if($method !== false){
            $this->method = $method;
		}


		switch($this->method){
			case 'load':

				//$this->setSes('last_id', 12699);
				$this->setSes('last_id', 12735);
				$this->load();


				//hx($this->getSes('nameis'));

				break;
            case 'load-units':
                $data = $this->loadUnits();

                $this->_name = $this->name;
                $this->_type = 'GTUnit';
                $this->_mode = '';
                $this->_info = [
                    'dataUnits'     => $data,
                    'dataClients'   => $this->loadClients(),
                    'dataAccounts'  => $this->loadAccounts(),
					'tracking'      => $this->loadTracking2(),
					'popupTemplate' => $this->popupTemplate,
					'infoTemplate'	=> $this->infoTemplate,
					'pathImages'	=> PATH_IMAGES,
					'caption'		=> 'Unidades 2',
					'id'            => 'k',
					'followMe'		=> true,
					'delay'			=> 10000,
				];
			case 'tracking':
				//hx($this->id);
				//hr($this->getSes('nameis'));
				//$this->setSes('nameis', 'luis');
				//hx("-");
				$value = $this->getSes('last_id');
				$lastDateTime = $this->getSes('lastDateTime');
				$this->setRequest([
					'tracking2'=>$this->updateTracking2($this->getUser(), $lastDateTime),
					//'tracking'=>$this->updateTracking($this->getUser(), $lastDateTime),
					'connected'=>$this->unitConected($this->getUser(), $lastDateTime)
				]);

				$value++;
				$this->setSes('lastDateTime', $lastDateTime);
				//hr($this->id);
				//hx($value);
				break;
			case 'trace':
				//hx($this->id);
				//hr($this->getSes('nameis'));
				//$this->setSes('nameis', 'luis');
				//hx("-");
				//$value = $this->getSes('last_id');
				$infoResult = null;

				$this->setRequest($this->loadTraceTracking($this->getUser(), $this->eparams->unitId?? 0, $infoResult));

				//$value++;
				//$this->setSes('last_id', $value);
				//hr($this->id);
				//hx($value);

				break;
			case 'status-units':
				if($this->eparams->lastDate ?? false){
					$this->setRequest($this->statusUnits($this->getUser(), $this->eparams->lastDate));
				}else{
					$this->setRequest($this->statusUnits($this->getUser()));
				}

				break;
			case 'get-info':
				$this->addResponse([
					'type'=>'',
					'id'=>$this->id,
					'data'=>[
						'unitData'=>$this->getUnitData($this->eparams->unitId?? 0)
						
					],
					'iToken'=>$this->iToken
				]);	
			default:
				break;

		}

		return true;
	}

	public function init(){
		hx("BYE");
		return [
			'dataUnits'     => $this->loadUnits2($this->getUser()),
			'dataClients'   => $this->loadClients($this->getUser()),
			'dataAccounts'  => $this->loadAccounts($this->getUser()),
			'tracking'      => $this->loadTracking2(),
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES,
			'caption'		=> 'Unidades',
			'id'            => 'k',
			'followMe'		=> true,
			'delay'			=> 10000,
		];
	}

	private function load(){
		//hx($this->loadTracking4(2002, '2020-07-01 09:20:34', '2020-07-01 12:09:50', '', ''));
		//hx($this->loadTracking2());

		$infoForm = new \Sigefor\InfoForm([

			//'id'		=> $this->containerId,
			'containerId'=>null,
			'panelId'	=> $this->id,
			'name'		=> '/gt/infoForm/unit',
			'method'	=> 'load',
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);
		$infoForm->load();

		$infoPopup = new \Sigefor\InfoForm([

			//'id'		=> $this->containerId,
			'containerId'=>null,
			'panelId'	=> $this->id,
			'name'		=> '/gt/infoForm/unit_popup',
			'method'	=> 'load',
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);
		$infoPopup->load();

		$infoTrace = new \Sigefor\InfoForm([

			//'id'		=> $this->containerId,
			'containerId'=>null,
			'panelId'	=> $this->id,
			'name'		=> '/gt/infoForm/unit_trace',
			'method'	=> 'load',
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);
		$infoTrace->load();


        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = $this->id;
		//$this->panel->innerHTML = 'gt-unit-'.$this->id;
		$this->typeElement = 'GTUnit';
		$this->jsClassName = 'GTUnit';
		//hx($this->loadUnits());
		//hx($this->panel->id);

		$lastDateTime = date('Y-m-d H:i:s');


		//hx($this->lastTracking($this->getUser(), $lastDateTime));


		$winStatus = [
			'visible'=> true,
			'caption'=> 'Unidades Conectadas',
			'left'=>'right',
			'top'=>'bottom',
			'deltaX'=> -50,
			'deltaY'=>-140-20,
			//top:390,
			'width'=> '330px',
			'height'=> '120px',
			'mode'=>'auto',
			'className'=>['sevian'],
			//'child'=>_statusUnit.get(),
			'resizable'=> true,
			'draggable'=> true,
			'closable'=> false

		];

		$this->info = [
			'id'=>$this->id,
			'panel'=>$this->id,

			'mapName'     	=> $this->eparams->mapName ?? '',

			'dataUnits'     => $this->loadUnits2($this->getUser()),
			'dataClients'   => $this->loadClients($this->getUser()),
			'dataAccounts'  => $this->loadAccounts($this->getUser()),
			//'tracking'      => $this->loadTracking2(),
			//'tracking'		=> $this->lastTracking($this->getUser(), $lastDateTime),
			//'history'		=> $this->loadTracking4(2002, '2020-07-01 09:20:34', '2020-07-01 12:09:50', '', ''),
			'traceConfig'	=> $this->loadUserConfig($this->_userInfo->user),
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES,
			'caption'		=> 'Unidades',
			//'id'            => 'U-'.$this->panel->id,
			'followMe'		=> false,
			'delay'			=> 10000,
			'infoId'		=> $this->eparams->infoId ?? false,
			'statusId'		=> $this->eparams->statusId ?? false,
			'searchUnitId'	=> $this->eparams->searchUnitId ?? false,
			'infoMenuId'    => $this->eparams->infoMenuId?? '',
			'infoInput'		=>$this->infoInput(),
			'unitInputs'	=>$this->loadUnitInputs($this->getUser()),
			'msgErrorUnit'	=> "Unidad no encontrada!!!",
			'msgErrortracking'=> "La Unidad no presenta datos de Posición!!!",
			'infoForm'		=> $infoForm->getInit(),
			'infoPopup'		=> $infoPopup->getInit(),
			'infoTrace'		=> $infoTrace->getInit(),
			'propertysInfo' => $this->getPropertysInfo(),
			'traceTime'		=> $this->traceTime,
			'winStatus' => $winStatus
		];

		//hx($this->info);
		$this->setSes('lastDateTime', $lastDateTime);
		$this->setInit($this->info);

		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'GTUnit',
			'iClass'	=> 'GTUnit',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> $this->info
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

	public function setRequest($data=[]){
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

	private function getPropertysInfo(){
		return
		[

			[
				"name"=>"unitId",
				"caption"=>"Unit Id",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"deviceId",
				"caption"=>"Device Id",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"date_time",
				"caption"=>"Fecha",
				"type"=>"string",
				"options"=>null
			],
			[
				"name"=>"longitude",
				"caption"=>"Longitude",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"latitude",
				"caption"=>"Latitud",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"speed",
				"caption"=>"Velocidad",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"heading",
				"caption"=>"Orientación",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"altitude",
				"caption"=>"Altitud",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"satellite",
				"caption"=>"Satelites",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"eventId",
				"caption"=>"Evento",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"mileage",
				"caption"=>"mileage",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"inputStatus",
				"caption"=>"Input Status",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"voltageI1",
				"caption"=>"voltageI1",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"voltageI2",
				"caption"=>"voltageI2",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"outputStatus",
				"caption"=>"Output Status",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"batteryVoltage",
				"caption"=>"batteryVoltage",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"mainEvent",
				"caption"=>"mainEvent",
				"type"=>"number",
				"options"=>null
			],
			[
				"name"=>"uTime",
				"caption"=>"Hora",
				"type"=>"string",
				"options"=>null
			],
			[
				"name"=>"uDate",
				"caption"=>"Fecha",
				"type"=>"string",
				"options"=>null
			],


		];
	}

	public function getUnitData($unitId){
		$user = $this->getUser();
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
            e.title as myEvent,
            de.name as event,m.name as device_model, v.version,IFNULL(v.name, '') as protocol


        FROM unit as u
        INNER JOIN user_unit as uu ON uu.unit_id = u.id
        LEFT JOIN unit_name as vn ON vn.id = u.name_id

        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id

        LEFT JOIN vehicle_brand as br ON br.id = ve.brand_id
        LEFT JOIN vehicle_model as mo ON mo.id = ve.model_id

        INNER JOIN device as de ON de.id = u.device_id
        INNER JOIN device_version as v on v.id = de.version_id
        INNER JOIN device_model as m ON m.id = v.id_model
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
		$data = $cn->getDataAssoc($result);
		if($data['trackId']){
			$io = $this->evalInput($unitId, $data['inputStatus'], $data['outputStatus']);
			$data['inputs'] = $io['inputs'] ?? [];
			$data['outputs'] = $io['outputs'] ?? [];
		}
		
		
        return $data;
        
    }

	private function evalInput($unitId, $input, $output){
		$user = $this->getUser();
        $cn = $this->cn;

        $cn->query = "SELECT ui.unit_id as unitId,

		i.type,

		'i' as ctype, number, ui.input_id as inputId, i.name,
		($input >> (number - 1 ))%2 as `on`,
		CASE ($input >> (number - 1 ))%2 WHEN 1 THEN value_on ELSE value_off END as value
				FROM unit_input as ui
				INNER JOIN input as i ON i.id = ui.input_id
				INNER JOIN user_unit as uu ON uu.unit_id = ui.unit_id
				WHERE uu.user = '$user' AND ui.unit_id = '$unitId' AND i.type = 1

		union

		SELECT ui.unit_id as unitId,

		i.type,

		'o' as ctype, number, ui.input_id as inputId, i.name,
		($output >> (number - 1 ))%2 as `on`,
		CASE ($output >> (number - 1 ))%2 WHEN 1 THEN value_on ELSE value_off END as value
				FROM unit_input as ui
				INNER JOIN input as i ON i.id = ui.input_id
				INNER JOIN user_unit as uu ON uu.unit_id = ui.unit_id
				WHERE uu.user = '$user' AND ui.unit_id = '$unitId' AND i.type = 2

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

}