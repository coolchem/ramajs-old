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

   this.super = function(){
      this.skin = "appSkin.html";
   };

   this.skinParts = [{id:'testButton',required:true}, {id:'mainComponent', required:true}];
   this.mainComponent = null;
   this.testButton = null;

   var mainComponent = null;
   var testButton = null;

    this.partAdded = function(partName, instance){

        this._super(partName, instance);

        if(instance === this.testButton)
        {
            testButton = this.testButton;
            this.testButton.addEventListener('click', handleTestButtonClick)
        }

        if(instance === this.mainComponent)
        {
            mainComponent = this.mainComponent;
        }

    };

    function handleTestButtonClick(){

       mainComponent.style.display = "none";
    }

});


