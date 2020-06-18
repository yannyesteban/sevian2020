<?php
namespace Sevian;


$query = '$if(3>1){"alpha"}{"betha"}';
hx("Total ..: ".\sevian\Logic::eval($query, true));

class Logic{

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
					return self::evalIf($exp,$c['cc'],$c['then'],$c['else']??false);
				}
			},$qq);
			return $result;
		}else{
			return $qq;
		}
		
	}
	static function eval($query, $debug){
		$pattern = '
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
		if(preg_match_all($pattern, $query, $c)){
			//hx($c);
		}
		if(preg_match($pattern, $query, $c)){
			$query = preg_replace_callback ($pattern, function($c) use($pattern){
				if($c['cc']){
					return self::evalIf($pattern,$c['cc'],$c['then'],$c['else']??'');
				}
				
			},$query);
		}

		return $query;
	}

	static function evalOr($query, $debug = false){
		hr("Query: ".$query, "#123574", "#ffaacc");
		
		$pattern = "{
			(?(DEFINE)
				(?<fun> \w+(?&paren))
				(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
				(?<mul> (?&exp)([*%/](?&exp2))+)
				(?<exp>  ((?&number) | (?&fun) | (?&paren) |(?&s)|(?&s2)|true|false|null ))
				(?<exp2>  [\+\-]*((?&number) | (?&fun) | (?&paren)  ))
				(?<pot2> (?&exp)\s*[\^]\s*(?&exp2))
				(?<and>((?&op)|(?&exp)|(?&m))(\s*(and)\s*((?&op)|(?&exp)|(?&m)))+)
				(?<and2>((?&op)|(?&exp)|(?&m))(\s*(and|xor)\s*((?&op)|(?&exp)|(?&m)))+)
				//(?<xor>((?&and))(\s*(xor)\s*((?&and)))+)
				(?<or>((?&xor))(\s*(or)\s*((?&xor)))+)
				(?<exp3>  ((?&number) | (?&fun) | (?&paren)  ))
			)
			(?<term>
				(?<a>(?&and))|
				(?<xo>(?&and2))|
				#?<orr>(?&or))|
				#(?<op>(?<o1>(?&m)|(?&s)|(?&s2))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)|(?&s)|(?&s2)))|
				(?<op>(?<o1>(?&m)|(?&s)|(?&s2))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)|(?&s)|(?&s2)))|
				(?<paren> \( (?<p>(?: (?>[^()]+)| (?R)  )*) \) )|
				(?<m>[\+\-]*(?&exp3)(?:[\*/%\+\-](?&exp3))*(?:\*\*(?&exp3))*)|
				(?<n>(?&number))|
				(?<f>(?&fun))|
				(?<s>(?<string>   \" (?<t>(?:   [^\"\\\\]|\\\\.     )*) \"     ))|
				(?<s2>(?<string2>   ' (?<t2>(?:   [^'\\\\]|\\\\.     )*) '     ))|
				(?<v>true|false|null)
				
			
			)
			(?:\s*(?<opp>or)\s*|$)
			
			
		}isx";
		if($debug or preg_match_all($pattern, $query, $c)){
			//hx($c);
		}
		
		$value = '';
		
		
		if(preg_match_all($pattern, $query, $c)){
			
	
			foreach($c['term'] as $k => $t){
				if($c['paren'][$k] != ''){
					hr("Parentesis: $t");
					$value = self::evalOr($c['p'][$k]);
				}
	
				if($c['a'][$k] != ''){
					hr(".AND.: $t");
					$value = self::evalAnd($c['a'][$k]);
				}
				if($c['xo'][$k] != ''){
					hr(".XOR.: $t");
					$value = self::evalXOr($c['xo'][$k]);
				}
				if($c['string'][$k] != ''){
					$value = $c['t'][$k];
				}
	
				if($c['string2'][$k] != ''){
					$value = $c['t2'][$k];
				}
				
				if($c['n'][$k] != ''){
					hr("Número: $t");
					$value = $c['n'][$k];
				}
	
				if($c['v'][$k] != ''){
					if($c['v'][$k]=='true'){
						$value = true;
					}else if($c['v'][$k]=='true'){
						$value = false;
					}
				}
	
				if($c['m'][$k] != ''){
				
					$value = Math::eval($c['m'][$k]);
					hr("Matemática: [$t] => ".$c['m'][$k]);
					
					
				}
	
				if($c['o'][$k] != ''){
					$t1 = self::evalOr($c['o1'][$k]);
					$t2 = self::evalOr($c['o2'][$k]);
					$value = false;
					
					switch($c['o'][$k]){
						case '==':
							$value = $t1 == $t2;
						break;
						case '>':
							$value = $t1 > $t2;
						break;
						case '<':
							$value = $t1 < $t2;
						break;
						case '>=':
							$value = $t1 >= $t2;
						break;
						case '<=':
							$value = $t1 <= $t2;
						break;
						case '!=':
							$value = $t1 != $t2;
						break;
					}
					hr("Condicion: ".$t1." ".$c['o'][$k]." ".$t2." -> $value", "green");
				}
	
				$op = $c['opp'][$k];
				hr("$t => VALUE = $value, ".$op,"darkred");
	
				if($value){
					return $value;
				}
	
				
	
				//
				
			
			}
		} 
		
		return $value;
	}

	static function evalAnd($query, $debug = false){
		hr("Query [.AND.]: ".$query, "white", "#33aacc");
	
		$pattern = "{
			(?(DEFINE)
				(?<fun> \w+(?&paren))
				(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
				(?<mul> (?&exp)([*%/](?&exp2))+)
				(?<exp>  ((?&number) | (?&fun) | (?&paren) |(?&s)|(?&s2)|true|false|null ))
				(?<exp2>  [\+\-]*((?&number) | (?&fun) | (?&paren)  ))
				(?<pot2> (?&exp)\s*[\^]\s*(?&exp2))
				(?<and>((?&op)|(?&exp)|(?&m))(\s*(and|xor)\s*((?&op)|(?&exp)|(?&m)))+)
				(?<exp3>  ((?&number) | (?&fun) | (?&paren)  ))
			)
			(?<term>
				#(?<a>(?&and))|
				#(?<op>(?<o1>(?&m))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)))|
				(?<op>(?<o1>(?&m)|(?&s)|(?&s2))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)|(?&s)|(?&s2)))|
				(?<paren> \( (?<p>(?: (?>[^()]+)| (?R)  )*) \) )|
				(?<m>[\+\-]*(?&exp3)(?:[\*/%\+\-](?&exp3))*(?:\*\*(?&exp3))*)|
				(?<n>(?&number))|
				(?<f>(?&fun))|
				(?<s>(?<string>   \" (?<t>(?:   [^\"\\\\]|\\\\.     )*) \"     ))|
				(?<s2>(?<string2>   ' (?<t2>(?:   [^'\\\\]|\\\\.     )*) '     ))|
				(?<v>true|false|null)
				
			
			)
			(?:\s*(?<opp>and|xor)\s|$)
			
			
		}isx";
		if($debug or preg_match_all($pattern, $query, $c)){
			//hx($c);
		}
	
		$value = '';
		$last = null;
		$xor = false;
		if(preg_match_all($pattern, $query, $c)){
	
			foreach($c['term'] as $k => $t){
				if($c['paren'][$k] != ''){
					hr("Parentesis: $t");
					$value = self::evalOr($c['p'][$k]);
				}
	
				if($c['string'][$k] != ''){
					$value = $c['t'][$k];
				}
	
				if($c['string2'][$k] != ''){
					$value = $c['t2'][$k];
				}
				
				if($c['n'][$k] != ''){
					hr("Número: $t");
					$value = $c['n'][$k];
				}
	
				if($c['v'][$k] != ''){
					if($c['v'][$k]=='true'){
						$value = true;
					}else if($c['v'][$k]=='true'){
						$value = false;
					}
				}
	
				if($c['m'][$k] != ''){
				
					$value = Math.eval($c['m'][$k]);
					hr("Matemática: [$t] => ".$c['m'][$k]);
					
					
				}
	
				if($c['o'][$k] != ''){
					$t1 = self::evalOr($c['o1'][$k]);
					$t2 = self::evalOr($c['o2'][$k]);
					$value = false;
					
					switch($c['o'][$k]){
						case '==':
							$value = $t1 == $t2;
						break;
						case '>':
							$value = $t1 > $t2;
						break;
						case '<':
							$value = $t1 < $t2;
						break;
						case '>=':
							$value = $t1 >= $t2;
						break;
						case '<=':
							$value = $t1 <= $t2;
						break;
						case '!=':
							$value = $t1 != $t2;
						break;
					}
					hr("Condicion: ".$t1." ".$c['o'][$k]." ".$t2." -> $value", "green");
				}
	
				$op = $c['opp'][$k];
				hr("$t => VALUE = $value, ".$op,"red");
				if(!$value){
					hr(" F..I..N ".$value);
					return $value; 
				}
				
				
				
			
			}
		} 
		
		return $value;
	}
	
	static function evalXOr($query, $debug = false){
		hr("Query [.OR.]: ".$query, "white", "#33aacc");
	
		$pattern = "{
			(?(DEFINE)
				(?<fun> \w+(?&paren))
				(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
				(?<mul> (?&exp)([*%/](?&exp2))+)
				(?<exp>  ((?&number) | (?&fun) | (?&paren) |(?&s)|(?&s2)|true|false|null ))
				(?<exp2>  [\+\-]*((?&number) | (?&fun) | (?&paren)  ))
				(?<pot2> (?&exp)\s*[\^]\s*(?&exp2))
				(?<and>((?&op)|(?&exp)|(?&m))(\s*(and)\s*((?&op)|(?&exp)|(?&m)))+)
				(?<and2>((?&op)|(?&exp)|(?&m))(\s*(and|xor)\s*((?&op)|(?&exp)|(?&m)))+)
				//(?<xor>((?&and))(\s*(xor)\s*((?&and)))+)
				(?<or>((?&xor))(\s*(or)\s*((?&xor)))+)
				(?<exp3>  ((?&number) | (?&fun) | (?&paren)  ))
			)
			(?<term>
				(?<a>(?&and))|
				#(?<xo>(?&and2))|
				#?<orr>(?&or))|
				#(?<op>(?<o1>(?&m)|(?&s)|(?&s2))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)|(?&s)|(?&s2)))|
				(?<op>(?<o1>(?&m)|(?&s)|(?&s2))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)|(?&s)|(?&s2)))|
				(?<paren> \( (?<p>(?: (?>[^()]+)| (?R)  )*) \) )|
				(?<m>[\+\-]*(?&exp3)(?:[\*/%\+\-](?&exp3))*(?:\*\*(?&exp3))*)|
				(?<n>(?&number))|
				(?<f>(?&fun))|
				(?<s>(?<string>   \" (?<t>(?:   [^\"\\\\]|\\\\.     )*) \"     ))|
				(?<s2>(?<string2>   ' (?<t2>(?:   [^'\\\\]|\\\\.     )*) '     ))|
				(?<v>true|false|null)
				
			
			)
			(?:\s*(?<opp>xor)\s*|$)
			
			
		}isx";
		if($debug or preg_match_all($pattern, $query, $c)){
			//hx($c);
		}
	
		$value = '';
		$last = null;
		
		if(preg_match_all($pattern, $query, $c)){
	
			foreach($c['term'] as $k => $t){
				if($c['paren'][$k] != ''){
					hr("Parentesis: $t");
					$value = self::evalOr($c['p'][$k]);
				}
				if($c['a'][$k] != ''){
					hr(".AND.: $t");
					$value = self::evalAnd($c['a'][$k]);
				}
				if($c['string'][$k] != ''){
					$value = $c['t'][$k];
				}
	
				if($c['string2'][$k] != ''){
					$value = $c['t2'][$k];
				}
				
				if($c['n'][$k] != ''){
					hr("Número: $t");
					$value = $c['n'][$k];
				}
	
				if($c['v'][$k] != ''){
					if($c['v'][$k]=='true'){
						$value = true;
					}else if($c['v'][$k]=='true'){
						$value = false;
					}
				}
	
				if($c['m'][$k] != ''){
				
					$value = Math::eval($c['m'][$k]);
					hr("Matemática: [$t] => ".$c['m'][$k]);
					
					
				}
	
				if($c['o'][$k] != ''){
					$t1 = self::evalOr($c['o1'][$k]);
					$t2 = self::evalOr($c['o2'][$k]);
					$value = false;
					
					switch($c['o'][$k]){
						case '==':
							$value = $t1 == $t2;
						break;
						case '>':
							$value = $t1 > $t2;
						break;
						case '<':
							$value = $t1 < $t2;
						break;
						case '>=':
							$value = $t1 >= $t2;
						break;
						case '<=':
							$value = $t1 <= $t2;
						break;
						case '!=':
							$value = $t1 != $t2;
						break;
					}
					hr("Condicion: ".$t1." ".$c['o'][$k]." ".$t2." -> $value", "green");
				}
	
				$op = $c['opp'][$k];
				hr("comparando XOR [$t] => VALUE = $value, ".$op,"red");
	
				if($last === null){
	
					$last = $value;
					continue;
				}
				$value = ($last xor $value);
				$last = $value;
				hr("XOR value is $value", "blue");
			}
		} 
		
		return $value;
	}

	
}

class Math{

	static function eval($query, $debug=false){
		$query = self::arragePow($query);
		return self::main($query, $debug);
	}
	
	static function arragePow($query){
		
		//hr($query,"red","pink");
		$pattern = "{
			(?(DEFINE)
				(?<fun> \w+(?&paren))
				(?<paren> \( (?: (?>[^()]+)| (?R)| (?&paren) )* \) )
				(?<number>  (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
				(?<exp> (?&paren) | (?&number) | (?&fun)  )
				(?<pot> (?&exp)\s*[*]{2}\s*[\+\-]*(?&exp)(?![*]{2}))
			)
			(?&pot)
			
		}isx";
		
		$t = true;
		
		while($t){
			$t = false;
			$query = preg_replace_callback(
				$pattern,
				function ($c) use(&$t, $query) {
					$t = true;
					return str_replace('**','^',"(".$c[0].")" );
				},
				$query,
				1
			);
		}
		
		return $query;
	}
	
	static function main($query, $debug = false){
		//hr("Query: ".$query, "red");
	
		$pattern = "{
			(?(DEFINE)
				(?<fun> \w+(?&paren))
				(?<paren> \( (?: (?>[^()]+)| (?R)  )* \) )
				(?<number>   (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
				(?<mul> (?&exp)([*%/](?&exp2))+)
				(?<exp>  ((?&number) | (?&fun) | (?&paren)  ))
				(?<exp2>  [\+\-]*((?&number) | (?&fun) | (?&paren)  ))
				(?<pot2> (?&exp)\s*[\^]\s*(?&exp2))
			)
	
			(?<y>[\+\-])(?<x>[\+\-]*(?:(?R)))
			|(?<p2>(?&pot2))
			|(?<pr>(?: \( (?<z> (?R) +  ) \) ))
			|(?<m>(?&mul))
			|(?<f>(?&fun))
			|(?<n>(?&number))
			
		}isx";
		if($debug and preg_match_all($pattern, $query, $c)){
			hx($c);
		}
	
		$value = 0;
		if(preg_match_all($pattern, $query, $c)){
	
			foreach($c[0] as $k => $t){
				//hr("   Subpatron: ".$t, "blue","aqua");
				if($c['z'][$k]){
					$value += self::main($c['z'][$k]);
					continue;
				}
				if($c['x'][$k]){
					if($c['y'][$k]=='-'){
						
						$value += -self::main($c['x'][$k]); 
					}else{
						$value += self::main($c['x'][$k]); 
					}
					continue;
				
					
				}
				if($c['m'][$k]??false){
					$value += self::evalMulti($t);
					continue;
				}
				if($c['p2'][$k]??false){
					
					$value += self::evalPow($t);
					continue;
				}
				if($c['f'][$k]??false){
					
					$value += self::evalFunction($t);
					continue;
				}
				
				$value += $t;
			
			}
		} 
		
		return $value;
	}
	
	static function evalFunction($query){
		$pattern = "{
			(?(DEFINE)
				(?<paren> \( (?: (?>[^()]+)| (?R)  )* \) )
			)
			(?<fun> (?<name>\w+)(?<p>(?&paren)))
			
		}isx";
		$value = false;
		if(preg_match($pattern, $query, $c)){
	
			$f = $c['name'];
			if($c['p']!='()'){
				$value = $f(self::main($c['p']));
			}else{
				$value = $f();
			}
		}
		return $value; 	
	}
	
	static function evalMulti($query){
		//hr("Multi ".$query, "#112233","pink");
	
		$pattern = "{
			(?(DEFINE)
				(?<fun> \w+(?&paren))
				(?<paren> \( (?: (?>[^()]+)| (?R)  )* \) )
				(?<number>   (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
				(?<mul> (?&exp)([*%/](?&exp2))+)
				(?<exp>  ((?&number) | (?&fun) | (?&paren)  ))
				(?<exp2>  [\+\-]*((?&number) | (?&fun) | (?&paren)  ))
				(?<pot2> (?&exp)\s*[\^]\s*(?&exp2))
			
				
			)
			[\+\-]*(?&exp)|(?<o>[*%/])
		}isx";
	   
		$value = 1;
		$oper = '*';
		if(preg_match_all($pattern, $query, $c)){
			
			foreach($c[0] as $k => $t){
				
				if($c['o'][$k]??false){
					
					$oper = $c['0'][$k];
					continue;
					
					
				}
				switch($oper){
					case '*':
					default:
						
						$value = $value * self::main($t);
					break;
					case '/':
						$value = $value / self::main($t);
					break;
					case '%':
						$value = $value % self::main($t);
					break;
				}
				
			}
		} 
		//hr("Multiplicacion: ".$value, "red");
		return $value;
	}
	
	static function evalPow($query){
		//hr("Potencia ".$query, "red");
	
		$pattern = "{
			(?(DEFINE)
				(?<fun> \w+(?&paren))
				(?<paren> \( (?: (?>[^()]+)| (?R) | (?&paren)  )* \) )
				(?<number>   (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
				(?<exp> (?&number) | (?&fun) | (?&paren))
				#(?<pot> (?&exp)\s*[*]{2}\s*[-+]*(?&exp)(?![*]{2}))
			)
			(?<pot> (?<a>(?&exp))\s*[\^]\s*(?<b>[-+]*(?&exp)))
		}isx";
	   
		$value = 1;
		if(preg_match_all($pattern, $query, $c)){
			$value = self::main($c['a'][0]) ** self::main($c['b'][0]);
		} 
		return $value;
	}
}




