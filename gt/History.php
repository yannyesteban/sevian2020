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
				$this->updateConfig("juan", $this->eparams->config);
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
		hx($rr);
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

		$this->setInfoElement([
			'id'		=> $this->id,
			'actions'	=> $this->info,
			'type'=>'update'
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
}