import {DesignPermutations} from "../../collections/design/design_permutations";
import {DefaultItemNames} from "../../constants/default_names";


class DesignPermutationClass{

    // INSERT ==========================================================================================================
    insertNewDesignPermutation(designId){

        return DesignPermutations.insert(
            {
                designId: designId,
                permutationName: DefaultItemNames.NEW_PERMUTATION_NAME
            }
        );
    }

    importDesignPermutation(designPermutation, designId){

        if(Meteor.isServer) {
            return DesignPermutations.insert(
                {
                    designId: designId,
                    permutationName: designPermutation.permutationName
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    getDesignPermutationById(permId){

        return DesignPermutations.findOne({
            _id: permId
        });
    }

    getDesignPermutationByName(designId, permName){

        // Names are enforced to be unique per Design

        return DesignPermutations.findOne({
            designId: designId,
            permutationName: permName
        });
    }

    getPermutationsForDesign(designId){

        return DesignPermutations.find({
            designId: designId
        }).fetch();
    }

    getOtherPermutationsForDesign(designId, permutationId){

        return DesignPermutations.find({
            _id: {$ne: permutationId},
            designId: designId
        }).fetch();
    }

    // UPDATE ==========================================================================================================

    updatePermutationName(permId, permutationName){

        return DesignPermutations.update(
            {_id: permId},
            {
                $set:{
                    permutationName: permutationName
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removePermutation(permId){

        return DesignPermutations.remove({
            _id: permId
        });
    }

}

export const DesignPermutationData = new DesignPermutationClass();