import { Meteor } from 'meteor/meteor';

import { UserCurrentViewOptions }   from '../../imports/collections/context/user_current_view_options.js';

import ClientAppHeaderServices          from '../../imports/apiClient/apiClientAppHeader';

import TestDataHelpers                  from '../test_modules/test_data_helpers.js'
import { ViewOptionType } from '../../imports/constants/constants.js';

Meteor.methods({

    'testViewOptions.setAllViewOptionsHidden'(userName){

        // Sets a dummy user context for test purposes
        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);

        UserCurrentViewOptions.update(
            {_id: viewOptions._id},
            {
                $set:{
                    userId:                     userContext.userId,
                    designDetailsVisible:       false,
                    designTestSummaryVisible:   false,
                    designDomainDictVisible:    false,
                    updateDetailsVisible:       false,
                    updateTestSummaryVisible:   false,
                    updateDomainDictVisible:    false,
                    wpDetailsVisible:           false,
                    wpDomainDictVisible:        false,
                    devDetailsVisible:          false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devTestSummaryVisible:      false,
                    devFeatureFilesVisible:     false,
                    devDomainDictVisible:       false
                }
            }
        )
    },

    'testViewOptions.toggleViewOption'(optionType, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const viewOptions = TestDataHelpers.getViewOptions(userName);

        const outcome = ClientAppHeaderServices.toggleViewOption(optionType, viewOptions, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Toggle View Option');

    },


    'testViewOptions.setViewOption'(optionType, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);

        switch(optionType){
            case ViewOptionType.DESIGN_DETAILS:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.DESIGN_TEST_SUMMARY:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.DESIGN_DICT:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.UPDATE_DETAILS:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.UPDATE_TEST_SUMMARY:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.UPDATE_DICT:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.WP_DETAILS:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.WP_DICT:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.DEV_DETAILS:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.DEV_ACC_TESTS:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.DEV_INT_TESTS:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.DEV_UNIT_TESTS:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.DEV_TEST_SUMMARY:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.DEV_FILES:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
            case ViewOptionType.DEV_DICT:
                UserCurrentViewOptions.update(
                    {_id: viewOptions._id},
                    {
                        $set: {}
                    }
                );
                break;
        }
    }


});

