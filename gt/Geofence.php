<?php
namespace GT;

require_once MAIN_PATH.'gt/Trait.php';

class Geofence
    extends \Sevian\Element
	implements
		\sevian\JasonComponent,
		\sevian\JsonRequest

{


    use DBGeofence{
		DBGeofence::loadRecord as public loadGeofence;
	}



    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;

	public $userData = [];

	private $_jsonRequest = null;
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
            $method = $this->method;
		}
		if($this->getSes('_userData')){
			$this->userData = $this->getSes('_userData');

		}


		switch($method){
			case 'load':
				$this->load();
				break;
            case 'load-sites':


                $this->_name = $this->name;
                $this->_type = 'GTGeofence';
                $this->_mode = '';
                $this->_info = [
					'dataMain'		=> $this->loadGeofences(),

					'popupTemplate' => $this->popupTemplate,
					'infoTemplate'	=> $this->infoTemplate,

					'pathImages'	=> PATH_IMAGES,
					'caption'		=> 'Geocercas',
					'id'            => $this->id,
					'followMe'		=> true,
					'delay'			=> 60000,
				];
			case 'test':
				$this->addResponse([
					'type'=>'update',
					'id'=>$this->id,
					'actions'=>[
						['property'=>'name4', 'value'=>'yanny esteban 24'],
						['method'=>'test', 'value'=>'cool']
					]


				]);
				break;

			case 'get-record':

				$id = $this->eparams->geofenceId?? \sevian\s::getReq('id');
				//hx(json_encode(\sevian\s::getVReq(), JSON_PRETTY_PRINT));
				$this->addResponse([

					'id'=>$this->id,
					'data'=>[
						'list'=>$this->listGeofences(),
						'data'=>$this->loadGeofence($id)
					],
					'iToken'=>$this->iToken

				]);

				break;
			case 'get-geofences':

				$this->setRequest($this->listGeofences());
				break;
			case 'geofence-load':

				$id = $this->eparams->geofenceId?? \sevian\s::getSes('_geofenceLast');

				$form =  new \Sigefor\Component\Form2([

					'id'		=> $this->containerId,
					'panelId'	=> $this->id,
					'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/geofence', self::$patternJsonFile),
					'method'	=> 'load',
					'mode'		=> 2,
					'userData'	=> $this->userData,

					'record'=>['id'=>$id]
				]);
				$this->setRequest($form);


			break;
			default:
				break;

		}

		return true;
	}

	public function init(){}

	private function load(){
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-geofence-'.$this->id;
		$this->panel->innerHTML = 'gt-geofence-'.$this->id;


		$this->jsClassName = 'GTGeofence';
		//$this->typeElement = 'GTCota';

		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'mapName'     	=> $this->eparams->mapName ?? '',
			'caption'=>'Geocercas',
			'formId'=>$this->eparams->formId??"form_".$this->id,

			'dataMain'		=> $this->loadGeofences(),

			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,

			'pathImages'	=> PATH_IMAGES,
			'caption'		=> 'Geocercas',
			'id'            => $this->id,
			'followMe'		=> true,
			'delay'			=> 60000,
			'geofenceForm'	=> $this->getGeofenceForm(1)
];
		$this->setInit($this->info);

		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'GTGeofence',
			'iClass'	=> 'GTGeofence',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> $this->info
		]);

    }


	public function save($data){
		$master['f'][]=
			[
				'id'=>$data->id
			];

		$formSave =  new \Sigefor\Component\FF([
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/geofence', self::$patternJsonFile),
			'dataKeys'	=> $master,//$this->_masterData,
			'dataKeysId'=> 'f',
			'data'		=> [$data]
		]);
		$this->lastRecord = $data->id;
		//	hx($formSave->getResult());
		//print_r($formSave->getResult());
		\sevian\s::setSes('_siteLast', $this->lastRecord);

		foreach($formSave->getResult() as $k => $v){

			if(!$v->error){

				return new \Sevian\iMessage([
					'caption'	=> $formSave->getCaption(),
					'text'		=> 'Record was saved!!!'
				]);

			}else{

				return new \Sevian\iMessage([
					'caption'	=> 'Error '.$formSave->getCaption(),
					'text'		=> "Record wasn't saved!!!"
				]);

			}
		}
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

	public function getGeofenceForm($id=""){
		$form =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/geofence', self::$patternJsonFile),
			'method'	=> 'load',
			'mode'		=> 2,
			'userData'	=> $this->userData,

			'record'=>['id'=>$id]
		]);

		return $form;

	}



}