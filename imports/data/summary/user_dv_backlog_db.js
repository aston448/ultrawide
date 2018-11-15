import {UserDvBacklog}        from '../../collections/summary/user_dv_backlog.js';


class UserDvBacklogDataClass {

    // INSERT ==========================================================================================================
    bulkInsert(batchData){

        UserDvBacklog.batchInsert(batchData);
    }

    addUpdateBacklogEntry(workContext, featureRefId, scenarioTestCount, backlogType){

        const currentEntry = UserDvBacklog.findOne({
            userId: workContext.userId,
            dvId: workContext.dvId,
            inId: workContext.inId,
            itId: workContext.itId,
            duId: workContext.duId,
            wpId: workContext.wpId,
            backlogType: backlogType,
            featureRefId: featureRefId,
            noWorkPackage: workContext.noWorkPackage
        });

        if(currentEntry){

            // Add another scenario to this count
            UserDvBacklog.update(
                {
                    _id: currentEntry._id
                },
                {
                    $set:{
                        scenarioCount:  currentEntry.scenarioCount + 1,
                        scenarioTestCount: currentEntry.scenarioTestCount + scenarioTestCount
                    }
                }
            );

        } else {

            // New item not yet counted
            UserDvBacklog.insert({
                userId:                 workContext.userId,
                dvId:                   workContext.dvId,
                inId:                   workContext.inId,
                itId:                   workContext.itId,
                duId:                   workContext.duId,
                wpId:                   workContext.wpId,
                backlogType:            backlogType,
                featureRefId:           featureRefId,
                scenarioCount:          1,
                scenarioTestCount:      scenarioTestCount,
                noWorkPackage:          workContext.noWorkPackage
            });
        }

    }

    // SELECT ==========================================================================================================


    // UPDATE ==========================================================================================================


    // REMOVE ==========================================================================================================

    removeUserBacklogData(userContext){

        // Wipe for all design versions to prevent excess data build up
        return UserDvBacklog.remove({
            userId:             userContext.userId
        });
    }
}

export const UserDvBacklogData = new UserDvBacklogDataClass();