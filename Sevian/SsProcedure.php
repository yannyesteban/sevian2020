<?php

class SsProcedure extends Sevian\Panel{
	
	public $title = "Procedure 1.0";
	
	public function evalMethod($method = false){
		
		
		if($method == "test"){
			$this->addSing("save_cosa");
			return;
		}
		
		$this->targetId = "proc";
		$this->html = "Nuñez Jimenez";
		
		
	}
	
	
	public function render(){
		
		
		
		return "El Procedimiento ($this->panel)".'<input type="submit" name="submit1" id="submit1" value="Enviar">';
		
	}
	
}


?>