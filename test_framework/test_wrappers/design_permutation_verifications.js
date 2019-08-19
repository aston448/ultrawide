
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignPermutationVerificationsClass{

    // Design Permutations ---------------------------------------------------------------------------------------------
    defaultNewDesignPermutationExistsForDesign(designName){
        server.call('verifyDesignPermutations.newDesignPermutationExistsForDesign', designName,
            (function(error, result){
                return(error === null);
            })
        );
    };

    defaultNewDesignPermutationDoesNotExistForDesign(designName){
        server.call('verifyDesignPermutations.newDesignPermutationDoesNotExistForDesign', designName,
            (function(error, result){
                return(error === null);
            })
        );
    };

    designPermutationExistsForDesignCalled(designName, permutationName){
        server.call('verifyDesignPermutations.designPermutationExistsForDesign', designName, permutationName,
            (function(error, result){
                return(error === null);
            })
        );
    };

    // Design Permutation Values ---------------------------------------------------------------------------------------

    designPermutationValueExistsForDesignVersionCalled(designName, designVersionName, permutationName, permutationValue){

        server.call('verifyDesignPermutations.designPermutationValueExistsForDesignVersion', designName, designVersionName, permutationName, permutationValue,
            (function(error, result){
                return(error === null);
            })
        );
    };

    designPermutationValueDoesNotExistForDesignVersionCalled(designName, designVersionName, permutationName, permutationValue){
        server.call('verifyDesignPermutations.designPermutationValueDoesNotExistForDesignVersion', designName, designVersionName, permutationName, permutationValue,
            (function(error, result){
                return(error === null);
            })
        );
    };
}

export const DesignPermutationVerifications = new DesignPermutationVerificationsClass();