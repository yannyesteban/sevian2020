<?php
$query = '"hello" and 4==2 and 3>=2 or 1>1 or (2==2 and 3==2) or pi() and 3==null and true';
valid($query);
hx(logic($query, true));

function valid($query){
	$query = "   agua verde rodjo  ";
	$pattern = "{
		(?(DEFINE)

			(?<test>agua|azul|verde|rojo|\s+|$)
		)
		^(?&test)*$
		
		
		
		
	}isx";
	if(preg_match_all($pattern, $query, $c)){
		hx($c);
	}
	hx("nada");
}
function logic($query, $debug = false){
	//hr("Query: ".$query, "red");

	$pattern = "{
		(?(DEFINE)
			(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
			(?<fun> \w+(?&paren))
			(?<paren> \( (?: (?>[^()]+)| (?R)  )* \) )
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<mul> (?&exp)([*%/](?&exp2))+)
			(?<exp>  ((?&number) | (?&fun) | (?&paren) |(?&string)|true|false|null ))
			(?<exp2>  [\+\-]*((?&number) | (?&fun) | (?&paren)  ))
			(?<pot2> (?&exp)\s*[\^]\s*(?&exp2))
			(?<op>(?&exp)(==|>=|<=|>|<||=)(?&exp))
			(?<and>((?&op)|(?&exp))(\s*(and|xor)\s*((?&op)|(?&exp)))+)
		)
		(?&and)|
		(?&op)|
		(?&exp)|
		(true|false|null)
		
		
		
		
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




