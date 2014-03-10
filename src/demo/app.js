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


    var contentGroup;
    Object.defineProperty(this, "contentGroup",
            {   get : function(){
                return contentGroup;
            },
                set : function(newValue){
                    contentGroup = newValue;
                },
                enumerable : true,
                configurable : true
            });


   this.super = function(){
      this._super();

   };

    this.skin = "appSkin.html";

    this.skinParts = [{id:'testButton',required:true}, {id:'mainComponent', required:true},
                     {id:'contentGroup'}];



    this.partAdded = function(partName, instance){

        this._super(partName, instance);

        if(instance === this.testButton)
        {
            this.testButton.addEventListener('click', handleTestButtonClick)
        }

        if(instance === this.mainComponent)
        {
           console.log(mainComponent);
        }

    };

    function handleTestButtonClick(){

        if(mainComponent.style.display === "none")
        {
            mainComponent.style.display = "";
            return;
        }

       mainComponent.style.display = "none";

      if(contentGroup)
      {
          var mainComp = new rama.MainComponent();
          contentGroup.addElement(mainComp);
      }
    }

});


