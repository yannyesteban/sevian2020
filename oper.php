<?php


function multi($query){


    $pattern = "{
		(?(DEFINE)
			(?<fun> \w+(?&paren))
			(?<paren> \( (?: (?>[^()]+)| (?R) | (?&paren)  )* \) )
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<exp> (?&number) | (?&fun) | (?&paren))
			(?<pot> (?&exp)\s*[*]{2}\s*(?&exp)(?![*]{2}))
		)
		(?&number)
    }isx";
   
    $value = 1;
    if(preg_match_all($pattern, $query, $c)){
        foreach($c[0] as $t){
            $value = $value * $t;
        }
	} 
    return $value;
}

function pot($query){


    $pattern = "{
		(?(DEFINE)
			(?<fun> \w+(?&paren))
			(?<paren> \( (?: (?>[^()]+)| (?R) | (?&paren)  )* \) )
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<exp> (?&number) | (?&fun) | (?&paren))
			(?<pot> (?&exp)\s*[*]{2}\s*(?&exp)(?![*]{2}))
		)
		(?&number)
    }isx";
   
    $value = 1;
    if(preg_match_all($pattern, $query, $c)){
        foreach($c[0] as $t){
            //$value = $value * $t;
        }
	} 
    return $value;
}