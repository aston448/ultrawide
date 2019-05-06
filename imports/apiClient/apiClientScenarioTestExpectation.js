// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { MessageType, ItemType }                        from '../constants/constants.js';
import { Validation }                                   from '../constants/validation_errors.js';
import { TestExpectationMessages }                      from '../constants/message_texts.js'

import { ServerScenarioTestExpectationApi }             from '../apiServer/apiScenarioTestExpectation.js';
import { ScenarioTestExpectationValidationApi }         from '../apiValidation/apiScenarioTestExpectationValidation.js';
import { ScenarioTestExpectationData}                   from "../data/design/scenario_test_expectations_db";

// REDUX services
import store from '../redux/store'
import {setCurrentUserDesignPermutation, setCurrentUserPermutationValue, updateUserMessage} from '../redux/actions'


// =====================================================================================================================
// Client API for Scenario Test Expectations
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================

class ClientScenarioTestExpectationServicesClass {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User adds a new specified value expectation
    addNewSpecificValueTestExpectation(userRole, userContext, scenarioReferenceId, testType){

        // Client validation
        let result = ScenarioTestExpectationValidationApi.validateAddTestTypeExpectation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerScenarioTestExpectationApi.addNewSpecificValueTestExpectation(userRole, userContext, scenarioReferenceId, testType, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestExpectationMessages.MSG_NEW_VALUE
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};

    }

    // User updates the value of a specified value expectation
    updateSpecificValueTestExpectation(userRole, expectationId, newValue){

        // Client validation
        let result = ScenarioTestExpectationValidationApi.validateUpdateTestTypeExpectation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerScenarioTestExpectationApi.updateSpecificValueTestExpectation(userRole, expectationId, newValue, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestExpectationMessages.MSG_UPDATE_VALUE
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};

    }

    // User removes a specified value expectation
    removeSpecificValueTestExpectation(userRole, expectationId){

        // Client validation
        let result = ScenarioTestExpectationValidationApi.validateRemoveTestTypeExpectation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerScenarioTestExpectationApi.removeSpecificValueTestExpectation(userRole, expectationId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestExpectationMessages.MSG_REMOVE_VALUE
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};

    }

    // User selects a test type ----------------------------------------------------------------------------------------
    selectTestTypeExpectation(userRole, userContext, scenarioReferenceId, testType){

        // Client validation
        let result = ScenarioTestExpectationValidationApi.validateAddTestTypeExpectation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerScenarioTestExpectationApi.selectTestType(userRole, userContext, scenarioReferenceId, testType, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestExpectationMessages.MSG_TYPE_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User de-selects a test type -------------------------------------------------------------------------------------
    unselectTestTypeExpectation(userRole, userContext, scenarioReferenceId, testType){

        // Client validation
        let result = ScenarioTestExpectationValidationApi.validateRemoveTestTypeExpectation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerScenarioTestExpectationApi.unselectTestType(userRole, userContext, scenarioReferenceId, testType, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestExpectationMessages.MSG_TYPE_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User de-selects a test type permutation -------------------------------------------------------------------------
    unselectTestTypePermutationExpectation(userRole, userContext, scenarioReferenceId, testType, permutationId){

        // Client validation
        let result = ScenarioTestExpectationValidationApi.validateRemoveTestTypePermutationExpectation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerScenarioTestExpectationApi.unselectTestTypePermutation(userRole, userContext, scenarioReferenceId, testType, permutationId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestExpectationMessages.MSG_PERM_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };


    // User selects a test type permutation value-----------------------------------------------------------------------
    selectTestTypePermutationValueExpectation(userRole, userContext, scenarioReferenceId, testType, permutationId, permutationValueId){

        // Client validation
        let result = ScenarioTestExpectationValidationApi.validateAddTestTypePermutationValueExpectation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerScenarioTestExpectationApi.selectTestTypePermutationValue(userRole, userContext, scenarioReferenceId, testType, permutationId, permutationValueId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestExpectationMessages.MSG_VALUE_ADDED
                }));

            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User de-selects a test type permutation value--------------------------------------------------------------------
    unselectTestTypePermutationValueExpectation(userRole, userContext, scenarioReferenceId, testType, permutationId, permutationValueId){

        // Client validation
        let result = ScenarioTestExpectationValidationApi.validateRemoveTestTypePermutationValueExpectation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerScenarioTestExpectationApi.unselectTestTypePermutationValue(userRole, userContext, scenarioReferenceId, testType, permutationId, permutationValueId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestExpectationMessages.MSG_VALUE_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // LOCAL CLIENT ACTIONS ============================================================================================

    hasTestExpectation(itemType, designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId){

        switch(itemType){
            case ItemType.TEST_TYPE:
                const testExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(designVersionId, scenarioReferenceId, testType);
                return testExpectations.length > 0;
            case ItemType.PERMUTATION_VALUE:
                const permExpectation = ScenarioTestExpectationData.getScenarioTestExpectationForScenarioTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId);
                return(typeof permExpectation !== 'undefined');
        }
    }

    hasChildExpectations(itemType, designVersionId, itemRef, testType, permId){

        switch(itemType){

            case ItemType.PERMUTATION_VALUE:
                return false;
            case ItemType.VALUE_PERMUTATION:
                // True if any specific value expectations defined:
                const values = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestTypeValuePermutationValue(designVersionId, itemRef, testType);
                return (values.length > 0);
            case ItemType.DESIGN_PERMUTATION:
                // True if there are any values existing for this scenario ref, test type and permutation
                const permVals = ScenarioTestExpectationData.getPermutationValuesForScenarioTestTypePerm(designVersionId, itemRef, testType, permId);
                return (permVals.length > 0);
            case ItemType.TEST_TYPE:
                // True if there are any values existing for this scenario ref and test type
                const testVals = ScenarioTestExpectationData.getPermutationExpectationsForScenarioTestType(designVersionId, itemRef, testType);
                return (testVals.length > 0);
            default:
                return false;
        }

    }
}

export const ClientScenarioTestExpectationServices = new ClientScenarioTestExpectationServicesClass();

