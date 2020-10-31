<?php
include ("constantes.php");
//include ("D:/www/sigefor20/clases/sg_configuracion.php");
//include ("D:/www/sigefor20/clases/funciones.php");
//include ("D:/www/sigefor20/clases/cls_conexion.php");
include ("sigefor20/configuracion.php");
include ("sigefor20/clases/sg_configuracion.php");
include ("sigefor20/clases/funciones.php");
include ("sigefor20/clases/funciones_sg.php");
include ("sigefor20/clases/cls_conexion.php");
include ("tracker_eventos.php");

error_reporting(0);
ini_set("display_errors", "Off"); 

//echo C_PATH;
//exit;
//include (C_PATH."clases/sg_configuracion.php");
//include (C_PATH."clases/funciones.php");

//error_reporting(E_ALL);
set_time_limit(0);
ob_implicit_flush();

$address = '192.168.1.21';
$port = 10010;
$equipos = array();
$cn=new cls_conexion;
function cargar_parametros(&$equipos){
	$cn=new cls_conexion;
	$cn->query = "	SELECT e.codequipo,v.codvehiculo,c.codigo as id_vehiculo,ce.codigo as id_equipo,
					p.parametros
					
					FROM vehiculos as v
					INNER JOIN codigos_vehiculos as c ON v.codigo=c.id
					INNER JOIN cuenta_vehiculos as cta ON cta.codvehiculo=v.codvehiculo
					INNER JOIN equipos as e ON e.codequipo = cta.codequipo
					INNER JOIN modelo_param as p ON p.codmodelo = version
					INNER JOIN codigos_equipos as ce ON ce.id=e.codigo_und";
					
	$result = $cn->ejecutar();
	while($rs=$cn->consultar($result)){
		//$this->equipos[$rs["id_equipo"]]=array();
		$equipos[$rs["id_equipo"]]=$rs;
		//hr($rs["id_equipo"]);
		
	}// end if
	//return $equipos;
}// end function
cargar_parametros($equipos);

function tracking($track=""){
	//echo "1";
	//return true;
	//echo $track."\n";
	$cn = $GLOBALS["cn"];
	$equipos = $GLOBALS["equipos"];
	$t = explode(chr(10),$track);
	
	
	//$cn->query = "insert into aux values (null,'$track')";
	//$cn->ejecutar();
	
	//*********************** base de datos viejo
	//track2($t[0],$track);
	//************************
	$cadena="";
	//$cadena = "INSERT INTO tracks_log  (track ) VALUES ('$track')";
	//$cn->ejecutar($cadena);

	foreach($t as $kk => $vv){
		$vv = str_replace(chr(13),"",$vv);
		//$vv = str_replace(chr(8),"",$vv);
		
		$aux = explode(",",$vv);
		$id_equipo = $aux[0];
		//echo $id_equipo." - ".$equipos[$id_equipo]["parametros"];
		if($id_equipo=="*"){
		
			//exit;
		}
		if(!isset($aux[2]) or !isset($aux[3]) or $aux[2]=="" or $aux[3]==""){
			//$cadena = "INSERT INTO tracks_log VALUES (null,'Error: $track')";
			//$cn->ejecutar($cadena);

			continue;
		}
		//$id_equipo!='1018000001' 
		if(!array_key_exists($id_equipo,$equipos)){
		
			if(strlen($id_equipo)>=8 and strlen($id_equipo)<=10){
				cargar_parametros($equipos);
			}
			//echo "ID Equipo: '$id_equipo' Indefinido\n";
			continue;
		}
		$param = $equipos[$id_equipo]["parametros"];
		$codequipo = $equipos[$id_equipo]["codequipo"];
		$param = $equipos[$id_equipo]["parametros"];
		$codequipo = $equipos[$id_equipo]["codequipo"];
		if($param==""){
			continue;
			echo "ID Equipo: $id_equipo Indefinido\n";
		}// end if
		$aux2=explode(",",$param);
		//hr($param);
		$campo = array();
		$valor=array();
		$c2 = array();
		foreach($aux2 as $k => $v){
			if($v==""){
				continue;
			}//
			$campo[$k]=$v;
			$valor[$k]="'".((trim($aux[$k])==="")?0:$aux[$k])."'";
			
			$c2[$v] = ((trim($aux[$k])==="")?0:$aux[$k]);
			//echo "\n v:$v,   k: $k;";
			
		}// next
		//$cadena .=implode(",",$valor);
		
		$cn->error = false;
		$cadena = "INSERT INTO tracks (codequipo,".implode(",",$campo).") VALUES ('$codequipo',".implode(",",$valor).")";
		$cn->ejecutar($cadena);
		if(!$cn->error){
			$id = $cn->insert_id;
			$cn->error = 0;
			$cadena = "INSERT INTO tracks_2020 (codequipo,".implode(",",$campo).") VALUES ('$codequipo',".implode(",",$valor).")";
			$cn->ejecutar($cadena);


			if(!$cn->error){

				echo "\n\n\n OK -> $cn->error....\n";
				$cadena = 
					"UPDATE equipos 
					SET id_track='$id', id_track2='$cn->insert_id', last_track='".$c2["fecha_hora"]."' 
					WHERE codequipo='$codequipo'";


				$cadena = 
				"UPDATE equipos 
					SET id_track='$id', id_track2='$cn->insert_id'
					WHERE codequipo='$codequipo'";

				$cn->ejecutar($cadena);
				
				@getTracks2($cn->insert_id, $codequipo, 
					@$c2["id_equipo"],  
					@$c2["fecha_hora"], 
					@$c2["longitud"], 
					@$c2["latitud"], 
					@$c2["velocidad"], 
					@$c2["input"]);

			}else{
				echo "\n\n\n ERROR -> $cn->error....\n";	
			}


		}// end if
		/*
		if($id_equipo=='1018000001'){
			$a=error_get_last();
			$cn->ejecutar("INSERT INTO trama values( null,'".addslashes($cadena)."','$param','".$a["message"]." yanny linea: ".$a["line"]."','".addslashes($vv)."')");
		
			//echo $vv;
			exit;
		}
		*/
		
		//$cadena = "INSERT INTO tracks_3 (codequipo,".implode(",",$campo).") VALUES ('$codequipo',".implode(",",$valor).")";
		
		//$cn->ejecutar($cadena);




		//$cadena = "INSERT INTO tracks_hist (codequipo,".implode(",",$campo).") VALUES ('$codequipo',".implode(",",$valor).")";
		//$cn->ejecutar($cadena);


		//$a=error_get_last();
		//$cn->ejecutar("INSERT INTO trama values( null,'".addslashes($cadena)."','$param','".$a["message"]." linea: ".$a["line"]."','".addslashes($vv)."')");
		
		//echo $vv."\n";
		//echo $cadena."\n\n";
	
	}// next
	


}// end function


function handle_client($allclient, $socket, $buf, $bytes) {


    //$sock = $GLOBALS["sock"];
	//$sock->tracking($buf);
	//echo $buf;
	tracking($buf);
	return false;
	foreach($allclient as $client) {
        socket_write($client, "$socket wrote: $buf");
		
    }
}

if (($master = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) < 0) {
    echo "socket_create() failed: reason: " . socket_strerror($master) . "\n";
}

socket_set_option($master, SOL_SOCKET,SO_REUSEADDR, 1);

if (($ret = socket_bind($master, $address, $port)) < 0) {
    echo "socket_bind() failed: reason: " . socket_strerror($ret) . "\n";
}

if (($ret = socket_listen($master, 5)) < 0) {
    echo "socket_listen() failed: reason: " . socket_strerror($ret) . "\n";
}

$read_sockets = array($master);

while (true) {
    $changed_sockets = $read_sockets;
    $num_changed_sockets = socket_select($changed_sockets, $write = NULL, $except = NULL, NULL);
    //$num_changed_sockets = socket_select($changed_sockets, NULL, NULL, NULL);
    foreach($changed_sockets as $socket) {
        if ($socket == $master) {
            if (($client = socket_accept($master)) < 0) {
                echo "socket_accept() failed: reason: " . socket_strerror($msgsock) . "\n";
                continue;
            } else {
                array_push($read_sockets, $client);
            }
        } else {
            $bytes = socket_recv($socket, $buffer, 4096, 0);
            if ($bytes == 0) {
                $index = array_search($socket, $read_sockets);
                unset($read_sockets[$index]);
                socket_close($socket);
            } else {
                $allclients = $read_sockets;
                array_shift($allclients);    // remove master
                handle_client($allclients, $socket, $buffer, $bytes);
            }
        }
       
    }
}

?>
