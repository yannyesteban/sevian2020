<?php
namespace Sigefor;
require_once 'DBTrait/HtmlFileInfo.php';
require_once 'DBTrait/JasonFileInfo.php';
require_once 'Sigefor.php';

class InfoForm
    extends \Sevian\Element
	implements
		\sevian\JasonComponent,
		\sevian\JsonRequest,
		\Sevian\UserInfo

{
    use Sigefor;
    use DBTrait\HTMLFileInfo;

    public $_name = '';
    public $_type = '';
    public $_mode = '';
    public $_info = null;

    private $templateName = null;
    private $template = '';
    private $data = '';
    private $mode = '';
	private $modePropertys = [];

    public $containerId = "";
	private $_jsonRequest = null;

	public $jsClassName = 'InfoForm';

	static public $patternJsonFile = '';
    static public $patternTemplateFile = '';

    public function __construct($info = []){
        foreach($info as $k => $v){
			$this->$k = $v;
		}

        $this->cn = \Sevian\Connection::get();
	}
	public function config(){}

	public function evalMethod($method = false): bool{

		if($method === false){
            $method = $this->method;
		}

		switch($method){
			case 'load':
				$this->load();
				break;
			default:
				break;

		}

		return true;
	}

	public function init(){

		$form =  new \Sigefor\Component\Form2([

			//'id'		=> $this->containerId,
			'panelId'	=> $this->id,
			'name'		=> \Sigefor\JasonFile::getNameJasonFile('/gt/forms/history', self::$patternJsonFile),
			'method'	=> $this->method,
			'mode'		=> 1,
			'userData'=> [],

			//'record'=>$this->getRecord()
		]);


		return [
			'form'     => $form,

			'popupTemplate' => $this->popupTemplate,
			'infoTemplate'	=> $this->infoTemplate,
			'pathImages'	=> PATH_IMAGES."sites/",
			'caption'		=> 'Historial',
			'id'            => $this->containerId,
			'followMe'		=> true,
			'delay'			=> 60000,
		];
	}

	public function load(){
		$this->loadConfigData($this->name, self::$patternJsonFile);
        if($this->templateName){
            $this->template = $this->loadHTMLFragment($this->templateName, self::$patternTemplateFile);
        }

        if($this->containerId !== null){
            if($this->eparams->mainId?? false){
                $this->containerId = $this->eparams->mainId;
            }

            if(!$this->containerId){
                $this->containerId = 'pan-'.$this->id;
            }

            $this->panel = new \Sevian\HTML('div');
            $this->panel->id = $this->containerId;
        }



		$this->jsClassName = 'InfoForm';

		$this->info = [

			'caption'   => $this->caption,
			'id'        => $this->containerId,
            'html'      => $this->template,
            'data'      => $this->data,
            'mode'      => $this->mode,
            'className' => $this->className,
			'modePropertys'=> $this->modePropertys

		];


		$this->setInit($this->info);

    }


	private function loadTest(){
		$rr = json_decode(@file_get_contents("data2.json", true), true);
		//hx($rr);
		foreach($rr as $k => $t){
			$cn = $this->cn;
			$date_time = $t['fecha']." ".$t['hora'];
			$latitude = str_replace("," ,".",$t['latitud']);
			$longitude = str_replace("," ,".",$t['longitud']);
			$heading = $t['heading'];
			$altitud = $t['altitud'];
			$satellites = $t['satelites'];
			$speed = $t['velocidad'];


			$cn->query =
			"INSERT INTO tracking (unit_id, device_id, date_time, longitude, latitude, speed, altitude, heading, satellite)
			VALUES (2319, '2012000750', '$date_time', '$longitude', '$latitude', '$speed',
			'$altitud', '$heading', '$satellites') ";
			//hr($cn->query);
			$result = $cn->execute();
		}
		hx($rr);
	}


    public function jsonSerialize() {
        return [
			'name'	=> $this->_name,
			'type'	=> $this->_type,
			'mode'	=> $this->_mode,
			'info'	=> $this->_info
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

}