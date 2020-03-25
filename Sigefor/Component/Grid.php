<?php

namespace Sigefor\Component;

include "../Sevian/JS/Grid.php";

include "../Sigefor/DBTrait/Grid.php";


class Grid extends \Sevian\JS\Grid {
	
	use \Sigefor\DBTrait\Grid;

	public $panelId = 0;
	
	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		
		if($this->name){
			if(substr($this->name, 0, 1) == '#'){
				$this->name = substr($this->name, 1);
				$info = $this->loadJsonFile($this->name);
				$this->jsonConfig($info);

				$this->setInfoFields($this->fields);
				$this->data = $this->getDataGrid($this->searchValue, $this->page);
			}else{
				$this->loadForm($this->name);
				$this->fields = $this->loadFields($this->name);
				//$this->fields = $this->loadFields($this->name, $this->loadRecord);
				$this->data = $this->getDataGrid($this->searchValue, $this->page);
				
			}
			//$this->menu = new Menu(['name'=>$this->menuName]);
		

			//$this->loadForm($this->name);
			//$this->fields = $this->loadFields($this->name);
			//$this->data = $this->getDataGrid($this->searchValue, $this->page);
			
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
								element:'testgrid',
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
								element:'testgrid',
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