<?php

class ssFragment extends Sevian\Panel{
	
	public $title = "FORM 3.0";
	
	
	public function test(){
		$cn = Sevian\Connection::get("sevian_2017_pg");
		
		$data = [
			"id"=>false,
			"cedula"=>"1247473",
			"nombre"=>"Yanny",
			"apellido"=>"Nuñez",
			
			"__record_mode" => 1,
			"__record" => [],
			
		];
		
		$data1[] = [
			
			"codpersona"=>"",
			"usuario"=>"pepe",
			"rol"=>"admin",
			"__record_mode" => 1,
			"__record" => [],
			
		];
		
		$data1[] = [
			
			"codpersona"=>"",
			"usuario"=>"juan",
			"rol"=>"user",
			"__record_mode" => 1,
			"__record" => [],
			
		];
		
		
		$s = new \Sevian\Record();
		$s->setConnection("sevian_2017_pg");
		$s->setData($data);
		$s->setTable("personas");
		
		
		//$s->table = "personas";
		//$s->keys = $infoTable->keys;

		
		
		$s1 = new \Sevian\Record();
		$s1->setConnection("sevian_2017_pg");
		$s1->setData($data1);
		$s1->setTable("persona_usuario");
		$s1->master["codpersona"] = "id";
		
		$s->addDetail($s1);
		
		
		$s->save();
		
		print_r(Sevian\Debug\Log::request());
	}
	
	public function render(){
		
		//$this->test();
		
		
		return "Fragmento 2017";
		/*
		
		$rules["required"] = ["msg"=>"Obligatorio"];
		//$rules["alpha"] = true;
		//$rules["exp"] = ["value"=>'{^[abc]+$}', "msg"=>"dese ser igual a mil {=title}"];
	
		$rules["lessequal"] = ["value"=>80];
	


		$error = Sevian\Valid::send($rules, '500', "hola", array());
		
		hr($error);
		
		return "ccc";
		*/
		$cn = Sevian\Connection::get("sevian_2017_pg");
		
		
		
		
		$dataDetalle[] = array(
			"id"			=> "",
			"codfactura"	=> false,
			"codproducto"	=> 6,
			"cantidad"		=> 5,
			
			"precio"		=> 69.35,
			"__record_mode"	=> 1,
			//"__record_id"=>"personaId",
			"__record_id"	=> false,
			"__record"		=> ["id"=>8],
			
		
		);
		$dataDetalle[] = array(
			"id"			=> "",
			"codfactura"	=> false,
			"codproducto"	=> 5,
			"cantidad"		=> 2,
			
			"precio"		=> 14.00,
			"__record_mode"	=> 1,
			//"__record_id"=>"personaId",
			"__record_id"	=> false,
			"__record"		=> ["id"=>8],
			
		
		);
		
		$dataDetalle[] = array(
			"id"			=> "",
			"codfactura"	=> false,
			"codproducto"	=> 1,
			"cantidad"		=> 3,
			
			"precio"		=> "66.89",
			"__record_mode"	=> 1,
			//"__record_id"=>"personaId",
			"__record_id"	=> false,
			"__record"		=> ["id"=>8],
			
		
		);
		
		
		$dataFactura = array(
			"codfactura"	=>"4",
			"descripcion"	=>"Productos Regulados Navidad",
			"fecha"			=>"2015-12-08",
			"numero"		=>10001,
			
			"detalle"		=>$dataDetalle,
			"__record_mode"	=>2,
			//"__record_id"=>"personaId",
			"__record_id"	=>false,
			"__record"		=>["codfactura"=>4],
			
		
		);
		
		$iFacturaDet = $cn->infoTable("factura_det");
		
		$iFacturaDetFields = array();
		foreach($iFacturaDet->fields as $field){
			$iFacturaDetFields[$field->name] = new Sevian\InfoRecordField($field);
			
		}
		
		
		
		$fd = new \Sevian\Record();
		//$fd->dataRecords = $recordId;
		$fd->fields = $iFacturaDetFields;
		$fd->tables = $iFacturaDet->tables;
		$fd->connectionId = "sevian_2017_pg";
		$fd->keys = $iFacturaDet->keys;
		
		$fd->master["codfactura"] = "codfactura";
		
		
		
		$iFactura = $cn->infoTable("facturas");
		
		$iFacturaFields = array();
		foreach($iFactura->fields as $field){
			$iFacturaFields[$field->name] = new Sevian\InfoRecordField($field);
			
		}
		
		$iFacturaFields["detalle"] = new Sevian\InfoRecordField(array(
			"name"=>"detalle",
			"field"=>"detalle",
			
			"details"=>$fd
		));
		
		
		
		
		$iFacturaFields["descripcion"]->rules = [
			"email_"=>false
			
			
		];
		
		$f = new \Sevian\Record();
		//$f->dataRecords = $recordId;
		$f->fields = $iFacturaFields;
		$f->tables = $iFactura->tables;
		$f->connectionId = "sevian_2017_pg";
		$f->keys = $iFactura->keys;
		
		
		
		
		
		
		print_r($f->save($dataFactura));
		
		print_r(Sevian\Debug\Log::request());
		return "El Fragmento";
		
		$cn = Sevian\Connection::get("sevian_2017_pg");
		
		$infoTable = $cn->infoTable("personas");
		
		//print_r($infoTable);
		$recordId["personaId"] = ["id"=>4];
		
		
		$_info = array();
		foreach($infoTable->fields as $field){
			$_info[$field->name] = new Sevian\InfoRecordField($field);
			
		}
		
		
		$infoTable2 = $cn->infoTable("ciudades");
		
		//print_r($infoTable);
		
		$_info2 = array();
		foreach($infoTable2->fields as $field){
			$_info2[$field->name] = new Sevian\InfoRecordField($field);
			
		}
		
		
		$s2 = new \Sevian\Record();
		$s2->dataRecords = $recordId;
		$s2->fields = $_info2;
		$s2->tables = $infoTable2->tables;
		$s2->connectionId = "sevian_2017_pg";
		$s2->keys = $infoTable2->keys;
		
		
		$_info["ciudades"] = new Sevian\InfoRecordField(array(
			"name"=>"ciudades",
			"field"=>"ciudades",
			
			"details"=>$s2
		));
		
		$_info["nombre"]->upper = true;
		
		
		
		$data2[] = array(
			"id"=>"",
			"cedula"=>"4444",
			"ciudad"=>"caracas",
			"__record_mode"=>1,
			//"__record_id"=>"personaId",
			"__record_id"=>false,
			"__record"=>["id"=>8],
		
		);
		$data2[] = array(
			"id"=>"",
			"cedula"=>"1254",
			"ciudad"=>"Maracay",
			"__record_mode"=>1,
			//"__record_id"=>"personaId",
			"__record_id"=>false,
			"__record"=>["id"=>8],
		
		);
		$data2[] = array(
			"id"=>"",
			"cedula"=>"6665",
			"ciudad"=>"Valencia",
			"__record_mode"=>1,
			//"__record_id"=>"personaId",
			"__record_id"=>false,
			"__record"=>["id"=>8],
		
		);
		
		
		$data = array(
			"id"=>"",
			"cedula"=>"10000",
			"nombre"=>"Jose Maria",
			"apellidos"=>"Perez",
			"ciudades"=>$data2,
			
			"__record_mode"=>2,
			//"__record_id"=>"personaId",
			"__record_id"=>false,
			"__record"=>["id"=>8],
			
		
		);
		
		$s = new \Sevian\Record();
		$s->dataRecords = $recordId;
		$s->fields = $_info;
		$s->tables = $infoTable->tables;
		$s->connectionId = "sevian_2017_pg";
		$s->keys = $infoTable->keys;
		
		$s->save($data);
		print_r(Sevian\Debug\Log::request());
		
		//$this->script = "alert(9);";
		return "El Fragmento <br> <br> ($this->panel)".'<input type="submit" name="submit1" id="submit1" value="Enviar">';
		
	}
	
	public function _getScript(){
		
		$this->script .= "alert(8);";
		return $this->script;
		
	}
	
}


?>