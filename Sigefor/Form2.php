<?php
namespace SIGEFOR;

require_once MAIN_PATH.'Sigefor/JasonFile.php';
require_once MAIN_PATH.'Sigefor/DBTrait/DataRecord.php';
//require_once MAIN_PATH.'Sigefor/DBTrait/Form.php';

require_once "Component/Form2.php";

require_once "Component/FormSave.php";

class Form2
	extends \sevian\element
	implements \sevian\JasonComponent

{

	//use DBTrait\JasonFileInfo;
	use DBTrait\DataRecord;
	//use DBTrait\Form2;

	private $_info = null;
	private $_mode = '';
	private $_type = '';
	private $_name = '';

	public $userData = [];
	static public $patternJsonFile = '';
	static public $patternFormFile = '';
	static public $patternMenuFile = '';


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
            $this->method = $method;
		}

		$this->userData = [
			'panelId'=>$this->id,
			'element'=>$this->element,
			'elementName'=>$this->name,
			'elementMethod'=>$this->method,
			'a'=>'horizontal'
		];
		switch($this->method){
			case 'request':
				$this->createForm(1);
				break;
			case 'load':
				$this->createForm(2);
				break;
			case 'load-from':
				//hx($this->recordFrom,"red");
				$this->createForm(3, true);
				break;
			case 'list':
				$this->createGrid(1, '');
				break;
			case 'save':
				$this->save();
				break;
			case 'get_data':
				$this->createGrid($this->eparams->page, $this->eparams->q ?? '');
				break;
			case 'search':
				$this->createGrid(1, $this->eparams->q ?? '');
				break;
			case 'get-records':

				$records = $this->getRecords();
				hx(getRecords);
			default:
				break;

		}

		return true;
	}

	public function createForm($mode = 1, $recordFrom = false){

		if($this->eparams->mainId?? false){
            $this->containerId = $this->eparams->mainId;
        }

		if(!$this->containerId){
			$this->containerId = $this->getPanelId();
			$this->panel = new \Sevian\HTML('div');
			$this->panel->id = $this->containerId;
		}

		//hr(JasonFile::getNameJasonFile($this->name, self::$patternJsonFile));

		$this->typeElement = 'Form2';
		if($mode == 1){
			$form =  new \Sigefor\Component\Form2([

				'id'		=> $this->containerId,
				'panelId'	=> $this->id,
				'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
				'method'	=> $this->method,
				'mode'		=> 1,
				'userData'=>$this->userData,

				//'record'=>$this->getRecord()
			]);
		}else if($mode == 2){
			$__id_ = \Sevian\S::getReq("__id_");

			if(!isset($__id_)){
				$__id_ = 0;
			}

			$form =  new \Sigefor\Component\Form2([

				'id'		=> $this->containerId,
				'panelId'	=> $this->id,
				'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
				'method'	=> $this->method,
				'mode'		=> 2,
				'record'	=> $this->getRecord('grid', $__id_),
				'recordIndex'=>$__id_,
				'userData'=>$this->userData,

			]);

			//$records[$__id_] = $form->getDataKeys()[0];

			//$this->setDataRecord('form', $records);
		}else if($mode == 3){

			$form =  new \Sigefor\Component\Form2([

				'id'		=> $this->containerId,
				'panelId'	=> $this->id,
				'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
				'method'	=> $this->method,
				'mode'		=> 2,
				//'record'	=> $this->getRecord('grid', $__id_),
				//'recordIndex'=>$__id_,
				'userData'=>$this->userData,

			]);
		}
		//print_r($form);exit;
		$this->info = $form;
		//$form->id = 'one_6';
		$this->_name = $this->name;
		$this->_type = 'Form2';
		$this->_mode = 'create';
		$this->_info = $form;

	}

	public function createGrid($page = 1, $searchValue = ''){

		if($this->eparams->mainId?? false){
            $this->containerId = $this->eparams->mainId;
		}

		if(!$this->containerId){
			$this->containerId = $this->element.'-'.$this->id;
			$this->panel = new \Sevian\HTML('div');
			$this->panel->id = $this->containerId;

		}
		$this->typeElement = 'Grid2';
		//hx($this->name);
		//$async = ($this->asyncMode===true)?'true':'false';
		$async = true;
		$search = "
			S.send(
				{
					async: $async,
					panel:$this->id,
					valid:false,
					confirm_: 'seguro?',
					params:	[
						{t:'setMethod',
							id:$this->id,
							element:'$this->element',
							method:'search',
							name:'$this->name',
							eparams:{
								page:1,
								token:'search',
								q:this.getSearchValue(),
							}
						}

					]
				});

			";



		$paginator = [
			'page'=> $page,
			'totalPages'=>	5,
			'maxPages'=>	5,
			'change'=>"S.send(
				{
					async: $async,
					panel:$this->id,
					valid:false,
					confirm_: 'seguro?',
					params:	[
						{t:'setMethod',
							id:$this->id,
							element:'$this->element',
							method:'get_data',
							name:'$this->name',
							eparams:{

								page:page,
								q:this.getSearchValue(),


							}
						}

					]
				});"
			];


		$grid =  new \Sigefor\Component\Grid([
			'asyncMode'	=> true,
			'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
			'method'	=> $this->method,
			'page'		=> $page,
			'searchValue' => $searchValue,
			'search'=>$search,
			'paginator'=>$paginator,
			'userData'=>$this->userData,
			//'patternFormFile'=>self::$patternJsonFile,
			//'patternMenuFile'=>self::$patternMenuFile

		]);

		//hx(json_encode($grid,JSON_PRETTY_PRINT));

		$records=$grid->getDataKeys();
		$this->setDataRecord('grid', $records);
		//hx($grid->data);
		$this->info = $grid;

		//$grid->id = $this->panel->id;
		$this->_name = $this->name;
		$this->_type = 'Grid2';
		$this->_mode = 'create';
		$this->_info = $grid;
		//print_r(json_encode($grid,JSON_PRETTY_PRINT));exit;

	}

	public function save(){
		//hx(\Sevian\S::getVReq());
		//hr($this->_masterData);exit;
		//\Sevian\S::getVReq() = (object)\Sevian\S::getVReq();
		//$d = &\Sevian\S::getVReq();
		//hx(\Sevian\S::getVReq());
		$formSave =  new \Sigefor\Component\FF([
			'name'		=> JasonFile::getNameJasonFile($this->name, self::$patternJsonFile),
			'dataKeys'	=> $this->_masterData,
			'dataKeysId'=> 'grid',
			'data'		=> [\Sevian\S::getVReq()]
		]);

		if($this->eparams->getResult?? false and $this->eparams->getResult){
			$this->addResponse([
				'type'=>'',
				'id'=>$this->id,
				'data'=>[
					'data'=>\Sevian\S::getVReq(),
					'result' => $formSave->getResult()
				],
				'iToken'=>$this->iToken
			]);
			return;
		}

		foreach($formSave->getResult() as $k => $v){

			if($v->error){
				$this->setInfoElement(new \Sevian\iMessage([
					'caption'	=> 'Error '.$formSave->getCaption(),
					'text'		=> "Record wasn't saved!!!"
				]));
			}else{
				$this->setInfoElement(new \Sevian\iMessage([
					'caption'	=> $formSave->getCaption(),
					'text'		=> 'Record was saved!!!'
				]));
			}
		}

	}

	public function jasonRender(){

		return [
			'name'	=> $this->_name,
			'type'	=> $this->_type,
			'mode'	=> $this->_mode,
			'info'	=> $this->_info
		];
	}
	public function jsonSerialize(): mixed {
        return [
			'name'	=> $this->_name,
			'type'	=> $this->_type,
			'mode'	=> $this->_mode,
			'info'	=> $this->_info
		];
    }
}
