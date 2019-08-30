cc.Class({
    extends: cc.Component,

    properties: {
        useIndex: 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    init:function(){
        this.node.color = cc.Color.GRAY;
        this.useIndex = 0;
    },

    setColor:function(color, changBool){
        this.node.color = color;
        if (changBool){
            this.useIndex = 1;
        }else{
            this.useIndex = 0;
        }
    },

    getUserIndex:function(){
        return this.useIndex;
    }

});
