<?php
namespace Sevian;

interface DBInfo{
    public function setDBInfo($info);
    public function getDBInfo();

}

interface UserInfo{
    public function setUserInfo($info);
    public function getUserInfo();

}

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

interface ListenSigns{
    public function getTaskXSigns();

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

interface JasonComponent extends \JsonSerializable{
	public function jsonSerialize(): mixed;
    //public function getJsComponents();
    //public function jasonRender();

}

interface CSSDocAdmin{
    public function getCSSDocuments();

}
interface JsDocAdmin{
    public function getJsDocuments();
}

