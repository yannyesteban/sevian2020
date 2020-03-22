<?php
namespace Sigefor\DBTrait;
include_once "../Sigefor/DBTrait/Form.php";

trait Grid{

	use Form;


	public $searchFor = [];
	public $pagination = true;
	public $page = 1;
	public $pageLimit = 6;
	
	//private $cn = null;
	//private $infoQuery = null;
	

    //private $tForms = "_sg_form";
	//private $tFields = "_sg_fields";
	
	//private $menuName = '';
	
	private $dataKeys = [];
	

	private $totalPages = 0;

	//private $query = '';
	private $groups = null;
	private $pages = null;
	
	public function getDataGrid($search = '', $page = 1){

		$this->page = $page;

		$cn = $this->cn;

		if($search !='' and $this->searchFor){
			$this->query = $cn->evalFilters($this->query, $search, $this->searchFor);
		}

		$cn->query = $this->query;
		$cn->page = $page;
		$cn->pagination = $this->pagination;
		$cn->pageLimit = $this->pageLimit;//$this->maxPages;

		$result = $cn->execute();

		$this->totalPages = $cn->pageCount;
		$data = $cn->getDataAll($result);

		$keys = $this->infoQuery->keys;
		
		$this->dataKeys = [];

		foreach($data as $k => $record){
			
			foreach($keys as $key){
				
				$data[$k]['__mode_'] = 2;
				$data[$k]['__id_'] = $k;
				
				$this->dataKeys[] = [
					$key => $record[$key]
				];
				
			}

			foreach($this->fields as $f){
				if($f->subform){
					if($f->params){
						$params = \Sevian\S::varCustom($f->params, $record, '&');
						$params = json_decode(\Sevian\S::vars($params));
		
						foreach($params as $kk => $v){
							$f->$kk = $v;
						}
					}
					$sf = new SubForm($f->subform);
					$sf->dataRecord =  &$this->getSes('_rec');
					
					$data[$k][$f->field] = $sf->getValue();
					
				}
			}
			

		}

		$cn->pageLimit = false;
		return $data;

	}

	public function getTotalPages(){
		return $this->totalPages;
	}


}