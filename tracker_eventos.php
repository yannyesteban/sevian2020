<?php
/*
$tiempo_inicio = microtime(true);
$a = "local1";


if($a == "local"){

	define ("C_SERVIDOR","192.168.1.21");
	define ("C_USUARIO","cota");
	define ("C_PASSWORD","cota1024x");
	define ("C_BDATOS","cota");
	
	include ("../sigefor21/configuracion.php");
	include ("../sigefor21/clases/sg_configuracion.php");
	include ("../sigefor21/clases/funciones.php");
	include ("../sigefor21/clases/funciones_sg.php");
	include ("../sigefor21/clases/cls_conexion.php");

}else{

	include ("constantes.php");
	//include ("D:/www/sigefor20/clases/sg_configuracion.php");
	//include ("D:/www/sigefor20/clases/funciones.php");
	//include ("D:/www/sigefor20/clases/cls_conexion.php");
	include ("sigefor20/configuracion.php");
	include ("sigefor20/clases/sg_configuracion.php");
	include ("sigefor20/clases/funciones.php");
	include ("sigefor20/clases/funciones_sg.php");
	include ("sigefor20/clases/cls_conexion.php");	
	
}// end if
*/
function init(){

	$cn = new cls_conexion;
	$cn->query = "SELECT track_id FROM alarma_update WHERE id=1";
					
	$result = $cn->ejecutar();

	if($rs = $cn->consultar($result)){
		
		return $rs["track_id"];	
		
		$track_id = $rs["track_id"];
		
		$cn->query = "SELECT id FROM tracks WHERE id > $track_id LIMIT 1";
						
		$result = $cn->ejecutar();
	
		if($rs=$cn->consultar($result)){

			$v1 = $rs["id"];

			if($v1){
				return $v1;	
			}
			exit;
		}// end if

	}// end if

}// end function

function test(){
	
	$cn = new cls_conexion;


		$cn->query = "delete from alarma_eventos";		
		$result = $cn->ejecutar(); 

	
		$cn->query = "select * from tracks_tay 
		/*WHERE id<17*/
		
		";		
		$result = $cn->ejecutar(); 
		
		while($rs=$cn->consultar($result)){
			$id = $rs["id"];
			
	
			getTracks2($rs["id"], $rs["codequipo"], $rs["id_equipo"],  $rs["fecha_hora"], $rs["longitud"], $rs["latitud"], $rs["velocidad"], $rs["input"]);
	
		
			

	
		};
		mysql_free_result($result);
	
	
}







function getTracks2($id, $codequipo, $id_equipo,  $fecha_hora, $longitud, $latitud, $velocidad, $input){
	
	
	//echo "\n id: $id, code: $codequipo, id: $id_equipo,  $fecha_hora, $longitud, $latitud, vel $velocidad, $input";
	
	$cn = new cls_conexion;



	$cn->query = "	
			SELECT
			av.codalarma,
			ag.codgeocerca,
			

			av.status as st, vel_max, vel_min,
			
			av.velocidad as last_vel,
			av.geocerca as last_geo,
			av.sitio as last_sit,
			
			a.alarma, a.descripcion,
			
			a.desde, a.hasta, 
			
			
			a.geo_modo, a.input_modo,
			ag.codgeocerca, ag.valor as gvalor,
			g.tipo as gtipo, g.coords, sitio_radio, sitio_modo,
			si.codsitio, si.latitud, si.longitud,
			
			
			/* el input que se busca*/
			ai.codinput,
			ai.codtipo, 
			
			vi.codvehiculo,
			
			
			/*los input definidos para el vehiculo*/
			vi.input_1, vi.input_on_1, vi.input_off_1,
			vi.input_2, vi.input_on_2, vi.input_off_2,
			vi.input_3, vi.input_on_3, vi.input_off_3,
			vi.input_4, vi.input_on_4, vi.input_off_4,
			vi.input_5, vi.input_on_5, vi.input_off_5,
			vi.input_6, vi.input_on_6, vi.input_off_6,
			vi.input_7, vi.input_on_7, vi.input_off_7,
			vi.input_8, vi.input_on_8, vi.input_off_8
			
		FROM alarma_vehiculos as av
		INNER JOIN alarmas as a ON a.codalarma = av.codalarma
		INNER JOIN cuenta_vehiculos as cv ON cv.codequipo = av.codequipo
		
		LEFT JOIN alarma_sitios as asi ON asi.codalarma = av.codalarma
	    LEFT JOIN sitios as si ON si.codsitio = asi.codsitio
		
		LEFT JOIN alarma_geocercas as ag ON ag.codalarma = av.codalarma
		LEFT JOIN geocercas as g ON g.codgeocerca = ag.codgeocerca
		
		LEFT JOIN alarma_inputs as ai ON ai.codalarma = av.codalarma
		
		LEFT JOIN inputs as i ON i.codinput = ai.codinput
		LEFT JOIN vehiculo_inputs as vi ON vi.codvehiculo = cv.codvehiculo

		WHERE av.codequipo = $codequipo 
		/*
		AND (a.desde is null OR '$fecha_hora' >= a.desde)
		AND (a.hasta is null OR '$fecha_hora' <= a.hasta)
		
		AND (dias is null OR  dias=0 OR (dias & (1 << (DAYOFWEEK('$fecha_hora')-1)) = (1 << (DAYOFWEEK('$fecha_hora')-1))))
		*/
		
		ORDER BY  av.codalarma
	";
	//hr($cn->query);
	//exit;	
	$result = $cn->ejecutar(); 
	$inx=array();

	$_alarma = "";
	$_descripcion = "";

	while($rs=$cn->consultar($result)){
		
		$_alarma = $rs["alarma"];
		$_descripcion = $rs["descripcion"];
		
		$a = $rs["codalarma"];
		
		
		
		$inx[$a]["vel_min"] = $rs["vel_min"];
		$inx[$a]["vel_max"] = $rs["vel_max"];
		
		$inx[$a]["last_vel"] = $rs["last_vel"];
		$inx[$a]["last_geo"] = $rs["last_geo"];
		$inx[$a]["last_sit"] = $rs["last_sit"];
		
		$inx[$a]["geo_modo"] = $rs["geo_modo"];
		$inx[$a]["input_modo"] = $rs["input_modo"];

		$inx[$a]["sitio_modo"] = $rs["sitio_modo"];
		$inx[$a]["sitio_radio"] = $rs["sitio_radio"];



		$inx[$a]["fdesde"] = $rs["fdesde"];
		$inx[$a]["fhasta"] = $rs["fhasta"];

		$inx[$a]["ii"] = $rs["input"];
		$inx[$a]["input"] = array_reverse(str_split(str_pad(decbin($rs["input"]),8,"0",STR_PAD_LEFT)));

		$inx[$a]["input"] = array_reverse(str_split(str_pad(decbin($input),8,"0",STR_PAD_LEFT)));
		//hr(print_r($inx[$a]["input"], true));
		
		foreach($inx[$a]["input"] as $ki => $vi){
			if($rs["input_".($ki+1)]){
				$inx[$a]["input_i"][$rs["input_".($ki+1)]] = ($vi=="1")? $rs["input_on_".($ki+1)]: $rs["input_off_".($ki+1)];
			}// end if
		}// next
		
		//hr(print_r($inx[$a]["input_i"], true), "red");		

		
		if($rs["codsitio"]){
			$inx[$a]["s"][$rs["codsitio"]]["longitud"] = $rs["longitud"];
			$inx[$a]["s"][$rs["codsitio"]]["latitud"] = $rs["latitud"];
			$inx[$a]["s"][$rs["codsitio"]]["radio"] = $rs["sitio_radio"];
			$inx[$a]["s"][$rs["codsitio"]]["modo"] = $rs["sitio_modo"];
		}
		if($rs["codgeocerca"]){
			$inx[$a]["g"][$rs["codgeocerca"]]["t"] = $rs["gtipo"];
			$inx[$a]["g"][$rs["codgeocerca"]]["c"] = $rs["coords"];  
			$inx[$a]["g"][$rs["codgeocerca"]]["v"] = $rs["gvalor"];
		}
		if($rs["codtipo"]){
			$inx[$a]["i"][$rs["codtipo"]] = $rs["codinput"];
		}
		
		$inx[$a]["st"] = $rs["st"];
		$st[$a] = $rs["st"];
		
		
		

	}// end while

	$v=&$inx;
	
	
	foreach($v as $kk => $vv){
		
		$_min = false;
		$_max = false;
		$_geo = false;
		$_inp = false;
		$_sit = false;
		
		$_geo_dentro = false;
		$_sit_dentro = false;
		
		/************************/
		if($vv["vel_min"] != ""){
			$_min = 0;
			if($velocidad < $vv["vel_min"] and $velocidad < $vv["last_vel"]){
				$_min = 1;
			}			
		}			


		if($vv["vel_max"] != ""){
			$_max = 0;
			if($velocidad > $vv["vel_max"] and $velocidad > $vv["last_vel"]){
				$_max = 1;
			}			

		}		
		/************************/
		
		if(count($vv["g"]) > 0){
			
			$_geo_dentro = 0;
			
			foreach($vv["g"] as $kkk => $vvv){

				$geo = true;

				$coords = $vvv["c"];
				$tipo = $vvv["t"];//1 = circulo, 2 = poligono
				$modo = $vvv["v"];//1 = se cumple adentro, 2 = se cumple afuera
				$lat = $latitud;//$vvv["latitud"];
				$lng = $longitud;//$vvv["longitud"];
				$valor = -100;

				switch($tipo){
					case 1:

						$aux = explode(",", $coords);
						$c = explode(" ", $aux[0]);
						$r = explode(" ", $aux[1]);
						$valor = inside_circle($lat, $lng,  $c[0], $c[1], $r[0], $r[1]);
						break;

					case 2:

						$aux = explode(",", $coords);
						$coord = array();
						foreach($aux as $ka => $va){
							$coord[] = explode(" ", $va);
						}// next
						$valor = inside_polygon($coord, array($lat, $lng));
						break;

				}// end switch
				
				if($valor == 1){
					$_geo_dentro = 1;
					break;
					
					
				}
				


			}// next
			
			if($_geo_dentro == 1){
				$_geo = 0;
				switch($modo){
					case 1:
						$_geo = 1;
						break;
					case 2:
						break;
					case 3:
						if($vv["last_geo"] == 0){
							$_geo = 1;
						}
						break;
					case 4:
						break;
				}// end switch
				
			}else{
				$_geo = 0;
				switch($modo){
					case 1:
						
						break;
					case 2:
						$_geo = 1;
						break;
					case 3:
						break;
					case 4:
						if($vv["last_geo"] == 1){
							$_geo = 1;
						}
						break;
				}// end switch
				
				
				
				
			}
			
			
		}// end if
		
		/* geo sitios*/
		if(count($vv["s"]) > 0){
			
			$_sit_dentro = 0;
			$modo = false;
			foreach($vv["s"] as $kkk => $vvv){
				
				$modo = $vvv["modo"];//1 = se cumple adentro, 2 = se cumple afuera
				$radio = $vvv["radio"];
				$lat1 = $vvv["latitud"];
				$lng1 = $vvv["longitud"];
				$lat = $latitud;//$vvv["latitud"];
				$lng = $longitud;//$vvv["longitud"];

				$valor = inside_circle2($lat, $lng,  $lat1, $lng1, $radio);				

				
				if($valor == 1){
					$_sit_dentro = 1;
					break;
					
					
				}
				


			}// next
			
			if($_sit_dentro == 1){
				$_sit = 0;
				switch($modo){
					case 1:
						$_sit = 1;
						break;
					case 2:
						break;
					case 3:
						if($vv["last_sit"] == 0){
							$_sit = 1;
						}
						break;
					case 4:
						break;
				}// end switch
				
			}else{
				$_sit = 0;
				switch($modo){
					case 1:
						
						break;
					case 2:
						$_sit = 1;
						break;
					case 3:
						break;
					case 4:
						if($vv["last_sit"] == 1){
							$_sit = 1;
						}
						break;
				}// end switch
				
				
				
				
			}
			
			
		}		

		if(count($vv["i"]) > 0){
			
			$alert = false;
			
			foreach($vv["i"] as $kkk => $vvv){
						
				$input = true;
				if($vv["input_i"][$kkk]){
					if($vv["input_i"][$kkk] == $vvv){
						$alert = true;
					}else{
						$alert_error = true; 
					}// end if

				}else{
					$alert_error = true; 
				}// end if

			}// next

			if($input){

				if($alert == false or $vv["input_modo"] == 2 and $alert_error){
					$_inp = 0;

				}else{
					$_inp = 1;
				}

			}// end if			
			
			
		}
	
		
		
		if($_min===false and $_max===false and $_geo===false and $_inp===false and $_sit===false){
			//hr(2);
			continue;
		}
		
		if(($_min===false or $_min===1)
			and ($_max===false or $_max===1)
			and ($_geo===false or $_geo===1)
			and ($_sit===false or $_sit===1)
			and ($_inp===false or $_inp===1)){

			$i_velocidad = 0;
			$i_geocerca = 0;
			$i_input = 0;
			$i_sitio = 0;			
			
			$query = "
				INSERT INTO alarma_eventos 
					(codalarma, codequipo, hora, track_id, activo, status, velocidad, geocerca, input, sitio, alarma, descripcion) 
				VALUES
					($kk, $codequipo, '$fecha_hora', $id, 1, 1, $i_velocidad, $i_geocerca, $i_input, $i_sitio, '$_alarma', '$_descripcion')";

			$cn->ejecutar($query);
		}		
		
		
		updateAlarma($codequipo, $kk, 0, $velocidad, $_geo_dentro, $_sit_dentro);
			
		
		
		
		
		

		
	}// next

	mysql_free_result($result);
	unset($inx);
	unset($rs);
	
}

function alarmaTrackId($id){
	$cn = new cls_conexion;		
	$query = "
		UPDATE alarma_update 
		SET n = n +1, track_id = $id
		WHERE id=1";

	//$query = "insert into alarma_update (track_id, n) VALUES ($id, 1)";

	$cn->ejecutar($query);	
}

function updateAlarma($codequipo, $codalarma, $status, $velocidad, $geo, $sit){
	
	$geo = ($geo===false)?"null":$geo;
	$sit = ($sit===false)?"null":$sit;
	
	$cn = new cls_conexion;	
	$query = "
		UPDATE alarma_vehiculos 
		SET status = '$status', velocidad = '$velocidad',
		geocerca=$geo, sitio=$sit
		
		WHERE codequipo=$codequipo AND codalarma = $codalarma";



	$cn->ejecutar($query);	
	
}

function inside_circle($p_lat, $p_lng, $r_lat, $r_lng, $d_lat, $d_lng){
	$d1 = pow($p_lat - $r_lat, 2) + pow($p_lng - $r_lng, 2);
	$d2 = pow($d_lat - $r_lat, 2) + pow($d_lng - $r_lng, 2);
	return ($d2 - $d1) >= 0? 1: 0;
}// end function

function inside_circle2($p_lat, $p_lng, $r_lat, $r_lng, $d){
	
	
		//var lat = [p1.lat, p2.lat]
		//var lng = [p1.lng, p2.lng]
		
	$R = 6378137;
		$dLat = ($p_lat-$r_lat) * pi() / 180;
		$dLng = ($p_lng-$r_lng) * pi() / 180;
		$a = sin($dLat/2) * sin($dLat/2) +
		cos($r_lat * pi() / 180 ) * cos($p_lat * pi() / 180 ) *
		sin($dLng/2) * sin($dLng/2);
		$c = 2 * atan2(sqrt($a), sqrt(1-$a));
		$d1 = $R * $c;	
	
	//$degrees = rad2deg(acos((sin(deg2rad($p_lat))*sin(deg2rad($r_lat))) + (cos(deg2rad($p_lat))*cos(deg2rad($r_lat))*cos(deg2rad($p_lng-$r_lng)))));	
	//$d1 = $degrees * 111.13384;
	//$d2 = sqrt(pow($p_lat - $r_lat, 2) + pow($p_lng - $r_lng, 2));
	//hr($d1."....".$d2,"green");
	return ($d1 <= $d)? 1: 0;
}// end function

function inside_polygon($pointList, $p){
	$counter = 0;
	$xinters=0;
	//var p1:PointTest;
	//var p2:PointTest;
	$n = count($pointList);
	$x=0;
	$y=1;  
	$p1 = $pointList[0];
	for ($i = 1; $i <= $n; $i++){
		$p2 = $pointList[$i % $n];
      	if ($p[$y] > min($p1[$y], $p2[$y])){
         	if ($p[$y] <= max($p1[$y], $p2[$y])){
            	if($p[$x] <= max($p1[$x], $p2[$x])){
               		if($p1[$y] != $p2[$y]){
                  		$xinters = ($p[$y] - $p1[$y]) * ($p2[$x] - $p1[$x]) / ($p2[$y] - $p1[$y]) + $p1[$x];
                  		if ($p1[$x] == $p2[$x] or $p[$x] <= $xinters)
                     		$counter++;
               		}// end if
            	}// end if
         	}// end if
      	}// end if
      	$p1 = $p2;
   	}// next
	if($counter % 2 == 0){
		return(0);
	}else{
		return(1);
	}// end if
}// end function    
?>