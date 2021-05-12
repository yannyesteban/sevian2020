<?php
namespace GT;



class Test
    extends \Sevian\Element
	implements 
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\UserInfo
	
{

   
    

    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;
	
	private $_jsonRequest = null;

	public $jsClassName = 'GTHistory';

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
			case 'test':
				$this->load();
				break;
			case 'load':
				$this->load();
				break;
			case 'load-data':
				
			default:
				break;

		}
		
		return true;
	}
	
	
	private function load(){
		

        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-history-'.$this->id;
		$this->panel->innerHTML = 'gt-history-'.$this->id;
		//$this->typeElement = 'GTHistory';
		$this->jsClassName = '';

		$this->info = [
			
			'caption'		=> 'Historial',
			'id'            => $this->id,
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

	public function setUserInfo($info){
        $this->_userInfo = $info;
    }
    public function getUserInfo(){
        return $this->_userInfo;
    }


}