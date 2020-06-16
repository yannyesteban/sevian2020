<?php
//$fruit = "pear";
//$a = ($fruit ?: 'apple'); 
//hx(1==1 xor 2==2 and 0==1,"red");
//hx ( ! 'a' );
$query = '"a" or true or 15 or "hello" and 4==2 and 3>=2 or 1>1 or (2==2 and 3==2 or (a==1 or a==2)) or pi() and 3==null and true';
$query = 'cos(45) and 11>10 or 3==3 and 4==4 and true and (9==4 and pi()*2) and pi()*2 or "string x" and (1==2 or 7==7) ';
//hx(1==1 and 2==1 and true or 6==6);
$query = "1==0 and 1==2 and 5==4";
$query = "'c'=='c' xor 2==2 and 1==1 and 5==5 or 1==1 xor 2==1";hx("Total: ".logic($query, true));
//$query = '0';

//$query = "1+3+5*(6+2)+---5*(4*9*(2+2))+pi(132)**2";

hx("Total: ".logic_and($query, true));

hx(1+(true==1)==2);
hx(mathx($query, true));

function logic($query, $debug = false){
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
	$last = null;
	$xor = false;
    if(preg_match_all($pattern, $query, $c)){
		

		foreach($c['term'] as $k => $t){
			if($c['paren'][$k] != ''){
				hr("Parentesis: $t");
				$value = logic($c['p'][$k]);
			}

			if($c['a'][$k] != ''){
				hr(".AND.: $t");
				$value = logic_and($c['a'][$k]);
			}
			if($c['xo'][$k] != ''){
				hr(".XOR.: $t");
				$value = logic_xor($c['xo'][$k]);
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
			
				$value = math($c['m'][$k]);
				hr("Matemática: [$t] => ".$c['m'][$k]);
				
				
			}

			if($c['o'][$k] != ''){
				$t1 = logic($c['o1'][$k]);
				$t2 = logic($c['o2'][$k]);
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
function logic_and($query, $debug = false){
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
				$value = logic($c['p'][$k]);
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
			
				$value = math($c['m'][$k]);
				hr("Matemática: [$t] => ".$c['m'][$k]);
				
				
			}

			if($c['o'][$k] != ''){
				$t1 = logic($c['o1'][$k]);
				$t2 = logic($c['o2'][$k]);
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

function logic_xor($query, $debug = false){
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
				$value = logic($c['p'][$k]);
			}
			if($c['a'][$k] != ''){
				hr(".AND.: $t");
				$value = logic_and($c['a'][$k]);
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
			
				$value = math($c['m'][$k]);
				hr("Matemática: [$t] => ".$c['m'][$k]);
				
				
			}

			if($c['o'][$k] != ''){
				$t1 = logic($c['o1'][$k]);
				$t2 = logic($c['o2'][$k]);
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

function mathx($query, $debug = false){
	//hr("Query: ".$query, "red");
	$query = "1 and 2 and 3 and 4 and 5 and 6 and 7 and 8 and 9 and 444";
	$pattern = "{
		(?(DEFINE)
			(?<fun> \w+(?&paren))
			(?<paren> \( (?: (?>[^()]+)| (?R)  )* \) )
			(?<number>   (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<mul> (?&exp)([*%/](?&exp2))+)
			(?<exp>  ((?&number) | (?&fun) | (?&paren)  ))
			(?<exp2>  [\+\-]*((?&number) | (?&fun) | (?&paren)  ))
			(?<pot2> (?&exp)\s*[\^]\s*(?&exp2))
			(?<and>(?&exp)(\s*and\s*(?&exp))*)
			(?<and2> (?&exp) ((?=(\s*and\s*(?&exp)))|$)   )
			(?<or>(?&and2)(\s*or\s*(?&and2))*)
			(?<aa>(?&exp)(\s*and))
			(?<w>(?&exp)(\s*and\s*(?&exp))+)
			(?<w2>(?&w)(\s*or))
			(?<w3>(?&and)(?=\s*or\s*))
			(?<w4>(or)\s*(?&and)+)
		)
		(?<k>(?&w3))
		|
		(?<k4>(?&w4))
		|
		(?<L>(?&and2))
		
		
		

		
	}isx";
	
	if($debug and preg_match_all($pattern, $query, $c)){
		hx($c);
	}
	exit;
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
function logicx($query, $debug = false){
	hr("Query: ".$query, "#123574", "#ffaacc");

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
		)(?<term>
		(?<a>(?&and))|
		##(?<or2>(?<ora>(?&op)|(?&exp)|(?&m))(\s*(or)\s*(?<orb>(?&op)|(?&exp)|(?&m)))+)|
		#(?<a>(?:(?&op)|(?&exp)|(?&m))(?<ao>\s*(and|xor)\s*(?:(?&op)|(?&exp)|(?&m)))+)|
		##(?<op>(?<o1>[\+\-]*(?&exp))(?<o>(==|>=|<=|>|<|!=))(?<o2>[\+\-]*(?&exp)))|
		(?<op>(?<o1>(?&m))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)))|
		
		(?<paren> \( (?<p>(?: (?>[^()]+)| (?R)  )*) \) )|

		(?<m>[\+\-]*(?&exp3)(?:[\*/%\+\-](?&exp3))*(?:\*\*(?&exp3))*)|
		
		(?<n>(?&number))|
		(?<f>(?&fun))|
		(?<s>(?<string>   \" (?<t>(?:   [^\"\\\\]|\\\\.     )*) \"     ))|
		(?<s2>(?<string2>   ' (?<t2>(?:   [^'\\\\]|\\\\.     )*) '     ))|
		(?<v>true|false|null)
		

		
		
		)(?:\s*(?<opp>or)\s)?
		
		
	}isx";
	if($debug and preg_match_all($pattern, $query, $c)){
		hx($c);
	}

	$value = '';
	$last = null;
	$xor = false;
    if(preg_match_all($pattern, $query, $c)){

		foreach($c['term'] as $k => $t){
			if($c['paren'][$k] != ''){
				hr("Parentesis: $t");
				$value = logic($c['p'][$k]);
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
			
				$value = math($c['m'][$k]);
				hr("Matemática: [$t] => ".$c['m'][$k]);
				
				
			}

			if($c['o'][$k] != ''){
				$t1 = logic($c['o1'][$k]);
				$t2 = logic($c['o2'][$k]);
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

			if($xor){
				hr("last: ".$last. " value: ".$value);
				$value = ($last xor $value);
				
				hr("....".$value, "red");
			}

			if($op == 'and'){
				$last = $value;
				if($value){
					continue;
				}else{
					return $value;
				}
			}
			if($op == 'or'){
				$last = $value;
				if($value){
					return $value;
				}else{
					continue;
				}
			}
			if($op == 'xor'){hr(888);
				$last = $value;
				$xor = true;
				continue;
				
			}

			

			return $value;
			
		
		}
	} 
	
    return $value;
}


function logic_and2($query, $debug = false){
	hr("Query: ".$query, "red");

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
		)(?<term>
		#(?<and_x>(?&and))|
		(?<op>(?<o1>(?&m))(?<o>(==|>=|<=|>|<|!=))(?<o2>(?&m)))|
		(?<paren> \( (?<p>(?: (?>[^()]+)| (?R)  )*) \) )|
		(?<m>[\+\-]*(?&exp3)(?:[\*/%\+\-](?&exp3))*(?:\*\*(?&exp3))*)|
		(?<n>(?&number))|
		(?<f>(?&fun))|
		(?<s>(?<string>   \" (?<t>(?:   [^\"\\\\]|\\\\.     )*) \"     ))|
		(?<s2>(?<string2>   ' (?<t2>(?:   [^'\\\\]|\\\\.     )*) '     ))|
		(?<v>true|false|null)
		
		)(\s*(?<opp>or)\s)?
		
		
	}isx";
	$query = "1 and 2 and 3 or 5";
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




