import { Meteor } from 'meteor/meteor';

import { UserCurrentViewOptions }   from '../../imports/collections/context/user_current_view_options.js';

import ClientAppHeaderServices          from '../../imports/apiClient/apiClientAppHeader';

import TestDataHelpers                  from '../test_modules/test_data_helpers.js'
import { ViewOptionType } from '../../imports/constants/constants.js';

Meteor.methods({

    'testViewOptions.setAllViewOptionsHidden'(userName){

        // Sets a dummy user context for test purposes
        const userContext = TestDataHelpers.getUserContext(userName);

        UserCurrentViewOptions.update(
            {userId: userContext.userId},
            {
                $set:{
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false
                }
            }
        );

        // Toggle an option to ensure that redux object is populated for tests
    },

    'testViewOptions.toggleViewOption'(optionType, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userContext.userId);

        const outcome = ClientAppHeaderServices.toggleViewOption(optionType, viewOptions, userContext.userId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Toggle View Option');

    },


    'testViewOptions.setViewOption'(optionType, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userContext.userId);

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

