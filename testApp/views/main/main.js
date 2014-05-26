var demoPackage = $r.package("demoPackage");

demoPackage.skins(
        {skinClass:'MainContainerSkin', skinURL:"views/main/skins/mainContainerSkin.html"},
        {skinClass:'MainComponentSkin', skinURL:"views/main/skins/mainComponentSkin.html"},
        {skinClass:'TestItemRendererSkin', skinURL:"views/main/skins/testItemRendererSkin.html"}
);

demoPackage.TestModel = $r.extend("Class",function () {

    var _testProp = "super"
    this.get("testProp", function(){
        return _testProp;
    })

    this.set("testProp", function(value){
        _testProp = value;
    })

});

demoPackage.MyEvent = $r.extend("Event", function () {

    this.classConstructor = function () {
        this.super("myEvent", true, false);
    };

});

demoPackage.TestModel1 = $r.extend("demoPackage.TestModel", function () {

    var _baseTestProp = "Base"
    this.get("testProp", function(){
        return _baseTestProp + this.super.testProp;
    })

    this.set("testProp", function(value){
        this.super.testProp = value;
        _baseTestProp = "humm";
    })

});

demoPackage.MainContainer = $r.extend("Container", function () {

    //this.skinClass = "demoPackage.MainContainerSkin";

    this.skinParts = [
        {id:'testButton', required:true},
        {id:'testViewStack', required:true}
    ];

    this.testButton = null;
    this.testViewStack = null;

    //var testModel =  $r.new("TestModel");
    var testModel1 = new demoPackage.TestModel1();

    var testingEventDispatcher = new $r.EventDispatcher();

    var _contentGroup = null;

    this.partAdded = function (partName, instance) {
        this.super.partAdded(partName, instance);


        if (instance === this.testButton) {
            this.testButton.addEventListener('click', $r.bindFunction(handleTestButtonClick, this));

            //testingEventDispatcher.addEventListener('myEvent', handleMyEvent);
            //handleMyEvent.bind(this);
        }

        if (instance === this.testViewStack) {
            this.testViewStack.htmlContent = this.htmlContent;
        }

    };

    function handleTestButtonClick(clickEvent) {

        if(this.testViewStack.selectedIndex + 1 === this.testViewStack.elements.length)
        {
            this.testViewStack.selectedIndex = 0;
        }
        else
        {
            this.testViewStack.selectedIndex = this.testViewStack.selectedIndex + 1;
        }
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
})

demoPackage.TestItemRenderer = $r.extend("Component", function(){

    this.skinClass = "demoPackage.TestItemRendererSkin";

    this.skinParts = [
        {id:'label1'},
        {id:'label2', required:true}
    ];

    this.label1 = null;
    this.label2 = null;
    var _data;
    this.get("data", function(){
        return _data;
    })

    this.set("data", function(value){
        this.super.data = value;
        _data = value;
        if(_data)
        {
            if(this.label1)
                this.label1.textContent = _data.viewid;
            if(this.label2)
                this.label2.textContent = _data.viewName;
        }
    })

    this.partAdded = function (partName, instance) {
        this.super.partAdded(partName, instance);

        if(instance === this.label1)
        {
            if(_data)
                this.label1.textContent = _data.viewid;
        }

        if(instance === this.label2)
        {
            if(_data)
                this.label2.textContent = _data.viewName;
        }
    }


})

demoPackage.MainComponent = $r.extend("Component", function () {

    this.classConstructor = function(){
        this.super();
    };
    this.skinClass = "demoPackage.MainComponentSkin";

    this.skinParts = [
        {id:'contentGroup', required:true},
        {id:'contentGroup1', required:true}
    ];

    var _myHTMLContent = []

    this.get("myHtmlContent", function () {

        return _myHTMLContent;
    });

    this.set("myHtmlContent", function (newValue) {
        _myHTMLContent = newValue;
    })

    var _myHTMLContent1 = []

    this.get("myHtmlContent1", function () {

        return _myHTMLContent1;
    });

    this.set("myHtmlContent1", function (newValue) {
        _myHTMLContent1 = newValue;
    })

    this.partAdded = function (partName, instance) {
        this.super.partAdded(partName, instance);

        if (instance === this.contentGroup) {
            this.contentGroup.htmlContent = _myHTMLContent;
        }

        if (instance === this.contentGroup1) {
            this.contentGroup1.htmlContent = _myHTMLContent1;
        }
    };

})



