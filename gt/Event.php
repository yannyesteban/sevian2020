<?php
namespace GT;

require_once MAIN_PATH.'gt/Trait.php';

class Event
    extends \Sevian\Element
	implements 
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\UserInfo
	
{

   
    use DBEvent;
   
    

    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;
	
	private $_jsonRequest = null;

	static $patternJsonFile = '';

	
	

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
				//$this->load();
				$this->setRequest($this->loadDataEvent($this->eparams->lastEventId?? 0));

				break;
			case 'update-status':
				$userInfo = $this->getUserInfo();
				$this->setStatus($this->eparams->eventId?? 0, $this->eparams->status?? 0, $userInfo->user);
				$this->setRequest([
					"eventId"=>$this->eparams->eventId?? 0,
					"status"=>$this->eparams->status?? null,
					"windowId"=>$this->eparams->windowId?? 0,
					'mode'=>$this->eparams->mode?? 0,
					'user'=>$userInfo->user?? '',
					]);
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

		$form =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/history', self::$patternJsonFile),
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
			'id'            => 'ks',
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