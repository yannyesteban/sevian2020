<?php
namespace Sevian\Sigefor;

class InfoRecord{
    public $cn ="";
    public $fields;
    public $query;
    public $tables = [];
    public $transaction = false;
    public $masterData = false;

    public $error = false;
    public $errno = 0;

    public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
		
	}

}


class InfoRecordField{
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
    public $update = true;
    public $key = false;

    public $setSes = false;
	public $setReq = false;
    public $setExp = false;
    
    public function __construct($opt = []){
		
		foreach($opt as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}
		
		
	}
}


class FormSave{
    private static $cn;
    private static $transaction = false;
    private static $error = false;
    private static $errno = 0;

    private static function begin(){
        if(self::$transaction){
            self::$cn->begin();
        }
    }

    private static function end($error){
            
        if(self::$transaction){
            if(!$error){
                self::$cn->commit();
                
            }else{
                self::$cn->rollback();
                
            }
        }
    }
    public static function send($info, $data, $masterData = []){
        $info = new InfoRecord($info);
        if($info->cn){
            self::$cn = \Sevian\Connection::get($info->cn);  
        }
        self::$transaction = $info->transaction;
        self::begin();

        self::$error = false;
        self::$errno = 0;
        
        foreach($data as $record){
            self::saveRecord($info, $record, $masterData);
        }
        
        self::end(self::$error);
        
    }
    
    private static function saveRecord($info, $data, $masterData){
        //print_r($info->fields);
        if($data->__mode_ <= 0){
            return false;
        }

        
        $cn = self::$cn;
        $mode = $data->__mode_;
        
        $record = $data->__record_ ?? new \stdClass;
        $tables = $info->tables;
        

        foreach($tables as $table){
           
            $serial = '';

            $filter = new \stdClass;
            $q_where = '';

            if($record != ''){
                if(count($tables ) == 1){
                    foreach($record as $k => $v){
                        $q_where .= (($q_where != '')? ' AND ': '').$cn->addQuotes($k)."='".$cn->addSlashes($v)."'";    
                    }
                }else{
                    foreach($record as $k => $v){
                        if(isset($info->fields->$k) and $info->fields->$k->table == $table){
                            $q_where .= (($q_where != '')? ' AND ': '').$cn->addQuotes($info->fields->$k->field)."='".$cn->addSlashes($v)."'";    
                        }

                    }
                }
                
            }


            foreach($info->fields as $k => $field){
               
                $field = new InfoRecordField($field);
              
                if($field->aux or $field->table != $table or ($mode > 1 and !$field->update)){
                    continue;
                }
              
                if(($field->mtype == 'S') and $field->notNull and $data->$k == '' and $mode == 1){
						
                    $serial = $field->field;
                    continue;
                }

                $fieldName = $cn->addQuotes($field->field);
               
                if($field->sqlValue){
                    $fieldValue = $field->sqlValue;
                }else{
                    if($field->master and isset($masterData->{$field->master})){
                        $value = $masterData->{$field->master};
                    }elseif($field->refValue){
                        $value = $data->{$field->refValue};
                    }elseif($field->serialize){
                        $value = $cn->serialId($table, $field->field, $field->serializeFilters);
                    }else{
                        $value = $data->$k;
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
                        $record->$k = $value;
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
            }// end switch
           
            if($q){
                //hr($q);
                $result = $cn->execute($q);

                if($cn->error){
                   
                    self::$error = true;
                    self::$errno = $cn->errno;		
                }
                if($serial){
                    $lastId = $cn->getLastId();
                    $data->$serial =  $lastId;
                    $record->$serial = $lastId;
                    
                }
                
            }
            
        }

        foreach($info->fields as $k => $field){

            if(isset($field->detail)){

                self::send($field->detail, $data->$k, $data);
                
            }
        }
    }
    
}


class _FormSave{
    private $cn;
    private $fields;
    private $data;
    private $query;
    private $tables = ['persons2'];
    private $transaction = false;
    private $masterData = false;

    private $error = false;
    private $errno = 0;



    public function __construct($info = []){
		
		foreach($info as $k => $v){
			if(property_exists($this, $k)){
				$this->$k = $v;
			}
		}



        $f = $this->loadJson("save_form.json");
       // print_r($f);
        $this->cn = \Sevian\Connection::get();

        $i = $this->cn->infoQuery("select * from persons2");
        //print_r($i);

        //$i = $this->cn->infoTable("persons");
        //print_r($i);
        $this->info = $f;// = json_decode($d);
        //print_r($p);
        $this->save( $this->info, $this->info->data, $this->info->masterData);
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
    public function save($info, $data, $masterData = []){

        $cn = $this->cn;
        $this->begin();
        $this->error = false;
        $this->errno = 0;
        
        foreach($data as $record){
            $this->saveRecord($info, $record, $masterData);
        }

        
        $this->end($this->error);
        
    }
    
    public function saveRecord($info, $data, $masterData){

        if($data->__mode_ <= 0){
            return false;
        }

        //$info = $this->info;
        $cn = $this->cn;
        $mode = $data->__mode_;
        
        $record = $data->__record_ ?? new \stdClass;
        $tables = $info->tables;
        //$masterData = $info->masterData;

        foreach($tables as $table){
           
            $serial = '';

            $filter = new \stdClass;
            $q_where = '';

            if($record != ''){
                if(count($tables ) == 1){
                    foreach($record as $k => $v){
                        $q_where .= (($q_where != '')? ' AND ': '').$cn->addQuotes($k)."='".$cn->addSlashes($v)."'";    
                    }
                }else{
                    foreach($record as $k => $v){
                        if(isset($info->fields->$k) and $info->fields->$k->table == $table){
                            $q_where .= (($q_where != '')? ' AND ': '').$cn->addQuotes($info->fields->$k->field)."='".$cn->addSlashes($v)."'";    
                        }

                    }
                }
                
            }


            foreach($info->fields as $k => $field){
               
                $field = new InfoRecordField($field);
              
                if($field->aux or $field->table != $table or ($mode > 1 and !$field->update)){
                    continue;
                }
              
                if(($field->mtype == 'S') and $field->notNull and $data->$k == '' and $mode == 1){
						
                    $serial = $field->field;
                    continue;
                }

                $fieldName = $cn->addQuotes($field->field);
               
                if($field->sqlValue){
                    $fieldValue = $field->sqlValue;
                }else{
                    if($field->master and isset($masterData->{$field->master})){
                        $value = $masterData->{$field->master};
                    }elseif($field->refValue){
                        $value = $data->{$field->refValue};
                    }elseif($field->serialize){
                        $value = $cn->serialId($table, $field->field, $field->serialize_filters);
                    }else{
                        $value = $data->$k;
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
                        $record->$k = $value;
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
            }// end switch
           
            if($q){
                hr($q);
                $result = $cn->execute($q);

                if($cn->error){
                    
                    $this->error = true;
                    $this->errno = $cn->errno;		
                }
                if($serial){
                    $lastId = $cn->getLastId();
                    $data->$serial =  $lastId;
                    $record->$serial = $lastId;
                    //hr($cn->getLastId());
                }
                
            }
            
        }

        foreach($info->fields as $k => $field){

            if(isset($field->detail)){

                $this->save($field->detail, $data->$k, $data);
                
            }
        }
    }

    public function loadJson($path){
		
		
		//$a= file_get_contents("json/mod_principal.json", true);
		return json_decode(file_get_contents($path, true));
		
		
		
	}
}