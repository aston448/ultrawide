import { Meteor } from 'meteor/meteor';

import { DesignPermutations }                  from '../../imports/collections/design/design_permutations';

import {DefaultItemNames} from '../../imports/constants/default_names.js';
import {TestDataHelpers} from "../test_modules/test_data_helpers";
import {DesignPermutationValues} from "../../imports/collections/design/design_permutation_values";
import {updateDesignVersionName} from "../../imports/apiValidatedMethods/design_version_methods";

Meteor.methods({

    'verifyDesignPermutations.newDesignPermutationExistsForDesign'(designName){

        const design = TestDataHelpers.getDesign(designName);

        const newDesignPermutation = DesignPermutations.findOne({designId: design._id, permutationName: DefaultItemNames.NEW_PERMUTATION_NAME});

        if(newDesignPermutation){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No new design permutation was created");
        }
    },

    'verifyDesignPermutations.newDesignPermutationDoesNotExistForDesign'(designName){

        const design = TestDataHelpers.getDesign(designName);

        const newDesignPermutation = DesignPermutations.findOne({designId: design._id, permutationName: DefaultItemNames.NEW_PERMUTATION_NAME});

        if(newDesignPermutation){
            throw new Meteor.Error("FAIL", "A default new design permutation does exist");
        } else {
            return true;
        }
    },

    'verifyDesignPermutations.designPermutationExistsForDesign'(designName, permutationName){

        const design = TestDataHelpers.getDesign(designName);

        const designPermutation = DesignPermutations.findOne({designId: design._id, permutationName: permutationName});

        if(designPermutation){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Design Permutation <" + permutationName + "> not found");
        }
    },

    'verifyDesignPermutations.designPermutationValueExistsForDesignVersion'(designName, designVersionName, permutationName, permutationValueName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        const designPermutation = DesignPermutations.findOne({designId: design._id, permutationName: permutationName});

        if(designPermutation){
            const permutationValue = DesignPermutationValues.findOne({permutationId: designPermutation._id, designVersionId: designVersion._id, permutationValueName: permutationValueName});

            if(permutationValue){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Design Permutation Value <" + permutationValue + "> not found");
            }
        } else {
            throw new Meteor.Error("FAIL", "Design Permutation <" + permutationName + "> not found");
        }
    },

    'verifyDesignPermutations.designPermutationValueDoesNotExistForDesignVersion'(designName, designVersionName, permutationName, permutationValueName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        const designPermutation = DesignPermutations.findOne({designId: design._id, permutationName: permutationName});

        if(designPermutation){
            const permutationValue = DesignPermutationValues.findOne({permutationId: designPermutation._id, designVersionId: designVersion._id, permutationValueName: permutationValueName});

            if(permutationValue){
                throw new Meteor.Error("FAIL", "Design Permutation Value <" + permutationValue + "> was found");
            } else {
                return true;
            }
        } else {

            // No Design Permutation so check that no remaining values orphaned
            const permutationValue = DesignPermutationValues.findOne({designVersionId: designVersion._id, permutationValueName: permutationValueName});

            if(permutationValue){
                throw new Meteor.Error("FAIL", "Design Permutation Value <" + permutationValue + "> was found");
            } else {
                return true;
            }
        }
    },
});