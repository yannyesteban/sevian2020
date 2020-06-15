<?php
//$fruit = "pear";
//$a = ($fruit ? "w": 'apple'); 

//hx ( ! 'a' );
$query = '"a" or true or 15 or "hello" and 4==2 and 3>=2 or 1>1 or (2==2 and 3==2 or (a==1 or a==2)) or pi() and 3==null and true';
$query = '11>10 or 3==3 and 4==4 and true';
//$query = '0';

//$query = "1+3+5*(6+2)+---5*(4*9*(2+2))+pi(132)**2";

hx("Toral: ".logic_and($query, true));

hx(1+(true==1)==2);
hx(mathx($query, true));
function mathx($query, $debug = false){
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
		(?<n>[\+\-]*(?&exp)([\*/%](?&exp))*(\*\*(?&exp))*)*
		#(?<y>[\+\-])(?<x>[\+\-]*(?:(?R)))
		#|(?<p2>(?&pot2))
		#|(?<pr>(?: \( (?<z> (?R) +  ) \) ))
		#|(?<m>(?&mul))
		#|(?<f>(?&fun))
		#|(?<n>(?&number))
		
	}isx";
	if($debug and preg_match_all($pattern, $query, $c)){
		hx($c);
	}
}
function valid($query){
	$query = "agua azul negro blanco blanko";
	$pattern = "{
		(?(DEFINE)

			(?<test>agua|azul|verde|rojo|\s+|$)
			(?<test2>negro|gris|\s+|$)
			(?<test3>blanco|blanko)
		)
		^((?&test)|(?&test2)|(?<x>(?&test3)+))+$
		
		
		
	}isx";
	if(preg_match_all($pattern, $query, $c)){
		hx($c);
	}
	hx("nada");
}
function logic($query, $debug = false){
	hr("Query: ".$query, "red");

	$pattern = "{
		(?(DEFINE)
			#(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
			#(?<string2>   ' (?:   [^'\\\\]|\\\\.     )* '     )
			(?<fun> \w+(?&paren))
			#(?<paren> \( (?: (?>[^()]+)| (?R)  )* \) )
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<mul> (?&exp)([*%/](?&exp2))+)
			(?<exp>  ((?&number) | (?&fun) | (?&paren) |(?&s)|(?&s2)|true|false|null ))
			(?<exp2>  [\+\-]*((?&number) | (?&fun) | (?&paren)  ))
			(?<pot2> (?&exp)\s*[\^]\s*(?&exp2))
			#(?<op>(?&exp)(==|>=|<=|>|<|!=)(?&exp))
			(?<and>((?&op)|(?&exp)|(?&m))(\s*(and|xor)\s*((?&op)|(?&exp)|(?&m)))+)
			(?<exp3>  ((?&number) | (?&fun) | (?&paren)  ))
		)
		//(?<a>(?&and))|
		#(?<or2>(?<ora>(?&op)|(?&exp)|(?&m))(\s*(or)\s*(?<orb>(?&op)|(?&exp)|(?&m)))+)|
		(?<a>(?:(?&op)|(?&exp)|(?&m))(?<ao>\s*(and|xor)\s*(?:(?&op)|(?&exp)|(?&m)))+)|
		#(?<op>(?<o1>[\+\-]*(?&exp))(?<o>(==|>=|<=|>|<|!=))(?<o2>[\+\-]*(?&exp)))|
		(?<op>(?<o1>(?&m))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)))|
		(?<m>[\+\-]*(?&exp3)(?:[\*/%\+\-](?&exp3))*(?:\*\*(?&exp3))*)|
		
		(?<n>(?&number))|
		(?<f>(?&fun))|
		(?<s>(?<string>   \" (?<t>   [^\"\\\\]|\\\\.     )* \"     ))|
		(?<s2>(?<string2>   ' (?<t2>   [^'\\\\]|\\\\.     )* '     ))|
		(?<v>true|false|null)|
		(?<paren> \( (?<p>(?: (?>[^()]+)| (?R)  )*) \) )
		

		
		
		
		
		
	}isx";
	if($debug and preg_match_all($pattern, $query, $c)){
		hr($c);
	}

    $value = false;
    if(preg_match_all($pattern, $query, $c)){

		foreach($c[0] as $k => $t){
			if($c['m'][$k] != ''){;
				return math($t);
				
			}

			if(isset($c['o'][$k])){
				$t1 = logic($c['o1'][$k]);
				$t2 = logic($c['o2'][$k]);
				$value = false;
				hr($t1." ".$c['o'][$k]." ".$t2);
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
				if($value){
					return true;
				}
			}

			if(isset($c['string'][$k]) or isset($c['string2'][$k])){
				if($c['t'][$k] or $c['t2'][$k]){
					return true;
				}
			}

			if(isset($c['n'][$k])){
				if($c['n'][$k]){
					return $c['n'][$k];
				}
			}
			if(isset($c['v'][$k])){
				if($c['v'][$k]=='true'){
					return true;
				}
			}

			
			continue;
			//hr("   Subpatron: ".$t, "blue","aqua");
			if($c['z'][$k]){
				$value += oper($c['z'][$k]);
				continue;
			}
			if($c['x'][$k]){
				if($c['y'][$k]=='-'){
					
					$value += -oper($c['x'][$k]); 
				}else{
					$value += oper($c['x'][$k]); 
				}
				continue;
			
				
			}
			if($c['m'][$k]??false){
				$value += multi($t);
				continue;
			}
			if($c['p2'][$k]??false){
				
				$value += pot($t);
				continue;
			}
			if($c['f'][$k]??false){
				
				$value += mfunction($t);
				continue;
			}
			
			$value += $t;
		
		}
	} 
	
    return $value;
}


function logic_and($query, $debug = false){
	hr("Query: ".$query, "red");

	$pattern = "{
		(?(DEFINE)
			#(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
			#(?<string2>   ' (?:   [^'\\\\]|\\\\.     )* '     )
			(?<fun> \w+(?&paren))
			#(?<paren> \( (?: (?>[^()]+)| (?R)  )* \) )
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<mul> (?&exp)([*%/](?&exp2))+)
			(?<exp>  ((?&number) | (?&fun) | (?&paren) |(?&s)|(?&s2)|true|false|null ))
			(?<exp2>  [\+\-]*((?&number) | (?&fun) | (?&paren)  ))
			(?<pot2> (?&exp)\s*[\^]\s*(?&exp2))
			#(?<op>(?&exp)(==|>=|<=|>|<|!=)(?&exp))
			(?<and>((?&op)|(?&exp)|(?&m))(\s*(and|xor)\s*((?&op)|(?&exp)|(?&m)))+)
			(?<exp3>  ((?&number) | (?&fun) | (?&paren)  ))
			(?<paren> \( (?<p>(?: (?>[^()]+)| (?R)  )*) \) )
			(?<v>true|false|null)
			(?<s>(?<string>   \" (?<t>   [^\"\\\\]|\\\\.     )* \"     ))
			(?<s2>(?<string2>   ' (?<t2>   [^'\\\\]|\\\\.     )* '     ))
			(?<op>(?<o1>(?&m))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)))
			(?<m>[\+\-]*(?&exp3)(?:[\*/%\+\-](?&exp3))*(?:\*\*(?&exp3))*)
	
		)
		
		
		(?<a>
			
		(?:(?&op)|(?&exp)|(?&m))

		)
		
		
		
	}isx";
	if($debug and preg_match_all($pattern, $query, $c)){
		hx($c);
	}

    $value = false;
    if(preg_match_all($pattern, $query, $c)){

		foreach($c[0] as $k => $t){
			if($c['m'][$k] != ''){;
				return math($t);
				
			}

			if(isset($c['o'][$k])){
				$t1 = logic($c['o1'][$k]);
				$t2 = logic($c['o2'][$k]);
				$value = false;
				hr($t1." ".$c['o'][$k]." ".$t2);
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
				if($value){
					return true;
				}
			}

			if(isset($c['string'][$k]) or isset($c['string2'][$k])){
				if($c['t'][$k] or $c['t2'][$k]){
					return true;
				}
			}

			if(isset($c['n'][$k])){
				if($c['n'][$k]){
					return $c['n'][$k];
				}
			}
			if(isset($c['v'][$k])){
				if($c['v'][$k]=='true'){
					return true;
				}
			}

			
			continue;
			//hr("   Subpatron: ".$t, "blue","aqua");
			if($c['z'][$k]){
				$value += oper($c['z'][$k]);
				continue;
			}
			if($c['x'][$k]){
				if($c['y'][$k]=='-'){
					
					$value += -oper($c['x'][$k]); 
				}else{
					$value += oper($c['x'][$k]); 
				}
				continue;
			
				
			}
			if($c['m'][$k]??false){
				$value += multi($t);
				continue;
			}
			if($c['p2'][$k]??false){
				
				$value += pot($t);
				continue;
			}
			if($c['f'][$k]??false){
				
				$value += mfunction($t);
				continue;
			}
			
			$value += $t;
		
		}
	} 
	
    return $value;
}




