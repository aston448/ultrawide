
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
      server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion2', ComponentType.APPLICATION, 'Application1', 'NONE',
          (function(error, result){
              return(error === null);
          })
      );
  }





}

export default new DesignComponentVerifications();
