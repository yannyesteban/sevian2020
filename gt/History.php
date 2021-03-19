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

	use DBUnit;
    use DBHistory;
	use DBConfig;
   
    

    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;
	
	private $_jsonRequest = null;

	public $jsClassName = 'GTHistory';

	static $patternJsonFile = '';

	private $popupTemplate = '<div class="wecar_info">
		<div>{=name}</div>
		<div>Categoria: {=category}</div>
		

		<div>{=latitude}, {=longitude}</div>
		<div>Telefonos {=phone1} {=phone2} {=phone3}</div>
		<div>Web: {=web}</div>
		<div>Dirección: {=address}</div>

	</div>';

	private $infoTemplate = '
	<div class="units-info">

		<div>Nombre</div><div>{=name}</div>
		<div>Categoria</div><div>{=category}</div>

		<div>Longitud</div><div>{=longitude}</div>
		<div>Latidud</div><div>{=latitude}</div>

		<div>Dirección</div><div>{=address}</div>
		<div>Teléfonos</div><div>{=phone1} {=phone2} {=phone3}</div>
		<div>Correo</div><div>{=email}</div>
		<div>Web</div><div>{=web}</div>
		<div>Observaciones</div><div>{=observations}</div>
	
	</div>';

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
			case 'request':
				$this->load2();
				break;
			case 'load':
				$this->load();
				break;
			case 'load-data':
				$this->loadHistory();
				
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

		
		$this->setInit([
			'form'     => $form,
			
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
		$form =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/history', self::$patternJsonFile),
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
			'form'     => $form,
			
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES."sites/",
			'caption'		=> 'Historial',
			'id'            => $this->id,
			'followMe'		=> true,
			'delay'			=> 60000,
		];

		
		$this->setInit($this->info);

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
	private function loadHistory(){
		$unitId = \SEVIAN\S::getReq('unit_id');
		$dateFrom = \SEVIAN\S::getReq('date_from');
		$hourFrom = \SEVIAN\S::getReq('hour_from');
		$dateTo = \SEVIAN\S::getReq('date_to');
		$hourTo = \SEVIAN\S::getReq('hour_to');
		$filter = \SEVIAN\S::getReq('filter');

		//$this->loadTest();
		$config = $this->loadUserConfig($this->_userInfo->user);
		$layerInputData = $this->getInputLayers($unitId, $dateFrom, $dateTo);
		$layerOutputData = $this->getOutputLayers($unitId, $dateFrom, $dateTo);
		$layerEventData = $this->getEventLayers($unitId, $dateFrom, $dateTo);
		$layerAlarmData = $this->getAlarmLayers($unitId, $dateFrom, $dateTo);
		

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
		$config->layers = array_merge($config->layers, $layerInput);

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
		$config->layers = array_merge($config->layers, $layerOutput);

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
		$config->layers = array_merge($config->layers, $layerEvent);


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
		$config->layers = array_merge($config->layers, $layerAlarm);

		//hx($config);
		if($dateFrom){
			//$dateForm .= ' '
		}

		$data = $this->loadTracking($unitId, $dateFrom, $dateTo, $filter);
		
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
				'method'	=> 'uPlay',
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

}