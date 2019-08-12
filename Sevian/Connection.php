<?php
namespace Sevian;
	
include 'DB/DBase.php';
include 'DB/Mysql.php';
include 'DB/Postgres.php';

class Info{
	
	public $driver	= false;
	public $host	= false;
	public $port	= false;
	public $user	= false;
	public $pass	= false;
	public $dbase	= false;
	public $charset	= false;
		
	public function __construct($opt = array()){
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
		foreach($conn as $name => $info){
			self::set($name, new Info($info));
		}
		
	}
	static function set($name, $info){
		self::$_connections[$name] = new Info($info);
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