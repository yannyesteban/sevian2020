<?php
namespace Sevian\Sigefor;


class Map extends \Sevian\Element{


    
    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $form = new \Sevian\Panel('div');
        $form->id = "map_".$this->id;
        
        $this->panel = $form;
        $info = [
            "id"=>$form->id

        ];
        $this->typeElement = 'sgMap';
		$this->info = $info;//$form->getInfo();
    }



}


