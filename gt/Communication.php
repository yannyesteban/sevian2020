<?php
namespace GT;
include "CommunicationTrait.php";

class Communication extends \Sevian\Element implements \Sevian\JasonComponent{
    static $patternJsonFile = '';

    public $unitId = '';

    use DBCommunication{
		DBCommunication::ccc as public ccc;
	}

    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}
		
        $this->cn = \Sevian\Connection::get();

    }
    public function evalMethod($method = false): bool{
		
		if($method){
            $this->method = $method;
        }
        
        switch($this->method){
            case 'load':
                $this->init2();
            break;
            case 'unit-init':
                $this->unitInit($this->eparams->unitId);
            break;


        }

        return true;
    }
    public function init2(){

        $form =  new \Sigefor\Component\Form2([
			
            'id'		=> $this->containerId,
            'panelId'	=> $this->id,
            'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/gt_comm_main', self::$patternJsonFile),//'/form/gt_comm_main',//'main_command',
            'method'	=> 'request',
            'mode'		=> 2,
            //'userData'	=> $this->userData,
            
            //'record'=>['id'=>$id]
        ]);
       // $this->_info = $
       $this->info = [
        'id'=>$this->eparams->targetId,
           "caption"=>"Communication 3.0",
            "mainForm"=>$form,
       ];
       $this->typeElement = 'GTCommunication';
       $this->panelActions = [];
       return $this;
    }
    public function init(){

        $form =  new \Sigefor\Component\Form2([
			
            'id'		=> $this->containerId,
            'panelId'	=> $this->id,
            'name'		=> 'main_command',
            'method'	=> 'request',
            'mode'		=> 2,
            //'userData'	=> $this->userData,
            
            //'record'=>['id'=>$id]
        ]);
       // $this->_info = $
       $this->_info = [
           'id'=>$this->id,
           "caption"=>"Communication 3.0",
            "mainForm"=>$form,
       ];
       return $this;
    }

    public function unitInit($unitId){

       \sevian\s::setExp("unitId", $unitId);
        $form =  new \Sigefor\Component\Form2([
			
            'id'		=> $this->containerId,
            'panelId'	=> $this->id,
            'name'		=> \Sigefor\JasonFile::getNameJasonFile('/form/gt_form_command', self::$patternJsonFile),//'/form/gt_comm_main',//'main_command',
            'method'	=> 'request',
            'mode'		=> 2,
            'userData'   => [
              
            ],
            //'userData'	=> $this->userData,
            
            //'record'=>['id'=>$id]
        ]);
       // $this->_info = $
      

        $this->panelActions[] = [
            'method'  => 'setFormCommand',
            'value'=> $form,
            
        ];
       return $this;
    }
    public function jsonSerialize(){
        return $this->_info;
    }


}