<?php

namespace Sevian\Sigefor;

class Article extends \Sevian\Panel2 implements \Sevian\DocElement{

    protected $tArticles = "_sg_articles";
    

    public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			$this->$k = $v;
		}

		$this->_main = new \Sevian\HTML('div');
		$this->_main->style = "color:red";
        $this->_main->innerHTML = "betha";
        
        $this->cn = \Sevian\Connection::get();
	}

    public function evalMethod($method = false): bool{
		

        if($method === false){
            $method = $this->method;
        }
        
        //$this->loadForm();
        $this->_config();
        //$this->script = ";alert(88888);";

        $this->_main->innerHTML = $this->html;
        switch($method){
            case 'create':

                
                
            case 'load':
                //$this->main = $this->load();
                break;
            case 'delete':
                break;
            case 'get_field_data':
                break;
                
                
                
        }
        return true;	
    }
	public function getMain(){
		return true;
	}

    private function _config(){

		$cn = $this->cn;

		$cn->query = "
			SELECT * 
			FROM $this->tArticles 
			WHERE article = '$this->name'";
        
            
       

		$result = $cn->execute();
		
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}

			$this->_menu = (array)json_decode($this->config);
			$this->_menu["caption"] = $this->_config["caption"]??$this->title;
			$this->_menu["class"] = $this->_config["class"] ?? $this->class;


		}

	}

}



?>