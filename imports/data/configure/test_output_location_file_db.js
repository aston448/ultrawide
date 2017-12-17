
import { TestOutputLocationFiles }                  from '../../collections/configure/test_output_location_files.js';

import { TestLocationFileType, TestLocationFileStatus } from '../../constants/constants.js';
import { DefaultLocationText }                      from "../../constants/default_names";

class TestOutputLocationFileData{

    // INSERT ==========================================================================================================

    addNewLocationFile(locationId){

        return TestOutputLocationFiles.insert(
            {
                locationId:             locationId,
                fileAlias:              DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS,
                fileName:               DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_NAME
            }
        );
    }

    importLocationFile(locationFile, locationId){

        if (Meteor.isServer) {

            return TestOutputLocationFiles.insert(
                {
                    locationId:             locationId,
                    fileAlias:              locationFile.fileAlias,
                    fileDescription:        locationFile.fileDescription,
                    fileType:               locationFile.fileType,
                    testRunner:             locationFile.testRunner,
                    fileName:               locationFile.fileName,
                    allFilesOfType:         locationFile.allFilesOfType,
                    fileStatus:             locationFile.fileStatus,
                    lastUpdated:            locationFile.lastUpdated
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    getLocationFileByAlias(locationId, fileAlias){

        return TestOutputLocationFiles.findOne({
            locationId: locationId,
            fileAlias: fileAlias
        });
    }

    getAcceptanceTestFilesForLocation(outputLocationId){

        return TestOutputLocationFiles.find({
            locationId: outputLocationId,
            fileType:   TestLocationFileType.ACCEPTANCE
        }).fetch();
    }

    getIntegrationTestFilesForLocation(outputLocationId){

        return TestOutputLocationFiles.find({
            locationId: outputLocationId,
            fileType:   TestLocationFileType.INTEGRATION
        }).fetch();
    }

    getUnitTestFilesForLocation(outputLocationId){

        return TestOutputLocationFiles.find({
            locationId: outputLocationId,
            fileType:   TestLocationFileType.UNIT
        }).fetch();
    }

    getAllLocationFiles(){

        return TestOutputLocationFiles.find({}).fetch();
    }

    // UPDATE ==========================================================================================================

    saveLocationFileDetails(locationFile){

        return TestOutputLocationFiles.update(
            {_id: locationFile._id},
            {
                $set:{
                    fileAlias:              locationFile.fileAlias,
                    fileDescription:        locationFile.fileDescription,
                    fileType:               locationFile.fileType,
                    testRunner:             locationFile.testRunner,
                    fileName:               locationFile.fileName,
                    allFilesOfType:         locationFile.allFilesOfType,
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                }
            }
        )
    }

    resetAllLocationFilesStatus(locationId){

        return TestOutputLocationFiles.update(
            {locationId: locationId},
            {
                $set: {
                    fileStatus:     TestLocationFileStatus.FILE_NOT_UPLOADED,
                    lastUpdated:    ''
                }
            },
            {multi: true}
        );
    }

    setLocationFileStatus(locationId, fileName, fileStatus, modifiedDate){

        return TestOutputLocationFiles.update(
            {
                locationId: locationId,
                fileName:   fileName
            },
            {
                $set: {
                    fileStatus:     fileStatus,
                    lastUpdated:    modifiedDate
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeLocationFile(locationFileId){

        return TestOutputLocationFiles.remove({_id: locationFileId});
    }

    removeAllFilesForLocation(locationId){

        return TestOutputLocationFiles.remove({locationId: locationId});
    }
}

export default new TestOutputLocationFileData();