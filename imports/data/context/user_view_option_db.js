import {UserCurrentViewOptions} from '../../collections/context/user_current_view_options.js'

class UserViewOptionDataClass {

    // INSERT ==========================================================================================================

    insertNewUserViewOptions(userId, userViewOptions){

        return UserCurrentViewOptions.insert({
            userId:                     userId,
            designDetailsVisible:       userViewOptions.designDetailsVisible,
            designDomainDictVisible:    userViewOptions.designDomainDictVisible,
            testSummaryVisible:         userViewOptions.testSummaryVisible,
            updateProgressVisible:      userViewOptions.updateProgressVisible,
            updateSummaryVisible:       userViewOptions.updateSummaryVisible,
            devAccTestsVisible:         userViewOptions.devAccTestsVisible,
            devIntTestsVisible:         userViewOptions.devIntTestsVisible,
            devUnitTestsVisible:        userViewOptions.devUnitTestsVisible,
            devFeatureFilesVisible:     userViewOptions.devFeatureFilesVisible,
            designShowAllAsTabs:        userViewOptions.designShowAllAsTabs,
            updateShowAllAsTabs:        userViewOptions.updateShowAllAsTabs,
            workShowAllAsTabs:          userViewOptions.workShowAllAsTabs
        });
    }

    // SELECT ==========================================================================================================

    getUserViewOptions(userId){

        return UserCurrentViewOptions.findOne({userId: userId});
    }

    // UPDATE ==========================================================================================================

    updateUserViewOptions(userId, userViewOptions){

        return UserCurrentViewOptions.update(
            {userId: userId},
            {
                $set:{
                    designDetailsVisible:       userViewOptions.designDetailsVisible,
                    designDomainDictVisible:    userViewOptions.designDomainDictVisible,
                    testSummaryVisible:         userViewOptions.testSummaryVisible,
                    updateProgressVisible:      userViewOptions.updateProgressVisible,
                    updateSummaryVisible:       userViewOptions.updateSummaryVisible,
                    devAccTestsVisible:         userViewOptions.devAccTestsVisible,
                    devIntTestsVisible:         userViewOptions.devIntTestsVisible,
                    devUnitTestsVisible:        userViewOptions.devUnitTestsVisible,
                    devFeatureFilesVisible:     userViewOptions.devFeatureFilesVisible,
                    designShowAllAsTabs:        userViewOptions.designShowAllAsTabs,
                    updateShowAllAsTabs:        userViewOptions.updateShowAllAsTabs,
                    workShowAllAsTabs:          userViewOptions.workShowAllAsTabs
                }
            }
        );
    }
}

export const UserViewOptionData = new UserViewOptionDataClass();