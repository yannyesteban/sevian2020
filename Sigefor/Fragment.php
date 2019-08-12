<?php
/*****************************************************************
creado: 09/08/2017
por: Yanny Nuñez
Version: 1.0
*****************************************************************/
namespace Sigefor;

use Sevian;

class Fragment extends Sevian\Panel{
	
	private $cn_name = "_config";
	
	public function execute(){
		
		global $sevian;
		
		$cn = Sevian\Connection::get($this->cn_name);
		$t_fragments = "_sg_fragments";
		
		$cn->query = "
			SELECT * 
			FROM $t_fragments 
			WHERE fragment = '$this->name'";
		
		$result = $cn->execute($cn->query);
		if($rs = $cn->getDataAssoc($result)){
			foreach($rs as $k => $v){
				$this->$k = $v;
			}
		}else{
			
		}// end if
		
		$this->html = $sevian->vars($this->html);
	}
	
	public function render(){
		
		$this->execute();
		return $this->html."...";
		
	}
	
}
?>