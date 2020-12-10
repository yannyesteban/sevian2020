<?php
namespace SIGEFOR;

require_once MAIN_PATH.'Sigefor/DBTrait/DataRecord.php';
require_once MAIN_PATH.'Sigefor/Component/Form2.php';
require_once MAIN_PATH.'Sigefor/JasonFile.php';
require_once MAIN_PATH.'Sigefor/Component/SaveForm.php';

//require_once MAIN_PATH.'Sigefor/DBTrait/Form.php';
//require_once "Component/Form2.php";
//require_once "Component/FormSave.php";

class Form extends \sevian\element {
    
    use DBTrait\DataRecord;

    public $jsClassName = 'Form2';

    private $userData = [];
    
    static public $patternJsonFile = '';

    public function __construct($info = []){
		
        foreach($info as $k => $v){
			$this->$k = $v;
		}
		
        $this->cn = \Sevian\Connection::get();
    }

	public function config(){
		$this->initDataRecord();
	}
    public function evalMethod($method = false): bool{
        if($method){
            $this->method = $this->method;
		}
		
		$this->userData = [
			'panelId'=>$this->id,
			'element'=>$this->element,
			'elementName'=>$this->name,
			'elementMethod'=>$this->method
		];

        switch($this->method){
            case 'request':
                $this->requestForm();
			break;
			case 'load':
			case 'load-from':
				$this->loadRecord();
			break;
            case 'list':
				$this->createGrid(1, '');
				break;
			case 'save':
				
				$this->save([(object)\Sevian\S::getVReq()]);
				
				break;
			case 'delete':
				\Sevian\S::setReq('__mode_', 3);
				$this->save([(object)\Sevian\S::getVReq()]);
				
				break;	
            case 'get_data':
                $this->createGrid($this->eparams->page, $this->eparams->q ?? '');
				break;
			case 'search':
				$this->createGrid(1, $this->eparams->q ?? '');
				break;				                
        }

        return true;

    }

    public function requestForm(){

        if($this->eparams->mainId?? false){
            $this->containerId = $this->eparams->mainId;
        }

        if(!$this->containerId){
            $this->containerId = 'form-main-'.$this->id;
        }
        
        $form = new Component\Form2([

            'id'		=> $this->containerId,
            'panelId'	=> $this->id,
            'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
            'method'	=> $this->method,
			'mode'		=> 1,
			'userData'	=> $this->userData,
        ]);

        $form->id = $this->containerId;
		$this->setInit($form);
		$this->setPanel($this->createPanel());
		$this->title = $form->caption;
	}
	
	public function loadRecord(){
		if($this->eparams->mainId?? false){
            $this->containerId = $this->eparams->mainId;
        }

        if(!$this->containerId){
            $this->containerId = 'form-main-'.$this->id;
		}
		$record = null;
		if(isset($this->eparams->record)){

			$this->setDataRecord('grid', [$this->eparams->record]);

			$record = $this->eparams->record;
			//$this->setDataRecord('grid',$this->eparams->record);
		}else{
			$record = $this->getRecord('grid', \Sevian\S::getReq("__id_") ?? 0);
		}
		
		//$record = $this->getRecord('grid', \Sevian\S::getReq("__id_") ?? 0);
		
		//hx($record);

		if($this->method == 'load-from'){
			$record = false;
		}
		$form =  new \Sigefor\Component\Form2([

			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 2,
			'record'	=> $record,
			'recordIndex'=>\Sevian\S::getReq("__id_") ?? 0,
			'userData'	=> $this->userData,
			
		]);

		$form->id = $this->containerId;
		$this->setInit($form);
		$this->setPanel($this->createPanel());
		$this->title = $form->caption;
	}

    public function createGrid($page = 1, $searchValue = ''){

		$mainId = '';

		if($this->eparams->mainId?? false){
			$this->containerId = $this->eparams->mainId;
			$mainId = "mainId:'$this->containerId',";
        }

        if(!$this->containerId){
            $this->containerId = 'form-main-'.$this->id;
        }
		$this->jsClassName = 'Grid2';
		//hx($this->name);
		//$async = ($this->asyncMode===true)?'true':'false';
        $async = true;
        $element = self::getElementName();
		
		
		
		//hx($paginator);
		$form =  new \Sigefor\Component\Grid([
			'asyncMode'	=> true,
			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
			'method'	=> $this->method,
			'page'		=> $page,
			'searchValue' => $searchValue,
			//'search'=>$search,
			//'paginator'=>$paginator,
			'userData'=>$this->userData,
			//'patternFormFile'=>self::$patternJsonFile,
			//'patternMenuFile'=>self::$patternMenuFile
			
		]);
		
		$this->setDataRecord('grid', $form->getDataKeys());
		
		$search = "
		S.send3(
			{
				async: $async,
				panel:'$this->id',
				valid:false,
				confirm_: 'seguro?',
				params:	[
					{a:'yannye',t:'setMethod',
						'mode':'element',
						id:'$this->id',
						element:'$element',
						method:'search',
						name:'$this->name',
						eparams:{
							page:1,
							token:'search',
							q:this.getSearchValue(),
							$mainId
						}
					}
					
				]
			});
			
		";
	
		

		$paginator = [
			'page'=> $page,
			'totalPages'=>	$form->getTotalPages(),
			'maxPages'=>	5,
			'change'=>"S.send3(
				{
					async: $async,
					panel:'$this->id',
					valid:false,
					confirm_: 'seguro?',
					params:	[
                        {n:'esteban',t:'setMethod',
                            'mode':'element',
							id:'$this->id',
							element:'$element',
							method:'get_data',
							name:'$this->name',
							eparams:{
                                $mainId
								page:page,
								q:this.getSearchValue(),
								
							
							}
						}
						
					]
				});"
			];
		//hx($info->getTotalPages());
		$form->paginator = $paginator;
		$form->search = $search;
        $form->id = $this->containerId;
        

		//hx(json_encode($grid,JSON_PRETTY_PRINT));
		
		$records=$form->getDataKeys();
		$this->setDataRecord('grid', $records);
		//hx($grid->data);	
		//$this->info = $grid;

		//$grid->id = $this->panel->id;
		//$this->_name = $this->name;
		//$this->_type = 'Grid2';
		//$this->_mode = 'create';
		//$this->_info = $grid;
        //print_r(json_encode($grid,JSON_PRETTY_PRINT));exit;
		$this->setInit($form);
		$this->setPanel($this->createPanel());
		$this->title = $form->caption;
		
	}

	public function save($data){

		//$data = [(object)\Sevian\S::getVReq()];
		//$this->save([(object)\Sevian\S::getVReq()]);

		if(count($this->getDataRecord('grid'))==0){
			$this->setDataRecord('grid', [(object)["id"=>0]]);
		}

		$f = new \Sigefor\Component\SaveForm([
			'name'=>$this->name,//JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
			'dataKeys'	=> $this->getMasterData(),
			'dataKeysId'=> 'grid',
		]);

		$result = $f->send($data, []);
		\Sevian\S::addReq((array)$data[0]);

			//hr(\Sevian\S::getVReq());
		//hx($data);
		//hx(\Sevian\S::getVReq());
		foreach($result as $k => $v){
			
			if(!$v->error){
				
				$this->addFragment(new \Sevian\iMessage([
					'caption'	=> $f->getCaption(),
					'text'		=> 'Record was saved!!!'
				]));
				
			}else{
				
				$this->addFragment(new \Sevian\iMessage([
					'caption'	=> 'Error '.$f->getCaption(),
					'text'		=> "Record wasn't saved!!!"
				]));

			}
			
			
		}
		
		$this->setInit(null);
		$this->setPanel(false);
	}
	public function createPanel(){
		$div = new \SEVIAN\HTML('div');
        $div->id = $this->containerId;
        //$this->setPanel($div);
        return $div;
	}
	public function getPanel(){
		return $this->_panel;
	}
    
}