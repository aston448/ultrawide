
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignComponentVerifications{

  componentOfType_Called_DoesNotExist(type, name){
      server.call('verifyDesignComponents.componentDoesNotExistCalled', type, name,
          (function(error, result){
              return(error === null);
          })
      );
  }

  componentOfType_Called_ExistsInDesign_Version_(type, name, designName, designVersionName){
      server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', designName, designVersionName, type, name,
          (function(error, result){
              return(error === null);
          })
      );
  }

  componentOfType_Called_InDesign_Version_ParentIs_(type, name, designName, designVersionName, parentName){
      server.call('verifyDesignComponents.componentInDesignVersionParentIs', designName, designVersionName, type, name, parentName,
          (function(error, result){
              return(error === null);
          })
      );
  }

  componentOfType_Called_InDesign_Version_CountIs(type, name, designName, designVersionName, count){
      server.call('verifyDesignComponents.componentCountCalledIs', type, name, designName, designVersionName, 1,
          (function(error, result){
              return(error === null);
          })
      );
  }





}

export default new DesignComponentVerifications();
