<?php
namespace GT;

require_once MAIN_PATH.'GT/Trait.php';

class Site
    extends \Sevian\Element
	implements 
		\sevian\JasonComponent,
		\sevian\JsonRequest
	
{

   
    use DBSite;
   
    

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
		
		switch($method){
			case 'load':
				$this->load();
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
			case 'tracking':
				
				break;
			default:
				break;

		}
		
		return true;
	}
	
	public function init(){
		$images = [
			"airport.png","alcabala.png","bank.png","Binoculars.png","bridge_01.png","building.png","buildings.png","bulb_grey.png","cama.png","cargo-1-icon.png","car_repair.png","car_repair_blue 2.png","church.png","city-icon.png","city.png","coal_power plant.png","Drug-basket-icon.png","drugstore-icon.png","Drugstore.png","Drugstore_azul.png","gas_station.png","goverment_01.png","goverment_icon.png","Hangar-icon.png","home.png","home2.png","hospital.png","hotel.png","iglesia.png","laboratory.png","maison_viii_256.png","mall1.png","pharmacy.png","police.png","post_office.png","property_icon.png","ranger-station.png","restaurant_black1.png","restaurant_black2.png","restaurant_blue_2.png","retail-shop-icon.png","risk.png","school.png","shopping-cart-icon.png","sin-senal.png","squat_marker_orange-31px.png","stadium.png","university.png"

		];
		//echo(json_encode($images));exit;
		foreach ($images as $k => $img){
			$images[$k] = PATH_IMAGES."sites/".$img;
		}
		

		$form =  new \Sigefor\Component\Form2([
			
			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/site', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],
			
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
	
	private function load(){
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-site-'.$this->id;
		$this->panel->innerHTML = 'gt-site-'.$this->id;
		$this->typeElement = 'GTSite';

		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'tapName'=>'yanny'
		];

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