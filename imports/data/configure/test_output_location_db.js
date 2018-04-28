
import { TestOutputLocations }              from '../../collections/configure/test_output_locations.js';
import { TestOutputLocationFiles}           from "../../collections/configure/test_output_location_files";

import { DefaultLocationText }              from "../../constants/default_names";

class TestOutputLocationDataClass{

    // INSERT ==========================================================================================================

    insertNewOutputLocation(userId){

        return TestOutputLocations.insert(
            {
                locationName:           DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
                locationUserId:         userId,
            }
        );
    }

    importLocation(location, userId){

        if (Meteor.isServer) {

            return TestOutputLocations.insert(
                {
                    locationName:           location.locationName,
                    locationIsShared:       location.locationIsShared,
                    locationUserId:         userId,
                    locationPath:           location.locationPath,
                    locationFullPath:       location.locationFullPath,
                    isGuestViewerLocation:  location.isGuestViewerLocation
                }
            );
        }

    }

    // SELECT ==========================================================================================================

    getOutputLocationById(locationId){

        return TestOutputLocations.findOne({_id: locationId});
    }

    // Gets a location only if it is available to the specified user
    getUserOutputLocationById(locationId, userId){

        return TestOutputLocations.findOne({
            _id:                locationId,
            $or:[{locationIsShared: true}, {locationUserId: userId}]
        });
    }

    getOutputLocationByName(locationName){

        return TestOutputLocations.findOne({
            locationName: locationName
        });
    }

    getAllLocations(){

        return TestOutputLocations.find({}).fetch();
    }

    getGuestViewerLocations(){

        return TestOutputLocations.find({isGuestViewerLocation: true}).fetch();
    }

    getOtherLocations(locationId){

        return TestOutputLocations.find({_id: {$ne: locationId}}).fetch();
    }

    getAllUserLocations(userId){

        return TestOutputLocations.find({
            $or:[{locationIsShared: true}, {locationUserId: userId}]
        }).fetch();

    }

    getAllLocationFiles(locationId){

        return TestOutputLocationFiles.find({locationId: locationId}).fetch();
    }

    getOtherLocationFiles(locationId, locationFileId){

        return TestOutputLocationFiles.find({
            _id: {$ne: locationFileId},
            locationId: locationId
        }).fetch();
    }

    // UPDATE ==========================================================================================================

    updateOutputLocation(locationId, location){

        return TestOutputLocations.update(
            {_id: locationId},
            {
                $set: {
                    locationName:           location.locationName,
                    locationIsShared:       location.locationIsShared,
                    locationUserId:         location.locationUserId,
                    locationPath:           location.locationPath,
                    locationFullPath:       location.locationFullPath,
                    isGuestViewerLocation:  location.isGuestViewerLocation
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeOutputLocation(locationId){

        return TestOutputLocations.remove({_id: locationId});
    }

    removeAllLocations(){

        return TestOutputLocations.remove({});
    }
}

export const TestOutputLocationData = new TestOutputLocationDataClass();