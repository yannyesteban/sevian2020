<?php

namespace GT;


class Map extends \Sevian\Element{

	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}
        $this->cn = \Sevian\Connection::get();
	}
	
	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
        }
		switch($method){
			case 'load':
				$this->load();
				break;
			case 'x':

				break;
		}

		return true;
	}


	public function load(){
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-map-'.$this->id;
		
		$this->typeElement = 'GTMap';

		$images = [
			"airport.png","alcabala.png","bank.png","Binoculars.png","bridge_01.png","building.png","buildings.png","bulb_grey.png","cama.png","cargo-1-icon.png","car_repair.png","car_repair_blue 2.png","church.png","city-icon.png","city.png","coal_power plant.png","Drug-basket-icon.png","drugstore-icon.png","Drugstore.png","Drugstore_azul.png","gas_station.png","goverment_01.png","goverment_icon.png","Hangar-icon.png","home.png","home2.png","hospital.png","hotel.png","iglesia.png","laboratory.png","maison_viii_256.png","mall1.png","pharmacy.png","police.png","post_office.png","property_icon.png","ranger-station.png","restaurant_black1.png","restaurant_black2.png","restaurant_blue_2.png","retail-shop-icon.png","risk.png","school.png","shopping-cart-icon.png","sin-senal.png","squat_marker_orange-31px.png","stadium.png","university.png"

		];
		
		foreach ($images as $k => $img){
			$images[$k] = PATH_IMAGES."sites/".$img;
		}


		$this->info = [
			'id'=>$this->panel->id,
			'panel'=>$this->id,
			'markImages' => $images,
			'markDefaultImage' => PATH_IMAGES."sites/"."squat_marker_orange-31px.png"
		];

		
	}
}