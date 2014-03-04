/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 2/15/14
 * Time: 9:39 AM
 * To change this template use File | Settings | File Templates.
 */

rama.SkinnableComponent.extend("MainComponent", function(){

    this.skin = 'views/main/skins/mainComponentSkin.html';
    this.skin1 = "views/main/skins/mainComponentSkin.html";

    this.skinParts = [];


    this.mainModuleNavigator = null;
    this.mainModuleNavigationContainer = null;

    this.partAdded = function(partName, instance)
    {
        this._super.partAdded(partName, instance);
        if(instance === this.mainModuleNavigator)
        {
            this.mainModuleNavigator.on("changeModule", handleChangeModule)
        }
    };

    function handleChangeModule(event)
    {

    }

});

rama.list.extend("moduleNavigator", function(){

    this.skin = '/views/main/skins/mainComponentSkin.html';

    this.skinParts = [{id:'mainModuleNavigator',required:true},
        {id:'mainModuleNavigationContainer',required:true}];


    this.mainModuleNavigator = null;
    this.mainModuleNavigationContainer = null;

    this.partAdded = function(partName, instance)
    {
        this._super.partAdded(partName, instance);
        if(instance === this.mainModuleNavigator)
        {
            this.mainModuleNavigator.on("changeModule", handleChangeModule)
        }
    };

    function handleChangeModule(event)
    {

    }

});

rama.SkinnableComponent.extend("moduleNavigationContainer", function(){

    this.skin = '/views/main/skins/mainComponentSkin.html';

    this.skinParts = [{id:'mainModuleNavigator',required:true},
        {id:'mainModuleNavigationContainer',required:true}];


    this.mainModuleNavigator = null;
    this.mainModuleNavigationContainer = null;

    this.partAdded = function(partName, instance)
    {
        this._super.partAdded(partName, instance);
        if(instance === this.mainModuleNavigator)
        {
            this.mainModuleNavigator.on("changeModule", handleChangeModule)
        }
    };

    function handleChangeModule(event)
    {

    }

});

