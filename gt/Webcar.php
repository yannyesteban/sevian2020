<?php
namespace GT;
require_once 'Unit.php';
require_once 'Site.php';
require_once 'Geofence.php';
require_once 'History.php';
class Webcar extends \Sevian\Element{
	
	public $jsClassName = 'GTWebcar';
	
	public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}
        $this->cn = \Sevian\Connection::get();
	}
	
	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
		}
		$this->info = null;
		switch($method){
			case 'load':
				$this->load();
				break;
			case 'site_save':
				
				$site = new Site();
				
				//hx($this->eparams->formData);
				$msg = $site->save($this->eparams->formData);

				$this->addFragment($msg);

				$this->info[] = [
					'method'  => 'siteUpdate',
					'value'=>$site->loadSite($site->lastRecord),
					'_args' => [1,1,1],
					'id'=>$site->lastRecord
				];
				
				break;

			case 'site_load':

				$userData = $this->getSes('_userData');
				$site = new Site([
					"id" => $this->id,
					"userData"=>$userData
				]);
				//$site = new Site();
				$site->load($this->eparams->siteId);
				break;
			case 'site-update':

				$userData = $this->getSes('_userData');
				$geofence = new Geofence([
					"id" => $this->id,
					"userData"=>$userData
				]);
				

				$this->info[] = [
					'method'  => 'geofenceUpdate',
					'value'=>$site->update(),
					'_args' => [1,1,1]
				];
				break;
			case 'geofence_save':
			
				$geofence = new Geofence();
				
				//hx($this->eparams->formData);
				$msg = $geofence->save($this->eparams->formData);

				$this->addFragment($msg);

				$this->info[] = [
					'method'  => 'geofenceUpdate',
					'value'=>$geofence->loadGeofence($geofence->lastRecord),
					'_args' => [1,1,1],
					'id'=>$geofence->lastRecord
				];
				
				break;

			case 'geofence_load':

				$userData = $this->getSes('_userData');
				$geofence = new Geofence([
					"id" => $this->id,
					"userData"=>$userData
				]);
				
				$geofence->load($this->eparams->geofenceId);
				break;
			case 'geofence-update':

				$userData = $this->getSes('_userData');
				$geofence = new Geofence([
					"id" => $this->id,
					"userData"=>$userData
				]);
				
				$this->info[] = [
					'method'  => 'geofenceUpdate',
					'value'=>$geofence->update(),
					'_args' => [1,1,1]
				];
				break;				
			}

			if($this->info){
				$this->setInit($this->info);
			}
		return true;
	}


	public function load(){
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-webcar-'.$this->id;
		
		$this->typeElement = 'GTWebcar';
		$unit = new Unit();
		$userData = [
			'panelId'=>$this->id,
			'element'=>$this->element,
			'elementName'=>$this->name,
			'elementMethod'=>$this->method
		];
		$this->setSes('_userData', $userData);
		$site = new Site([
			"id" => $this->id,
			"userData"=>$userData
		]);
		
		$geofence = new Geofence([
			"id" => $this->id,
			"userData"=>$userData
		]);
		$history = new History();
		$alarm = new Alarm();
		$config = new Config();
		$this->info = [
			'id'		=> $this->panel->id,
			'panel'		=> $this->id,
			'unit'		=> $unit->init(),
			'site'		=> $site->init(),
			'geofence'	=> $geofence->init(),
			'history'	=> $history->init(),
			'alarm'		=> $alarm->init(),
			'config'	=> $config->init()
		];

		
	}
}


