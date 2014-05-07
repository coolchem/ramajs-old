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

$r.Application('testApplication', function()
{
    this.testApplication = function(){
        this.super();
    }
    this.skinClass = $r.skinClass("AppSkin");

    this.skinParts = [{id:'mainComponent', required:true}];

    this.mainComponent = null;


});


