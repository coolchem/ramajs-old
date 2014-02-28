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
   this.skin = "appSkin.html";
   this.skinParts = [{id:'mainContainer',required:true}];

   this.mainContainer = null;

   this.partAdded = function(partName, instance){
       this._super(partName, instance);
       if(instance === this.mainContainer)
       {
           this.mainContainer.on("click", handleButtonClick)
       }
   };

   function handleButtonClick(event)
   {

   }

});


