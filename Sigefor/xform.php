<?php
namespace SIGEFOR;

require_once MAIN_PATH.'Sevian/JS/Form.php';
require_once MAIN_PATH.'Sigefor/DBTrait/DataRecord.php';
require_once MAIN_PATH.'Sigefor/DBTrait/Form2.php';
require_once MAIN_PATH.'Sigefor/Component/Menu.php';

//require_once MAIN_PATH.'Sigefor/JasonFile.php';

//require_once MAIN_PATH.'Sigefor/DBTrait/Form.php';

//require_once "Component/Form2.php";

//require_once "Component/FormSave.php";

class XForm extends \sevian\element {
    use \Sigefor\DBTrait\Form2{
		DBTrait\Form2::init as public iniForm;
	}


    public $jsClassName = 'Form2';

    private $userData = [];
    
    static public $patternJsonFile = '';

    public function __construct($info = []){
		
        foreach($info as $k => $v){
			$this->$k = $v;
		}
		
        $this->cn = \Sevian\Connection::get();
    }

    public function evalMethod($method = false): bool{
        if($method){
            $this->method = $this->method;
        }

        switch($this->method){
            case 'request':
                $this->init();

            break;

        }

        return true;

    }

    public function init(){
        $this->loadForm($this->name, $this->record, self::$patternJsonFile);


        
        $info = new \Sevian\JS\Form($this);

        $this->userData = [
			'id'=>$this->id,
			'element'=>$this->element,
			'elementName'=>$this->name,
			'elementMethod'=>$this->method,
			'a'=>'horizontal'
		];
        if($this->menuName){
			$info->menu = new \Sigefor\Component\Menu([
			'name'=>$this->menuName,
			'userData'=>&$this->userData,
            'onDataUser'=>$this->onDataUser?? 'S.send3(dataUser);' 
            //'onDataUser'=>'S.send3(dataUser);' 
			]);
		}

        //print_r(JSON_ENCODE($info->menu, JSON_PRETTY_PRINT));exit;

        $div = new \SEVIAN\HTML("div");
        $div->id = "x";
        $div->innerHTML = "";
        $info->id = "x";
        $this->setPanel($div);
        $this->setInit($info);
    }
}