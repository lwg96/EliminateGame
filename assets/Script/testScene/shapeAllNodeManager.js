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
        for (let i = 0; i < GAME_CONFIG.allRows; i++){
            let shapeItem = [];
            for (let j = 0; j < GAME_CONFIG.allRows; j++){
                let item = cc.instantiate(this.shapePrefab);
                this.node.addChild(item);
                item.setPosition(item.width * j, item.height*i);
                item.getComponent("shapeItem").init();
                if (i > GAME_CONFIG.topRows){
                    item.getComponent("shapeItem").setColor(cc.Color.BLACK);
                }
                shapeItem.push(item);
            }
            shapeItemArr.push(shapeItem);
        };
        this.shapeItemArr = shapeItemArr;
        
    },

    changeData:function(pos,color){
        let localPos = this.node.convertToNodeSpaceAR(pos);
        let i = Math.floor(localPos.y/GAME_CONFIG.shapeHeight);
        let j = Math.floor(localPos.x/GAME_CONFIG.shapeWidth);
        cc.log("changeData:", i ,"changeData:",j);
        if(i > GAME_CONFIG.topRows){
            this.shapeItemArr[i][j].getComponent("shapeItem").setColor(cc.Color.BLACK);
        }else{
            this.shapeItemArr[i][j].getComponent("shapeItem").setColor(color,true);        
        }
        
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

    getTopRowNumber:function(){
        let topRow = 0;
        let userIndexArr = this.getAllShapeUseIndex();
        for (let i = 0; i< userIndexArr.length; i++){
            for (let j = 0;j < userIndexArr[i].length; j++){
                if(userIndexArr[i][j] == 1){
                    topRow = i;
                    break;
                }
            }
        }
        return topRow;
    },

    checkCollision:function(pos){
        let localPos = this.node.convertToNodeSpaceAR(pos);
        let i = Math.floor(localPos.y/GAME_CONFIG.shapeHeight);
        let j = Math.floor(localPos.x/GAME_CONFIG.shapeWidth);
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
            for (let p = 0; p < this.shapeItemArr[scoreLine[t]].length; p++){
                this.shapeItemArr[scoreLine[t]][p].getComponent("shapeItem").setColor(cc.Color.GRAY);
            } 
        }

        for (let t = scoreLine.length -1 ; t>=0;t--){
            this.resfreshAllNode(scoreLine[t]);
        }
        
    },

    resfreshAllNode:function(lowRow){

        let topRow = this.getTopRowNumber();
        cc.log("resfreshAllNode: ",lowRow ," topRow: ",topRow );
        for (let i = lowRow ;i <= topRow; i++){
            for (let j = 0; j < this.shapeItemArr[i].length; j++){
                if (i == topRow){
                    this.shapeItemArr[i][j].getComponent("shapeItem").setColor(cc.Color.GRAY);
                }else{
                    let color = this.shapeItemArr[i+1][j].getComponent("shapeItem").getColor();
                    let index = this.shapeItemArr[i+1][j].getComponent("shapeItem").getUserIndex();
                    this.shapeItemArr[i][j].getComponent("shapeItem").setColor(color,index);
                }
            }
        }
    },

});
