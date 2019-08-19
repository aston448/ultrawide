import {DesignPermutationValues} from "../../collections/design/design_permutation_values";
import {DefaultItemNames} from "../../constants/default_names";
import {DesignPermutations} from "../../collections/design/design_permutations";


class DesignPermutationValueDataClass{

    // INSERT ==========================================================================================================
    insertNewDesignPermutationVlaue(permutationId, designVersionId){

        return DesignPermutationValues.insert(
            {
                permutationId: permutationId,
                designVersionId: designVersionId,
                permutationValueName: DefaultItemNames.NEW_PERMUTATION_VALUE
            }
        );
    }

    importDesignPermutationValue(designPermutationValue, designVersionId, permutationId){

        if(Meteor.isServer) {
            return DesignPermutationValues.insert(
                {
                    permutationId: permutationId,
                    designVersionId: designVersionId,
                    permutationValueName: designPermutationValue.permutationValueName
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    getDesignPermutationValueById(permValueId){

        return DesignPermutationValues.findOne({
            _id: permValueId
        });
    }

    getDesignPermutationValueByName(permId, permValue){

        // Names are enforced to be unique per Design Permutation

        return DesignPermutationValues.findOne({
            permutationId: permId,
            permutationValueName: permValue
        });
    }

    getDvPermutationValuesForPermutation(permId, designVersionId){

        return DesignPermutationValues.find({
            designVersionId: designVersionId,
            permutationId: permId
        }).fetch();
    }

    getOtherValuesForPermutation(permutationId, designVersionId, permutationValueId){

        return DesignPermutationValues.find({
            _id: {$ne: permutationValueId},
            permutationId:  permutationId,
            designVersionId: designVersionId
        }).fetch();
    }

    getAllValuesForDesignVersion(designVersionId){

        return DesignPermutationValues.find({
            designVersionId: designVersionId
        }).fetch();
    }

    // UPDATE ==========================================================================================================

    updatePermutationValueName(permValueId, permutationValueName){

        return DesignPermutationValues.update(
            {_id: permValueId},
            {
                $set:{
                    permutationValueName: permutationValueName
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removePermutationValue(permValueId){

        return DesignPermutationValues.remove({
            _id: permValueId
        });
    }

}

export const DesignPermutationValueData = new DesignPermutationValueDataClass();