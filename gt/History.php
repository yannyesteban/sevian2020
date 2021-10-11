<?php
namespace GT;

require_once MAIN_PATH.'gt/Trait.php';

class History
    extends \Sevian\Element
	implements
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\UserInfo

{

	//use DBUnit;
    use DBHistory;
	use DBConfig;



    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;

	private $_jsonRequest = null;

	public $jsClassName = 'GTHistory';

	static $patternJsonFile = '';

	private $popupTemplate = '';

	private $infoTemplate = '';

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
            $this->method = $this->method;
		}

		//hx($this->method);

		switch($this->method){
			case 'request':
				$this->load2();
				break;
			case 'load':
				$this->load();
				break;
			case 'load-data':

				$unitId = \SEVIAN\S::getReq('unit_id');
				$dateFrom = \SEVIAN\S::getReq('date_from');
				$hourFrom = \SEVIAN\S::getReq('hour_from');
				$dateTo = \SEVIAN\S::getReq('date_to');
				$hourTo = \SEVIAN\S::getReq('hour_to');
				$this->loadHistory($unitId, $dateFrom, $hourFrom, $dateTo, $hourTo);
				break;
			case 'load-test':

				$this->loadHistory(2002, '2020-07-01', '09:20:34', '2020-07-01', '12:09:50');
				break;
            case 'load-sites':


                $this->_name = $this->name;
                $this->_type = 'GTHistory';
                $this->_mode = '';
                $this->_info = [
					'dataMain'		=> $this->loadGeofences(),

					'popupTemplate' => $this->popupTemplate,
					'infoTemplate'	=> $this->infoTemplate,

					'pathImages'	=> PATH_IMAGES,
					'caption'		=> 'Historial',
					'id'            => $this->containerId,
					'followMe'		=> true,
					'delay'			=> 60000,
				];
			case 'tracking':

				break;
			case 'save-config':


				$this->addResponse([
					'type'=>'',
					'id'=>$this->id,
					'data'=>[
						"error"=>$this->updateConfig($this->getUser(), $this->eparams->config)
					],
					'iToken'=>$this->iToken
				]);
				break;
			default:
				break;

		}

		return true;
	}
	public function load2(){

		if($this->eparams->mainId?? false){
            $this->containerId = $this->eparams->mainId;
        }

        if(!$this->containerId){
            $this->containerId = 'history-main-'.$this->id;
		}

		$form =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/history', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);

		$formHistoryConfig =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/history_config', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);


		$this->setInit([
			'form'     => $form,
			'formHistoryConfig'=>$formHistoryConfig,
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES."sites/",
			'caption'		=> 'Historial',
			'id'            => $this->containerId,
			'followMe'		=> true,
			'delay'			=> 60000,
		]);
	}
	public function init(){

		$form =  new \Sigefor\Component\Form2([

			//'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/history', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);


		return [
			'form'     => $form,

			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES."sites/",
			'caption'		=> 'Historial',
			'id'            => $this->containerId,
			'followMe'		=> true,
			'delay'			=> 60000,
		];
	}

	private function load(){


		$info = new \Sigefor\InfoForm([

			//'id'		=> $this->containerId,
			'containerId'=>null,
			'panelId'	=> $this->id,
			'name'		=> '/gt/infoForm/history',
			'method'	=> 'load',
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);
		$info->load();


		$form =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/history', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);

		$formHistoryConfig =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/history_config', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);




        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-history-'.$this->id;
		$this->panel->innerHTML = 'gt-history-'.$this->id;
		//$this->typeElement = 'GTHistory';
		$this->jsClassName = 'GTHistory';

		$this->info = [
			'mapName'     	=> $this->eparams->mapName ?? '',
			'form'     => $form,
			'formHistoryConfig' =>$formHistoryConfig,
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES."sites/",
			'caption'		=> 'Historial',
			'id'            => $this->id,
			'followMe'		=> true,
			'delay'			=> 60000,
			'infoForm'		=> $info->getInit(),
			'unitPanelId'=>$this->eparams->unitPanelId?? ''
		];

		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'GTHistory',
			'iClass'	=> 'GTHistory',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> $this->info
		]);
		//$this->setInit($this->info);

    }


	private function loadTest(){
		$rr = json_decode(@file_get_contents("data2.json", true), true);
		//hx($rr);
		foreach($rr as $k => $t){
			$cn = $this->cn;
			$date_time = $t['fecha']." ".$t['hora'];
			$latitude = str_replace("," ,".",$t['latitud']);
			$longitude = str_replace("," ,".",$t['longitud']);
			$heading = $t['heading'];
			$altitud = $t['altitud'];
			$satellites = $t['satelites'];
			$speed = $t['velocidad'];


			$cn->query =
			"INSERT INTO tracking (unit_id, device_id, date_time, longitude, latitude, speed, altitude, heading, satellite)
			VALUES (2319, '2012000750', '$date_time', '$longitude', '$latitude', '$speed',
			'$altitud', '$heading', '$satellites') ";
			//hr($cn->query);
			$result = $cn->execute();
		}

	}
	private function loadHistory($unitId, $dateFrom, $hourFrom, $dateTo, $hourTo){


		if($hourFrom == ''){
			$hourFrom = '00:00:00';
		}
		if($hourTo == ''){
			$hourTo = '23:59:59';
		}

		if($dateFrom == ''){
			$dateFrom = date("Y-m-d");
		}
		if($dateTo == ''){
			$dateTo = date("Y-m-d");
		}

		$from = "$dateFrom $hourFrom";
		$to = "$dateTo $hourTo";

		$config = $this->loadUserConfig($this->_userInfo->user);
		$config->propertys = $this->getPropertysInfo();
		$config->propertys = array_merge($config->propertys, $this->getInputName(1626));

		$data = $this->loadTracking($unitId, $from, $to);
		//print_r(json_encode($data, JSON_NUMERIC_CHECK));exit;
		$this->info = [
			[
            	'method'	=> 'setData',
				'value'		=> $data,
			],
			[
				'method'	=> 'setInfoUnit',
				//'value'		=> $this->infoUnit($unitId)
			],
			[
				'method'	=> 'setInfoUnitInfo',
				//'value'		=> $this->infoUnitInput($unitId)
			],

			[
				'method'	=> 'setLayerConfig',
				'value'		=> $config
			],
			[
				'method'	=> 'play',
				'value'		=> null
			]
		];
		/*
		$this->setInfoElement([
			'id'		=> $this->id,
			'actions'	=> $this->info,
			'type'=>'update'
		]);
		*/

		$this->addResponse([
			'type'=>'',
			'id'=>$this->id,
			'data'=>[
				'unitData'=>$this->getUnitData($this->getUser(), $unitId),
				"data" =>  $data,
				"config"=> $config

			],
			'iToken'=>$this->iToken
		]);

		return;

		//hx("$unitId: $from / $to");
		//$this->loadTest();

		//$layerInputData = $this->getInputLayers($unitId, $dateFrom, $dateTo);
		//$layerOutputData = $this->getOutputLayers($unitId, $dateFrom, $dateTo);
		//$layerEventData = $this->getEventLayers($unitId, $dateFrom, $dateTo);
		//$layerAlarmData = $this->getAlarmLayers($unitId, $dateFrom, $dateTo);
		//hr($this->getInputName($unitId));
		//$config->propertys[] = $this->getInputName($unitId);
		//hx($config);
		//$layerInputPropertys = $this->getInputName($unitId);


		$layerInput = [];

		foreach($layerInputData as $k => $v){
			$layerInput[] = [
				"caption"	=> $v["layer"],
				"type"		=> "circle",
				"color"		=> $config->colors[$k],
				"value"		=> $v["number"],
				"group"		=> 2
			];
		}


		$layerOutput = [];

		foreach($layerOutputData as $k => $v){
			$layerOutput[] = [
				"caption"	=> $v["layer"],
				"type"		=> "circle",
				"color"		=> $config->colors[$k],
				"value"		=> $v["number"],
				"group"		=> 3
			];
		}



		$layerEvent = [];

		foreach($layerEventData as $k => $v){
			$layerEvent[] = [
				"caption"	=> $v["name"],
				"type"		=> "circle",
				"color"		=> $config->colors[$k],
				"value"		=> $v["event_id"],
				"group"		=> 4
			];
		}




		$layerAlarm = [];

		foreach($layerAlarmData as $k => $v){
			$layerAlarm[] = [
				"caption"	=> $v["name"],
				"type"		=> "circle",
				"color"		=> $config->colors[$k],
				"value"		=> $v["event_id"],
				"group"		=> $v["group"]
			];
		}
/*
		$config->layers = array_merge($config->layers, $layerInput);
		$config->layers = array_merge($config->layers, $layerOutput);
		$config->layers = array_merge($config->layers, $layerEvent);
		$config->layers = array_merge($config->layers, $layerAlarm);
*/
		//hx($config);
		if($dateFrom){
			//$dateForm .= ' '
		}

		$data = $this->loadTracking($unitId, $from, $to);
		//print_r(json_encode($data, JSON_NUMERIC_CHECK));exit;
		$this->setJSActions([
			[
            	'method'	=> 'setData',
				'value'		=> $data,
			],
			[
				'method'	=> 'setInfoUnit',
				//'value'		=> $this->infoUnit($unitId)
			],
			[
				'method'	=> 'setInfoUnitInfo',
				//'value'		=> $this->infoUnitInput($unitId)
			],

			[
				'method'	=> 'setLayerConfig',
				'value'		=> $config
			],
			[
				'method'	=> 'play',
				'value'		=> null
			]
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

	private function getPropertysInfo(){
		return
		[

			[
				"name"=>"speed",
				"caption"=>"Velocidad",
				"type"=>"text",
				"options"=>null
			],
			[
				"name"=>"heading",
				"caption"=>"Orientación",
				"type"=>"text",
				"options"=>null
			],
			[
				"name"=>"satellite",
				"caption"=>"Satélites",
				"type"=>"text",
				"options"=>null
			],
			[
				"name"=>"voltage_level_i2",
				"caption"=>"Voltaje I1",
				"type"=>"text",
				"options"=>null
			],
			[
				"name"=>"voltage_level_i2",
				"caption"=>"Voltaje I2",
				"type"=>"text",
				"options"=>null
			],
			[
				"name"=>"longitude",
				"caption"=>"Longitud",
				"type"=>"text",
				"options"=>null
			],
			[
				"name"=>"latitude",
				"caption"=>"Latitud",
				"type"=>"text",
				"options"=>null
			],
			[
				"name"=>"altitude",
				"caption"=>"Altitud",
				"type"=>"text",
				"options"=>null
			],
			[
				"name"=>"eventId",
				"caption"=>"Evento",
				"type"=>"text",
				"options"=>null
			],
			[
				"name"=>"mileage",
				"caption"=>"Millas",
				"type"=>"text",
				"options"=>null
			],
			/*[
				"name"=>"inputStatus",
				"caption"=>"inputStatus",
				"type"=>"text",
				"options"=>null
			],*/
			[
				"name"=>"batteryVoltage",
				"caption"=>"Voltaje de la Batería",
				"type"=>"text",
				"options"=>null
			]

		];
	}

	private function getConfigHistory(){



	}

	private function updateConfig($user, $config){
        $cn = $this->cn;
		$config = json_encode($config, JSON_PRETTY_PRINT);

        $cn->query = "UPDATE user_config SET layer = '$config'
            WHERE user = '$user'";

        $cn->execute();

		return $cn->error;
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

            UNIX_TIMESTAMP(t.date_time) as ts, e.title as myEvent, de.name as event



        FROM tracking as t

        LEFT JOIN unit as u ON u.id = t.unit_id
        LEFT JOIN device as v ON v.id = u.device_id
        LEFT JOIN device_event de ON de.version_id = v.version_id AND de.event_id = t.event_id

        LEFT JOIN event as e ON e.unit_id = t.unit_id AND e.date_time = t.date_time

        WHERE t.unit_id = '$unitId' AND t.date_time>='$from' AND t.date_time<='$to'



        ";

		$result = $cn->execute();
		$data = $cn->getDataAll($result);


        $data = array_map(function($item){

			$io = $this->getUnitInput($item['unitId'], $item['inputStatus'], $item['outputStatus']);
			$item['inputs'] = $io['inputs'];
			$item['outputs'] = $io['outputs'];

            return $item;
        }, $data);



        return $data;
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
            de.name as event,m.name as device_model, v.version,IFNULL(v.name, '') as protocol,

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
        LEFT JOIN unit_name as vn ON vn.id = u.name_id

        LEFT JOIN vehicle as ve ON ve.id = u.vehicle_id

        LEFT JOIN vehicle_brand as br ON br.id = ve.brand_id
        LEFT JOIN vehicle_model as mo ON mo.id = ve.model_id

        INNER JOIN device as de ON de.id = u.device_id
        INNER JOIN device_version as v on v.id = de.version_id
        INNER JOIN device_model as m ON m.id = v.id_model
        INNER JOIN device_name as dn ON dn.name = de.name


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
		$io = $this->getUnitInput($unitId, $data['inputStatus'], $data['outputStatus']);
		$data['inputs'] = $io['inputs'];
		$data['outputs'] = $io['outputs'];
		;
        return $data;
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

	private function getUnitInput($unitId, $input, $output){
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