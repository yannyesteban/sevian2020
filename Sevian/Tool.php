<?php
namespace Sevian;



class Tool{
	
	static function evalIf($exp, $q, $then, $else) {
	
		eval("\$v = $q;");
		
	
		if($v){
			$qq = $then;
		}else{
			$qq = $else;
		}
	
		if(preg_match($exp, $qq, $c)){
	
			$result = preg_replace_callback ($exp, function($c) use($exp){
	
				if($c['cc']){
					return Tool::evalIf($exp,$c['cc'],$c['then'],$c['else']??false);
				}
			},$qq);
			return $result;
		}else{
			return $qq;
		}
		
	}


	static function evalExp($q){

		$exp = '
		/
		(?(DEFINE)
			(?<pp> \( (?: (?>[^()]+) | (?&exp) )* \) )
			(?<pc> \{ (?: (?>[^{}]+) | (?&exp) )* \} )
			#	(?<pc> )
		   (?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (?:\.\d+)? (?:[eE] [+-]? \d+)? )    
		   #(?<boolean>   true | false | null )
		   (?<string>    " (?:[^"\\\\]* | \\\\ ["\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* " )
		   #(?<array>     \[  (?:  (?&json)  (?: , (?&json)  )*  )?  \s* \] )
		   #(?<pair>      \s* (?&string) \s* : (?&json)  )
		   #(?<object>    \{  (?:  (?&pair)  (?: , (?&pair)  )*  )?  \s* \} )
		   #(?<json>   \s* (?: (?&number) | (?&boolean) | (?&string) | (?&array) | (?&object) ) \s* )
		
		   (?<xw> ([^(){}"])*)
			
			(?<exp> (?:(?&string) | (?&number) | \s* | (?&pp)| (?&pc) | (?&xw) )* )

			#(?<cond>) @if\((?&exp)\){((?&number))}

			(?<if> @if\((?&exp)\)\{((?R))\}(?>\{((?R))\})*+ )
		
		)
		
		(
		# @if\(( (?&exp)  )\)\{((?&exp)*+|(?R)*+)\}(?>\{((?R))\})*+

			#(?:if\((?&exp)\)\{((?&exp))\}\{((?&exp))\})
			#|(?:if\(xx\)\{((?&exp))\}) 
			#(case\(((?&exp))\)\{(?=)(when\((\d+)\)\{(\w+)\})+\})

			
			
			(?:\$if\((?<cc>(?&exp))\)\{(?<then>(?&exp))\}(\{(?<else>(?&exp))\})?) 
			#|
			#(?:if\((?<cc2>(?&exp))\)\{(?<then2>(?&exp))\}) 
		)
		

		/six';

		//$q = '@if(3>1){ @if(5>6){"k"} }{ @if(4>2){@if(9>1){"zz"}} }';
		//$q = '@if(3>1){"alpha"}{"betha"}';
		//$q = 'k=if(33>112){if(8>3){alpha}}{if(8>3){"gamma"}{"thita"}}, m:if(2>10){"yes"}{{a:"ll"}}';
		//$q = 'if(8>3){"gamma"}{"thita"}';
		//$q = "case(3>2 + 5){when(1){aaa}when(2){bbb}when(3){ccc}}";
		//$q='@if("465" 465 (999)){(4654 + 0()}';
		//$q = 'yanny @if(u==4 + ((3+8a) + (7*3)) ){"hola"}{"adios"}';

		if(preg_match($exp, $q, $c)){
			$q = preg_replace_callback ($exp, function($c) use($exp){
				if($c['cc']){
					return Tool::evalIf($exp,$c['cc'],$c['then'],$c['else']??'');
				}
				
			},$q);
		}

		return $q;

		


		//hr($m(8,9));

		if(preg_match($exp, $q, $c)){

			//print_r($c);
			if(preg_match_all($exp, $q, $c)){

				print_r($c);
			}

				return;
			$q = preg_replace_callback ($exp, function($c){
				$f = "\$a = ".$c[12];
				if($f){
					hr("s= ".$c[12]);
				}
				print_r($c);
				return $c[13];

			}, $q);
			hr($q);
		}else{
			hr("error", "red");
		}
		exit;

//		preg_match('/(foo)(bar)(baz)/', 'foobarbaz', $matches, PREG_OFFSET_CAPTURE);
//print_r($matches);

//exit;


		$pcre_regex = '
		/
		(?(DEFINE)
		   (?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )    
		   (?<boolean>   true | false | null )
		   (?<string>    " ([^"\\\\]* | \\\\ ["\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* " )
		   (?<array>     \[  (?:  (?&json)  (?: , (?&json)  )*  )?  \s* \] )
		   (?<pair>      \s* (?&string) \s* : (?&json)  )
		   (?<object>    \{  (?:  (?&pair)  (?: , (?&pair)  )*  )?  \s* \} )
		   (?<json>   \s* (?: (?&number) | (?&boolean) | (?&string) | (?&array) | (?&object) ) \s* )
		)
		\A (?&json) \Z
		/six';

		$pcre_regex = '
		/
		(?(DEFINE)
			(?<string>    " ([^"\\\\]* | \\\\ ["\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* " )
		   (?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )    
		   (?<if>@if\((\w+)\)\{((?&string) | (?&number))\}\{((?&string) | (?&number))\}?)
		)
		((?&if))
		/six';
$c= "yanny";
		$q1 = 'yan @if(uno){4565}{46465}';
	  if(preg_match($pcre_regex, $q1, $c)){
		print_r($c);

	
		return"";
	}else{
		
		hr("Error: ".$q);
		//throw new Exception($q);
		//return array();	
		
	}// end if
return;

		hr($q);
		$c = "xx";
		$exp ='
		{
		
		
			if(\(.+)\){}{"dos"}

		}isx';

		$exp_ = '
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