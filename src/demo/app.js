/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 12/14/13
 * Time: 8:48 PM
 * To change this template use File | Settings | File Templates.
 */

'use strict';

rama.Application.extend('testApplication', function application()
{

    var mainComponent;

    Object.defineProperty(this, "mainComponent",
    {   get : function(){
            return mainComponent;
        },
        set : function(newValue){
            mainComponent = newValue;
        },
        enumerable : true,
        configurable : true
    });

    var testButton;
    Object.defineProperty(this, "testButton",
            {   get : function(){
                return testButton;
            },
                set : function(newValue){
                    testButton = newValue;
                },
                enumerable : true,
                configurable : true
            });


   this.super = function(){
      this._super.super();

   };

    this.skin = "appSkin.html";

    this.skinParts = [{id:'testButton',required:true}, {id:'mainComponent', required:true}];



    this.partAdded = function(partName, instance){

        this._super.partAdded(partName, instance);

        if(instance === this.testButton)
        {
            this.testButton.addEventListener('click', handleTestButtonClick)
        }

        if(instance === this.mainComponent)
        {

        }

    };

    function handleTestButtonClick(){

       mainComponent.style.display = "none";
    }

});


