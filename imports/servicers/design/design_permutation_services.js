// Ultrawide Services

import { DesignPermutationData }        from '../../data/design/design_permutation_db.js';
import { DesignPermutationValueData }   from '../../data/design/design_permutation_value_db.js';


//======================================================================================================================
//
// Server Code for Design Permutations.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignPermutationServicesClass{

    addPermutation(designId){

        const result = DesignPermutationData.insertNewDesignPermutation(designId);
    }

    savePermutation(permutation){

        const result = DesignPermutationData.updatePermutationName(permutation._id, permutation.permutationName);
    }

    addPermutationValue(permutationId, designVersionId){

        const result = DesignPermutationValueData.insertNewDesignPermutationVlaue(permutationId, designVersionId);
    }

    savePermutationValue(permutationValue){

        const result = DesignPermutationValueData.updatePermutationValueName(permutationValue._id, permutationValue.permutationValueName);
    }
}

export const DesignPermutationServices = new DesignPermutationServicesClass();