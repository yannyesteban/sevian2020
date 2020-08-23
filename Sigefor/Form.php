<?php
namespace SIGEFOR;

require_once MAIN_PATH.'Sigefor/DBTrait/DataRecord.php';
require_once MAIN_PATH.'Sigefor/Component/Form2.php';
require_once MAIN_PATH.'Sigefor/JasonFile.php';

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

    public function evalMethod($method = false): bool{
        if($method){
            $this->method = $this->method;
        }

        switch($this->method){
            case 'request':
                $this->requestForm();

            break;
            case 'list':
				$this->createGrid(1, '');
                break;
            case 'get_data':
                $this->createGrid($this->eparams->page, $this->eparams->q ?? '');
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
        
        $info = new Component\Form2([

            'id'		=> $this->containerId,
            'panelId'	=> $this->id,
            'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
            'method'	=> $this->method,
            'mode'		=> 1
        ]);

        $info->id = $this->containerId;
        $this->setInit($info);
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
		$search = "
			S.send3(
				{
					async: $async,
					panel:$this->id,
					valid:false,
					confirm_: 'seguro?',
					params:	[
						{t:'setMethod',
							id:$this->id,
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
		
		

		
		
		//hx($paginator);
		$info =  new \Sigefor\Component\Grid([
			'asyncMode'	=> true,
			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
			'method'	=> $this->method,
			'page'		=> $page,
			'searchValue' => $searchValue,
			'search'=>$search,
			//'paginator'=>$paginator,
			'userData'=>$this->userData,
			//'patternFormFile'=>self::$patternJsonFile,
			//'patternMenuFile'=>self::$patternMenuFile
			
		]);
		

		$paginator = [
			'page'=> $page,
			'totalPages'=>	$info->getTotalPages(),
			'maxPages'=>	5,
			'change'=>"S.send3(
				{
					async: $async,
					panel:'$this->id',
					valid:false,
					confirm_: 'seguro?',
					params:	[
                        {t:'setMethod',
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
		$info->paginator = $paginator;
        $info->id = $this->containerId;
        

		//hx(json_encode($grid,JSON_PRETTY_PRINT));
		
		$records=$info->getDataKeys();
		$this->setDataRecord('grid', $records);
		//hx($grid->data);	
		//$this->info = $grid;

		//$grid->id = $this->panel->id;
		//$this->_name = $this->name;
		//$this->_type = 'Grid2';
		//$this->_mode = 'create';
		//$this->_info = $grid;
        //print_r(json_encode($grid,JSON_PRETTY_PRINT));exit;
        $this->setInit($info);
		
	}
    public function getPanel(){
        $div = new \SEVIAN\HTML('div');
        $div->id = $this->containerId;
        //$this->setPanel($div);
        return $div;
    }
}