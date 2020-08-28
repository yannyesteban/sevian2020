<?php
namespace GT;
require_once 'Unit.php';
require_once 'Site.php';
require_once 'Geofence.php';
require_once 'Alarm.php';
require_once 'Config.php';
require_once 'History.php';
class Cota extends \Sevian\Element{
	static $patternJsonFile = '';

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

		return true;
	}


	public function load(){
		$this->panel = new \Sevian\HTML('div');
		$this->panel->id = 'gt-cota-'.$this->id;
		$this->jsClassName = 'GTCota';
		$this->typeElement = 'GTCota';
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
		$comm = new Communication();

		$form =  new \Sigefor\Component\Form2([
			
			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/main_unit', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],
			
			//'record'=>$this->getRecord()
		]);
		
		$this->info = [
			'id'		=> $this->panel->id,
			'panel'		=> $this->id,
			'unit'		=> $unit->init(),
			'site'		=> $site->init(),
			'geofence'	=> $geofence->init(),
			'history'	=> $history->init(),
			'alarm'		=> $alarm->init(),
			'config'	=> $config->init(),
			'form'		=> $form,
			//'comm'		=> $comm->init(),
		];

		$this->setInit($this->info);
		
	}
}


