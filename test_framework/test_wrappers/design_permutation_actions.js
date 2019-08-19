
class DesignPermutationActionsClass {

    // Add -------------------------------------------------------------------------------------------------------------
    designerAddsDesignPermutation(expectation) {
        server.call('testDesignPermutations.addNewDesignPermutation', 'gloria', expectation);
    }

    developerAddsDesignPermutation(expectation) {
        server.call('testDesignPermutations.addNewDesignPermutation', 'hugh', expectation);
    }

    managerAddsDesignPermutation(expectation) {
        server.call('testDesignPermutations.addNewDesignPermutation', 'miles', expectation);
    }

    // Update ----------------------------------------------------------------------------------------------------------
    designerUpdatesPermutationName(oldName, newName, expectation){
        server.call('testDesignPermutations.updateDesignPermutation', 'gloria', oldName, newName, expectation)
    }

    // Remove ----------------------------------------------------------------------------------------------------------
    designerRemovesPermutation(permutationName, expectation){
        server.call('testDesignPermutations.removeDesignPermutation', 'gloria', permutationName, expectation)
    }

}

export const DesignPermutationActions = new DesignPermutationActionsClass();