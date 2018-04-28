
import { Meteor } from 'meteor/meteor';

import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { DesignUpdates }            from '../../imports/collections/design_update/design_updates.js';
import { WorkPackages }             from '../../imports/collections/work/work_packages.js';
import { UserWorkProgressSummary }  from '../../imports/collections/summary/user_work_progress_summary.js';

import ClientDesignVersionServices    from '../../imports/apiClient/apiClientDesignVersion.js';
import { TestDataHelpers }              from '../test_modules/test_data_helpers.js'


import {RoleType, WorkSummaryType, ViewType, ViewMode, DisplayContext, ComponentType, TestLocationFileType, TestRunner} from '../../imports/constants/constants.js';

Meteor.methods({

    'testWorkProgress.gotoWorkItem'(itemType, itemName, asRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);

        let item = null;
        let workSummaryItem = null;

        switch(itemType){
            case WorkSummaryType.WORK_SUMMARY_BASE_DV:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_DV:

                item = DesignVersions.findOne({designVersionName: itemName});

                if(item){
                    workSummaryItem = UserWorkProgressSummary.findOne({
                        userId:                     userContext.userId,
                        designVersionId:            item._id,
                        designUpdateId:             'NONE',
                        workPackageId:              'NONE'
                    });
                } else {
                    throw new Meteor.Error("NOT_FOUND", "Work item called " + itemName + " not found");
                }

                break;
            case WorkSummaryType.WORK_SUMMARY_UPDATE:

                item = DesignUpdates.findOne({updateName: itemName});

                if(item){
                    workSummaryItem = UserWorkProgressSummary.findOne({
                        userId:                     userContext.userId,
                        designVersionId:            item.designVersionId,
                        designUpdateId:             item._id,
                        workPackageId:              'NONE'
                    });
                } else {
                    throw new Meteor.Error("NOT_FOUND", "Work item called " + itemName + " not found");
                }

                break;
            case WorkSummaryType.WORK_SUMMARY_BASE_WP:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_WP:

                item = WorkPackages.findOne({workPackageName: itemName});

                if(item){
                    workSummaryItem = UserWorkProgressSummary.findOne({
                        userId:                     userContext.userId,
                        designVersionId:            item.designVersionId,
                        designUpdateId:             item.designUpdateId,
                        workPackageId:              item._id
                    });
                } else {
                    throw new Meteor.Error("NOT_FOUND", "Work item called " + itemName + " not found");
                }
                break;
        }

        if(workSummaryItem){

            const outcome = ClientDesignVersionServices.gotoWorkProgressSummaryItemAsRole(workSummaryItem, asRole);

            TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Goto Item as Role');

        } else {
            throw new Meteor.Error("NOT_FOUND", "Work summary item not found for " + itemName);
        }

    },

});
