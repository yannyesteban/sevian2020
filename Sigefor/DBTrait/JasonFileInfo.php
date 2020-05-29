<?php

namespace Sigefor\DBTrait;

trait JasonFileInfo{

	public function loadJsonInfo($name, $pattern = null){ 
		
		if(substr($name, 0, 1) == '#'){
			$name = substr($name, 1);
			$path = str_replace('{name}', $name, $pattern);
			return json_decode(@file_get_contents($path, true));
	
		}

		return null;
	}
}
