
<?php
error_reporting(E_ALL);

echo "<h2>TCP/IP Connection</h2>\n";

/* Obtener el puerto para el servicio WWW. */
$service_port = 3311;//getservbyname('www', 'tcp');

/* Obtener la dirección IP para el host objetivo. */
$address = "127.0.0.1";//gethostbyname('localhost');

/* Crear un socket TCP/IP. */
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($socket === false) {
    echo "socket_create() falló: razón: " . socket_strerror(socket_last_error()) . "\n";
} else {
    echo "OK.\n";
}

echo "Intentando conectar a '$address' en el puerto '$service_port'...";
$result = socket_connect($socket, $address, $service_port);
if ($result === false) {
    echo "socket_connect() falló.\nRazón: ($result) " . socket_strerror(socket_last_error($socket)) . "\n";
} else {
    echo "OK.\n";
}

$in = "HEAD / HTTP/1.1\r\n";
$in .= "Host: www.example.com\r\n";
$in .= "Connection: Close\r\n\r\n";
$out = '';

echo "Enviando petición HTTP HEAD ...";
socket_write($socket, $in, strlen($in));
echo "OK.\n";

echo "Leyendo respuesta:\n\n";
for($i=0;$i<=10;$i++)
while(socket_recv ( $socket , $response , 1024 , MSG_PEEK)!==0)
{
   echo "<br>Server said: $response<br>";
}

if ($out = socket_read($socket, 50)) {
    echo $out;
}

echo "Cerrando socket...";
socket_close($socket);
echo "OK.\n\n";
?>
