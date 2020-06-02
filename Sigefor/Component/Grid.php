<?php
namespace Sigefor\Component;

//require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';
require_once MAIN_PATH.'Sevian/JS/Grid.php';
require_once MAIN_PATH.'Sigefor/DBTrait/Grid.php';

class Grid extends \Sevian\JS\Grid {
	
	use \Sigefor\DBTrait\JasonFileInfo;
	use \Sigefor\DBTrait\Grid;

	public $panelId = 0;
	public $element = null;
	public $asyncMode = true;
	public $patternJsonFile = '';
	public $userData = [];
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		
		

		if($this->name){
			$this->loadForm($this->name, null, $this->patternJsonFile);
			/*
			if(substr($this->name, 0, 1) == '#'){
				//$filePath = substr($this->name, 1);

				//$infoForm = $this->loadJsonFile($filePath);
				$infoForm = $this->loadJsonInfo($this->name);
				$this->setInfoForm($infoForm);
				$this->setInfoFields($infoForm['infoFields']);
				
			}else{
				$infoForm = $this->infoDBForm($this->name);
				$this->setInfoForm($infoForm);
				$infoField = $this->infoDBFields($this->name);
				$this->setInfoFields($infoField);
				
			}
			*/
			$this->data = $this->getDataGrid($this->searchValue, $this->page);
			
			$this->menu = new Menu([
				'name'=>$this->menuName,
				'userData'=>&$this->userData,
				'onDataUser'=>$this->onDataUser?? 'S.send(dataUser);' 
				]);
			return;
			$async = ($this->asyncMode===true)?'true':'false';
			
			$this->search = "
				S.send(
					{
						async: $async,
						panel:$this->panelId,
						valid:false,
						confirm_: 'seguro?',
						params:	[
							{t:'setMethod',
								id:$this->panelId,
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
			
			

			$this->paginator = [
				'page'=> $this->page,
				'totalPages'=>	$this->totalPages,
				'maxPages'=>	$this->pageLimit,
				'change'=>"S.send(
					{
						async: $async,
						panel:$this->panelId,
						valid:false,
						confirm_: 'seguro?',
						params:	[
							{t:'setMethod',
								id:$this->panelId,
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
		}
	}
}