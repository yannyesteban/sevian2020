<?php
namespace Sigefor\DBTrait;

trait ConfigField{
	
	private function getDataField($info){
		
		$data = [];
		foreach($info as $_data){

			switch(gettype( $_data)){
				case "array":
					$data[] = $_data;//array_merge($data, $_data);
					break;
				case "string":
					$data = array_merge($data, $this->getDataQuery($_data));
					break;
				case "object":
					$data = array_merge($data, $this->getDataExtra($_data));
					break;					
			}

		}
		return $data;
	}
	
	private function getDataQuery($query){
		$cn = $this->cn;

		$result = $cn->execute($query);
		$data = [];
		while($rs = $cn->getDataRow($result)){
			$data[] = [$rs[0], $rs[1], $rs[2]?? ''];
		}

		return $data;
	}

	private function getDataExtra($info){
		$data = [];
		if(isset($info->t)){

			switch($info->t){
				case 'for':
				case 'range':
					if($info->ini < $info->end){
						for($i = $info->ini; $i < $info->end; $i = $i + abs($info->step)){
							$data[] = [$i, $i, $info->parent?? ''];
						}

					}else{
						for($i = $info->ini; $i > $info->end; $i = $i - abs($info->step)){
							$data[] = [$i, $i, $info->parent?? ''];
						}
					}
					break;
			}
		}
		return $data;
	}
	
	private function getDefaultInput($meta, &$input, &$type){
		$input = 'input';
		switch($meta){
			case 'I':
			case 'C':
				$type = 'text';
				break;
			case 'D':
				$input = 'date';
				$type = 'calendar';
				break;
			case 'B':
				$type =  'textarea';
				break;

		}
	}
}