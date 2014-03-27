/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 12/14/13
 * Time: 8:48 PM
 * To change this template use File | Settings | File Templates.
 */

'use strict';

rama.skins(
        {Class:'AppSkin', skinURL:"appSkin.html"}
);

rama.Application.extend('testApplication', function application()
{

   this.super = function(){
      this._super();

   };

    this.skinClass = "AppSkin";

    this.skinParts = [{id:'mainComponent', required:true}];

    this.mainComponent = null;


});


