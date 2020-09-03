<?php
namespace GT;

require_once MAIN_PATH.'gt/Trait.php';

class History
    extends \Sevian\Element
	implements 
		\sevian\JasonComponent,
		\sevian\JsonRequest
	
{

	use DBUnit;
    use DBHistory;
   
    

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
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-history-'.$this->id;
		$this->panel->innerHTML = 'gt-history-'.$this->id;
		$this->typeElement = 'GTHistory';

		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'tapName'=>'yanny'
		];

    }
	
	private function loadHistory(){

		$unitId = \SEVIAN\S::getReq('unit_id');
		$dateFrom = \SEVIAN\S::getReq('date_from');
		$hourFrom = \SEVIAN\S::getReq('hour_from');
		$dateTo = \SEVIAN\S::getReq('date_to');
		$hourTo = \SEVIAN\S::getReq('hour_to');
		$filter = \SEVIAN\S::getReq('filter');
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
				'value'		=> $this->infoUnit($unitId)
			],
			[
				'method'	=> 'setInfoUnitInfo',
				'value'		=> $this->infoUnitInput($unitId)
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

	

}