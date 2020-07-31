<?php

$inputs = [
	'text' => [
		'file' 	=> 'Input.php',	
		'class' => 'Sevian\Input',
		'type'  =>  'text'],
	'hidden' => [
		'class' => 'Sevian\Input',
		'type'  =>  'hidden'],
	'password' => [
		'class' => 'Sevian\Input',
		'type'  =>  'password'],
	'text' => [
		'class' => 'Sevian\Input',
		'type'  =>  'text'],
	'button' => [
		'class' => 'Sevian\Input',
		'type'  =>  'button'],
	'submit' => [
		'class' => 'Sevian\Input',
		'type'  =>  'submit'],
	'color' => [
		'class' => 'Sevian\Input',
		'type'  =>  'color'],
	'range' => [
		'class' => 'Sevian\Input',
		'type'  =>  'range'],
	'image' => [
		'class' => 'Sevian\Input',
		'type'  =>  'image'],
	'select' => [
		'class' => 'Sevian\Input',
		'type'  =>  'select'],
	'multiple' => [
		'class' => 'Sevian\Input',
		'type'  =>  'multiple'],
	'date' => [
		'class' => 'Sevian\DateInput',
		'type'  =>  'calendar'],
];

Sevian\S::inputsLoad($inputs);

?>