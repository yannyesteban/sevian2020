<?php
namespace SIGEFOR\DBTrait;

trait HTMLFileInfo{

	private $userData = [];

	public function loadHTMLFragment($name, $pattern = null){ 
		
		if(substr($name, 0, 1) == '/'){
			$name = substr($name, 1);
			
			if($pattern){
				$name = str_replace('{name}', $name, $pattern);
			}
			
			$html = \Sevian\S::varCustom(@file_get_contents($name, true), $this->userData, '&P_');
			
			return \Sevian\S::vars($html);
		}

		return null;
	}

	public function loadHTMLInfo($name, $pattern = null){ 
		
		if(substr($name, 0, 1) == '/'){
			$name = substr($name, 1);
			
			if($pattern){
				$name = str_replace('{name}', $name, $pattern);
			}
			
			//return @file_get_contents($name, true);

			$html = \Sevian\S::varCustom(@file_get_contents($name, true), $this->userData, '&P_');
			
			return \Sevian\S::vars($html);
		}

		return null;
	}

	public function loadHTMLFile($name){ 
		
		if(substr($name, 0, 1) == '/'){
			$html = \Sevian\S::varCustom(@file_get_contents(substr($name, 1), true), $this->userData, '&P_');
			return \Sevian\S::vars($html);
		}

		return null;
	}
	
}