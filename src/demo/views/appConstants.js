
function appConstants () {

  var modules = [

    {
      moduleName:"Home",
      moduleId:"home",
      iconClass:"icon-home2",
      subModules:[
        {
          moduleName:"Dashboard",
          moduleId:"dashboard",
          iconClass:"icon icon-home2",
          subModules:[]
        },
        {
          moduleName:"Profile",
          moduleId:"profile",
          iconClass:"icon icon-lab",
          subModules:[]
        },

        {
          moduleName:"Settings",
          moduleId:"settings",
          iconClass:"icon icon-uniF5CA",
          subModules:[]
        }
      ]
    },

    {
      moduleName:"Health",
      moduleId:"myHealth",
      iconClass:"icon-aid",
      subModules:[
        {
          moduleName:"Medications",
          moduleId:"medications",
          iconClass:"icon icon-pill",
          subModules:[]
        },
        {
          moduleName:"Lab Results",
          moduleId:"labResults",
          iconClass:"icon icon-lab",
          subModules:[]
        },

        {
          moduleName:"Diagnosis",
          moduleId:"diagnosis",
          iconClass:"icon icon-uniF5CA",
          subModules:[]
        },

        {
          moduleName:"Allergies",
          moduleId:"allergies",
          iconClass:"icon icon-bug",
          subModules:[]
        }

      ]
    },

    {
      moduleName:"Messages",
      moduleId:"messages",
      iconClass:"icon icon-mail",
      subModules:[
        {
          moduleName:"Inbox",
          moduleId:"inbox",
          iconClass:"icon icon-home2",
          subModules:[]
        },
        {
          moduleName:"Sent",
          moduleId:"sent",
          iconClass:"icon icon-lab",
          subModules:[]
        },

        {
          moduleName:"Drafts",
          moduleId:"drafts",
          iconClass:"icon icon-uniF5CA",
          subModules:[]
        }
      ]
    }
  ];


  this.loadModule = function (stateId) {

    actionTransferBus.dispatchAction(actionTransferBus.viewActions.VIEW_ACTION_CHANGE_APP_STATE,stateId);
  };

  this.getModules = function (stateId) {

    var availableModules = null;

    if( stateId == actionTransferBus.appStatesConst.APP_STATE_MAIN)
    {
      availableModules = modules;
    }
    else
    {
      var length = modules.length;

      for(var i= 0; i < modules.length; i++)
      {
        var module = modules[i];
        if(module.stateId == stateId)
        {
          availableModules = module.subModules;
          break;
        }
      }

    }

    return availableModules;
  };

}

