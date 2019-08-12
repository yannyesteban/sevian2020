<?php
namespace Sevian;
class Tool{
	
	static function extract($q){
		
		$exp = '
		{(
		(?:if\s*+:(?P<cond>(?P<sc>[^;"\']*+(?:"(?:[^"]*+(?:(?<=\\\)"[^"]*+)*+)" | \'(?:[^\']*+(?:(?<=\\\)\'[^\']*+)*+)\'))*+[^;"\']*+|(?P>sc));
			\s*then\s*:((?1)+)(?:\s*+else\s*+:((?1)+)?)\s*+endif\s*+;)
		|
		(?:if\s*+:((?P>cond);)\s*+then\s*+:((?1))(?:\s*+else\s*+:((?1)))?)
		|case;(when:((?P>cond));do:((?1)+))(
			(?:when:(?P>cond);do:(?1)+)*)(?:default:((?1)+))?endcase
		#|(?:for:[^;"\':]+;((?1)+)next)
		#|(?:while:((?P>cond);)((?1)+)wend)
		#|(?:do:((?1)+)while((?P>cond);))
		#|
		|
		#OLD: 
		#((\w+)\s*+:\s*+(?:"([^"]*+(?:(?<=\\\)"[^"]*+)*+)"|\'([^\']*+(?:(?<=\\\)\'[^\']*+)*+)\'|([^;"\':]+))\s*;)
		#NEW: 
		 ((\w+)\s*+:\s*+(?:"([^"]*+(?:(?<=\\\)"[^"]*+)*+)"|\'([^\']*+(?:(?<=\\\)\'[^\']*+)*+)\'|([^;"\':]*))\s*;)
		)}isx';
		if(preg_match_all($exp, $q, $c)){
			//print_r($c);
			return $c;
		}else{
			
			hr("Error: ".$q);
			//throw new Exception($q);
			//return array();	
			
		}// end if
	}
	
	static function vars($q, $info){
		
		foreach($info as $i){
			$q = self::evalVar($q, $i["token"], $i["data"], $i["default"]);
		}
		return $q;
	}
	
	static function evalVar($q, $t, $data, $default = false){

		if($q == "" or count($data) == 0){
			return $q;	
		}// end if
		
		$exp="{
			(?:(?<![\{\\\])$t(\w++))
			|
			(?:\{$t(\w++)\})
			|
			(?:([\\\]($t\w++)))
			
		}isx";

		$q = preg_replace_callback($exp,
			function($i) use (&$data, $default){
				if(isset($data[$i[1]])){
					return $data[$i[1]];
				}elseif(isset($i[2]) and $i[2] != "" and isset($data[$i[2]])){
					return $data[$i[2]];
				}elseif(isset($i[4])){
					return $i[4];
				}else{
					if($default !== false){
						return $default;	
					}else{
						return $i[0];
					}// end if
				}// end if
			},$q);
		return $q;		
	}
	
	static function param($q = "", &$p){

		if(trim($q) == ""){
			return "";	
		}// end if

		$c = self::extract($q);
					
		foreach($c[0] as $k => $v){
			if($c[2][$k] != ""){
				eval("\$eval=".$c[2][$k].";");
				if($eval){
					$aux = $c[4][$k];
				}else{
					$aux = $c[5][$k];
				}// end if
				self::param($aux, $p);
			}elseif($c[6][$k] != ""){
				eval("\$eval=".$c[6][$k].";");
				if($eval){
					$aux = $c[7][$k];
				}else{
					$aux = $c[8][$k];
				}// end if
				self::param($aux, $p);
			}elseif($c[9][$k] != ""){
				eval("\$eval=".$c[10][$k].";");
				if($eval){
					$aux = $c[11][$k];
				}elseif($c[12][$k] != ""){
					self::param("case;".$c[12][$k]."default:".$c[13][$k]."endcase;",$p);
				}elseif($c[13][$k] != ""){
					$aux = $c[13][$k];
				}else{
					$aux="";
				}// end if					
				self::param($aux, $p);
			}elseif($c[16][$k] != ""){
				$p[$c[15][$k]] = $c[16][$k];
			}elseif($c[17][$k] != ""){
				$p[$c[15][$k]] = $c[17][$k];
			}else{
				$p[$c[15][$k]] = $c[18][$k];
			}//end if
		}// next
	}
	
	static function getList($q){
		$exp = '{[^,]+\'.+\'|[^,]+\(.+\)|[^,]+}isx';		
		
		if(preg_match_all($exp, $q, $c)){
			return $c[0];
		}else{
			throw new Exception($q);
			return array();	
			
		}// end if		
		
	}// end function
	
}

?>