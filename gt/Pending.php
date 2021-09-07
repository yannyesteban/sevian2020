<?php
namespace GT;

require_once MAIN_PATH.'Sigefor/JasonFile.php';


class Pending
    extends \Sevian\Element
	implements \Sevian\UserInfo {


    private $unitId = 0;
    private $commandId = 0;
    private $index = 0;
    private $mode = 0;
    private $type = "0";

	static public $patternJsonFile = '';

    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();
	}

    public function config(){ }

	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
		}


        $unitId = $this->eparams->unitId ?? $this->unitId;
        $commandId = $this->eparams->commandId ?? $this->commandId;
        $index = $this->eparams->index ?? $this->index;
        $mode = $this->eparams->mode ?? $this->mode;

        $type = $this->eparams->type ?? $this->type;

		switch($method){

			case 'load':
				$this->load();
				break;
            case 'init':

                break;
            case 'load-pending':


                $this->addResponse([
                    'id'	=> $this->id,
                    'data'	=> [
                        "pendingList"     => $this->getPending($unitId)
                    ],
                    'iToken'=> $this->iToken
                ]);
                break;
            case 'delete-pending':
                $id = $this->eparams->id ?? 0;


                $affectedRows = $this->deletePending($id);
                if($affectedRows > 0){
                    $message = "El Comando fué eliminado Correctamente!";
                }else{
                    $message = "Error no se pudo eliminar el Comando!";
                }
                $this->addResponse([
                    'id'	=> $this->id,
                    'data'	=> [
                        "message"     => $message,
                        "error" => ($affectedRows>0)? 0: -1,
                        "pendingList"     => $this->getPending($unitId)
                    ],
                    'iToken'=> $this->iToken
                ]);


                break;
			default:
				break;

		}

		return true;
	}

	private function load(){

		//$this->setInit($this->info);
		$this->setInfoElement([
			'id'		=> $this->id,
			'title'		=> 'Pending',
			'iClass'	=> 'GTPending',
			//'html'		=> $this->panel->render(),
			'script'	=> '',
			'css'		=> '',
			'config'	=> [
                'id'=>$this->id,
                'panel'=>$this->id,
                'tapName'=>'yanny',
                'caption'		=> 'Pending',
                'socketId'=>$this->eparams->socketId?? "",
                'unitPanelId'=>$this->eparams->unitPanelId?? ""

            ]

		]);

    }

    private function getPending($unitId = ''){
        $cn = $this->cn;

        $cn->query = "SELECT
        uc.id, uc.unit_id, uc.command_id, uc.index, uc.mode, un.name as unit_name, command
        FROM unit_command as uc
        INNER JOIN unit as u ON u.id = uc.unit_id
        INNER JOIN unit_name as un ON un.id = u.name_id

        INNER JOIN device_command as dc ON dc.id = uc.command_id
        WHERE (uc.unit_id = '$unitId' or '$unitId' = '0') and uc.status=1";

        $result = $this->cn->execute();
        return $cn->getDataAll($result);
    }

    private function deletePending($id = ''){
        $cn = $this->cn;

        $cn->query = "UPDATE unit_command
        SET status = 3
        WHERE id = '$id'";

        $result = $this->cn->execute();
        return $cn->affectedRows;


    }

    private function getEvent($unitId, $index){
        $config = $this->getEventConfig($unitId);
        $command = $this->getUnitCommand( $unitId, $index);


        $command['fields'] = $config['params']->fields;
        $command['indexField'] = $config['params']->indexField;

        return [
            "command" => $command,
            "eventList"     => $this->getEventList($unitId, $config['params']->eventRange[0], $config['params']->eventRange[1]),
            "commandList"   => $this->getCommandFieldsList($unitId)
        ];
    }

    private function getICommand($unitId, $commandId, $index){


        $c = $this->getCommand($unitId, $commandId, $index);

        $c['fields'] = $this->getCommandFields($unitId, $commandId, $index);
        $c['paramData'] = $this->getParamData($unitId, $commandId);
        //$command['values'] = $this->getCommandFieldsValue($unitId, $commandId, $index);

        $config = $this->getEventConfig($unitId);

        foreach($c['fields'] as $k => $v){

            $subdata = array_filter($c['paramData'], function($m) use ($v){

                return $v['id'] == $m['param_id'];
            });
            //hr($subdata,"red");
            $c['fields'][$k]['data'] = array_map(function($x){
                return [$x['value'], ($x['title']!='')?$x['title']:$x['value']];
            }, $subdata);
            //hr($v['data'], "green");
        }
        //hx($c['fields']);
        return [
                "commandParam" => $this->getCommandFieldsParams($unitId, $commandId),
                //"paramData"   => ,
                "command"       =>  $c,
                "eventList"     => $this->getEventList($unitId, $config['params']->eventRange[0], $config['params']->eventRange[1]),
                "commandList"   => $this->getCommandFieldsList($unitId)

            ];
    }

	public function setRequest($data){
		$this->_jsonRequest = $data;
	}

	public function getRequest(){
		return $this->_jsonRequest;
	}

	public function setUserInfo($info){
        $this->_userInfo = $info;
    }

    public function getUserInfo(){
        return $this->_userInfo;
    }

    public function getUser(){
        return $this->_userInfo->user;
    }

    private function getCommand($unitId = 0, $commandId = 0, $index = 0){
        $cn = $this->cn;

        $cn->query = "SELECT uc.id,
            '$unitId' as unit_id, c.id as command_id, '$index' as `index`,
            uc.name, uc.params, uc.values,
            IFNULL(uc.status, 0) as status, c.command as command,
            c.type, role_id,
            CASE WHEN uc.id IS NULL THEN 1 ELSE 2 END as __mode_,
             '' as __record_
            FROM device_command as c
            LEFT JOIN unit_command as uc ON c.id = uc.command_id
            AND uc.index = '$index' AND uc.unit_id = '$unitId'
            WHERE c.id = '$commandId'
            ";


        $result = $this->cn->execute();

        $data = [];
        if($data = $cn->getDataAssoc($result)){
            if($data['id'] > 0){
                $data['params'] = json_decode($data["params"]);
                $data['values'] = json_decode($data["values"]);
                $data['__record_'] = ["id"=>$data["id"]];
            }
        }
        return $data;

    }

    private function getCommandFields($unitId = 0, $commandId = 0, $index = 0){

        $cn = $this->cn;


        $cn->query = "SELECT
                    p.id, p.command_id, param, IFNULL(title, param) as title, p.type_value, p.order,p.default_value as value,
                    p.description,

                    '' as name,'' as value, null as data, p.param as label,  1 as param_mode,

                    CASE p.type_value
                        WHEN 1 THEN 'select'
                        WHEN 2 THEN 'bit'
                        else 'text' end as type
                FROM unit as u
                INNER JOIN device as d ON d.id = u.device_id
                INNER JOIN device_command as c ON c.version_id = d.version_id
                INNER JOIN device_comm_param as p ON p.command_id = c.id and c.type = p.type
            WHERE c.id = '$commandId' AND u.id = '$unitId'
            ORDER BY `order`";

        $result = $this->cn->execute();
        return $cn->getDataAll($result);
    }
    private function getEventList($unitId, $init, $end){

        $cn = $this->cn;

        $cn->query = "SELECT c.index as event_id, IFNULL(c.name, '') as name, c.status
        FROM unit u
        INNER JOIN device as d on d.id = u.device_id
        INNER JOIN device_version as v ON v.id = d.version_id
        INNER JOIN device_command as dc ON dc.version_id = v.id
        INNER JOIN unit_command as c ON c.command_id = dc.id AND c.unit_id = u.id
        WHERE u.id = '$unitId' AND dc.role_id = 1";

        $list = [];
        $result = $this->cn->execute();
        $evenList = $cn->getDataAll($result);

        for($i = $init; $i <= $end; $i++){
            $found_key = array_search($i, array_column($evenList, 'event_id'));

            if($found_key !== false){
                $list[] = [$i, "$i : ".$evenList[$found_key]['name'], '*', $evenList[$found_key]['status']];
            }else{
                $list[] = [$i, "$i: ---"];
            }

        }

        return $list;

    }

    private function getEventConfig($unitId){


        //$evenList = $this->getEventList($unitId);

        $cn = $this->cn;

        $cn->query = "SELECT c.*
        FROM unit u
        INNER JOIN device as d on d.id = u.device_id
        INNER JOIN device_version as v ON v.id = d.version_id
        INNER JOIN device_command as dc ON dc.version_id = v.id
        INNER JOIN command as c ON c.command_id = dc.id
        WHERE u.id = '$unitId' AND dc.role_id = 1";
        //hx($cn->query );
        $data = [];
        $result = $this->cn->execute();
        $list = [];
        if($data = $cn->getDataAssoc($result)){
            $params = $data['params'] = json_decode($data["params"]);
            /*
            if(isset($params->eventRange)){
                for($i = $params->eventRange[0]; $i <= $params->eventRange[1]; $i++){
                    $found_key = array_search($i, array_column($evenList, 'event_id'));
                    if($found_key !== false){
                        $list[] = [$i, "$i : ".$evenList[$found_key]['name'], '*', $evenList[$found_key]['status']];
                    }else{
                        $list[] = [$i, "$i: ---"];
                    }
                }
            }*/
        }

        return $data;
    }

    private function getCommandFieldsConfig($commandId){

        $cn = $this->cn;

        $cn->query = "SELECT * FROM command as c WHERE command_id = '$commandId'";

        $data = [];
        $result = $this->cn->execute();
        if($data = $cn->getDataAssoc($result)){
            $data['params'] = json_decode($data["params"]);
        }
        return $data;
    }

    private function getUnitConfig($unitId){

        $cn = $this->cn;

        $cn->query = "SELECT * FROM unit_config as uc WHERE unit_id = '$unitId'";

        $data = [];
        $result = $this->cn->execute();
        if($data = $cn->getDataAssoc($result)){
            $data['event'] = json_decode($data["event"]);
        }
        return $data;
    }

    private function getUnitCommand($unitId, $index){


        $cn = $this->cn;

        $cn->query = "SELECT c.id, u.id as unit_id, dc.id as command_id, '$index' as `index`,
            c.name, c.params,
            IFNULL(c.status, 0) as status,
            1 as __mode_, '' as __record_, dc.command

            FROM unit u
            INNER JOIN device as d on d.id = u.device_id
            INNER JOIN device_version as v ON v.id = d.version_id
            INNER JOIN device_command as dc ON dc.version_id = v.id
            LEFT JOIN unit_command as c
                ON c.command_id = dc.id
                AND c.unit_id = u.id
                AND c.index = '$index'


            WHERE u.id = '$unitId' AND dc.role_id = 1";

        //hx($cn->query);
        $result = $this->cn->execute();
        if($data = $cn->getDataAssoc($result)){
            if($data['id']){
                $data['params'] = json_decode($data["params"]);
                $data['__mode_'] = 2;
                $data['__record_'] = ["id"=>$data["id"]];
            }
        }
        return $data;
    }

    private function getCommandFieldsList($unitId){

        $cn = $this->cn;

        $cn->query = "SELECT c.id, c.command, c.type, IFNULL(uc.status, 0) as status
        FROM device_command as c
        INNER JOIN device_version as v ON v.id = c.version_id
        INNER JOIN device as d ON d.version_id = v.id
        INNER JOIN unit as u ON u.device_id = d.id
        LEFT JOIN unit_command as uc ON uc.command_id = c.id
                AND uc.unit_id = u.id


        WHERE

        u.id = '$unitId' AND c.role_id != 1";

        $result = $this->cn->execute();
        return $cn->getDataAll($result);

    }

    private function getCommandFieldsParams($unitId = '', $commandId = ''){

        $cn = $this->cn;


        $cn->query = "SELECT p.*, CONCAT('name_',p.id) as name,'' as value, null as data, p.param as label, co.value, 1 as param_mode,
                CASE WHEN co.param_id IS NOT NULL THEN 1 ELSE 0 END as exist,
                CASE p.type_value
                    WHEN 1 THEN 'select'
                    WHEN 2 THEN 'bit'
                    else 'text' end as type
            FROM unit as u
            INNER JOIN device as d ON d.id = u.device_id
            INNER JOIN device_command as c ON c.version_id = d.version_id
            INNER JOIN device_comm_param as p ON p.command_id = c.id and c.type = p.type
            LEFT JOIN device_config as co ON co.param_id = p.id AND co.unit_id = u.id
            WHERE c.id = '$commandId' AND u.id = '$unitId'
            ORDER BY `order`;";

        $result = $this->cn->execute();
        return $cn->getDataAll($result);
    }

    private function getParamData($unitId = '', $commandId = ''){
        $cn = $this->cn;

        $cn->query = "SELECT v.param_id, v.value, v.title, p.param, c.command, type_value
            FROM device_param_value as v
            INNER JOIN device_comm_param as p ON p.id = v.param_id
            INNER JOIN device_command as c ON c.id = command_id
            WHERE c.id = '$commandId'";

        $result = $this->cn->execute();
        return $cn->getDataAll($result);
    }


    private function getCommandFieldsValue($unitId = 0, $commandId = 0, $index = 0){
        $cn = $this->cn;

        $cn->query = "SELECT IFNULL(c.id,'') as id, dc.id as command_id, '$unitId' as unit_id, '$index' as `index`,
                    IFNULL(c.params, '') as params, IFNULL(c.status,0) as status,
                    CASE WHEN c.id IS NULL THEN 1 ELSE 2 END as __mode_,
                    '' as __record_, 'yanny' as n
                    FROM device_command as dc
                    LEFT JOIN unit_command as c ON

                    c.unit_id = '$unitId' AND c.command_id = dc.id
                        AND c.index = '$index'
                    WHERE dc.id = '$commandId'";
        $result = $this->cn->execute();

        $data = [];
        if($data = $cn->getDataAssoc($result)){
            if($data['__mode_'] == 2){
                $data['params'] = json_decode($data["params"]);
                $data['__record_'] = ["id"=>$data["id"]];
            }
        }
        return $data;

    }

    public function loadCommand(){

    }

    private function saveCommand($unitId = 0, $commandId = 0, $index = 0, $mode=0, $params = ""){
        $cn = $this->cn;

        $cn->query = "SELECT *
            FROM unit_command as uc
            WHERE
                uc.command_id = '$commandId' AND
                uc.index = '$index' AND
                uc.unit_id = '$unitId'
            ";
        if($mode == 1){
            $field_param = 'params';
        }else{
            $field_param = 'query';
        }

        $result = $this->cn->execute();

        $data = [];
        if($data = $cn->getDataAssoc($result)){
            $cn->query = "UPDATE unit_command as uc
            SET status='1', `read`=0, `$field_param`='$params', `mode` = '$mode'
            WHERE
                uc.command_id = '$commandId' AND
                uc.index = '$index' AND
                uc.unit_id = '$unitId'";
            $cn->execute();
        }else{
            $cn->query = "INSERT INTO unit_command (unit_id, command_id, `index`, `mode`, `status`, `read`, `$field_param`)
            VALUES ('$unitId', '$commandId', '$index', '$mode', 1, 0, '$params')";

            $cn->execute();
        }
        return $cn->error;

    }

    private function getCommandId($unitId, $roleId){
        $cn = $this->cn;

        $cn->query = "SELECT c.id as command_id, c.command, role_id





        FROM unit as u
        INNER JOIN device as d ON d.id = u.device_id
        INNER JOIN device_command as c ON c.version_id = d.version_id

        WHERE  u.id = '$unitId' and role_id='$roleId'
        ";
        $result = $this->cn->execute();

        $commandId = 0;
        if($data = $cn->getDataAssoc($result)){
            if( $data['command_id']){
                $commandId = $data['command_id'];
            }
        }
        return $commandId;

    }

    private function getCommandValues($unitId = 0, $commandId = 0, $index = 0){

        $cn = $this->cn;


        $cn->query = "SELECT uc.values

                FROM unit_command as uc

            WHERE uc.unit_id = '$unitId' AND uc.command_id = '$commandId' AND uc.index = '$index'
            ";

        $result = $this->cn->execute();


        $data = [];
        if($data = $cn->getDataAssoc($result)){
            if($data['values'] != ""){
                $data  = json_decode($data["values"]);

            }
        }
        return $data;


    }
}