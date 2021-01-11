<?php
namespace GT;
include 'CommunicationTrait.php';

class Communication extends 
    \Sevian\Element implements \Sevian\JasonComponent,
    \Sevian\UserInfo
    {
    static $patternJsonFile = '';

    public $unitId = '';

    public $jsClassName = 'GTCommunication';

    private $_userInfo = null;

        private $host = 'bests.no-ip.info';

    use DBCommunication{
		DBCommunication::ccc as public ccc;
    }
    public function setUserInfo($info){
        $this->_userInfo = $info;
    }
    public function getUserInfo(){
        return $this->_userInfo;
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
                $this->load();
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
    public function load(){

        if($this->eparams->mainId?? false){
            $this->containerId = $this->eparams->mainId;
        }

        if(!$this->containerId){
            $this->containerId = 'form-main-'.$this->id;
        }
        $unitId = null;
        if($this->eparams->unitId ?? false){
            $unitId = $this->eparams->unitId;
            $record = ['unit_idx'=>$unitId];
            $method = 'load';
            $mode = 2;
        }else{
            $record = false;
            $method = 'request';
            $mode = 1;
        }

        $form =  new \Sigefor\Component\Form2([
			
            //'id'		=> $this->containerId,
            //'panelId'	=> $this->id,
            'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/main_command', self::$patternJsonFile),//'/form/gt_comm_main',//'main_command',
            'method'	=> $method,
            'mode'		=> $mode,
            //'userData'	=> $this->userData,
            
            'record'    => $record
        ]);

        $form2 =  new \Sigefor\Component\Form2([
			
            //'id'		=> $this->containerId,
            //'panelId'	=> $this->id,
            'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/unit_cmd_response', self::$patternJsonFile),//'/form/gt_comm_main',//'main_command',
            'method'	=> $method,
            'mode'		=> $mode,
            //'userData'	=> $this->userData,
            
            //'record'    => $record
        ]);

       
        $div = new \SEVIAN\HTML('div');
        $div->id = $this->containerId;
        $this->setPanel($div);

        //$info->id = $this->containerId;

        $this->host = '127.0.0.1';
        $this->eparams->gridId="eres";
        $this->setInit([
            //'id'=>$this->eparams->targetId,

            'id'            => $this->containerId,
            'caption'       => 'Communication 3.0',
            'mainForm'      => $form,
            'responseForm'  => $form2,
            'unitId'        => $unitId,
            'gridId'        => $this->eparams->gridId??'',
            'user'          => $this->_userInfo->user,
            'socketServer'  => [
                'host'  => $this->host,// ='bests.no-ip.info',//'localhost',//'bests.no-ip.info',
                'port'  => 3321
            ]
        ]);
        
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
           'caption'=>'Communication 3.0',
            'mainForm'=>$form,
       ];
       return $this;
    }

    public function unitInit($unitId){

       \sevian\s::setExp('unitId', $unitId);
        $form =  new \Sigefor\Component\Form2([
			
            'id'		=> $this->containerId,
            'panelId'	=> $this->id,
            'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/gt_form_command', self::$patternJsonFile),//'/form/gt_comm_main',//'main_command',
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