<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form id="x" ></form>
    <form id="y" ></form>
    <form id="z" ></form>
    <form id="m" ></form>
<form id="w">
    <input type="text" name="b" form="x" value="yanny">
    <input type="text" id="s" name="b" form="y" value="esteban">
    <input type="text" name="b" form="z" value="nuñez">
    
    <input type="text" name="c" value="caroline">
    <input type="text" name="c" value="victory">
    <input type="text" name="c" form="m" value="la M">

    <input type="submit" name="a" form="x" value="X">
    <input type="submit" name="a" form="y" value="Y">
    <input type="submit" name="a" form="w" value="Z">
    <input type="submit" name="a" form="m" value="M">
    <hr>
    <input type="button" onclick="let e= document.getElementById('s');e.value='jimenezz';e.setAttribute('form','m');alert(e.getAttribute('form'))" value="M">
</form>
<?php
class SEAT {
    const modelo = "toledo";
    public static $color = "tono";
}

$toledo = "Hybrid";
$tono = "Oscuro";

echo "La versión del SEAT Toledo es {${SEAT::modelo}}" . PHP_EOL; // Devuelve: La versión del SEAT Toledo es Hybrid
echo "El color del SEAT Toledo {${SEAT::modelo}} es {${SEAT::$color}}"; // Devuelve: El color del SEAT Toledo Hybrid es Oscuro
?>



</body>
</html>