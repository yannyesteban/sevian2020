<?php
namespace GT;



class Info
    extends \Sevian\Element
	implements 
		\sevian\JasonComponent,
		\sevian\JsonRequest
	
{

    
    

    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;
	
	private $_jsonRequest = null;
	private $popupTemplate = '<div class="units-popup">
		<div class="unit-name">{=vehicle_name}</div>
		<div><div>Placa</div><div>{=plate}</div></div>
		<div><div>Marca</div><div>{=brand}</div></div>
		<div><div>Modelo</div><div>{=model}</div></div>
		<div><div>Color</div><div>{=color}</div></div>
		
		<div><div>Hora</div><div>{=date_time}</div></div>
		<div><div>Lng</div><div>{=longitude}</div></div>
		<div><div>Lat</div><div>{=latitude}</div></div>
		
		<div><div>Velocidad</div><div>{=speed}</div></div>
		
		<div><div>Heading</div><div>{=heading}</div></div>
		<div><div>Satellite</div><div>{=satellite}</div></div>
		<div><div>Inputs</div><div>{=input1}</div></div>
		<div><div>Outputs</div><div>{=output1}</div></div>
		
		</div>';

private $infoTemplate = '
	<div class="units-info">
	<div><div>Placa</div><div>{=plate}</div></div>
	<div><div>Marca</div><div>{=brand}</div></div>
	<div><div>Modelo</div><div>{=model}</div></div>
	<div><div>Color</div><div>{=color}</div></div>

	<div><div>Hora</div><div>{=date_time}</div></div>
	<div><div>Lng - Lat</div><div>{=longitude}, {=latitude}</div></div>

	<div><div>Velocidad</div><div>{=speed}</div></div>

	<div><div>Heading</div><div>{=heading}</div></div>
	<div><div>Satellite</div><div>{=satellite}</div></div>
	<div><div>Inputs</div><div>{=input1}</div></div>
	<div><div>Outputs</div><div>{=output1}</div></div>

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
            
			default:
				break;

		}
		
		return true;
	}
	
	public function init(){
		return [
			'dataUnits'     => $this->loadUnits(),
			'dataClients'   => $this->loadClients(),
			'dataAccounts'  => $this->loadAccounts(),
			'tracking'      => $this->loadTracking(),
			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES,
			'caption'		=> 'Unidades',
			'id'            => 'k',
			'followMe'		=> true,
			'delay'			=> 60000,
		];
	}
	
	private function load(){
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-info-'.$this->id;
		//$this->panel->innerHTML = 'gt-unit-'.$this->id;
		//$this->typeElement = 'GTUnit';
		$this->jsClassName = 'GTInfo';
		
		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'caption'=>'Info',			

		];

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

	public function setRequest($data){
		$this->_jsonRequest = $data;
	}
	
	public function getRequest(){
		return $this->_jsonRequest;
	}

}