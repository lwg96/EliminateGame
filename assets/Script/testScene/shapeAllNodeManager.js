cc.Class({
    extends: cc.Component,

    properties: {
        shapePrefab:{
            default: null,
            type: cc.Prefab
        },

    },
    onLoad:function(){
        this.parentWidth = this.node.parent.width;
        this.parentHeight = this.node.parent.height;
    },

    init:function(){

        let shapeItemArr = [];
        for (let i = 0; i < 12; i++){
            let shapeItem = [];
            for (let j = 0; j < 12; j++){
                let item = cc.instantiate(this.shapePrefab);
                this.node.addChild(item);
                item.setPosition(item.width * j, item.height*i);
                item.getComponent("shapeItem").init();
                shapeItem.push(item);
            }
            shapeItemArr.push(shapeItem);
        };
        this.shapeItemArr = shapeItemArr;
        
    },

    changeData:function(pos,color){
        let localPos = this.node.convertToNodeSpaceAR(pos);
        let i = Math.floor(localPos.y/50);
        let j = Math.floor(localPos.x/50);
        cc.log("changeData:", i ,"changeData:",j);
        this.shapeItemArr[i][j].getComponent("shapeItem").setColor(color,true);        
    },

    getAllShapeUseIndex:function(){
        let userIndexArr = [];
        for (let i = 0; i< this.shapeItemArr.length; i++){
            let userIndexCol = [];
            for (let j = 0; j < this.shapeItemArr[i].length; j++){
                let index = this.shapeItemArr[i][j].getComponent("shapeItem").getUserIndex();
                userIndexCol.push(index);
            }
            userIndexArr.push(userIndexCol);
        }
        return userIndexArr;
    },

    checkCollision:function(pos){
        let localPos = this.node.convertToNodeSpaceAR(pos);
        let i = Math.floor(localPos.y/50);
        let j = Math.floor(localPos.x/50);
        let userIndexArr = this.getAllShapeUseIndex();
        if (userIndexArr[i][j] == 1){
            return false;
        }else{
            return true;
        }
    },

    checkScore:function(){
        let scoreLine = [];
        let userIndexArr = this.getAllShapeUseIndex();
        for (let i = 0; i < this.shapeItemArr.length; i++ ){
            let count = 0;
            for (let j = 0; j < this.shapeItemArr[i].length; j++){
               count += userIndexArr[i][j];
            }
            if (count == this.shapeItemArr[i].length){
                scoreLine.push(i);
            }
        }




        for (let t = 0; t < scoreLine.length; t++){
            scoreLine[t].getComponent("shapeItem").setColor(cc.Color.GRAY);
        }
    }

});
