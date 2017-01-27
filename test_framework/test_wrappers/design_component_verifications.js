
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignComponentVerifications{

  componentOfType_Called_DoesNotExist(type, name){
      server.call('verifyDesignComponents.componentDoesNotExistCalled', type, name);
  }



}

export default new DesignComponentVerifications();
