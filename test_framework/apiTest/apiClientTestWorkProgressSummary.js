
import { Meteor } from 'meteor/meteor';

import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { DesignUpdates }            from '../../imports/collections/design_update/design_updates.js';
import { WorkPackages }             from '../../imports/collections/work/work_packages.js';

import ClientDesignVersionServices    from '../../imports/apiClient/apiClientDesignVersion.js';
import TestDataHelpers              from '../test_modules/test_data_helpers.js'


import {RoleType, WorkSummaryType, ViewType, ViewMode, DisplayContext, ComponentType, TestLocationFileType, TestRunner} from '../../imports/constants/constants.js';

Meteor.methods({

    'testWorkProgress.gotoWorkItem'(itemType, itemName, asRole, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        let item = null;

        switch(itemType){
            case WorkSummaryType.WORK_SUMMARY_BASE_DV:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_DV:

                item = DesignVersions.findOne({designVersionName: itemName});

                break;
            case WorkSummaryType.WORK_SUMMARY_UPDATE:

                item = DesignUpdates.findOne({updateName: itemName});

                break;
            case WorkSummaryType.WORK_SUMMARY_BASE_WP:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_WP:

                item = WorkPackages.find({workPackageName: itemName});
                break;
        }

        if(item){

            const outcome = ClientDesignVersionServices.gotoWorkProgressSummaryItemAsRole(item, asRole);

            TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Goto Item as Role');

        } else {
            throw new Meteor.Error("NOT_FOUND", "Work item called " + itemName + " not found");
        }

    },

});
