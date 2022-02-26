<?php
namespace GT;

require_once MAIN_PATH.'Sigefor/JasonFile.php';
require_once MAIN_PATH.'gt/Trait.php';

class Alarm
    extends \Sevian\Element
	implements
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\UserInfo

{


    use DBAlarm;



    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;

	private $_jsonRequest = null;

	static public $patternJsonFile = '';
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
			case 'init-record':

				//$id = $this->eparams->geofenceId?? \sevian\s::getReq('id');
				//hx(json_encode(\sevian\s::getVReq(), JSON_PRETTY_PRINT));
				$this->addResponse([
					'id'	=> $this->id,
					'data'	=> $this->initRecord(0),
					'iToken'=> $this->iToken
				]);

				break;
			case 'get-record':
				$id = $this->eparams->id ?? \sevian\s::getReq('id');

				$this->addResponse([
					'id'	=> $id,
					'data'	=> $this->loadRecord($id),
					'iToken'=> $this->iToken
				]);
				break;
            case 'load-sites':


                $this->_name = $this->name;
                $this->_type = 'GTAlarm';
                $this->_mode = '';
                $this->_info = [
					'dataMain'		=> $this->loadSites(),
					'dataCategory'	=> $this->loadCategorys(),
					'popupTemplate' => $this->popupTemplate,
					'infoTemplate'	=> $this->infoTemplate,

					'pathImages'	=> PATH_IMAGES,
					'caption'		=> 'Sitios',
					'id'            => 'ks',
					'followMe'		=> true,
					'delay'			=> 60000,
				];
			case 'delete':
				$formSaveAlarm =  new \Sigefor\Component\FF([
					'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/alarm', self::$patternJsonFile),
					//'dataKeys'	=> $this->_masterData,
					'dataKeysId'=> 'grid',
					'data'		=> [\Sevian\S::getVReq()]
				]);

				$this->deleteConfig(\sevian\s::getReq('id'));


				$this->addResponse([
					'type'=>'',
					'id'=>$this->id,
					'data'=>[
						'data'=>\Sevian\S::getVReq(),
						'result' => $formSaveAlarm->getResult()
					],
					'iToken'=>$this->iToken
				]);
				break;
			case 'save':
				\sevian\s::setReq('user', $this->getUser());

				$formSaveAlarm =  new \Sigefor\Component\FF([
					'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/alarm', self::$patternJsonFile),
					//'dataKeys'	=> $this->_masterData,
					'dataKeysId'=> 'grid',
					'data'		=> [\Sevian\S::getVReq()]
				]);

				$this->deleteConfig(\sevian\s::getReq('id'));

				$config = json_decode(\sevian\s::getReq('config'));

				$f = array_map(function ($e) use ($config){
					return (object)[
						'alarm_id'=>\sevian\s::getReq('id'),
						'unit_id'=>$e,
						'__mode_'=>1,
						'__id_'=>0
					];
				}, $config->unit);
				$formSave =  new \Sigefor\Component\FF([
					'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/alarm_unit', self::$patternJsonFile),
					//'dataKeys'	=> $this->_masterData,
					'dataKeysId'=> 'grid',
					'data'		=> $f
				]);

				$f = array_map(function ($e) use ($config){
					return (object)[
						'alarm_id'=>\sevian\s::getReq('id'),
						'geofence_id'=>$e->id,
						'__mode_'=>1,
						'mode'=>$e->mode,
						'__id_'=>0
					];
				}, $config->geofence);
				//hx($f);
				$formSave =  new \Sigefor\Component\FF([
					'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/alarm_geofence', self::$patternJsonFile),
					//'dataKeys'	=> $this->_masterData,
					'dataKeysId'=> 'grid',
					'data'		=> $f
				]);


				$f = array_map(function ($e) use ($config){
					return (object)[
						'alarm_id'=>\sevian\s::getReq('id'),
						'mark_id'=>$e->id,
						'__mode_'=>1,
						'radius'=>$e->radius,
						'mode'=>$e->mode,
						'__id_'=>0
					];
				}, $config->mark);
				//hx($f);
				$formSave =  new \Sigefor\Component\FF([
					'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/alarm_mark', self::$patternJsonFile),
					//'dataKeys'	=> $this->_masterData,
					'dataKeysId'=> 'grid',
					'data'		=> $f
				]);

				$f = array_map(function ($e) use ($config){
					return (object)[
						'alarm_id'=>\sevian\s::getReq('id'),
						'input_id'=>$e->id,
						'__mode_'=>1,

						'mode'=>$e->mode,
						'__id_'=>0
					];
				}, $config->input);
				//hx($f);
				$formSave =  new \Sigefor\Component\FF([
					'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/alarm_input', self::$patternJsonFile),
					//'dataKeys'	=> $this->_masterData,
					'dataKeysId'=> 'grid',
					'data'		=> $f
				]);

				$this->addResponse([
					'type'=>'',
					'id'=>$this->id,
					'data'=>[
						'data'=>\Sevian\S::getVReq(),
						'result' => $formSaveAlarm->getResult()
					],
					'iToken'=>$this->iToken
				]);

				break;
			default:
				break;

		}

		return true;
	}



	private function load(){

		$form =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/alarm', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],



			//'record'=>$this->getRecord()
		]);


		$this->info = [
			'id'=>$this->id,
			'panel'=>$this->id,
			'tapName'=>'yanny',
			'caption'		=> 'Alarmas',
			'form'     => $form,
			'data'=>[
				'alarm'     => $this->listAlarms($this->getUser()),
				'geofence' => $this->listGeofences(0, $this->getUser()),
				'mark' => $this->listMarks(0, $this->getUser()),
				'input' => $this->listInputs(0, $this->getUser()),
				'unit' => $this->listUnits(0, $this->getUser())
			]
		];


		//$this->setInit($this->info);
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'GTAlarm',
			'iClass'	=> 'GTAlarm',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> $this->info
		]);

    }
	private function initRecord($id){

		return [
			'record' => null,
			'alarm'     => $this->listAlarms($this->getUser()),
			'geofence' => $this->listGeofences($id, $this->getUser()),
			'mark' => $this->listMarks($id, $this->getUser()),
			'input' => $this->listInputs($id, $this->getUser()),
			'unit' => $this->listUnits($id, $this->getUser())
		];

    }
	private function loadRecord($id){

		return [
			'record' => $this->loadAlarm($id, $this->getUser()),
			'alarm'     => $this->listAlarms($this->getUser()),
			'geofence' => $this->listGeofences($id, $this->getUser()),
			'mark' => $this->listMarks($id, $this->getUser()),
			'input' => $this->listInputs($id, $this->getUser()),
			'unit' => $this->listUnits($id, $this->getUser())
		];

    }
    public function jsonSerialize(): mixed {
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