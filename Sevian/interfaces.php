<?php


namespace Sevian;

interface UserAdmin{

    public function login();


}

interface StructureAdmin{

    public function getStructure();


}

interface PanelsAdmin{
    public function getPanels();

}
