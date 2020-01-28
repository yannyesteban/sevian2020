<?php

$cls_elements = [
	'sgUser' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/User.php',
		'class' => '\Sigefor\User'],
	'sgModule' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Module.php',
		'class' => '\Sigefor\Module'],
	'sgStructure' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Structure.php',
		'class' => '\Sigefor\Structure'],
	'ajax' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Ajax.php',
		'class' => '\Sigefor\Ajax'],
	
	'form' => [
		'file' 	=> MAIN_PATH.'Sevian/SgForm.php',
		'class' => 'SgForm'],
	'menux' 		=> [
		'file' 	=> MAIN_PATH.'Sevian/SgMenu.php',
		'class' => 'SgMenu'],
	'fragment' 	=> [
		'file' 	=> MAIN_PATH.'Sevian/ssFragment.php',
		'class' => 'ssFragment'],
	'procedure' => [
		'file' 	=> MAIN_PATH.'Sigefor/Procedure.php',
		'class' => 'Sigefor\Procedure'],
	'sgForm' 	=> [
		'file' 	=> MAIN_PATH.'Sigefor/Form.php',
		'class' => 'Sevian\Sigefor\Form'],
	'ImagesDir' => [
		'file' 	=> MAIN_PATH.'Sevian/ImagesDir.php',
		'class' => 'Sevian\ImagesDir'],
	'menuX' 	=> [
		'file' 	=> MAIN_PATH.'Sevian/mMenu.php',
		'class' => 'Sevian\mMenu'],
	'menuD' 	=> [
		'file' 	=> MAIN_PATH.'Sigefor/DesignMenu.php',
		'class' => '\DesignMenu'],
	'menu' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Menu.php',
		'class' => '\Sevian\Sigefor\Menu'],		
	'test4' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Menu.php',
		'class' => '\Sevian\Sigefor\Test4'],	
	'test55' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Menu.php',
		'class' => '\Sevian\Sigefor\Test5'],
	'test5' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Article.php',
		'class' => '\Sevian\Sigefor\Article'],
	'sgArticle' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Article.php',
		'class' => '\Sevian\Sigefor\Article'],
	'sgMap' 		=> [
		'file' 	=> MAIN_PATH.'Sigefor/Map.php',
		'class' => '\Sevian\Sigefor\Map'],		
	'gtControlDevice' 		=> [
		'file' 	=> MAIN_PATH.'gt/ControlDevice.php',
		'class' => '\Sevian\GT\ControlDevice'],
	
	'gtMenuDevice' 		=> [
		'file' 	=> MAIN_PATH.'gt/MenuDevice.php',
		'class' => '\Sevian\GT\MenuDevice'],
	];

Sevian\S::elementsLoad($cls_elements);

?>