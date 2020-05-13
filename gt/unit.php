<?php
namespace GT;

require_once MAIN_PATH.'GT/Trait.php';

class Unit
    extends \Sevian\Element
    implements \sevian\JasonComponent
{

    use DBClient;
	use DBAccount;
    use DBUnit;
    use DBTracking;
    

    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;
    
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
            case 'load-units':
                $data = $this->loadUnits();

                $this->_name = $this->name;
                $this->_type = 'GTUnit';
                $this->_mode = '';
                $this->_info = [
                    'dataUnits'     => $data,
                    'dataClients'   => $this->loadClients(),
                    'dataAccounts'  => $this->loadAccounts(),
                    'tracking'      => $this->loadTracking(),
                    'id'            => 'k'
                ];
			default:
				break;

		}
		
		return true;
	}
	
	private function load(){
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-unit-'.$this->id;
		$this->panel->innerHTML = 'gt-unit-'.$this->id;
		$this->typeElement = 'GTUnit';

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

}