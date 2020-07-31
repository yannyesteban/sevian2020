<?php 
include "Sevian/Functions.php";
include "Sevian/Logic.php";




$query = "1==0 and 1==2 and 5==4";
$query = "'c'=='c' xor 2==2 and 1==1 and 5==5 or 1==1 xor 2==1";
hx("Total ..: ".\sevian\Logic::evalOr($query, true));
//$query = '0';

include "oper.php";
include "oper2.php";

$query = "4==2 and 3==2 or 1==1 or (2==2 and 3==2)";

hx(logic($query, true));

//hx(2**-( -( -( -2))));
//hx(2**(- (- (- (-2)))));

//hx(2*+(2));
//hx(arrage_pow("2**-(2)**2"));

$query = "(2)**2**(1+1)";
$query = "2**(2+2*2+(1+2))";
$query = "cos(deg2rad(45))";//2^9
//$query = "";//2+4+3
$query = arrage_pow($query);
//hx($query);
hx("Total: ".oper($query, false));


$query = "4**-(+(+(-2)))";
//$query = "2**-( -( -( -2)))";
//$query = "3*+(2)";
//$query = "----++-+++-1*2+2--3";
$query = "-----4 --(--1)+2*+pi()-5*-cos(8)+3+---1+pi()+(3+5)+4*5+6*9*9/25-(-3*5*(4*2))";

//$query = arrage_signe($query);


$query = arrage_pow($query);
$query = oper2($query);
hr("Final : ".$query);

exit;

function aa(){
	hr("aa");
	return 1;
}
function bb(){
	hr("bb");
	return -2;
}

function cc(){
	hr("cc");
	return 2;
}
function db($v){
	hr("value $v");
	
}

$a = -1;


//hx(aa(db(1))-2*bb(db(2))**cc(db(3)));
//hx(aa(1)-2*bb(db(2))**cc(db(3)));
//hx(1-2*bb(db(2))**cc(db(3)));
//hx(1-2*bb(2)**cc(db(3)));
//hx(1-2*(-2)**cc(db(3)));
//hx(1-2*(-2)**cc(3));
//hx(1-2*(-2)**2);
//hx(1-2*4);
//hx(1-8);
//hx(-7);


hx(pp($query));



$query = '>1 and b>2+"4"+++op and c>3';
$query = 'a==1 or b==2 or c==3 or (a>5 and b>2) AND a > 1 AND b+3!= 28+(5+3*5-3)+36+yahh AND 1++++3 != 5.05 OR d=="56" OR "xx+8" and true OR (s>5 or c>5 and 5+3==2+8)';


$query = '"yanny"==65*5+6-9+2*3*5+3+9*8';
$query = remp($query);
//echo eval("echo (-2)**-2;");exit;
echo eval("echo 2+2+3*4*5*6+7+(-8*9+8*3*(5+3*4))+1;");

echo sEval($query);exit;
function arrage_signe($query){

	$query = preg_replace([
		"{
		
			[\-]\s*(?=[\+\-])
		}isx",
		"{
		
			[\+]\s*(?=[\+\-])
		}isx"

	],['${0}1*','1*'], $query);

	return $query;

}
function arrage_pow2($query){
	//$query = "(2+3)";
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
	if(preg_match_all($pattern, $query, $c)){
		//hr($c,"green");
	}
	$t = true;
	
	while($t){
		$t = false;
		$query = preg_replace_callback(
			$pattern,
			function ($c) use(&$t, $query) {
				$t = true;
				hr(str_replace('**','^',"(".$c[0].")" ));
				return str_replace('**','^',"(".$c[0].")" );
			},
			$query,
			1
		);
	}
	
	return $query;
}

function oper2($query){
	hr(".....Query: $query ", "blue");
	$pattern = "{
		(?(DEFINE)
		#(?<!\w)
			#(?<fun2> \w+\( (?: (?>[^()]+)| (?R)  )* \))
			(?<fun> \w+(?&paren))
			
			(?<paren> \( (?: (?>[^()]+)| (?R) | (?&paren)  )* \) )
			#(?<parenx> \( (?: (?>[^()]+)| (?R)   )* \) )	
			(?<number>   (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			
			(?<number2> \((?&number)\))
			(?<pos>   (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<mul> (?&exp)([*%/](?&exp))+)
			(?<mul2> (?&number)([/%*](?&number))+)
			
			(?<exp> [\+\-]* ((?&number) | (?&fun) | (?&paren)))
			#(?<pot> (?<=[*]{2})\s*(?&exp)\s*[*]{2}\s*(?&exp))
			#(?<pot> \s*(?&exp)\s*[*]{2}\s*(?&exp))
			#(?<pot> (?![*]{2})\s*(?&exp)\s*[*]{2}\s*(?&exp)(?![*]{2}))
			#(?<pot2> (?&exp)\s*[*]{2}\s*(?&exp)(?![*]{2}))
			(?<pot2> (?&exp)\s*[\^]\s*(?&exp)(?![*]{2}))
		)
		
		(?&mul)|
		(?&exp)
		

		
	}isx";
	

	$t=true;
	if(preg_match_all($pattern, $query, $c)){
		hr($c,"red");
	}
	$value = 0;
    if(preg_match_all($pattern, $query, $c)){
        foreach($c[0] as $k => $t){
			hr($t);
			//hr($c['m2'][$k],"blue");
			if($c['oo'][$k]??false){
				hr($c['oo'][$k],"blue");
				$value += -oper($c['oo'][$k]);
			}
			if($c['o2'][$k]??false){
				hr($c['o2'][$k],"blue");
				$value += oper($c['o2'][$k]);
			}
			if($c['pq'][$k]??false){
				//hr($c['pq'][$k],"blue");
				$value += oper($c['pq'][$k]);
			}
			if($c['m'][$k]??false){
				$value += multi($t);
			}
			if($c['p2'][$k]??false){
				$value += pot($t);
			}
			if($c['n'][$k]??false){
				$value += $t;
			}
           // $value = $value * $t;
        }

		
	} 
	
	//hr($value, "aqua","blue");
    

    return $value;
	
	hx($query);


	if(preg_match_all($pattern, $query, $c)){
		$t = false;

		foreach($c as $k => $v){
			$o = $c['o'][$k]?? false;
			
			if($t === false){
				$t = $v;
			}


		}
		hx($c);
	}
	$t=true;
	while($t){
		$t =  false;
		$query = preg_replace_callback(
			$pattern,
			function ($c) use(&$t) {
				$t = true;
				
				return str_replace('**','^',"(".$c[0].")" );
				
				
			},
			$query,
			1
		);
	}

	hx($query, "red");
	if(preg_match($pattern, $query, $c)){
		hx($c);
	}
	$t = true;
	while($t){
		$t =  false;
		$query = preg_replace_callback(
			$pattern,
			function ($c) use(&$t) {
				$t = true;
				if($c['o']=='*'){
					return $c['a']*$c['b'];
				}elseif($c['o']=='/' and $c['b']!='0'){
					return $c['a']/$c['b'];
				}else{
					return 'error';
				}
				//hx($c['a']);
				//return"";
				
				
			},
			$query, 1
		);
	}
	$pattern = "{
		(?(DEFINE)
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<mul> (?&number)[*](?&number))
		)

		((?<a>(?&number))(?<o>[+-])(?<b>(?&number)))
	}isx";

	if(preg_match($pattern, $query, $c)){
		//hx($c);
	}
	$t = true;
	while($t){
		$t =  false;
		$query = preg_replace_callback(
			$pattern,
			function ($c) use(&$t) {
				$t = true;
				if($c['o']=='+'){
					return $c['a']+$c['b'];
				}elseif($c['o']=='-'){
					return $c['a']-$c['b'];
				}
				
				//hx($c['a']);
				//return"";
				
				
			},
			$query
		);
	}
	return $query;
	
}

function oper4($query){
	hr(".....Query: $query ", "blue");
	$pattern = "{
		(?(DEFINE)
		#(?<!\w)
			#(?<fun2> \w+\( (?: (?>[^()]+)| (?R)  )* \))
			(?<fun> [\-\+]?\w+(?&paren))
			
			(?<paren> [\-\+]?\( (?: (?>[^()]+)| (?R) | (?&paren)  )* \) )
			#(?<parenx> \( (?: (?>[^()]+)| (?R)   )* \) )	
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<number3>   \+? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<number2> \((?&number)\))
			(?<pos>   (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<mul> (?&exp)([*%/](?&exp))+)
			(?<mul2> (?&number)([/%*](?&number))+)
			
			(?<exp> (?&number2) |(?&number)|(?&number3) | (?&fun) | (?&paren))
			#(?<pot> (?<=[*]{2})\s*(?&exp)\s*[*]{2}\s*(?&exp))
			#(?<pot> \s*(?&exp)\s*[*]{2}\s*(?&exp))
			#(?<pot> (?![*]{2})\s*(?&exp)\s*[*]{2}\s*(?&exp)(?![*]{2}))
			#(?<pot2> (?&exp)\s*[*]{2}\s*(?&exp)(?![*]{2}))
			(?<pot2> (?&exp)\s*[\^]\s*(?&exp)(?![*]{2}))
		)
		#(?&exp)
		
		(?<p2>(?&pot2))|
		(-(?<oo>(?&paren)))|
		(\+(?<o2>(?&paren)))|
		(?<m>(?&mul))|
		(?<n> (?&number)) | (?<f>(?&fun)) | (?<p>(\(?<pq>( (?: (?>[^()]+)| (?R)| (?&paren)   )* )\)))
		
		#(?<m2>(?&mul2))|
		#(?<pt>(?&pot2))|
		#(?<f>(?&fun))|
		
		#(?<p>(?&paren))|
		#(?<n>(?&number))
		#(?&exp)[*](?&exp)|
		#(?<o>(?:[*]{2}|\+|\-|\*|/))?((?&pos) | (?&fun) | (?&paren))

		
		#(?:(?<t1>(?&exp))(?<c>[*]{2})(?<t2>(?&exp)))
		#((?<a>(?&number))(?<o>[*/])(?<b>(?&number)))
	}isx";
	

	$t=true;
	if(preg_match_all($pattern, $query, $c)){
		//hr($c,"red");
	}
	$value = 0;
    if(preg_match_all($pattern, $query, $c)){
        foreach($c[0] as $k => $t){
			hr($t);
			//hr($c['m2'][$k],"blue");
			if($c['oo'][$k]??false){
				hr($c['oo'][$k],"blue");
				$value += -oper($c['oo'][$k]);
			}
			if($c['o2'][$k]??false){
				hr($c['o2'][$k],"blue");
				$value += oper($c['o2'][$k]);
			}
			if($c['pq'][$k]??false){
				//hr($c['pq'][$k],"blue");
				$value += oper($c['pq'][$k]);
			}
			if($c['m'][$k]??false){
				$value += multi($t);
			}
			if($c['p2'][$k]??false){
				$value += pot($t);
			}
			if($c['n'][$k]??false){
				$value += $t;
			}
           // $value = $value * $t;
        }

		
	} 
	
	//hr($value, "aqua","blue");
    

    return $value;
	
	hx($query);


	if(preg_match_all($pattern, $query, $c)){
		$t = false;

		foreach($c as $k => $v){
			$o = $c['o'][$k]?? false;
			
			if($t === false){
				$t = $v;
			}


		}
		hx($c);
	}
	$t=true;
	while($t){
		$t =  false;
		$query = preg_replace_callback(
			$pattern,
			function ($c) use(&$t) {
				$t = true;
				
				return str_replace('**','^',"(".$c[0].")" );
				
				
			},
			$query,
			1
		);
	}

	hx($query, "red");
	if(preg_match($pattern, $query, $c)){
		hx($c);
	}
	$t = true;
	while($t){
		$t =  false;
		$query = preg_replace_callback(
			$pattern,
			function ($c) use(&$t) {
				$t = true;
				if($c['o']=='*'){
					return $c['a']*$c['b'];
				}elseif($c['o']=='/' and $c['b']!='0'){
					return $c['a']/$c['b'];
				}else{
					return 'error';
				}
				//hx($c['a']);
				//return"";
				
				
			},
			$query, 1
		);
	}
	$pattern = "{
		(?(DEFINE)
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<mul> (?&number)[*](?&number))
		)

		((?<a>(?&number))(?<o>[+-])(?<b>(?&number)))
	}isx";

	if(preg_match($pattern, $query, $c)){
		//hx($c);
	}
	$t = true;
	while($t){
		$t =  false;
		$query = preg_replace_callback(
			$pattern,
			function ($c) use(&$t) {
				$t = true;
				if($c['o']=='+'){
					return $c['a']+$c['b'];
				}elseif($c['o']=='-'){
					return $c['a']-$c['b'];
				}
				
				//hx($c['a']);
				//return"";
				
				
			},
			$query
		);
	}
	return $query;
	
}

function pp($query){
	$pattern =  "{
		(?(DEFINE)
		(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<paren> \( (?: (?>[^()]+)  )* \) )
		)

		(?&paren)


	}isx";
	if (preg_match_all($pattern, $query,$c)){
		//hx($c);
		echo 5;
	}
	$query = preg_replace_callback(
        $pattern,
        function ($c) {

			return oper($c[0]);
			
            
        },
        $query
	);
	return $query;
}
function suma($query){

	$query = "1+2+3*(5+6)*3+6*3+(3+6)";
	hr($query);
	$exp = "{
		(?(DEFINE)
			(?<pp> \( (?: (?>[^()]+) | (?R) )* \) )
			(?<pe> \( (?: (?>[^()]+) | (?&ex) )* \) )
			(?<pex> \( (?: (?&ex) )* \) )
			(?<w>\w+)
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<positive>  (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<str>    \" (?:[^\"\\\\]* | \\\\ [\"\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* \" )
	
			(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
			(?<cmll>[\"'])
			(?<ex>(?:(?&pe)|(?&number)|(?&w)|(?&string))(?:[\+\-\*/%^]+(?:(?&pe)|(?&number)|(?&w)|(?&string)))+)
			(?<cond>(?:(?&ex)|(?&number)|(?&w)|(?&string))(?:\s*(?:>|<|>=|<=|==|!=)\s*)(?:(?&ex)|(?&number)|(?&w)|(?&string))+)
			(?<t>(?&pex)|(?&ex)|(?&string)|(?&number)|(?&w)|true|false|null)
			(?<condition>(?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )
			(?<condition2>((?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )  | (?&t))
			
		)
		(?<p5p> \( (?: (?>[^()]+)  )* \) )
		#(?<pow>(?&number)((\*\*)(?&number)))
		#(?<pow>(?&number)((\*\*)(?&number))) |
		#(?<M>(?&number)([\*/](?&number))*+)
		#|(?&positive)(\+(?&positive))+
		#(?<t1>(?&t))\s* (?<c>(?:>|<|>=|<=|==|!=))\s* (?<t2>(?&t))
	
		
	}six";	

	if (preg_match_all($exp, $query,$c)){
		hx($c);
		hr($c['t1'],"green");
		hr($c['c'],"blue");
		hr($c['t2'],"red");

		$value = null;
		switch($c['c']){
			case '===':
				$value = $c['t1'] === $c['t2'];
				break;
			case '==':
				$value = $c['t1'] == $c['t2'];
				break;
			case '!=':
				$value = $c['t1'] != $c['t2'];
				break;
			case '>':
				$value = $c['t1'] > $c['t2'];
				break;
			case '>=':
				$value = $c['t1'] >= $c['t2'];
			break;
			case '<':
				$value = $c['t1'] < $c['t2'];
			break;
			case '<=':
				$value = $c['t1'] <= $c['t2'];
			break;
			default:
				echo "error";
				return;
				
		}

		echo ($value?"verdadero":"false");
		
		
		
		
	}// end if
}

function suma2($query){
	$exp = "{
		(?(DEFINE)
			(?<pp> \( (?: (?>[^()]+) | (?R) )* \) )
			(?<pe> \( (?: (?>[^()]+) | (?&ex) )* \) )
			(?<pex> \( (?: (?&ex) )* \) )
			(?<w>\w+)
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<numberpos>   (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<str>    \" (?:[^\"\\\\]* | \\\\ [\"\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* \" )
	
			(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
			(?<cmll>[\"'])
			(?<ex>(?:(?&pe)|(?&number)|(?&w)|(?&string))(?:[\+\-\*\\\%^]+(?:(?&pe)|(?&number)|(?&w)|(?&string)))+)
			(?<cond>(?:(?&ex)|(?&number)|(?&w)|(?&string))(?:\s*(?:>|<|>=|<=|==|!=)\s*)(?:(?&ex)|(?&number)|(?&w)|(?&string))+)
			(?<t>(?&pex)|(?&ex)|(?&string)|(?&number)|(?&w)|true|false|null)
			(?<condition>(?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )
			(?<condition2>((?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )  | (?&t))
			
		)
		(?&numberpos) |
		((?<c>(?:\+\+|\-\+|\+|\-\-|\+\-|\-|\*|\\\%))(?&numberpos))

		
	
		
	}six";	
	
	if (preg_match_all($exp, $query,$c)){
		print_r($c);exit;
		$t = false;
		foreach($c[0] as $e){
			if($t===false){
				$t = $e;
				continue;
			}
			hr($e);
			$t = $t + $e;

		}
		hr($t);
		print_r($c);exit;

		hr($c['t1'],"green");
		hr($c['c'],"blue");
		hr($c['t2'],"red");

		$value = null;
		switch($c['c']){
			case '+':
				$value = $c['t1'] === $c['t2'];
				break;
			case '-':
				$value = $c['t1'] == $c['t2'];
				break;
			case '*':
				$value = $c['t1'] != $c['t2'];
				break;
			case '/':
				$value = $c['t1'] > $c['t2'];
				break;
			case '%':
				$value = $c['t1'] >= $c['t2'];
			break;
			case '^':
				$value = $c['t1'] < $c['t2'];
			break;
			case '<=':
				$value = $c['t1'] <= $c['t2'];
			break;
			default:
				echo "error";
				return;
				
		}

		echo ($value?"verdadero":"false");
		
		
		
		
	}// end if
}
function mc($query){
	$exp = "{
		(?(DEFINE)
			(?<pp> \( (?: (?>[^()]+) | (?R) )* \) )
			(?<pe> \( (?: (?>[^()]+) | (?&ex) )* \) )
			(?<pex> \( (?: (?&ex) )* \) )
			(?<w>\w+)
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<str>    \" (?:[^\"\\\\]* | \\\\ [\"\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* \" )
	
			(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
			(?<cmll>[\"'])
			(?<ex>(?:(?&pe)|(?&number)|(?&w)|(?&string))(?:[\+\-\*\\\%^]+(?:(?&pe)|(?&number)|(?&w)|(?&string)))+)
			(?<cond>(?:(?&ex)|(?&number)|(?&w)|(?&string))(?:\s*(?:>|<|>=|<=|==|!=)\s*)(?:(?&ex)|(?&number)|(?&w)|(?&string))+)
			(?<t>(?&pex)|(?&ex)|(?&string)|(?&number)|(?&w)|true|false|null)
			(?<condition>(?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )
			(?<condition2>((?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )  | (?&t))
			
		)
		

		(?<t1>(?&t))\s* (?<c>(?:>|<|>=|<=|==|!=))\s* (?<t2>(?&t))
	
		
	}six";	

	if (preg_match($exp, $query,$c)){

		hr($c['t1'],"green");
		hr($c['c'],"blue");
		hr($c['t2'],"red");

		$value = null;
		switch($c['c']){
			case '===':
				$value = $c['t1'] === $c['t2'];
				break;
			case '==':
				$value = $c['t1'] == $c['t2'];
				break;
			case '!=':
				$value = $c['t1'] != $c['t2'];
				break;
			case '>':
				$value = $c['t1'] > $c['t2'];
				break;
			case '>=':
				$value = $c['t1'] >= $c['t2'];
			break;
			case '<':
				$value = $c['t1'] < $c['t2'];
			break;
			case '<=':
				$value = $c['t1'] <= $c['t2'];
			break;
			default:
				echo "error";
				return;
				
		}

		echo ($value?"verdadero":"false");
		
		
		
		
	}// end if
}

function sEval($query, $mode=true){
	$exp = "{
		(?(DEFINE)
			(?<pp> \( (?: (?>[^()]+) | (?R) )* \) )
			(?<pe> \( (?: (?>[^()]+) | (?&ex) )* \) )
			(?<pex> \( (?: (?&ex) )* \) )
			(?<w>\w+)
			(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
			(?<str>    \" (?:[^\"\\\\]* | \\\\ [\"\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* \" )
	
			(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
			(?<cmll>[\"'])
			(?<ex>(?:(?&pe)|(?&number)|(?&w)|(?&string))(?:[\+\-\*\\\%^]+(?:(?&pe)|(?&number)|(?&w)|(?&string)))+)
			(?<cond>(?:(?&ex)|(?&number)|(?&w)|(?&string))(?:\s*(?:>|<|>=|<=|==|!=)\s*)(?:(?&ex)|(?&number)|(?&w)|(?&string))+)
			(?<t>(?&pex)|(?&ex)|(?&string)|(?&number)|(?&w)|true|false|null)
			(?<condition>(?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )
			(?<condition2>((?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )  | (?&t))
			
		)
		#(?&pp)|(?&string)|(?&condition)|(AND|OR|XOR)|(?&ex)|(?:true|false|null)
		(?<a>(?&pp))|
			#(?&condition)
			#|(?<b>(?&string))
			#|(?<d>(AND|OR|XOR))
			#|(?<e>(?&ex))
			#|(?<f>(?:true|false|null))
	
	
		(?<vv>(?&condition2))
	}six";
	
	
	
	if (preg_match_all($exp, $query,$c)){

		foreach($c[0] as $term){
			hr($term);
			suma($term);
			//mc($term);
		}
		
		
		
	}// end if
}
exit;
$exp = "{
	(?(DEFINE)
		(?<pp> \( (?: (?>[^()]+) | (?R) )* \) )
		(?<pe> \( (?: (?>[^()]+) | (?&ex) )* \) )
		(?<pex> \( (?: (?&ex) )* \) )
		(?<w>\w+)
		(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
		(?<str>    \" (?:[^\"\\\\]* | \\\\ [\"\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* \" )

		(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
		(?<cmll>[\"'])
		(?<ex>(?:(?&pe)|(?&number)|(?&w)|(?&string))(?:[\+\-\*\\\%^]+(?:(?&pe)|(?&number)|(?&w)|(?&string)))+)
		(?<cond>(?:(?&ex)|(?&number)|(?&w)|(?&string))(?:\s*(?:>|<|>=|<=|==|!=)\s*)(?:(?&ex)|(?&number)|(?&w)|(?&string))+)
		(?<t>(?&pex)|(?&ex)|(?&string)|(?&number)|(?&w)|true|false|null)
		(?<condition>(?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )
		(?<condition2>((?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )  | (?&t))
		
	)
	#(?&pp)|(?&string)|(?&condition)|(AND|OR|XOR)|(?&ex)|(?:true|false|null)
	(?<a>(?&pp))|
		#(?&condition)
		#|(?<b>(?&string))
		#|(?<d>(AND|OR|XOR))
		#|(?<e>(?&ex))
		#|(?<f>(?:true|false|null))


	(?<vv>(?&condition2))
}six";



if (preg_match_all($exp, $query,$c)){
	
	print_r($c);exit;
	
}// end if

$exp = "{
	(?(DEFINE)
		(?<pp> \( (?: (?>[^()]+) | (?R) )* \) )
		(?<pe> \( (?: (?>[^()]+) | (?&ex) )* \) )
		(?<w>\w+)
		(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
		(?<string2>    \" (?:[^\"\\\\]* | \\\\ [\"\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* \" )
		(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
		(?<cmll>[\"'])
		(?<ex>(?:(?&pe)|(?&number)|(?&w)|(?&string))(?:[\+\-\*\\\%^]+(?:(?&pe)|(?&number)|(?&w)|(?&string)))+)
		(?<cond>(?:(?&ex)|(?&number)|(?&w)|(?&string))(?:\s*(?:>|<|>=|<=|==|!=)\s*)(?:(?&ex)|(?&number)|(?&w)|(?&string))+)
	)
	(?&pp)|(?&string)|(?&cond)|(AND|OR|XOR)|(?&ex)|(?:true|false|null)
}six";



if (preg_match_all($exp, $query,$c)){
	
	//print_r($c);exit;
	
}// end if

$query = ' "w" > "z" AND a>5 AND b>2 AND a > 1 AND b+3!= 28+(5+3*5-3)+36+yahh AND 1++++3 != 5.05 OR d=="56" OR "xx+8" and true OR (s>5 or c>5 and 5+3==2+8)';
remp($query);
exit;


function remp($query){
	$exp = "{
		(?(DEFINE)
		(?<pp> \( (?: (?>[^()]+) | (?R) )* \) )
		(?<pe> \( (?: (?>[^()]+) | (?&ex) )* \) )
		(?<pex> \( (?: (?&ex) )* \) )
		(?<w>\w+)
		(?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )
		(?<str>    \" (?:[^\"\\\\]* | \\\\ [\"\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* \" )

		(?<string>   \" (?:   [^\"\\\\]|\\\\.     )* \"     )
		(?<cmll>[\"'])
		(?<ex>(?:(?&pe)|(?&number)|(?&w)|(?&string))(?:[\+\-\*\\\%^]+(?:(?&pe)|(?&number)|(?&w)|(?&string)))+)
		(?<cond>(?:(?&ex)|(?&number)|(?&w)|(?&string))(?:\s*(?:>|<|>=|<=|==|!=)\s*)(?:(?&ex)|(?&number)|(?&w)|(?&string))+)
		(?<t>(?&pex)|(?&ex)|(?&string)|(?&number)|(?&w)|true|false|null)
		(?<condition>(?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )
		(?<condition2>((?&t) (?:\s*(?:>|<|>=|<=|==|!=)\s*) (?&t)  )  | (?&t))
		
		)
		(?<a>(?&pp))|
		#(?&condition)
		#|(?<b>(?&string))
		#|(?<d>(AND|OR|XOR))
		#|(?<e>(?&ex))
		#|(?<f>(?:true|false|null))


		 (?<vv>(?&condition2)\s*AND\s*(?&condition2))
	}six";
	if (preg_match_all($exp, $query,$c)){
	
		//print_r($c);
		//exit;
		
	}// end if
	//exit;
	$query = preg_replace_callback(
        $exp,
        function ($c) {
			//print_r($c[16]);return '';
			//echo "<br> ".$c[0]; return '';
			if(isset($c["vv"])){
				return "(".strtoupper($c["vv"]).")";
			}else{
				return $c[0];
			}
            
        },
        $query
    );
	
	return $query;
}

include "sevian/Tool.php";

$q = '$if(1+3-4){"hola":"yanny"}';
$w = "@if('a'=='1')(dfgdfg)(dfgdfg)";
$r = Tool::evalExp($q);


print_r($r);exit;


$a = '
{"a":"{if}"}

';


$d = json_decode($a);

print_r($d);exit;

$p = "{
	(?(DEFINE)
		(?<cmll>[\"'])
	)
	(?<prop>(?<name>\w+)=(?&cmll)?(?<value>\w+)\\k<cmll>?)
}six";




$diagrama = 'a="abc" b="xyz" c="query"';

if (preg_match($p, $diagrama,$c)){

	print_r (888);
	print_r($c);exit;
	
}// end if
exit;

function extraer($diagrama,$id,$tag="div"){
	$linea = "";
	
		$patron = "{
			
			(<(${tag})[^<>]+(?=\w+=([\"']?)(${id})[\\3]?)+[^<>]*>
			(
				(?: <(\w++) [^>]*+ (?<!/)> (?5) </\\6> 			# matched pair of tags
				| [^<>]++                                       # non-tag stuff
				| <\w[^>]*/>                                	# self-closing tag
				| <!--.*?-->                                    # comment
				| <script\b[^>]*>.*?</script>          			# script block
				| <hr[^>]*>
				| <input[^>]*>
				| <br[^>]*>
				| <\w[^>]*>
			   )*+
			 )<\/(${tag})>)
			
			}isx";
			//(<(?P<tt>${tag})(\s+\w+=(?P<f>[\"']?)\w+(?P<z>\\k<f>)?)+[^<>]*>
		$patron = "{
			(?(DEFINE)
				(?<string>    \" (?:[^\"\\\\]* | \\\\ [\"\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* \" )
				(?<cmll>[\"'])
				(?<prop>\w+=(?&cmll)?\w+\\k<cmll>?)
			
			)
			
			(<(?P<tt>${tag})(?P<atributtes>[^<>]*)>
			(?P<child>
				(?: <(?P<itag>\w++) [^>]*+ (?<!/)> (?&child) </(?P=itag)> 			# matched pair of tags
				| [^<>]++                                       # non-tag stuff
				| <\w[^>]*/>                                	# self-closing tag
				| <!--.*?-->                                    # comment
				| <script\b[^>]*>.*?</script>          			# script block
				| <hr[^>]*>
				| <input[^>]*>
				| <br[^>]*>
				| <\w[^>]*>
				)*+
				)<\/(?P=tt)>)
			
			}isx";

		$patron_ = "{
		
			(
				
				<(${tag})(\s(\w+)=(\w+))*+[^<>]*><\/(\\2)>
			
			)
			
			}isx";			
	if (preg_match_all($patron, $diagrama,$c)){

		foreach($c as $m){
			//echo "<hr>";
			//print_r($m);
		}
		//exit;
		print_r($c);exit;
		$linea = $c[1][0];
	}// end if
	return $linea;	
}// end function


$str = '

<for data="nop" datac="abc" dataa="yan" datab="est" datab="xyz">

		<div>nombre4 : {=name}</div>
		<for>apellido4: {=lastname}</for>
		<div> edad4: {=age}</div>


	</for>


<div id="pedro">
	<span>Hola</span>
	<div id="yan">

		<div>nombre1 : {=name}</div>
		<div>apellido1: {=lastname}</div>
		<div> edad1: {=age}</div>


	</div>

	<for data="yes" datac="abc" dataa="yan" datab="est" datab="xyz">

		<div>nombre2 : {=name}</div>
		<for>apellido2: {=lastname}</for>
		<div> edad2: {=age}</div>


	</for>
</div>
';
$str1 = '<for data="yes" datac="abc" dataa="yan" datab="est" datab="xyz"></for>';
$str2 = '<for data=master id=xxs value=yanny ></for>';
$s = extraer($str,"yan",$etiqueta="for");

echo "...".$s;




/*****************************************************************
creado: 20/06/2007
modificado: 11/07/2007
por: Yanny Nuñez
*****************************************************************/

$patron = '{
		(\w++)\s*+:((?:(?:\\\(?:;|")|[^;"])++)
		|
        # Entre Comillas doble
        " # Abre Comillas
        (?:  [^"]*+ (?: (?<=\\\)" [^"]*+ )*+ )
        " # Cierra Comillas
    	
)}x';
$q = 'color:rojo;propiedad:"coloR:azul;letRA\"s:tahoma;";columnas:163px;filas:144pt;agua:sucia;comilla:sdsd\"x';
//===========================================================
function extraer_sec($q){
	$aux = array();
	$patron = '{
			(\w++)\s*+:((?:(?:\\\(?:;|")|[^;"])++)
			|
			# Entre Comillas doble
			" # Abre Comillas
			(?:  [^"]*+ (?: (?<=\\\)" [^"]*+ )*+ )
			" # Cierra Comillas
			
			)}x';
	if(preg_match_all($patron,$q,$c)){
		$aux[0]=$c[1]; 
		$aux[1]=$c[2]; 
	}// end if	
	return $aux;
}// end function
//===========================================================
function inner_html($diagrama,$id,$filas){
	$patron = "{((<(\w++)[^<>]+(?=id=([\"']?)".$id."[\\4]?)[^<>]*>)
		(
			(?: <(\w++) [^>]*+ (?<!/)> (?5) </\\6> 			# matched pair of tags
			| [^<>]++                                       # non-tag stuff
			| <\w[^>]*/>                                	# self-closing tag
			| <!--.*?-->                                    # comment
			| <script\b[^>]*>.*?</script>          			# script block
			| <hr[^>]*>| <input[^>]*><br[^>]*>
			| <\w[^>]*>
		   )*+
		 )(<\/\\3>))
		}isx";
	$diagrama = preg_replace($patron,"$2$filas$7", $diagrama);
	return $diagrama;
}// end function

//===========================================================
function extraer_patron($diagrama,$id,$etiqueta="tr"){
	$linea = "";
	$patron = "{(<(\w++)[^<>]+(?=id=([\"']?)".$id."[\\3]?)[^<>]*>
		(
			(?: <(\w++) [^>]*+ (?<!/)> (?4) </\\5> 			# matched pair of tags
			| [^<>]++                                       # non-tag stuff
			| <\w[^>]*/>                                	# self-closing tag
			| <!--.*?-->                                    # comment
			| <script\b[^>]*>.*?</script>          			# script block
			| <hr[^>]*>| <input[^>]*><br[^>]*>
			| <\w[^>]*>
		   )*+
		 )<\/(\\2)>)
		}isx";
	if (preg_match_all($patron, $diagrama,$c)){
		$linea = $c[1][0];
	}// end if
	return $linea;	
}// end function
//===========================================================
function formar_diagrama($diagrama,$id,$filas){
	$patron = "{(<(\w++)[^<>]+(?=id=([\"']?)".$id."[\\3]?)[^<>]*>
		(
			(?: <(\w++) [^>]*+ (?<!/)> (?4) </\\5> 			# matched pair of tags
			| [^<>]++                                       # non-tag stuff
			| <\w[^>]*/>                                	# self-closing tag
			| <!--.*?-->                                    # comment
			| <script\b[^>]*>.*?</script>          			# script block
			| <hr[^>]*>| <input[^>]*><br[^>]*>
			| <\w[^>]*>
		   )*+
		 )<\/(\\2)>)
		}isx";
	$diagrama = preg_replace($patron,$filas, $diagrama);
	return $diagrama;
}// end function
//===========================================================
function eval_exp_x($c){
	
	$x = "";
	try{
		eval("@\$x=".$c[1].";");
	} catch (Exception $e) {
		
	}
    
	return $x;
}// end function
//===========================================================
function eval_expresion($q=""){
	if ($q=="" or $q==null){
		return "";
	}// end if
	$q =  preg_replace_callback("|{exp=([^}]+)}|","eval_exp_x",$q);
	return $q;
}// end function
//===========================================================
function hhr($msg_x,$color_x="green"){
	echo "<hr><span style=\"color:$color_x;font-family:tahoma;font-size:9pt;font-weight:bold;\">".htmlentities($msg_x)."</span><hr>";
}// end function
//===========================================================
function reg_explode($simb,$q=""){
	if($q==""){
		return false;
	}// end if

	$q = preg_replace("|(?<!\\\)".$simb."|","sGsimBolo",$q);
	$q = preg_replace("|(\\\\".$simb.")|",$simb,$q);
	$q = preg_split("|(?<!\\\)"."sGsimBolo"."|",$q);
    return $q;
}// end function
//===========================================================
function extraer_variables($q=""){
	if($q==""){
		return false;
	}// end if
	$vector_x = explode(C_SEP_L,$q);
	for($i=0;$i<count($vector_x);$i++){
		$vector_y = explode(C_SEP_E,$vector_x[$i]);
		$vector[$vector_y[0]] = $vector_y[1];
	}// next
	return $vector;
}// end function	
//===========================================================
function extraer_variables_v($q="",$valor="0"){
	if($q==""){
		return false;
	}// end if
	$vector_x = explode(C_SEP_L,$q);
	for($i=0;$i<count($vector_x);$i++){
		$vector[$vector_y[0]] = $valor;
	}// next
	return $vector;
}// end function	
//===========================================================
function extraer_bandera($q="",$valor_x=true){
	if($q==""){
		return false;
	}// end if
	$vector_x = explode(C_SEP_L,$q);
	for($i=0;$i<count($vector_x);$i++){
		$band[$vector_x[$i]] = $valor_x;
	}// next
	return $band;
}// end function	
//===========================================================
function reparar_query($q){
	if (preg_match("/([^;]+)/i",$q, $c)){
		$q = $c[1];
	}// end if
	return $q;
}// end function	
//===========================================================
?>