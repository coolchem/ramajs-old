var demoPackage = $r.package("demoPackage");

demoPackage.skins(
        {skinClass:'MainContainerSkin', skinURL:"views/main/skins/mainContainerSkin.html"},
        {skinClass:'MainComponentSkin', skinURL:"views/main/skins/mainComponentSkin.html"}
);

demoPackage.Class("TestModel")(function () {

    var _testProp = "super"
    this.get("testProp", function(){
        return _testProp;
    })

    this.set("testProp", function(value){
        _testProp = value;
    })

});

demoPackage.Class("MyEvent").extends($r.Class("Event"))(function () {
    var superCount = 0;
    this.MyEvent = function () {
        this.super("myEvent", true, false);
    };

});

demoPackage.Class("TestModel1").extends(demoPackage.Class("TestModel"))(function () {

    var _baseTestProp = "Base"
    this.get("testProp", function(){
        return _baseTestProp + this.super.testProp;
    })

    this.set("testProp", function(value){
        this.super.testProp = value;
        _baseTestProp = "humm";
    })

});


demoPackage.Class("MainContainer").extends($r.Class("Container"))(function () {

    //this.skinClass = "demoPackage.MainContainerSkin";

    this.skinParts = [
        {id:'testButton', required:true}
    ];

    this.testButton = null;

    //var testModel =  $r.new("TestModel");
    var testModel1 = demoPackage.new("TestModel1");

    var testingEventDispatcher = $r.new('EventDispatcher');

    var _contentGroup = null;

    this.partAdded = function (partName, instance) {
        this.super.partAdded(partName, instance);


        if (instance === this.testButton) {
            this.testButton.addEventListener('click', $r.bindFunction(handleTestButtonClick, this));

            //testingEventDispatcher.addEventListener('myEvent', handleMyEvent);
            //handleMyEvent.bind(this);
        }

        if (instance === this.contentGroup) {
            _contentGroup = instance;
        }

    };

    function handleTestButtonClick(clickEvent) {

        console.log(testModel1.testProp);
        testModel1.testProp = "wow";
        console.log(testModel1.testProp);

        if(this.currentState === "open")
        {
            this.currentState = "close";
        }
        else
        {
            this.currentState = "open";
        }

        //var customEvent = demoLibrary.new("MyEvent");

        //testingEventDispatcher.dispatchEvent(customEvent.eventObject);
    }

    var handleMyEvent = function (event) {

        if (_contentGroup) {
            if (_contentGroup.currentState === "open") {
                _contentGroup.display = "";
                return;
            }

            _contentGroup.display = "none";
        }
    }
});


$r.Class("MainComponent").extends($r.Class("Component"))(function () {

    this.MainComponent = function(){
        this.super();
        console.log("I am MainComponent")
    };
    this.skinClass = "demoPackage.MainComponentSkin";

    this.skinParts = [];

    var _testAttr = ""

    this.get("testAttr", function () {

        return _testAttr;
    });

    this.set("testAttr", function (newValue) {
        _testAttr = newValue;
        console.log(_testAttr);
    })

    this.partAdded = function (partName, instance) {
        this.super.partAdded(partName, instance);
    };

});


