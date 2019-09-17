(function () {
    var list ={};
	var __EventMgr = {
        //注册消息
         on:function(key,func,node) {
            if(list[key] == null){
                list[key] =[];
            }
            var data = {};
            data.func =func;
            data.node = node;
            list[key].push(data);
        },
        //移除一个消息
         remove:function(key,func,node) {
            if(list[key]){
                var data = list[key];
                for(var i=0; i<data.length;i++){
                    if(data[i].node == node && data[i].func == func)
                    {
                         data.splice(i,1);
                         --i;
                    }
                }
            }
            // list[key].push(func);
        },
        //移除node所有消息
        removeByNode:function(node) {
            for ( var p in list ){ 
                var data = list[p];
                for(var i=0; i<data.length;i++){
                    if(data[i].node == node)
                    {
                         data.splice(i,1);
                         --i;
                    }
                }
            } 
        },
        //移除key注册的所有消息
        removeByKey:function(key) {
            delete  list[key];
        },
        //遍历通知消息
         emit:function (key,arg) {
            if(list[key]){
                var funcs = list[key].concat();
                for(var i=0;i<funcs.length;i++){
                    // if((funcs[i].node instanceof cc.Component))
                    // {
                        if( cc.isValid (funcs[i].node) ){//node或者component对象没有被销毁并且不为空null
                            funcs[i].func(arg,funcs[i].node);
                        }
                    // }
                    // else{
                    //     funcs[i].func(arg,funcs[i].node);
                    // }
                }
            }
        }
    };
    window.GlobalEventManager = __EventMgr; 
})();
