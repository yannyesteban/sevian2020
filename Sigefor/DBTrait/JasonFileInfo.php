<?php
namespace SIGEFOR\DBTrait;

trait JasonFileInfo{

	public function loadJsonInfo($name, $pattern = null){

		if(substr($name, 0, 1) == '/'){
			$name = substr($name, 1);

			if($pattern){
				$name = str_replace('{name}', $name, $pattern);
			}
			$file = \Sevian\S::varCustom(@file_get_contents($name, true), $this->userData, '&P_');
			$file = \Sevian\S::vars($file);
			return json_decode($file);
		}

		return null;
	}

	public function loadJsonFile($name){

		if(substr($name, 0, 1) == '/'){
			$file = \Sevian\S::varCustom(@file_get_contents(substr($name, 1), true), $this->userData, '&P_');
			$file = \Sevian\S::vars($file);
			return json_decode($file, true);
		}

		return null;
	}

	public function ggetNameJasonFile($name, $pattern = null){

		hx($pattern,"blue");
		if(substr($name, 0, 1) == '/' and $pattern){
			$name = str_replace('{name}', substr($name, 1), $pattern);
		}
		return $name;
	}
}