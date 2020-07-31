var FormDetail = (($) => {

    class FormDetail{
        public data:any = [];
        public type:string = "default";
        private index:number = -1;
        private master:string[] = null;
        private detail:string = null;

        private _cache:object = {};
        
        constructor(info:object){
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            if(this.data){
                
                for(let d of this.data){
                    this._cache[d[this.detail]] = d;
                }
            }
            
        }

        setValue(value){

            if(typeof value === "string"){
                value = JSON.parse(value);
            }

            this.data = value;
        }

        getValue(){

            if(typeof this.data === "object"){
                return JSON.parse(this.data);
            }

            return this.data = this.data;
        }

        addRow(index, data){

        }
        setMode(index, mode){

        }

        setOn(value, set){
            let found = false;
            let index = this.data.findIndex((item) => item[this.detail] == value);

            if(index >= 0){
                let mode = this.data[index].__mode_;

                if(set){
                    switch(mode){
                        case 0:
                        case 1:
                            mode = 1;
                            break;
                        case 4:
                        case 3:
                            mode = 4;
                            break;
                    }
                }else{
                    switch(mode){
                        case 0:
                        case 1:
                            mode = 0;
                            break;
                        case 4:
                        case 3:
                            mode = 3;
                            break;
                    }

                }
                
                if(mode == 0){
                    this.data.splice(index, 1);
                }else{
                    this.data[index].__mode_ = mode;
                }
                
                found = true;
            }
                
            if(!found){
                this.data.push({
                    [this.detail]: value,
                    __mode_: 1,
                    __id_: this.data.length
                });
                
            }
            return this.data;
        }

        getList(){
            let data = [];

            for(let e of this.data){
                data[e[this.detail]] = e[this.detail];
            }

            return data;
        }

    }



    return  FormDetail;
})(_sgQuery);