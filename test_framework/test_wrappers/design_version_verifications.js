
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignVersionVerifications{

    defaultNewDesignVersionExistsForDesign(designName){
        server.call('verifyDesignVersions.designVersionExistsCalled', designName, DefaultItemNames.NEW_DESIGN_VERSION_NAME,
            (function(error, result){
                return(error === null);
            })
        );
    }

    defaultNewDesignVersionDoesNotExistForDesign(designName){
        server.call('verifyDesignVersions.designVersionDoesNotExistCalled', designName, DefaultItemNames.NEW_DESIGN_VERSION_NAME,
            (function(error, result){
                return(error === null);
            })
        );
    }

    designVersionExistsForDesign_Called(designName, designVersionName){
        server.call('verifyDesignVersions.designVersionExistsCalled', designName, designVersionName,
            (function(error, result){
                return(error === null);
            })
        );
    }

    designVersionDoesNotExistForDesign_Called(designName, designVersionName){
        server.call('verifyDesignVersions.designVersionDoesNotExistCalled', designName, designVersionName,
            (function(error, result){
                return(error === null);
            })
        );
    }

    designVersion_StatusForDesignerIs(version, status){
        server.call('verifyDesignVersions.designVersionStatusIs', version, status, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    designVersion_StatusForDeveloperIs(version, status){
        server.call('verifyDesignVersions.designVersionStatusIs', version, status, 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

    designVersion_StatusForManagerIs(version, status){
        server.call('verifyDesignVersions.designVersionStatusIs', version, status, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }


}

export default new DesignVersionVerifications();
