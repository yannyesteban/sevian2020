

var g = new Sevian.Form({
    target:"f100",
    caption:"Form 01",
    fields:[{
        name:"cedula",
        id:"p4_cedula",
        caption:"Cédula",
        control:"Std",
        type:'text',
        value:'12474737',
        propertys:{
            id:"my_cedula",
        },
        events:{
            click:'alert(8)'
        }

    }]
});


var xx ={
	async: false,
	panel:4,
	valid:true,
	confirm: 'seguro?',
	params:	[
		{setMethod:{
			panel:4,
			element:'test5',
			method:'request',
			name:'personas'
		}},
		{setMethod:{
			panel:8,
			element:'test4',
			method:'request',
			name:'personas'
		}}
	]
};



var Modulo = (function(){
    U=1000;
    function X(){
        alert(U);
    }


    return {
        W:X
    }
})();



function fds(){
var menu1 = new Sevian.Menu({
    target:"que",
    caption:"que menu",
    type:"accordion",
    useButton:true,

    items:[
        {

            caption:"tres",
            action:"alert(this.caption);",
            wCheck:true,
            onCheck:function(a, b){alert(33)}
                
            
        }


    ]

});


menu1.add({

    caption:"uno",
    action:"alert(this.caption);",
    wCheck:true,
    onCheck:function(a, b){alert(11)}
        
    
});

menu1.add({

    caption:"dos",
    action:"alert(this.className);",
    wCheck:true,
    //onCheck:"alert('todo');",
    
});

};


db(1000);