<?php
namespace GT;

require_once MAIN_PATH.'gt/Trait.php';

class Site
    extends \Sevian\Element
	implements
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\ListenSigns,
		\Sevian\UserInfo

{


    use DBSite{
	//	DBSite::loadSite as public loadSite;
	}



    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;

	private $_jsonRequest = null;
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
	<div class="units-info site-info">

		<div data-value="{=site_id}">Nombre</div>
		<div>{=name}</div>
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


		if($this->getSes('_userData')){
			$this->userData = $this->getSes('_userData');
			//$this->setSes('_userData', $this->userData);
		}
		switch($method){
			case 'load':

				$this->load();

				break;
			case 'get-record':

				$id = $this->eparams->siteId?? \sevian\s::getReq('id');

				//hx(json_encode(\sevian\s::getVReq(), JSON_PRETTY_PRINT));
				$this->addResponse([

					'id'=>$this->id,
					'data'=>[
						'list'=>$this->listSites($this->getUser()),
						'categoryList'=>$this->listCategorys($this->getUser()),
						'data'=>$this->loadSite($id, $this->getUser())
					],
					'iToken'=>$this->iToken

				]);

				break;
            case 'load-sites':


                $this->_name = $this->name;
                $this->_type = 'GTUnit';
                $this->_mode = '';
                $this->_info = [
					'dataSite'		=> $this->loadSites(),
					'dataCategory'	=> $this->loadCategorys(),
					'popupTemplate' => $this->popupTemplate,
					'infoTemplate'	=> $this->infoTemplate,

					'pathImages'	=> PATH_IMAGES,
					'caption'		=> 'Sitios',
					'id'            => 'ks',
					'followMe'		=> true,
					'delay'			=> 60000,
				];
				break;
			case 'tracking':

				break;
			case 'update':

				//$this->test();
				hx('');
				//hx($this->loadRecord(\sevian\s::getReq('id')));
				//hx(\sevian\s::getVReq());
				$this->setJSActions([[
					'method'  => 'updateSite',
					'value'=> $this->update(\sevian\s::getReq('id')),

				]]);


				break;
			case 'site-load':

				$id = $this->eparams->siteId?? \sevian\s::getSes('_siteLast');

				$form =  new \Sigefor\Component\Form2([

					'id'		=> $this->containerId,
					'panelId'	=> $this->id,
					'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/site', self::$patternJsonFile),
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

	public function init(){
		hr(8888);
		$form =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/site', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'	=> $this->userData,

			//'record'=>$this->getRecord()
		]);

		return [
			'dataSite'     => $this->loadSites(),
			'dataCategory' => $this->loadCategorys(),
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES."sites/",
			'caption'		=> 'Sitios',
			'id'            => 'ks',
			'followMe'		=> true,
			'delay'			=> 60000,
			'form'     => $form,
			//'images'=>$images
		];
	}

	public function update($lastId = 0){
		return [
			'dataSite'		=> $this->loadSites(),
			'dataCategory'	=> $this->loadCategorys(),
			'lastId'		=> $lastId

		];
	}

	private function load(){
		$this->panel = new \Sevian\HTML('div');
		if(\is_numeric($this->id)){
			$this->panel->id = 'gt-site-'.$this->id;
		}
		//$this->panel->innerHTML = 'gt-site-'.$this->id;
		//$this->typeElement = 'GTSite';
		$this->jsClassName = 'GTSite';
		$this->info = [
			'mapName'     	=> $this->eparams->mapName ?? '',
			'dataMain'     	=> $this->loadSites($this->getUser()),
			'dataCategory' 	=> $this->loadCategorys($this->getUser()),
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES."sites/",
			'caption'		=> 'Sitios',
			//'id'            => 'ks',
			'followMe'		=> true,
			'delay'			=> 60000,
			//'form'     => $form,

			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'infoId'		=> $this->eparams->infoId ?? false,
			'formId'		=> $this->id.'-form'
		];

		//$this->setInit($this->info);

		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'GTSite',
			'iClass'	=> 'GTSite',
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
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/site', self::$patternJsonFile),
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

	public function getTaskXSigns(){

		return [
			"form:/form/site2:save"=>[[
				"t"=>"addSes",
				"param"=>["kkk"=>""]
			],[
				"t"=>"setMethod",
				"id"=>$this->id,
				"element"=>$this->element,
				"name"=>$this->name,
				"method"=>"update",
				"mode"=>"element",
				"eparams"=>[]
			]],
			"form:/form/site:save"=>[[
				"t"=>"setMethod",
				"id"=>$this->id,
				"element"=>$this->element,
				"name"=>$this->name,
				"method"=>"update",
				"mode"=>"element",
				"eparams"=>[]
			]],
		];
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