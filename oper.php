<?php


function multi($query){


    $pattern = "{
		(?(DEFINE)
			(?<fun> -?\w+(?&paren))
			(?<paren> -?\( (?: (?>[^()]+)| (?R) | (?&paren)  )* \) )
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			#(?<exp> (?&number) | (?&fun) | (?&paren))
			(?<pot> (?&exp)\s*[*]{2}\s*(?&exp)(?![*]{2}))

			(?<mul> (?&exp)([*%/](?&exp))+)
			#(?<mul2> (?&number)([/%\*](?&number))+)
			
			(?<exp> (?&number) | (?&fun) | (?&paren))
			
		)
		(?&exp)|(?<o>[*%/])
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
					hr($t, "green");
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
	hr("Multiplicacion: ".$value, "red");
    return $value;
}

function pot($query){

	hr($query, "red");
    $pattern = "{
		(?(DEFINE)
			(?<fun> [\-\+]?\w+(?&paren))
			(?<paren> [\-\+]?\( (?: (?>[^()]+)| (?R) | (?&paren)  )* \) )
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<exp> (?&number) | (?&fun) | (?&paren))
			(?<pot> (?&exp)\s*[*]{2}\s*(?&exp)(?![*]{2}))
		)
		(?&exp)
    }isx";
   
    $value = false;
    if(preg_match_all($pattern, $query, $c)){
		foreach($c[0] as $k => $t){
			if($value === false){
				$value = oper($t);
				continue;
			}
			$value = $value ** oper($t);
		}
		


        
	} 
    return $value;
}