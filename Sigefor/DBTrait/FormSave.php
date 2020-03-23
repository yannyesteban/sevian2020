<?php
namespace Sigefor\DBTrait;
include_once 'FormSave.php';
include_once "../Sigefor/DBTrait/Form.php";


trait FormSave{
	use Form;
	private $cn = null;

	public function send($data){
		$this->loadForm($this->name);
		$this->configFields($this->name);

		foreach($this->fields as $k => $v){
			if($v->subform){

				$infoQuery = $this->cn->infoQuery("SELECT * FROM test_edo");
				$this->infoQuery->fields[$k]->detail = $infoQuery;
				$infoQuery->fields["id"]->master = 'id';
			}
		}
		//$_data = (object)\Sevian\S::getVReq();
		//$_data->__record_ = \Sevian\S::getSes("f_id");

		$info = new \Sevian\Sigefor\InfoRecord([
			'cn'		=> '_default',
			'mode'		=> 'update',
			'tables'	=> $this->infoQuery->tables,
			'fields'	=> $this->fields,
			'data' 		=> $data,
		]);

		$save = 'Sevian\Sigefor\FormSave';
		//$save::setDictRecords($this->pVars['records']);
		//$save::setDictRecords($this->getSes('_rec'));
		
		return $save::send($info, $data, []);
		//hr($this->pVars['records'],"red");

	}

}