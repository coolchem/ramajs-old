/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 2/15/14
 * Time: 9:39 AM
 * To change this template use File | Settings | File Templates.
 */

var demoLibrary = rama.library("demoLibrary");

demoLibrary.skins(
        {Class:'MainContainerSkin', skinURL:"views/main/skins/mainContainerSkin.html"},
        {Class:'MainComponentSkin', skinURL:"views/main/skins/mainComponentSkin.html"}
);

demoLibrary.SkinnableContainer.extend("MainContainer", function(){

    this.skinClass =  "demoLibrary:MainContainerSkin";

    this.skinParts = [{id:'testButton', required:true}];

    this.testButton = null;

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


rama.SkinnableComponent.extend("MainComponent", function(){

     this.skinClass =  "demoLibrary:MainComponentSkin";

     this.skinParts = [];

     this.partAdded = function(partName, instance)
     {
        this._super(partName, instance);
     };

});


