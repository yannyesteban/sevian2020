<?php
namespace Sigefor\DBTrait;

trait DataRecord{

	

	public $_masterData = [];
	public $_lastRecord = [];

	public function initDataRecord(){

		if(!$this->getSes('_masterData')){
			$this->setSes('_masterData', []);
		}

		if(!$this->getSes('_lastRecord')){
			$this->setSes('_lastRecord', []);
		}

		$this->_masterData = &$this->getSes('_masterData');
		$this->_lastRecord = &$this->getSes('_lastRecord');

	}
	public function &getMasterData(){
		return $this->_masterData;
	}
	public function setDataRecord($key, $record){
		$this->_masterData[$key] = $record;
	}
	public function getDataRecord($key){
		return $this->_masterData[$key];
	}
	public function getRecord2($name, $index){

		if($this->_lastRecord){
			//return $this->_lastRecord;
		}
		
		$record = $this->_masterData[$name][$index];
		$this->_lastRecord = $record;
		return $record;
	}
	public function getRecord($name, $index){

		$this->_lastRecord = $this->_masterData[$name][$index]?? false;
		return $this->_lastRecord;

	}

	public function getLastRecord(){
		return $this->_lastRecord;
	}

}



