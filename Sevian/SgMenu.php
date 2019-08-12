<?php



class SgMenu extends Sevian\Panel{
	
	
	public $title = "MENU 4.0";
	
	public function render(){
		
		global $sevian;
		
		$sevian->setPanelSign($this->panel, "save_cosa", array(
			
			array("vses"=>array("titulo"=>"Principal 2017")),
			array("setPanel"=>array("panel"=>8, "element"=>"menu")),
			array("setPanel"=>array("panel"=>7, "element"=>"procedure"))
		
		));
		
		
		$this->title .= " Panel($this->panel)";
		return "($this->panel) $this->title ... El Menu->".'<input type="submit" name="submit1" id="submit1" value="Enviar">';
		
	}
	
}


?>