cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        score:0,
    },
    
    reward:0,
    // use this for initialization
    onLoad: function () {
    },
    setReward:function(reward){
        this.reward=reward;
        
    },
    updateScore:function(){
        var com=this.node.getComponent(cc.Label);
        
        this.score+=this.reward;
        
        com.string="Score:"+this.score;
        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
