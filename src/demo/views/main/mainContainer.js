/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 2/15/14
 * Time: 9:39 AM
 * To change this template use File | Settings | File Templates.
 */

rama.skinnableComponent.extend("mainContainer", function(){

    this.skin = '/views/controls/skins/mainContainerSkin';

    this.skinParts = [{id:'sidebar',required:true},
        {id:'testLabel',required:true}];


    this.testButton = null;
    this.testLabel = null;
    //this.testProto = "Main Container test proto";

    this.partAdded = function(partName, instance)
    {
        this._super(partName, instance);
        console.log(customVar);
        console.log(this.skinURL);
        if(instance === this.testButton)
        {
            this.testButton.on("click", handleButtonClick)
        }
    };

    this.add = function(element){
        console.log(this.className);
        this._super(this.className);
    };

    function handleButtonClick(event)
    {
        if(this.getCurrentState() === "hideLabel")
        {
            this.setState("showLabel");
        }
        else
        {
            this.setState("hideLabel");
        }
    }

});

