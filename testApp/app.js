/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 12/14/13
 * Time: 8:48 PM
 * To change this template use File | Settings | File Templates.
 */

'use strict';


$r.skins(
        {skinClass:'AppSkin', skinURL:"appSkin.html"}
);

$r.Class("Event1")(function (name, bubbles, cancellable) {

    this.event = null; // The custom event that will be created

    if (document.createEvent) {
        this.event = document.createEvent("HTMLEvents");
    } else {
        this.event = document.createEventObject();
    }

    this.init = function (name, bubbles, cancellable) {

        if (document.createEvent) {
            this.event.initEvent(name, bubbles, cancellable);
        } else {
            this.event.eventType = name;
        }

        this.event.eventName = name;
    };

} )

$r.Application('TestApplication', function()
{

    this.testButton = null;

    var dataProvider = new $r.ArrayList([
        {
            viewid:"homeView",
            viewName:"Home",
            iconClass:"home-icon"
        },

        {
            viewid:"documentationView",
            viewName:"Documentation",
            iconClass:"doc-icon"
        },

        {
            viewid:"tutorialsView",
            viewName:"Tutorials",
            iconClass:"home-icon",
            subViews:[
                {
                    viewid:"helloWorld",
                    viewName:"Hello World and much more",
                },
                {
                    viewid:"todoApp",
                    viewName:"Write a TODO App",
                }
            ]
        }
    ])

    this.init = function(){
        this.super.init();
    }
    this.skinClass = "$r.AppSkin";

    this.skinParts = [{id:'testButton', required:true},
        {id:'testDataGroup', required:true}];

    this.mainComponent = null;
    this.testDataGroup = null;

    this.partAdded = function (partName, instance) {
        this.super.partAdded(partName, instance);

        if (instance === this.testButton) {
            this.testButton.addEventListener('click', $r.bindFunction(handleTestButtonClick, this));

            //testingEventDispatcher.addEventListener('myEvent', handleMyEvent);
            //handleMyEvent.bind(this);
        }

        if (instance === this.testDataGroup) {

            this.testDataGroup.dataProvider = dataProvider;
        }
    };

    function handleTestButtonClick(clickEvent) {

        dataProvider.removeItemAt(0);
    };


});


