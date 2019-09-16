<?php

namespace Sevian\Sigefor;

class InfoFormSave{

}

class FormSave{
    private $cn;
    private $fields;
    private $data;
    private $query;
    private $tables = ['persons'];
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
		
        $d = '
        {
            "cn":"sevian",
            "mode":"update",
            "fields":{
                "cedula":{
                    "field":"cedula",
                    "mtype":"C",
                    "format":["upper","md5"],
                    "table":"persons",
                    "notNull":false,
                    "rules":{}
        
                },
                "nombre":{
                    "field":"nombre",
                    "mtype":"C",
                    "format":["lower","md5"],
                    "table":"persons",
                    "notNull":false,
                    "rules":{}
        
                },
                "apellido":{
                    "field":"apellido",
                    "mtype":"C",
                    "format":["upper","md5"],
                    "table":"persons",
                    "notNull":false,
                    "rules":{}
        
                },
                "nacimiento":{
                    "field":"nacimiento",
                    "mtype":"D",
                    "format":["upper","md5"],
                    "table":"persons",
                    "notNull":false,
                    "rules":{}
        
                },
                "edad":{
                    "field":"edad",
                    "mtype":"I",
                    "format":["uppercase","md5"],
                    "table":"persons",
                    "notNull":false,
                    "rules":{}
        
                },
                "cursos":{
        
        
                    "detail":{
                        "cn":"sevian",
                        "fields":{
                            "cedula":{
                                "mtype":"I",
                                "linked":"cedula",
                                "table":"cursos",
                                "field":"cedula",
                                "format":[],
                                "rules":{}
        
                            },
                            "cursos":{
                                "mtype":"S",
                                
                                "table":"cursos",
                                "field":"curso",
                                "format":[],
                                "rules":{}
                            }
        
                            
                        }
                    }
                }
            },
            "data":[
        
                {
                    "cedula":"1112",
                    "nombre":"pepe",
                    "apellido":"cortisona",
                    "nacimiento":"2000-01-01",
                    "edad":50,
                    "cursos":[],
                    "__mode_":1,
                    "__record_":{
                        "cedula":"1111"
                    }
                },
                {
                    "cedula":"12474737",
                    "nombre":"Yanny Esteban",
                    "apellido":"Nuñez",
                    "nacimiento":"1975-10-24",
                    "edad":43,
                    "cursos":[],
                    "__mode_":2,
                    "__record_":{
                        "cedula":"12474737"
                    }
                }
        
            ],
            "transaction":true,
            "masterData":[]
        
        
        
        
        }
        
        
        ';

        $this->cn = \Sevian\Connection::get();

        $i = $this->cn->infoQuery("select * from persons, persons as b");
        //print_r($i);

        //$i = $this->cn->infoTable("persons");
        //print_r($i);
        $this->info = $p = json_decode($d);
        //print_r($p);
        $this->save($p->data);
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

    public function save($data){

        $cn = $this->cn;
        $this->begin();
        $this->error = false;
        $this->errno = 0;
        foreach($data as $record){
            $this->saveRecord($record);
        }

        //$cn->commit();
        $this->end($this->error);
    }
    public function saveRecord($data){
        $info = $this->info;
        $cn = $this->cn;
        $mode = $data->__mode_;
        $record = $data->__record_;

        foreach($this->tables as $table){


            $filter = new \stdClass;
            $q_where = "";

            
            foreach($info->fields as $k => $field){
                if($field->table?? false == $table){
                    $value = $data->$k;
                   

                    if(isset($record->$k)){
                        $filter->$k = $record->$k;
                        $q_where .= (($q_where!="")? " AND ": "").$cn->addQuotes($field->field)."='".$cn->addSlashes($record->$k)."'";
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

                    $fieldName = $this->cn->addQuotes($field->field);
                    $fieldValue = $this->cn->addSlashes($value);
                    if(($field->mtype != "C" and $field->mtype != "CH" and $field->mtype != "B" or !$field->notNull) and $value == ""){
						$fieldValue = "null";
					}else{
						$fieldValue = "'".$cn->addSlashes($value)."'";
					}
                    if($mode == 1){
                        $q_values[] = $fieldValue;
					    $q_fields[] = $fieldName;
                    }elseif($mode == 2){
                        $q_set[] = $fieldName."=".$fieldValue;
                    }

                }
            }
            $table = $this->cn->addQuotes($table);
            switch($mode){
                case 1:
                    $q = "INSERT INTO $table (".implode(", ",$q_fields).') VALUES ('.implode(', ',$q_values).');';
                    break;
                case 2:
                    $q = "UPDATE $table SET ". implode(", ", $q_set). ' WHERE '. $q_where. ';';
                    break;
                case 3:
                case 6:
                    $q = "DELETE FROM $table WHERE ". $q_where;
                    break;
            }// end switch
            hr($q);
            $result = $cn->execute($q);

            if($cn->error){
                
				$this->error = true;
				$this->errno = $cn->errno;		
			}
        }
    }


}