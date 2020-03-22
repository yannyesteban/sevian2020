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
		
		$this->loadForm($this->name);
		$this->fields = $this->loadFields($this->name);
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