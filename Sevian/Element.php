<?php
namespace Sevian;

interface DocElement{
    

    public function getMain();
    
    
    

}

class Element{

    static $_element = false;
	
	public $panel = false;
	public $element = "default";
	public $name = "";
	public $method = "";
	public $eparams = array();

	public $typePanel = "normal";
	public $async = false;
	public $updated = false;
	public $title = "";
	

	public $html = "";
	public $script = "";
	public $css = "";
	
	private $onDesing = true;
	private $onDebug = true;
	
	private $winParams = false;
	
	private $_signs = false;
	private $_infoRequest = false;

    public function evalMethod($method = ""){

    }

}

?>