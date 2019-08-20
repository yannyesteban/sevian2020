<?php

namespace Sevian\Sigefor;

class Article extends \Sevian\Element{

    protected $tArticles = '_sg_articles';
    

    public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			$this->$k = $v;
		}

        
        $this->cn = \Sevian\Connection::get();
	}

    public function evalMethod($method = false): bool{
		

        if($method === false){
            $method = $this->method;
        }


        
        
        switch($method){
            case 'create':

                
                
            case 'load':
                $this->_config();
               // $this->panel = new \Sevian\ElementPanel();
       $this->panel = new  \Sevian\HTML('');
        //$this->_panel->style = "color:pink";
        $this->panel->innerHTML = $this->html;
        //$this->panel->appendChild($div);
				//$this->panel->innerHTML = $this->html;
                break;
            case 'delete':
                break;
            case 'get_field_data':
                break;
                
                
                
        }
        return true;	
    }
	public function _getMain(){
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