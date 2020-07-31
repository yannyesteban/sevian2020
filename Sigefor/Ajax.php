<?php

namespace Sigefor;

class Ajax extends \Sevian\Element implements \Sevian\JsonRequest{

    protected $tArticles = "_sg_articles";
    

    public function __construct($opt = []){
		$this->dinamic = true;
		foreach($opt as $k => $v){
			$this->$k = $v;
		}

		$this->_main = new \Sevian\HTML('div');
		$this->_main->style = "color:red";
        $this->_main->innerHTML = "ajax";
        
        $this->cn = \Sevian\Connection::get();
	}

    public function evalMethod($method = false): bool{
		

        if($method === false){
            $method = $this->method;
        }

		$this->panel = new \Sevian\HTML('div');
		$this->panel->style = "color:yellow";
		$this->panel->innerHTML = "hola.. 2024";
        $this->panel->script = 'document.title="color:aqua";document.body.style="color:aqua";';
        switch($method){
            case 'create':

                
                
            case 'load':
                $this->_config();
				$this->_main->innerHTML = $this->html;
                break;
            case 'delete':
                break;
            case 'get_field_data':
                break;
                
                
                
		}
		
		$this->addFragment(new \Sevian\iFragment([
			"targetId"=>"titulo",
			"html"=>"Mi Primer Fragmento"

		]));

		$this->addFragment(new \Sevian\iFragment([
			"targetId"=>"nombre",
			"html"=>"Mi Primer Nombre"

		]));

		$this->addFragment(new \Sevian\iPropertyHTML([
			"targetId"=>"milogo",
			"style"=>['width'=>'50px'],
			"propertys"=>['title'=>'hola a la imagen',
			'width'=>'10px']

		]));
		
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
    public function getRequest(){


        
    }
}



?>