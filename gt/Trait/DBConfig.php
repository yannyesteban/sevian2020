<?php

namespace GT;

trait DBConfig{
    private $cn = null;
    private function loadUserConfig($user){

        $cn = $this->cn;
        $cn->query = "SELECT * FROM user_config WHERE user='$user'";

        $result = $this->cn->execute();
        $json = null;
		if($rs = $cn->getDataAssoc($result)){
            $json = json_decode($rs['layer']);


        }


        return $json;
    }


}