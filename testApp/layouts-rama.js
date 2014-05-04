/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 2/16/14
 * Time: 12:28 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

rama.LayoutBase.extend("verticalLayout", function(){

    var verticalAlignOptions = {TOP:"top", BOTTOM:"bottom", MIDDLE:"middle"};

    var horizontalAlignOptions = {LEFT:"left", RIGHT:"right", CENTER:"center", JUSTIFY:"justify"};


    this.verticalAlign = 0;

    this.horizontalAlign = 0;


    this.gap = 6;

    this.paddingLeft = 0;

    this.paddingRight = 0;

    this.paddingTop = 0;

    this.paddingBottom = 0;

    this.updateLayout = function(){

    }

});


rama.LayoutBase.extend("horizontalLayout", function(){

    this.updateLayout = function(){

    }

});