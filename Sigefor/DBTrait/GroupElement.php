<?php
namespace Sigefor\DBTrait;

trait GroupElement{
	//protected $cn = null;
	
	private $_user = '';
	private $_pass = '';
	
	private $_auth = false;

	private $_roles = [];

    protected $tGroups = '_sg_groups';
	protected $tGroUsr = '_sg_grp_usr';
	protected $tGrpEle = '_sg_grp_ele';

	public function dbGroupElement($element, $name, $method = ''){
		
		$cn = $this->cn;
		
		$_element = $cn->addSlashes($element);
		$_name = $cn->addSlashes($name);
		$_method = $cn->addSlashes($method);

		$cn->query = "
			SELECT r.group  
			FROM $this->tGrpEle as r
			INNER JOIN $this->tGroups as g ON g.group = r.group
			WHERE r.element = '$_element' AND r.name = '$_name' 
			AND (r.method = '$_method' OR '$_method' = '')
			AND g.status = 1 AND r.active = 1
		";
		
		//hr($cn->query);
		$result = $cn->execute();
        
		while(($rs = $cn->getDataRow($result))){
           $this->_roles[] = $rs[0];
		}

		return $this->_roles;
	}
	
	public function isValidGroup($element, $name, $method, $roles){
		$this->dbGroupElement($element, $name, $method);
		
		if(count(array_intersect($roles, $this->_roles)) > 0){
			return true;
		}
		return false;
	}

}