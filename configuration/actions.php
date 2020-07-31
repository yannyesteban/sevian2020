<?php


   
    $actions["open_personas"][] = [
        "setMethod" => [
            "panel" => 4,
            "method"=> "save",
        ]
    ];
    $actions["open_personas"][] = [
        "setMethod"=>[
            "panel"=>8,
            "method"=>"update",
        ]
    ];
    $actions["open_personas"][] = [
        "setPanel"=>[
            "panel"=>4,
            "element"=>"form",
            "name"=>"personas",
            "method"=>"load",
            "eparams"=>[
                "record"=>"personas.id=4",
            ]
        ],
    ];
    //print_r($actions);
    //Sevian\S::actionLoad($inputs);
?>