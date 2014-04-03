
var demoLibrary = $r.library("demoLibrary");

demoLibrary.skins(
        {Class:'MainContainerSkin', skinURL:"views/main/skins/mainContainerSkin.html"},
        {Class:'MainComponentSkin', skinURL:"views/main/skins/mainComponentSkin.html"}
);

demoLibrary("testData")(function(){
    this.myDataArray = ["humm", "aaaah", "aha"]
});


demoLibrary("MainContainer").extends($r("SkinnableContainer"))(function(){

    this.skinClass =  demoLibrary.skinClass("MainContainerSkin");

    this.skinParts = [{id:'testButton', required:true}];

    this.testButton = null;

    var testingData = new demoLibrary.Class("testData")();

    var _contentGroup = null;

    this.partAdded = function(partName, instance)
    {
        this._super(partName, instance);


        if(instance === this.testButton)
        {
            this.testButton[0].addEventListener('click', handleTestButtonClick)
        }

        if(instance === this.contentGroup)
        {
            _contentGroup = instance;
        }

    };

    function handleTestButtonClick(){

        if(_contentGroup)
        {
            if(_contentGroup[0].style.display === "none")
            {
                _contentGroup[0].style.display = "";
                return;
            }

            _contentGroup[0].style.display = "none";
        }
    }
});


$r("MainComponent").extends($r("SkinnableComponent"))(function(){

     this.skinClass =  demoLibrary.skinClass("MainComponentSkin");

     this.skinParts = [];

     this.partAdded = function(partName, instance)
     {
        this._super(partName, instance);
     };

});


