
var demoLibrary = $r.library("demoLibrary");

demoLibrary.skins(
        {skinClass:'MainContainerSkin', skinURL:"views/main/skins/mainContainerSkin.html"},
        {skinClass:'MainComponentSkin', skinURL:"views/main/skins/mainComponentSkin.html"}
);

demoLibrary("testData")(function(){
    this.myDataArray = ["humm", "aaaah", "aha"];
});


demoLibrary("MainContainer").extends($r("SkinnableContainer"))(function(){

    this.skinClass =  demoLibrary.skinClass("MainContainerSkin");

    this.skinParts = [{id:'testButton', required:true}];

    this.testButton = null;

    var testModel =  demoLibrary.new("testData");
    var testingEventDispatcher = $r.new('EventDispatcher');

    var _contentGroup = null;

    this.partAdded = function(partName, instance)
    {
        this._super(partName, instance);


        if(instance === this.testButton)
        {
            this.testButton.addEventListener('click', handleTestButtonClick);

            testingEventDispatcher.addEventListener('myEvent', handleMyEvent);
        }

        if(instance === this.contentGroup)
        {
            _contentGroup = instance;
        }

    };

    function handleTestButtonClick(clickEvent){
        var customEvent = $r.new("Event",["myEvent", true,false]);

        testingEventDispatcher.dispatchEvent(customEvent.eventObject);
    }

    function handleMyEvent(event){

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


