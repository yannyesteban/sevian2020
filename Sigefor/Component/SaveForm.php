<?php
namespace Sigefor\Component;

//require_once MAIN_PATH.'Sigefor/DBTrait/JasonFileInfo.php';
require_once MAIN_PATH.'Sevian/JS/Form.php';
require_once MAIN_PATH.'Sigefor/DBTrait/Form2.php';
require_once MAIN_PATH.'Sigefor/Component/Menu.php';
//require_once MAIN_PATH.'Sigefor/Component/FormSave.php';

class InfoRecordField{
    public $name = '';
    public $field = '';
    public $mtype = '';
    public $format = [];
    public $table = '';
    public $notNull = false;
    public $rules = [];
    
    public $sqlValue = false;
    public $refValue = false;
	public $master = false;
	public $expValue = 'Numero {=value} &name @cedula';
    
    public $serialize = false;
    public $serializeFilters = []; 
    public $aux = false;
    public $isUpdate = true;
    public $key = false;
    public $serial = '';

    public $setSes = false;
	public $setReq = false;
    public $setExp = false;
    
    public $subform = null;
    public function __construct($opt = []){
		
		foreach($opt as $k => $v){
          
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
	}
}

class SaveForm {
	

	use \Sigefor\DBTrait\Form2;

	private $loadRecord = null;

	
	private $patternJsonFile = JSON_PATH.'{name}.json';
	private $userData = [];
	private $masterFields = null;

    
    private $transaction = false;
    private $error = false;
    private $errno = 0;

    private $dict = null;
	//private $dataKeys = null;
	private $dataKeysId = null;

    private $result = [];
	private $data = null;
	private $subforms = null;

	
	//private $record = null;

	/*
	
	$data;
	$masterData = [];
	$tables = [];
	$fields=[
		$field;
		$name;
		$table;
		$aux;
		$sqlValue;
		$masterFields;
		$refValue;
		$serialize;
		$format;
		$key=true;
		$notNull;
		$mType;
		$subForm (this.value);
		$rules;
		public $expValue = 'Numero {=value} &name @cedula';

	]
	$subform;

	*/

	public function __construct($info = []){
		
		foreach($info as $k => $v){
			$this->$k = $v;
		}
        
		$this->cn = \Sevian\Connection::get();
		
		$this->init($this->name, $this->record, $this->patternJsonFile);

		//hx(json_encode($this->infoFields, JSON_PRETTY_PRINT));
		$fields = [];
		$_fields = [];
		foreach($this->infoQuery->fields as $key => $infoField){
			$fields[] = $_fields[$key] = new InfoRecordField($infoField);
		}
		
		foreach($this->infoFields as $info){
			$info = (object)$info;
			
			if(!isset($_fields[$info->name])){
				continue;
			}

			foreach($info as $k => $v){
				$_fields[$info->name]->$k = $v;
			}


			
			if($info->params?? false){
				if(is_string($info->params)){
					$params = \Sevian\S::varCustom($info->params, $values, '&');
					$params = json_decode(\Sevian\S::vars($params));
				}else{
					$params = $info->params;
				}
				
				foreach($params as $k => $v){
					$_fields[$info->name]->$k = $v;
				}
			}
		}
		$this->fields = $_fields;
		$this->tables = $this->infoQuery->tables;
		//hx($this->data);
		//hx(json_encode($fields, JSON_PRETTY_PRINT));

		if($this->data){
			$this->send($this->data, []);
		}
		

	}
	

	public function send($data, $masterData = []){
       
      
        $this->begin();

        $this->error = false;
        $this->errno = 0;
       
        if($this->dataKeys){
            $this->setDataKeys($this->dataKeys);
        }

        if($this->dataKeysId && $this->dataKeys??false){
            $this->setDictRecords($this->dataKeys[$this->dataKeysId]);
        }

        foreach($data as $record){
            $this->result[] = $this->saveRecord($record, $masterData);
        }
        
        $this->end($this->error);
        
        return $this->result;
    }

    public function sendOne($record, $masterData = []){
       
      
        $this->begin();

        $this->error = false;
        $this->errno = 0;
       
        if($this->dataKeys){
            $this->setDataKeys($this->dataKeys);
        }

        if($this->dataKeysId && $this->dataKeys??false){
            $this->setDictRecords($this->dataKeys[$this->dataKeysId]);
        }

        
        $this->result[] = $this->saveRecord($record, $masterData);
        
        
        $this->end($this->error);
        
        return $this->result;
    }

	private function saveRecord($data, $masterData){

        if($data->__mode_ <= 0){
            return false;
        }

        $cn = $this->cn;
        $mode = $data->__mode_;
       
        if(isset($data->__record_)){
            $record = $data->__record_;
        }elseif(isset($this->dict[$data->__id_])){
            $record = ((object)$this->dict[$data->__id_]);
        }else{
            $record = new \stdClass;
        }
        //hr($record,"red");exit;
        //hr($data);exit;

        $recordIni = clone $record;

        $tables = $this->tables;
        $result = new \stdClass;
        
        foreach($tables as $table){
            
            if($table == ''){
                continue;
            }
            
            $serial = '';
            $filter = new \stdClass;
            $q_where = '';

            if($record != '' and $mode != '1'){
                
                if(count($tables ) == 1){
                   
                    foreach($record as $k => $v){
                        $q_where .= (($q_where != '')? ' AND ': '').$cn->addQuotes($k)."='".$cn->addSlashes($v)."'";    
                    }
                }else{
                    
                    foreach($record as $k => $v){
                        //hr($k);exit;
                        if(isset($this->fields[$k]) and $this->fields[$k]->table == $table){
                            $q_where .= (($q_where != '')? ' AND ': '').$cn->addQuotes($this->fields[$k]->field)."='".$cn->addSlashes($v)."'";    
                        }
                    }
                }
            }
            //hr("table: $table, mode: $mode ". $q_where, "red");
            
            foreach($this->fields as $field){

                $name = $field->name;

                //$field = new InfoRecordField($field);
              
                if($field->aux or $field->table == '' OR $field->table != $table or ($mode > 1 and !$field->isUpdate)){
                    continue;
                }
              
                if(($field->serial) and $field->notNull and $data->$name??false and $data->$name == '' and $mode == 1){
					$serial = $field->field;
                    continue;
                }

                $fieldName = $cn->addQuotes($field->field);
               
                if($field->sqlValue){
                    $fieldValue = $field->sqlValue;
                }else{

                    if($this->masterFields and isset($this->masterFields->$name)){
                        $value = $masterData->{$this->masterFields->$name};
                    }elseif($field->master and isset($masterData->{$field->master})){
                        $value = $masterData->{$field->master};
                    }elseif($field->refValue){
                        $value = $data->{$field->refValue};
                    }elseif($field->serialize){
                        $value = $cn->serialId($table, $field->field, $field->serializeFilters);
                    }else{
                        $value = $data->$name ?? '';
                    }

                    foreach($field->format as $format){
                        switch($format){
                            case 'upper':
                                $value = mb_strtoupper($value);
                                break;
                            case 'lower':
                                $value = mb_strtolower($value);
                                break;
                            case 'capitalice':
                                $value = mb_ucfirst($value);
                                break;
                            case 'capitaliceWords':
                                $value = mb_ucwords($value);
                                break;
                        }
                    }
                    
                    if($field->key){
                        $record->$name = $value;
                    }

                    if($field->notNull and $field->mtype != 'C' and $field->mtype != 'CH' and $field->mtype != 'B' and $value == ''){
                        continue;
                    }

                    $fieldValue = $cn->addSlashes($value);

                    if(($field->mtype != 'C' and $field->mtype != 'CH' and $field->mtype != 'B' or !$field->notNull) and $value == ''){
						$fieldValue = 'null';
					}else{
						$fieldValue = "'".$cn->addSlashes($value)."'";
                    }
                    
                }
                if($mode == 1){
                    $q_values[] = $fieldValue;
                    $q_fields[] = $fieldName;
                }elseif($mode == 2){
                    $q_set[] = $fieldName."=".$fieldValue;
                }
                $data->$name = $value;

                
                
            }
            $table = $cn->addQuotes($table);
            $q = '';
            switch($mode){
                case 1:
                    $q = "INSERT INTO $table (".implode(', ',$q_fields).') VALUES ('.implode(', ',$q_values).');';
                    break;
                case 2:
                
                    $q = "UPDATE $table SET ". implode(', ', $q_set). " WHERE $q_where;";
                    break;
                case 3:
                case 6:
                    $q = "DELETE FROM $table WHERE $q_where;";
                    break;
            }
            
            $q_error = false;
            $q_errno = 0;
            
            if($q and $mode <=3){
                //hr($q);
                $cn->execute($q);

                if($cn->error){
                    $this->error = true;
                    $this->errno = $q_errno = $cn->errno;
                    $q_error = $cn->error;
                    //hr("ERROR ".$q, "RED");	
                    //hr($q_error, "green");	
                }
                
                if($serial){
                    $lastId = $cn->getLastId();
                    $data->$serial =  $lastId;
					$record->$serial = $lastId;
                }
            }
            
            if($q_error){
                $record = $recordIni;
                $this->dict[$data->__id_] = $recordIni;
            }

            $result->record = $record;

            $result->q[] = [
                'table' => $table,
                'query' => $q,
                'record'=> $record,
                'error' => $q_error,
                'errno' => $q_errno
            ];
            
        }
        
        if($this->subforms){
            foreach($this->subforms as $subform){
				//hx($data, "green");
				//hr($subform->form."....","green");
				$sf = new SaveForm([
					'name'=> $subform->form,
					'masterFields'=>$subform->masterFields,
					//'data'=>(object)\Sevian\S::getVReq()
				]);
                //hr($subform->masterFields);
                //hr($data->{$subform->fieldData}, "blue","aqua");
                $subData = null;
                if(is_string($data->{$subform->fieldData})){
                    $subData = \json_decode($data->{$subform->fieldData});
                }

                $sf->send($subData, $data);
            }
        }

        foreach($this->fields as $k => $field){

            if(isset($field->detail)){
                
                if(is_string($data->$k)){
                    $data->$k = \json_decode($data->$k);
                }
                if($data->$k){
                   $this->send($field->detail, $data->$k, $data); 
                }
            }
        }
        
        $result->error = $this->error;
        return $result;
	}
	
	public function getResult(){
		return $this->result;
	}

	private function begin(){
        if($this->transaction){
            $this->cn->begin();
        }
    }

    private function end($error){
            
        if($this->transaction){
            if(!$error){
                $this->cn->commit();
                
            }else{
                $this->cn->rollback();
                
            }
        }
    }

    public function setDictRecords(&$record){
        $this->dict = &$record;
    }
    public function setDataKeys(&$dataKeys){
        $this->dataKeys = &$dataKeys;
    }

	public function getCaption(){
		return $this->caption;
	}
}