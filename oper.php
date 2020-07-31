<?php

function math($query, $debug=false){
	$query = arrage_pow($query);
	return oper($query, $debug);
}

function arrage_pow($query){
	
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

function oper($query, $debug = false){
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

function mfunction($query){
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
			$value = $f(oper($c['p']));
		}else{
			$value = $f();
		}
	}
	return $value; 	
}

function multi($query){
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
					
					$value = $value * oper($t);
				break;
				case '/':
					$value = $value / oper($t);
				break;
				case '%':
					$value = $value % oper($t);
				break;
			}
			
        }
	} 
	//hr("Multiplicacion: ".$value, "red");
    return $value;
}

function pot($query){
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
		$value = oper($c['a'][0]) ** oper($c['b'][0]);
	} 
    return $value;
}