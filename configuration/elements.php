<?php

$cls_elements = [
	'sgUser' 		=> [
		'file' 	=> 'Sigefor/User.php',
		'class' => '\Sigefor\User'],
	'sgModule' 		=> [
		'file' 	=> 'Sigefor/Module.php',
		'class' => '\Sigefor\Module'],
	'sgStructure' 		=> [
		'file' 	=> 'Sigefor/Structure.php',
		'class' => '\Sigefor\Structure'],
	'ajax' 		=> [
		'file' 	=> 'Sigefor/Ajax.php',
		'class' => '\Sigefor\Ajax'],
	
	'form' => [
		'file' 	=> 'SgForm.php',
		'class' => 'SgForm'],
	'menux' 		=> [
		'file' 	=> 'SgMenu.php',
		'class' => 'SgMenu'],
	'fragment' 	=> [
		'file' 	=> 'ssFragment.php',
		'class' => 'ssFragment'],
	'procedure' => [
		'file' 	=> 'SsProcedure.php',
		'class' => 'SsProcedure'],
	'sgForm' 	=> [
		'file' 	=> 'Sigefor/Form.php',
		'class' => 'Sevian\Sigefor\Form'],
	'ImagesDir' => [
		'file' 	=> 'ImagesDir.php',
		'class' => 'Sevian\ImagesDir'],
	'menuX' 	=> [
		'file' 	=> 'mMenu.php',
		'class' => 'Sevian\mMenu'],
	'menuD' 	=> [
		'file' 	=> 'Sigefor/DesignMenu.php',
		'class' => '\DesignMenu'],
	'menu' 		=> [
		'file' 	=> 'Sigefor/Menu.php',
		'class' => '\Sevian\Sigefor\Menu'],		
	'test4' 		=> [
		'file' 	=> 'Sigefor/Menu.php',
		'class' => '\Sevian\Sigefor\Test4'],	
	'test55' 		=> [
		'file' 	=> 'Sigefor/Menu.php',
		'class' => '\Sevian\Sigefor\Test5'],
	'test5' 		=> [
		'file' 	=> 'Sigefor/Article.php',
		'class' => '\Sevian\Sigefor\Article'],
	'sgArticle' 		=> [
		'file' 	=> 'Sigefor/Article.php',
		'class' => '\Sevian\Sigefor\Article'],
	'sgMap' 		=> [
		'file' 	=> 'Sigefor/Map.php',
		'class' => '\Sevian\Sigefor\Map'],		
	'gtControlDevice' 		=> [
		'file' 	=> 'gt/ControlDevice.php',
		'class' => '\Sevian\GT\ControlDevice'],
	];

Sevian\S::elementsLoad($cls_elements);

?>