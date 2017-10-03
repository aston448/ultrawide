
import { UserTestTypeLocations }            from '../../collections/configure/user_test_type_locations.js';

class UserTestTypeLocationData {

    // INSERT ==========================================================================================================

    insertNewUserTestTypeLocation(location, userId){

        return UserTestTypeLocations.insert({
            locationId:             location._id,
            locationName:           location.locationName,
            userId:                 userId
        });
    }

    importUserConfiguration(userConfiguration, locationId, userId){

        if (Meteor.isServer) {

            return UserTestTypeLocations.insert(
                {
                    locationId:             locationId,
                    locationName:           userConfiguration.locationName,
                    userId:                 userId,
                    isUnitLocation:         userConfiguration.isUnitLocation,
                    isIntLocation:          userConfiguration.isIntLocation,
                    isAccLocation:          userConfiguration.isAccLocation
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    getUserLocationById(userId, locationId){

        UserTestTypeLocations.findOne({
            userId: userId,
            locationId: locationId,
        });
    }

    getUserIntegrationTestsLocations(userId){

        return UserTestTypeLocations.find({
            userId:         userId,
            isIntLocation:  true
        }).fetch();
    }

    getUserUnitTestsLocations(userId){

        return UserTestTypeLocations.find({
            userId:         userId,
            isUnitLocation: true
        }).fetch();
    }

    getUserTestTypeLocations(userId){

        UserTestTypeLocations.find({
            userId: userId
        }).fetch();
    }

    getAllUserTestTypeLocations(){

        UserTestTypeLocations.find({}).fetch();
    }

    // UPDATE ==========================================================================================================

    saveUserTestTypeLocation(userConfiguration){

        return UserTestTypeLocations.update(
            {_id: userConfiguration._id},
            {
                $set: {
                    isUnitLocation:         userConfiguration.isUnitLocation,
                    isIntLocation:          userConfiguration.isIntLocation,
                    isAccLocation:          userConfiguration.isAccLocation
                }
            }
        );
    }

    updateUserTestTypeLocationName(location, userId){

        return UserTestTypeLocations.update(
            {
                locationId: location._id,
                userId: userId
            },
            {
                $set:{
                    locationName: location.locationName,
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeUserTestTypeLocations(userLocationId){

        return UserTestTypeLocations.remove({
            _id: userLocationId
        });
    }

}

export default new UserTestTypeLocationData();