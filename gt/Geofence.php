<?php
namespace GT;

require_once MAIN_PATH.'GT/Trait.php';

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
					'id'            => 'ks',
					'followMe'		=> true,
					'delay'			=> 60000,
				];
			case 'tracking':
				
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
	
	public function init(){

		$form =  new \Sigefor\Component\Form2([
			
			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/geofence', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],
			
			//'record'=>$this->getRecord()
		]);
		return [
			'dataMain'     => $this->loadGeofences(),
			
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES."sites/",
			'caption'		=> 'Geocercas',
			'id'            => 'ks',
			'followMe'		=> true,
			'delay'			=> 60000,
			'form'     => $form,
		];
	}
	
	private function load(){
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-geofence-'.$this->id;
		$this->panel->innerHTML = 'gt-geofence-'.$this->id;
		$this->typeElement = 'GTGeofence';

		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'tapName'=>'yanny'
		];

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

	

}