<?php

$cls_elements = [
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


	];

Sevian\S::elementsLoad($cls_elements);

?>