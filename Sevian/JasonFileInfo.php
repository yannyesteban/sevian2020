<?php
namespace Sevian;

class JasonFileInfo{

    public static function load($fileName, $userData = null){
		
        if($userData !== null){
            return json_decode(\Sevian\S::varCustom(@file_get_contents($fileName, true), $userData, '@'));
        }else{
            return json_decode(@file_get_contents($fileName, true), $userData);
        }
        
	}

}