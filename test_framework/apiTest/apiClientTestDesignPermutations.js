import { Meteor } from 'meteor/meteor';

import { ClientDesignPermutationServices } from '../../imports/apiClient/apiClientDesignPermutation';

import { TestDataHelpers }                  from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testDesignPermutations.addNewDesignPermutation'(userName, expectation) {

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);


        const outcome = ClientDesignPermutationServices.addDesignPermutation(userRole, userContext);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Design Permutation');
    },

    'testDesignPermutations.updateDesignPermutation'(userName, oldName, newName, expectation) {

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);

        const oldPermutation = TestDataHelpers.getDesignPermutation(userContext.designId, oldName);

        const newPermutation = {
            _id:                oldPermutation._id,
            designId:           oldPermutation.designId,
            permutationName:    newName
        };

        const outcome = ClientDesignPermutationServices.saveDesignPermutation(userRole, newPermutation);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Design Permutation');
    },

    'testDesignPermutations.removeDesignPermutation'(userName, permutationName, expectation) {

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);

        const permutation = TestDataHelpers.getDesignPermutation(userContext.designId, permutationName);

        const outcome = ClientDesignPermutationServices.removeDesignPermutation(userRole, permutation._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove Design Permutation');
    },
});