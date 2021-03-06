<?php
namespace Sevian;
	
include MAIN_PATH.'Sevian/DB/DBase.php';
include MAIN_PATH.'Sevian/DB/Mysql.php';
include MAIN_PATH.'Sevian/DB/Postgres.php';

class Info{
	
	public $name	= false;
	public $driver	= false;
	public $host	= false;
	public $port	= false;
	public $user	= false;
	public $pass	= false;
	public $dbase	= false;
	public $charset	= false;
		
	public function __construct($opt = []){
		//hx($opt);
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}	
}	

class Connection{
	
	static $_defaultName = '_default';
	
	static $_connections = [];
	
	static function load($conn = []){
		foreach($conn as $info){
			
			self::set(new Info($info));
		}
		
	}
	static function set($info){
		self::$_connections[$info->name] = new Info($info);
	}
	static function get($name = false){
		
		if($name === false){
			$name = self::$_defaultName;
		}
		
		if(!isset(self::$_connections[$name])){
			return false;
		}
		
		$info = self::$_connections[$name];

		switch(strtolower(trim($info->driver))){
			case 'mysqlx':
				//$cn = new cls_mysql($server,$user,$password,$dbase,$port);
				//return new cls_mysql($server, $user, $password, $dbase, $port, $charset);
				return new cls_mysql($info->host, $info->user, $info->pass, $info->dbase, $info->port, $info->charset);
				break;
			case 'mysql':
				//$cn = new cls_mysql($server,$user,$password,$dbase,$port);
				return new DB\Mysql($info->host, $info->user, $info->pass, $info->dbase, $info->port, $info->charset);
				break;

			case 'postgres':
				return new DB\Postgres($info->host, $info->user, $info->pass, $info->dbase, $info->port, $info->charset);
				break;
		}
	
	}
	
}

?>