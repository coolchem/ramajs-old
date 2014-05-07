var demoLibrary = $r.library("demoLibrary");

demoLibrary.skins(
        {skinClass:'MainContainerSkin', skinURL:"views/main/skins/mainContainerSkin.html"},
        {skinClass:'MainComponentSkin', skinURL:"views/main/skins/mainComponentSkin.html"}
);

demoLibrary.Class("TestModel")(function () {

    var _testProp = "super"
    this.get("testProp", function(){
        return _testProp;
    })

    this.set("testProp", function(value){
        _testProp = value;
    })

});

demoLibrary.Class("MyEvent").extends($r.Class("Event"))(function () {
    var superCount = 0;
    this.MyEvent = function () {
        this.super("myEvent", true, false);
    };

});

demoLibrary.Class("TestModel1").extends(demoLibrary.Class("TestModel"))(function () {

    var _baseTestProp = "Base"
    this.get("testProp", function(){
        return _baseTestProp + this.super.testProp;
    })

    this.set("testProp", function(value){
        this.super.testProp = value;
        _baseTestProp = "humm";
    })

});


demoLibrary.Class("MainContainer").extends($r.Class("SkinnableContainer"))(function () {

    this.skinClass = demoLibrary.skinClass("MainContainerSkin");

    this.skinParts = [
        {id:'testButton', required:true}
    ];

    this.testButton = null;

    //var testModel =  $r.new("TestModel");
    var testModel1 = demoLibrary.new("TestModel1");

    var testingEventDispatcher = $r.new('EventDispatcher');

    var _contentGroup = null;

    this.partAdded = function (partName, instance) {
        this.super.partAdded(partName, instance);


        if (instance === this.testButton) {
            this.testButton.addEventListener('click', handleTestButtonClick);

            testingEventDispatcher.addEventListener('myEvent', handleMyEvent);
            handleMyEvent.bind(this);
        }

        if (instance === this.contentGroup) {
            _contentGroup = instance;
        }

    };

    function handleTestButtonClick(clickEvent) {

        console.log(testModel1.testProp);
        testModel1.testProp = "wow";
        console.log(testModel1.testProp);
        var customEvent = demoLibrary.new("MyEvent");

        testingEventDispatcher.dispatchEvent(customEvent.eventObject);
    }

    var handleMyEvent = function (event) {

        if (_contentGroup) {
            if (_contentGroup[0].style.display === "none") {
                _contentGroup[0].style.display = "";
                return;
            }

            _contentGroup[0].style.display = "none";
        }
    }
});


$r.Class("MainComponent").extends($r.Class("SkinnableComponent"))(function () {

    this.MainComponent = function(){
        this.super();
        console.log("I am MainComponent")
    };
    this.skinClass = demoLibrary.skinClass("MainComponentSkin");

    this.skinParts = [];

    var _testAttr = ""

    this.get("testAttr", function () {
        return _testAttr;
    });

    this.set("testAttr", function (newValue) {
        _testAttr = newValue;
    })

    this.partAdded = function (partName, instance) {
        this.super.partAdded(partName, instance);
    };

});


