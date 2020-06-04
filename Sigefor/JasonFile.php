<?php
namespace SIGEFOR;

class JasonFile{

	public static function loadJsonInfo($name, $pattern = null){ 
		
		if(substr($name, 0, 1) == '/'){
			$name = substr($name, 1);

			if($pattern){
				$name = str_replace('{name}', $name, $pattern);
			}
			return json_decode(@file_get_contents($name, true));
		}

		return null;
	}

	public static function loadJsonFile($name){ 
		
		if(substr($name, 0, 1) == '/'){
			return json_decode(@file_get_contents(substr($name, 1), true));
		}

		return null;
	}

	 public static function getNameJasonFile($name, $pattern = null){
		if(substr($name, 0, 1) == '/' and $pattern){
			$name = '/'.str_replace('{name}', substr($name, 1), $pattern);
		}
		return $name;
	}
}