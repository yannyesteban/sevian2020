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

private $infoTemplate = '
	';



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
					'delay'			=> 60000,
				];
			case 'tracking':
				//hx($this->id);
				//hr($this->getSes('nameis'));
				//$this->setSes('nameis', 'luis');
				//hx("-");
				$value = $this->getSes('last_id');
				$lastDateTime = $this->getSes('lastDateTime');
				$this->setRequest($this->updateTracking($this->getUser(), $lastDateTime));

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
					$this->setRequest($this->statusUnits($this->eparams->lastDate));
				}else{
					$this->setRequest($this->statusUnits());
				}

				break;
			default:
				break;

		}

		return true;
	}

	public function init(){
		return [
			'dataUnits'     => $this->loadUnits($this->getUser()),
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
		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,

			'mapName'     	=> $this->eparams->mapName ?? '',

			'dataUnits'     => $this->loadUnits($this->getUser()),
			'dataClients'   => $this->loadClients($this->getUser()),
			'dataAccounts'  => $this->loadAccounts($this->getUser()),
			//'tracking'      => $this->loadTracking2(),
			'tracking'		=> $this->lastTracking($this->getUser(), $lastDateTime),
			'history'		=> $this->loadTracking4(2002, '2020-07-01 09:20:34', '2020-07-01 12:09:50', '', ''),
			'traceConfig'	=> $this->loadUserConfig($this->_userInfo->user),
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES,
			'caption'		=> 'Unidades',
			//'id'            => 'U-'.$this->panel->id,
			'followMe'		=> true,
			'delay'			=> 10000,
			'infoId'		=> $this->eparams->infoId ?? false,
			'statusId'		=> $this->eparams->statusId ?? false,
			'searchUnitId'	=> $this->eparams->searchUnitId ?? false,
			'infoInput'		=>$this->infoInput(),
			'unitInputs'	=>$this->loadUnitInputs($this->getUser()),
			'msgErrorUnit'	=> "Unidad no encontrada!!!",
			'msgErrortracking'=> "La Unidad no presenta datos de Posición!!!",
			'infoForm'		=> $infoForm->getInit(),
			'infoPopup'		=> $infoPopup->getInit(),
			'infoTrace'		=> $infoTrace->getInit(),
			'propertysInfo' => $this->getPropertysInfo()
		];

		$this->setSes('lastDateTime', $lastDateTime);
		$this->setInit($this->info);

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

}