<?php


function hr($msg_x, $color_x='black',$back_x=''){
	
	//echo '**('.$GLOBALS['debug'].')**__';
	
	if(is_array($msg_x) or is_object($msg_x)){
		
		$msg_x = print_r($msg_x, true);
	}
	
	
	if(isset($_GET['ajax']) or isset($_POST['ajax'])){
		$GLOBALS['debugN']++;
		$GLOBALS['debug'] .= $GLOBALS['debugN'].': '.$msg_x.'\n';
		
		//echo $GLOBALS['debug'];
		return;	
		
	}
	
	if ($color_x==''){
		echo "<pre>$msg_x<pre>";
	}else{
		echo "<pre><span style=\"background-color:$back_x;color:$color_x;font-family:tahoma;font-size:9pt;font-weight:bold;\">$msg_x</span><pre>";
	}// end if
	
}// end function

function hx($msg_x, $color_x='black',$back_x=''){

	hr($msg_x, $color_x,$back_x);
	exit;

}