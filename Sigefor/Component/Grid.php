<?php
namespace Sigefor\Component;

include "../Sevian/JS/Grid.php";
include "../Sigefor/DBTrait/Grid.php";

class Grid extends \Sevian\JS\Grid {
	
	use \Sigefor\DBTrait\Grid;

	public $panelId = 0;
	public $element = null;
	
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		
		if($this->name){
			if(substr($this->name, 0, 1) == '#'){
				$filePath = substr($this->name, 1);

				$infoForm = $this->loadJsonFile($filePath);
				$this->setInfoForm($infoForm);
				$this->setInfoFields($infoForm['infoFields']);
				
			}else{
				$infoForm = $this->infoDBForm($this->name);
				$this->setInfoForm($infoForm);
				$infoField = $this->infoDBFields($this->name);
				$this->setInfoFields($infoField);
				
			}

			$this->data = $this->getDataGrid($this->searchValue, $this->page);
			
			$this->menu = new Menu(['name'=>$this->menuName]);
			
			$this->search = "
				S.send(
					{
						async: true,
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
						async: true,
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