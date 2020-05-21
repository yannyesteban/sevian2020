<?php
namespace Sigefor\DBTrait;

/*

crear opción de usar data de json tambien como de sql, 
buscar la manera de usar multiples registros del query
@a[0], {0=name}, {=prop.name}, {prop=name}

la data puede escribirse asi:

[{"name":"pedro", "edad":15},{"name":"ana", "edad":20},{"name":"juan", "edad":30}]

y que se pueda sumar la data sql + data json

tambian pensar en un sistema de paginacion para el master query

*/


require_once 'template.php';

trait JasonFile{

	private function getJsonFileName($name = ''){
		
			if($name and substr($name, 0, 1) == '#'){
				$name = substr($name, 1);

		
				$path = str_replace('{name}', $name, self::$patternJsonFile);
			}
			
	}
}

trait Catalogue {
	use JasonFile;
	use template;

	private $cn = null;
	
	
	private $methods = null;
	private $querys = null;
	private $template = '';
	private $templateName = '';
	private $tCatalogue = "_sg_catalogues";
	private $vreq = [];

	private $msgError = null;


	
	public function loadCatalogue($name){
		if($this->getJsonFileName($name)){
			$info = $this->loadJsonCatalogue($name);
		}else{
			$info = $this->loadDBCatalogue($name);
		}
		
		$this->setInfoCatalogue($info);
		
		$this->loadTemplate($this->templateName);
		
	}

	public function setInfoCatalogue($info){
		if(!$info){
			return ;
		}
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
		if(is_string($this->params)){
			$params = \Sevian\S::vars($this->params);
			$config = json_decode($params);
		}else{
			$config = $this->params;
		}
		
		if($config){
			foreach($config as $k => $v){
				$this->$k = $v;
			}
		}
		
		if($this->methods){
			if(is_string($this->methods)){
				$config = \Sevian\S::vars($this->methods);
				$config = json_decode($config, true);
			}else{
				$config = $this->methods;
			}
			
			if($config and $config[$this->method]?? false){
				foreach($config[$this->method] as $k => $v){
					$this->$k = $v;
				}
			}
		}

		if($this->querys){
			if(is_string($this->querys)){
				$query = \Sevian\S::vars($this->querys);
				//hr($query);
				$query = str_replace("\r\n", '\\n', $query);
				$query = str_replace("\t", '',  $query);
				//hr($query);exit;
				$this->_querys = json_decode($query);
				if(\json_last_error()){
					hr("Calalogue: error ".\json_last_error_msg(), "red","pink");
					hr($query);
				}
			}else{
				$this->_querys = $this->querys;
			}
		}
	}
	
	public function loadJsonCatalogue($file){
		return json_decode(file_get_contents($file, true));
	}

	public function loadDBCatalogue($name){
		
		$cn = $this->cn;

		$name = $cn->addSlashes($name);
		$cn->query = "
			SELECT catalogue, caption, template as templateName,
			
			class, querys, params, methods 
			FROM $this->tCatalogue 
			WHERE catalogue = '$name'
		";
		
		//hr($cn->query,"red","pink");
		$this->cn->execute();
		return $this->cn->getDataAssoc();
	}

	public function evalQuery($query = ''){
		
		if(!$query){
			return [];
		}
		
		$cn = $this->cn;

		//$name = $cn->addSlashes($name);


		$query = \Sevian\S::varCustom($query, $this->vreq, '&');
		//hr($query,"red");
		$cn->query = $query;

		$this->cn->execute();
		return $this->cn->getDataAll();
	}
	
	public function evalTemplate($template, $level){

		$string = '';

		$result = $this->evalQuery(@$this->_querys->{$level});
		
		foreach($result as $ww => $data){
			//
			// replace from db values to the template
			$this->vreq = array_merge($this->vreq, $data);
			$str = preg_replace_callback(
				'|{=(\w+)}|',
				function ($c) use ($data, $level){
					if(array_key_exists($c[1], $data)){
						return $data[$c[1]];
					}
					return $c[0];
				},
				$template
			);
			
			$tag = 'for';

			$pattern = "{
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
			
			$str = preg_replace_callback(
				$pattern,
				function ($temp){
					// searching for propertys tag
					$pattern = "{
						(?(DEFINE)
							(?<cmll>[\"'])
						)
						(?<prop>(?<name>\w+)=(?&cmll)?(?<value>\w+)\\k<cmll>?)
					}six";
					
					$att = [];
					if (preg_match_all($pattern, $temp['atributtes'],$c)){
						foreach($c['name'] as $k => $prop){
							$att[$prop] = $c['value'][$k];
						}
					}
					// $att['data'] is index of querys[]
					// $temp['child'] is template of for tag
					return $this->evalTemplate($temp['child'], $att['data']);
				},
				$str
			);
			$string .= $str;

		}
		
		return $string;
	}
}


