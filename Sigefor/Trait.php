<?php
namespace Sigefor;


trait traitMenuDB{
	public function load($name){

	}
}

trait traitFormDB{
    protected $tForms = "_sg_form";
	protected $tFields = "_sg_fields";

	public function load($name){
		$cn = $this->cn;

		$cn->query = "
			SELECT 
			form, caption, class, query, params, method, pages, f.groups,
			caption as title
			FROM $this->tForms as f
			WHERE form = '$name'
		";

		$result = $cn->execute();
		//print_r(\Sevian\S::getVSes());
		
		if($rs = $cn->getDataAssoc($result)){

			foreach($rs as $k => $v){
				$this->$k = $v;
			}
			$params = \Sevian\S::vars($this->params);
			$config = json_decode($params);
			if($config){
				foreach($config as $k => $v){
					$this->$k = $v;
				}
			}
			$this->query = \Sevian\S::vars($this->query);

		}
		//hr($this->query);
		$this->infoQuery = $cn->infoQuery($this->query);

		
		$_fields = $this->infoQuery->fields;

		foreach($_fields as $k => $v){
			
			$fields[$k] = new \Sevian\Sigefor\InfoField($v);
			$fields[$k]->input = 'input';
		}

		$cn->query = "
			SELECT 
			field, alias, caption, input, input_type as \"inputType\", cell, cell_type as \"cellType\",
			class, `default`, mode_value as \"modeValue\",data, params,method,rules,events,info 
			FROM $this->tFields 
			WHERE form = '$name'
		";

		$result = $cn->execute();
		
		while($rs = $cn->getDataAssoc($result)){
			if(isset($fields[$rs['field']])){
				$fields[$rs['field']]->update($rs);
			}
			if($rs['params']){
				$params = json_decode(\Sevian\S::vars($rs['params']));
				foreach($params as $k => $v){
					$fields[$rs['field']]->$k = $v;
				}
			}

			
		}

		$this->fields = [];
		foreach($fields as $field){
			$this->fields[] = $field;
		}

		return $this->fields;
	}


}


?>