<?php
namespace Sevian;

interface UserAdmin{

    //public function login();

    public function getUserInfo();

}

interface TemplateAdmin{

    public function getTemplate();
    public function getThemeTemplate();


}

interface WindowsAdmin{
    public function getWindows();

}

interface PanelsAdmin{
    public function getPanels();

}

interface JsElement{
    public function getJsType();

}

interface JsonRequest{
    public function getRequest();

}


interface JsPanelRequest{
    public function getJsConfigPanel():jsConfigPanel;
    public function getJsType();
}

interface JsElementRequest{
    public function addJsElement(jsConfigElement $opt);
    public function getJsElement();

}

interface JasonComponent{
	
    //public function getJsComponents();
    public function jasonRender();

}


