cc.Class({
    extends: cc.Component,

    properties: {
        shapeAllNode:{
            default: null,
            type: require("shapeAllNodeManager"),
        },

        itemPrefabs:{
            default: [],
            type: [cc.Prefab]
        },

        gameOver:{
            default: null,
            type: cc.Node
        },

        dropTime: 0.5,
    },

    onLoad:function(){

    },

    init: function () {
        cc.log("222222222222222222222222222222");
        this.gameOver.active = false;
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
        cc.log ("rotateRightAni:1",this.specialCheckCollision(this.item,tempPosArr));
        cc.log ("rotateRightAni:2",this.checkRotationCollision(this.item,tempPosArr));

        if (this.specialCheckCollision(this.item,tempPosArr) && this.checkRotationCollision(this.item,tempPosArr)){
            
            for (let t = 0; t < tempPosArr.length; t++){
                child[t].setPosition(tempPosArr[t].x,tempPosArr[t].y);
            }   
        }
    },

    checkRotationCollision:function(item,posArr){
        let bool  = true;
        let tempDistance = -1;
        if (item.x + item.width > this.node.width/2 ){
            for (let i = 0; i< posArr.length; i++){
                let worldPos = item.convertToWorldSpaceAR(cc.v2(posArr[i].x,posArr[i].y));
                let localPos = this.node.convertToNodeSpaceAR(worldPos);
                let beyondDistance = localPos.x + GAME_CONFIG.shapeWidth - this.node.width/2;
                if (beyondDistance > 0){
                    bool = false;
                    if (beyondDistance > tempDistance){
                        tempDistance = beyondDistance;
                    }                   
                }
            }
        }
        let tempPosArr = [];
        let specialBool = false;
        if (!bool && tempDistance != -1 ){
            for (let i = 0; i < posArr.length; i++){
                tempPosArr[i] = {};
                tempPosArr[i].x = posArr[i].x - tempDistance ;
                tempPosArr[i].y = posArr[i].y;
            }
            let specialBool = this.specialCheckCollision(item,tempPosArr);
            if (specialBool){
                item.setPositionX(item.getPosition().x - tempDistance);
            }
        }
        cc.log("checkRotationCollision:1",JSON.stringify(posArr));
        cc.log("checkRotationCollision:2",JSON.stringify(tempPosArr));

        cc.log("checkRotationCollision:----",bool,specialBool,tempDistance);

        return bool || specialBool;
    },

    leftAni:function(){
        if (this.item.x<= -this.node.width/2){
            cc.log("left allow");
            return;
        }else{
            if (this.checkCollision(this.item,- GAME_CONFIG.shapeWidth,0)){
                this.item.setPositionX(this.item.getPosition().x - GAME_CONFIG.shapeWidth);
            }else{
                cc.log("checkCollision left allow");
            } 
        }
        
    },

    rightAni:function(){
        if (this.item.x + this.item.width >= this.node.width/2){
            cc.log("right allow");
            if (this.checkRightCollision(this.item)){
                this.item.setPositionX(this.item.getPosition().x + GAME_CONFIG.shapeWidth);
            }
            return;
        }else{
            if (this.checkCollision(this.item, GAME_CONFIG.shapeWidth,0)){
                this.item.setPositionX(this.item.getPosition().x + GAME_CONFIG.shapeWidth);
            }else{
                cc.log("checkCollision right allow");
            } 
        }
        
    },

    checkRightCollision:function(item){
        let bool  = true;
        let child = item.children;
        let childCount = item.childrenCount;
        cc.log("checkRightCollision:",childCount);
        for (let i = 0; i< childCount; i++){
            let worldPos = item.convertToWorldSpaceAR(cc.v2(child[i].x + GAME_CONFIG.shapeWidth,child[i].y));
            let localPos = this.node.convertToNodeSpaceAR(worldPos);
            cc.log("checkRightCollision: localPos = ",localPos, " this.node.width /2 =  ",this.node.width/2);
            if (localPos.x >= this.node.width/2){
                bool = false;
            }
        }
        return bool;
    },

    

    update:function(dt){
        if (this.gameOver.active){
            return;
        }
        this.rotationBool = true;
        this.tempTime += dt;
        if (this.tempTime > this.dropTime){
            this.rotationBool = false;
            this.tempTime = 0;
            
            if (this.item.y <= (this.node.y - this.node.height/2)){
                this.item.y = this.node.y - this.node.height/2;
                this.destroyItem(this.item);
            }else{
                if (this.checkCollision(this.item,0,-GAME_CONFIG.shapeWidth)){
                    this.item.setPositionY(this.item.getPosition().y - GAME_CONFIG.shapeWidth);
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

        if (item.getPosition().y >= this.node.height/2 - this.item.height){
            this.gameOver.active = true;
        }else{
            this.createNewItem();
        }  
    },

    restart:function(){
        this.gameOver.active = false;
        this.tempTime = 0;
        this.shapeAllNode.init();
        this.createNewItem();
        this.itemPos = this.item.getPosition();
    },

    createNewItem:function(){
        //Math.random() 不包括1
        if(this.item){
            this.item.destroy();
        }
        let random = Math.floor(Math.random()*3);
        this.item = cc.instantiate(this.itemPrefabs[random]);
        this.node.addChild(this.item);
        this.item.setPositionY(this.node.height/2 - this.item.height);
        this.dropTime = 0.5;
    },


    dropNow:function(){
        this.dropTime = 0.01;
    }
});
