<?php
namespace GT;
include "CommunicationTrait.php";

class Communication extends \Sevian\Element implements \Sevian\JasonComponent{
    static $patternJsonFile = '';

    public $unitId = '';

    public $jsClassName = 'GTCommunication';

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
            case 'load-unit':
                //hx($this->eparams->unitId);
                \Sevian\S::setSes('unit_idx', $this->eparams->unitId);
                //hx(\Sevian\S::getSes('unit_idx'));
                //$this->unitInit($this->eparams->unitId);

            break;


        }

        return true;
    }
    public function init2(){

        if(!$this->containerId){
            $this->containerId = 'form-main-'.$this->id;
        }

        $form =  new \Sigefor\Component\Form2([
			
            //'id'		=> $this->containerId,
            //'panelId'	=> $this->id,
            'name'		=> \Sigefor\JasonFile::getNameJasonFile('/forms/gt/main_command', self::$patternJsonFile),//'/form/gt_comm_main',//'main_command',
            'method'	=> 'request',
            'mode'		=> 2,
            //'userData'	=> $this->userData,
            
            //'record'=>['id'=>$id]
        ]);

        //hx(json_encode($form, JSON_PRETTY_PRINT));
        $div = new \SEVIAN\HTML('div');
        $div->id = $this->containerId;
        $this->setPanel($div);

        //$info->id = $this->containerId;
        $this->setInit([
            'id'=>$this->containerId,
            //'id'=>$this->eparams->targetId,
               "caption"=>"Communication 3.0",
                "mainForm"=>$form,
           ]);
        
        return;
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