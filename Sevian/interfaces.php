<?php


namespace Sevian;

interface UserAdmin{

    public function login();


}

interface TemplateAdmin{

    public function getTemplate();
    public function getThemeTemplate();


}

interface PanelsAdmin{
    public function getPanels();

}
