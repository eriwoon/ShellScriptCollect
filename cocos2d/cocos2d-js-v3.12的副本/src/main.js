window.onload = function(){
    cc.game.onStart = function(){
        //load resources
        cc.LoaderScene.preload(["HelloWorld.png"], function () {
          var MyScene = cc.Scene.extend({
            onEnter:function () {
              this._super();
              var size = cc.director.getWinSize();
              var sprite = cc.Sprite.create("HelloWorld.png");
              sprite.setPosition(size.width / 2, size.height / 2);
              sprite.setScale(0.8);
              this.addChild(sprite, 0);

              var label = cc.LabelTTF.create("Hello World", "Arial", 40);
              label.setPosition(size.width / 2, size.height / 2);
              this.addChild(label, 1);
            }
          });
          //cc.director.runScene(new MyScene());
          cc.director.runScene(new startScene());
        }, this);
    };
    cc.game.run("gameCanvas");
};

var startLayer = cc.Layer.extend({
  ctor:function(){
    this._super();
    this.size = cc.winSize;

    this.count = 0;
    this.helloLabel = null;
    this.scheduleUpdateCount = 0;
    this.scheduleUpdateLabel = null;


    
    this.scheduleUpdate();
    this.schedule(this.updateSchedule, 1);
  },
  update: function(){
    if(this.helloLabel != null)
        this.removeChild(this.helloLabel);
    this.count++;
    this.helloLabel = new cc.LabelTTF.create("Scheduler 每帧一次:" + this.count, 38);
    this.helloLabel.setColor(new cc.color(0,0,0));
    this.helloLabel.x = this.size.width/2;
    this.helloLabel.y = this.size.height/2;
    this.addChild(this.helloLabel);
  },
  updateSchedule: function(){
    if(this.scheduleUpdateLabel != null)
        this.removeChild(this.scheduleUpdateLabel);
    this.scheduleUpdateCount ++;
    this.scheduleUpdateLabel = new cc.LabelTTF.create("Scheduler 每秒一次:" + this.scheduleUpdateCount, 38);
    this.scheduleUpdateLabel.setColor(new cc.color(0,0,0));
    this.scheduleUpdateLabel.x = this.size.width/2;
    this.scheduleUpdateLabel.y = this.size.height/2 - 20;
    this.addChild(this.scheduleUpdateLabel);
  }
});

var startScene = cc.Scene.extend({
  onEnter:function(){
    this._super();
    var layer = new startLayer();
    this.addChild(layer);
  }
})