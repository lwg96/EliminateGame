cc.Class({
    extends: cc.Component,

    properties: {
        shapeAllNode:{
            default: null,
            type: require("shapeAllNodeManager"),
        },

        item:{
            default: null,
            type: cc.Node
        },

        itemPrefab:{
            default: null,
            type: cc.Prefab
        },

        dropTime: 0.5,
        shapeWidth: 50,
    },

    onLoad: function () {
        this.createNewItem();
        this.itemPos = this.item.getPosition();
        this.tempTime = 0;
        this.shapeAllNode.init();
        
        // X2= X – Y + Y1 Y2 = X + Y –X1
    },


    rotateRightAni:function(){
        this.itemPos = this.item.getPosition();
        let tempX ,tempY;
        let tempPosArr = [];
        let childCount = this.item.childrenCount;
        let child = this.item.children;
        for (let i = 0; i < childCount; i++){
            let x = this.itemPos.x - this.itemPos.y + child[i].y;
            let y = this.itemPos.x + this.itemPos.y - child[i].x;  
            tempPosArr.push({x: x,y:y});
            if (i == 0 || x <= tempX)  {
                tempX = x;
            }
            if (i == 0 || y <= tempY){
                tempY = y;
            }
        }

        if (tempX != 0){
            for (let j = 0; j < tempPosArr.length; j ++){
                tempPosArr[j].x -= tempX;
            }
        }
        if (tempY != 0){
            for (let j = 0; j < tempPosArr.length; j ++){
                tempPosArr[j].y -= tempY;
            }
        }

        if (this.specialCheckCollision(this.item,tempPosArr)){
            for (let t = 0; t < tempPosArr.length; t++){
                child[t].setPosition(tempPosArr[t].x,tempPosArr[t].y);
            }
        }
    },

    leftAni:function(){
        if (this.item.x<= -this.node.width/2){
            cc.log("left allow");
            return;
        }else{
            if (this.checkCollision(this.item,- this.shapeWidth,0)){
                this.item.setPositionX(this.item.getPosition().x - this.shapeWidth);
            }else{
                cc.log("checkCollision left allow");
            } 
        }
        
    },

    rightAni:function(){
        if (this.item.x + this.item.width >= this.node.width/2){
            cc.log("right allow");
            return;
        }else{
            if (this.checkCollision(this.item, this.shapeWidth,0)){
                this.item.setPositionX(this.item.getPosition().x + this.shapeWidth);
            }else{
                cc.log("checkCollision right allow");
            } 
        }
        
    },

    update:function(dt){
        this.rotationBool = true;
        this.tempTime += dt;
        if (this.tempTime > this.dropTime){
            this.rotationBool = false;
            this.tempTime = 0;
            
            if (this.item.y <= (this.node.y - this.node.height/2)){
                this.item.y = this.node.y - this.node.height/2;
                this.destroyItem(this.item);
            }else{
                if (this.checkCollision(this.item,0,-this.shapeWidth)){
                    this.item.setPositionY(this.item.getPosition().y - this.shapeWidth);
                }else{
                    this.destroyItem(this.item);
                }
                
            }
        }    
    },

    //普通移动检查碰撞
    checkCollision:function(item, distanceX, distanceY){
        let bool  = true;
        let child = item.children;
        let childCount = item.childrenCount;
        for (let i = 0; i < childCount; i++){
            let worldPos = child[i].convertToWorldSpaceAR(cc.v2(distanceX,distanceY));
            if (this.shapeAllNode.checkCollision(worldPos)){
                continue;
            }else{
                bool = false;
                break;
            }
        }
        cc.log("checkCollision:",bool);
        return bool;     
    },

    //旋转检查碰撞
    specialCheckCollision:function(item,posArr){
        let bool = true;
        for (let i = 0; i< posArr.length; i++){
            let worldPos = item.convertToWorldSpaceAR(cc.v2(posArr[i].x,posArr[i].y));
            if (this.shapeAllNode.checkCollision(worldPos)){
                continue;
            }else{
                bool = false;
                break;
            }
        }
        cc.log("specialCheckCollision:",bool);
        return bool; 
    },

    destroyItem:function(item){
        let child = item.children;
        let childCount = item.childrenCount;
        cc.log("childCount",childCount);
        for (let i = 0; i < childCount; i++){
            let worldPos = child[i].convertToWorldSpaceAR(cc.v2(0,0));
            this.shapeAllNode.changeData(worldPos,child[i].color);
        }
        item.destroy();

        this.shapeAllNode.checkScore();


        this.createNewItem();
    },

    createNewItem:function(){
        this.item = cc.instantiate(this.itemPrefab);
        this.node.addChild(this.item);
    }
});
