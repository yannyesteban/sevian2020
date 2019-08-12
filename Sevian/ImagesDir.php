<?php

namespace Sevian;



class ImagesDir extends Panel{
	
	
	
	
	public function render(){
		
		$path = "c:\www\Iconos\PNG_icons";
		
		$path = 'C:\www\Awesome Icons Bundle 6000 Icons PSD AI SVG EPS CreativeMarket 442434\flat-icons\Financial\png_64';
		$path2 = '../../Awesome Icons Bundle 6000 Icons PSD AI SVG EPS CreativeMarket 442434\flat-icons\Financial\png_64';
		
		
		$path = "C:\www\sevian\icons\png";
		$path2 = "../../../icons/png";
		$path = "../../../icons/png";
		$list = scandir($path);
		
		$div = new HTML("div");
		$div->class = "sg-images-dir";
		foreach($list as $file){
			
			$info = pathinfo($file);
			
			if(isset($info['extension']) and ($info['extension'] =="png" or $info['extension'] =="_gif" or $info['extension'] =="jpg")){
				$item = $div->add("img");
				//$item->src = "../../Iconos/PNG_icons/".$file;	
				$item->src = $path2."/".$file;	
				
				
			}
			
			
		}
		
		S::setMainPanel($this->panel, "ImgDir", ["a"=>1]);
		return $div->render();
		
		$partes_ruta = pathinfo('/www/htdocs/inc/lib.inc.php');

echo $partes_ruta['dirname'], "\n";
echo $partes_ruta['basename'], "\n";
echo $partes_ruta['extension'], "\n";
echo $partes_ruta['filename'], "\n"; // desde PHP 5.2.0
		
		echo basename("yannyesteban.jpg", ".jpg");
		
		echo getcwd()."\Config.php";
		echo is_file(getcwd()."\Config.php")."..........";
		
		$directorio = getcwd() ;
$ficheros1  = scandir($directorio);
		
		print_r($ficheros1);
//$ficheros2  = scandir($directorio, 1);

$d = dir("/www/sevian/images");
echo "Handle: " . $d->handle . "\n";
echo "Path: " . $d->path . "\n";
while (false !== ($entry = $d->read())) {
   echo $entry."\n";
}
$d->close();		
		
		
		return "IMAGEN";
	}
	
	
	
}



?>