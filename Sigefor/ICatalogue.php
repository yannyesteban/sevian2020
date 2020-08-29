<?php
namespace Sigefor;
require_once MAIN_PATH.'Sigefor/DBTrait/Icatalogue.php';

class ICatalogue extends \Sevian\Element {

	use DBTrait\Icatalogue{
		DBTrait\Icatalogue::init as loadICatalogue;
	}
	
	private $form = '';
	private $catalogue = '';

	private $getVForm = null;
	private $getEparam = null;

	public $jsClassName = 'SGICatalogue';
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

		$this->userData = [
			'panelId'=>$this->id,
			'element'=>$this->element,
			'elementName'=>$this->name,
			'elementMethod'=>$this->method
			
		];


		//$this->loadInfoInfo($this->name);
		switch($method){
			case 'load':
				$this->load();
				//$this->loadCatalogue('');
				//$this->loadCatalogue($this->name, self::$patternJsonFile);
				break;
			case 'load_info':

				$this->info[] = [
					'method'  => 'loadCatalogue',
					'value'=>$this->loadCatalogue(''),
					'_args' => [1,1,1]
				];
				//$this->setInit($this->info);
				//$this->loadCatalogue('');
				break;

			default:
				break;

		}
		
		return true;
	}
	


	
	private function load(){
		$this->loadICatalogue($this->name, self::$patternJsonFile);
		
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = $this->getPanelId();
		//$this->panel->innerHTML = 'gt-unit-'.$this->id;
		

		$g =  new \Sigefor\Component\Form2([
			'panelId'=>$this->id,
			//'name'=>$this->name,
			'name'=>JasonFile::getNameJasonFile($this->form, self::$patternJsonFile),
			'method'=>'request',
			'mode'=>1,
			'userData'=>$this->userData
			//'record'=>$this->getRecord()
		]);

		$this->info = [
			'id'=>$this->getPanelId(),
			'panel'=>$this->id,
			'tapName'=>'yanny',
			'form'	=> $g,
			'catalogue'=>$this->loadCatalogue('')
		];

		$this->setPanel($this->panel);
		$this->setInit($this->info);

	}
	
	private function loadCatalogue($unit_id){
		$this->loadICatalogue($this->name, self::$patternJsonFile);
		
		//$this->loadInfoInfo($this->name);

		

		$cat = new \Sigefor\Catalogue2([
			'id'=>$this->id,
			'name'=>$this->catalogue,
			//'name'=>JasonFile::getNameJasonFile($this->catalogue, self::$patternJsonFile),
			'method'=>'load'
		]);
		$cat->evalMethod();
		//hr($this->catalogue);
		//hr(JasonFile::getNameJasonFile($this->catalogue, self::$patternJsonFile));
		$info = [
			[
				"method"=>"loadCatalogue",
				"value"=>$cat->getHTML()
			]
		];
		$this->setInit(null);
		$this->setJSActions($info);
		
		//hx($cat->getInit());
		
		return "";$cat->getComponent();
		$this->info[] = [
			'method'  => 'loadCatalogue',
			'value'=>$cat->getComponent(),
			'_args' => [1,1,1]
		];
	} 
    
    


}