import { Meteor } from 'meteor/meteor';

import { TestOutputLocations }      from '../../imports/collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../imports/collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../imports/collections/configure/user_test_type_locations.js';

import { ViewOptionType } from '../../imports/constants/constants.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    'verifyUserViewOptions.optionIsVisible'(optionType, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const userOptions = TestDataHelpers.getViewOptions(userContext.userId);

        if (!userOptions) {
            throw new Meteor.Error("FAIL", "No user options for user " + userName);
        } else {

            switch(optionType){
                case ViewOptionType.DESIGN_DETAILS:
                    if(userOptions.designDetailsVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.DESIGN_TEST_SUMMARY:
                    if(userOptions.testSummaryVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.DESIGN_DICT:
                    if(userOptions.designDomainDictVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.UPDATE_DETAILS:
                    if(userOptions.designDetailsVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.UPDATE_TEST_SUMMARY:
                    if(userOptions.testSummaryVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.UPDATE_DICT:
                    if(userOptions.designDomainDictVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.WP_DETAILS:
                    if(userOptions.designDetailsVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.WP_DICT:
                    if(userOptions.designDomainDictVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.DEV_DETAILS:
                    if(userOptions.designDetailsVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.DEV_ACC_TESTS:
                    if(userOptions.devAccTestsVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.DEV_INT_TESTS:
                    if(userOptions.devIntTestsVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.DEV_UNIT_TESTS:
                    if(userOptions.devUnitTestsVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.DEV_TEST_SUMMARY:
                    if(userOptions.testSummaryVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.DEV_FILES:
                    if(userOptions.devFeatureFilesVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
                case ViewOptionType.DEV_DICT:
                    if(userOptions.designDomainDictVisible !== true){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be visible");
                    }
                    break;
            }
        }
    },

    'verifyUserViewOptions.optionIsHidden'(optionType, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const userOptions = TestDataHelpers.getViewOptions(userContext.userId);

        if (!userOptions) {
            throw new Meteor.Error("FAIL", "No user options for user " + userName);
        } else {

            switch(optionType){
                case ViewOptionType.DESIGN_DETAILS:
                    if(userOptions.designDetailsVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.DESIGN_TEST_SUMMARY:
                    if(userOptions.testSummaryVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.DESIGN_DICT:
                    if(userOptions.designDomainDictVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.UPDATE_DETAILS:
                    if(userOptions.designDetailsVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.UPDATE_TEST_SUMMARY:
                    if(userOptions.testSummaryVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.UPDATE_DICT:
                    if(userOptions.designDomainDictVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.WP_DETAILS:
                    if(userOptions.designDetailsVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.WP_DICT:
                    if(userOptions.designDomainDictVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.DEV_DETAILS:
                    if(userOptions.designDetailsVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.DEV_ACC_TESTS:
                    if(userOptions.devAccTestsVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.DEV_INT_TESTS:
                    if(userOptions.devIntTestsVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.DEV_UNIT_TESTS:
                    if(userOptions.devUnitTestsVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.DEV_TEST_SUMMARY:
                    if(userOptions.testSummaryVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.DEV_FILES:
                    if(userOptions.devFeatureFilesVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
                case ViewOptionType.DEV_DICT:
                    if(userOptions.designDomainDictVisible !== false){
                        throw new Meteor.Error("FAIL", "Expected option " + optionType + " to be hidden");
                    }
                    break;
            }
        }
    },

});