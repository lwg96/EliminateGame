var gameConfig = require("gameConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        middleNode:{
            default: null,
            type: require("controlManager")
        }
    },

    // use this for initialization
    onLoad: function () {
        cc.log("1111111111111111111111111111");
        
        window.GAME_CONFIG = gameConfig;
        this.middleNode.init();
    },

    
});
