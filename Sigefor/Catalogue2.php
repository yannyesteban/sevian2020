<?php
namespace sigefor;

require_once 'DBTrait/Catalogue2.php';


class Catalogue2
    extends \Sevian\Element

	
{

    use	DBTrait\Catalogue2{
		DBTrait\Catalogue2::init as loadCatalogue;
	}
    

    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;
	
	private $_jsonRequest = null;
	private $html = '';
	private $caption = '';
	private $class = '';

	static public $patternJsonFile = '';
	static public $patternTemplateFile = '';

	
    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}
		
        $this->cn = \Sevian\Connection::get();
	}
	public function config(){
		
	}

	public function evalMethod($method = false): bool{
		
		if($method){
            $this->method = $method;//$method = $this->method;
		}
		
		$this->load();
		
		
		return true;
	}
	
	private function load(){
		$this->loadCatalogue($this->name, self::$patternJsonFile);

		$this->html = $this->evalTemplate($this->htmlTemplate, 'master');
		$this->title = $this->caption;
		

    }

	public function getHTML(){
		return ($this->html)? $this->html: $this->msgError->any??'error';
		
	}

	public function getPanel(){
		
        $this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-catalogue-'.$this->id;
		
		$this->panel->innerHTML = $this->getHTML();

		return $this->panel;	
	}
	

}