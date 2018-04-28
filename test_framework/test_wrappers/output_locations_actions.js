
import {RoleType, TestType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class OutputLocationsActionsClass{

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    // Add Location
    developerAddsNewLocation(expectation){
        server.call('testOutputLocations.addNewLocation', RoleType.DEVELOPER, 'hugh', expectation);
    }

    designerAddsNewLocation(expectation){
        server.call('testOutputLocations.addNewLocation', RoleType.DESIGNER, 'gloria', expectation);
    }

    managerAddsNewLocation(expectation){
        server.call('testOutputLocations.addNewLocation', RoleType.MANAGER, 'miles', expectation);
    }

    // Remove Location
    developerRemovesLocation(locationName, expectation){
        server.call('testOutputLocations.removeLocation', RoleType.DEVELOPER, locationName, expectation);
    }

    designerRemovesLocation(locationName, expectation){
        server.call('testOutputLocations.removeLocation', RoleType.DESIGNER, locationName, expectation);
    }

    managerRemovesLocation(locationName, expectation){
        server.call('testOutputLocations.removeLocation', RoleType.MANAGER, locationName, expectation);
    }

    // Save Location
    developerSavesLocation(locationName, newDetails, expectation){
        server.call('testOutputLocations.saveLocation', RoleType.DEVELOPER, locationName, newDetails, expectation);
    }

    designerSavesLocation(locationName, newDetails, expectation){
        server.call('testOutputLocations.saveLocation', RoleType.DESIGNER, locationName, newDetails, expectation);
    }

    managerSavesLocation(locationName, newDetails, expectation){
        server.call('testOutputLocations.saveLocation', RoleType.MANAGER, locationName, newDetails, expectation);
    }

    // Set Private / Shared
    developerSetsLocationAsShared(locationName, expectation){
        server.call('testOutPutLocations.setLocationShared', RoleType.DEVELOPER, locationName, expectation);
    }

    designerSetsLocationAsShared(locationName, expectation){
        server.call('testOutPutLocations.setLocationShared', RoleType.DESIGNER, locationName, expectation);
    }

    managerSetsLocationAsShared(locationName, expectation){
        server.call('testOutPutLocations.setLocationShared', RoleType.MANAGER, locationName, expectation);
    }

    developerSetsLocationAsPrivate(locationName, expectation){
        server.call('testOutPutLocations.setLocationPrivate', RoleType.DEVELOPER, locationName, expectation);
    }

    designerSetsLocationAsPrivate(locationName, expectation){
        server.call('testOutPutLocations.setLocationPrivate', RoleType.DESIGNER, locationName, expectation);
    }

    managerSetsLocationAsPrivate(locationName, expectation){
        server.call('testOutPutLocations.setLocationPrivate', RoleType.MANAGER, locationName, expectation);
    }

    // LOCATION FILES --------------------------------------------------------------------------------------------------

    // Add File
    developerAddsFileToLocation(locationName, expectation){
        server.call('testOutputLocations.addNewLocationFile', RoleType.DEVELOPER, locationName, expectation);
    }

    designerAddsFileToLocation(locationName, expectation){
        server.call('testOutputLocations.addNewLocationFile', RoleType.DESIGNER, locationName, expectation);
    }

    managerAddsFileToLocation(locationName, expectation){
        server.call('testOutputLocations.addNewLocationFile', RoleType.MANAGER, locationName, expectation);
    }

    // Remove File
    developerRemovesLocationFile(locationName, fileAlias, expectation){
        server.call('testOutputLocations.removeLocationFile', RoleType.DEVELOPER, locationName, fileAlias, expectation);
    }

    designerRemovesLocationFile(locationName, fileAlias, expectation){
        server.call('testOutputLocations.removeLocationFile', RoleType.DESIGNER, locationName, fileAlias, expectation);
    }

    managerRemovesLocationFile(locationName, fileAlias, expectation){
        server.call('testOutputLocations.removeLocationFile', RoleType.MANAGER, locationName, fileAlias, expectation);
    }

    // Save File Details
    developerSavesLocationFile(locationName, fileAlias, fileDetails, expectation){
        server.call('testOutputLocations.saveLocationFile', RoleType.DEVELOPER, locationName, fileAlias, fileDetails, expectation);
    }

    designerSavesLocationFile(locationName, fileAlias, fileDetails, expectation){
        server.call('testOutputLocations.saveLocationFile', RoleType.DESIGNER, locationName, fileAlias, fileDetails, expectation);
    }

    managerSavesLocationFile(locationName, fileAlias, fileDetails, expectation){
        server.call('testOutputLocations.saveLocationFile', RoleType.MANAGER, locationName, fileAlias, fileDetails, expectation);
    }


    // USER CONFIG -----------------------------------------------------------------------------------------------------

    // Edit config
    developerEditsTestLocationConfig(expectation){
        server.call('testOutputLocations.editUserTestLocationConfig', 'hugh', expectation);
    }

    anotherDeveloperEditsTestLocationConfig(expectation){
        server.call('testOutputLocations.editUserTestLocationConfig', 'davey', expectation);
    }

    designerEditsTestLocationConfig(expectation){
        server.call('testOutputLocations.editUserTestLocationConfig', 'gloria', expectation);
    }

    managerEditsTestLocationConfig(expectation){
        server.call('testOutputLocations.editUserTestLocationConfig', 'miles', expectation);
    }

    // Change Settings

    // Unit Tests
    developerSelectsUnitTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'hugh', locationName, TestType.UNIT, true, expectation);
    }

    designerSelectsUnitTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'gloria', locationName, TestType.UNIT, true, expectation);
    }

    managerSelectsUnitTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'miles', locationName, TestType.UNIT, true, expectation);
    }

    developerClearsUnitTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'hugh', locationName, TestType.UNIT, false, expectation);
    }

    designerClearsUnitTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'gloria', locationName, TestType.UNIT, false, expectation);
    }

    managerClearsUnitTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'miles', locationName, TestType.UNIT, false, expectation);
    }

    // Int Tests
    developerSelectsIntTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'hugh', locationName, TestType.INTEGRATION, true, expectation);
    }

    designerSelectsIntTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'gloria', locationName, TestType.INTEGRATION, true, expectation);
    }

    managerSelectsIntTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'miles', locationName, TestType.INTEGRATION, true, expectation);
    }

    developerClearsIntTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'hugh', locationName, TestType.INTEGRATION, false, expectation);
    }

    designerClearsIntTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'gloria', locationName, TestType.INTEGRATION, false, expectation);
    }

    managerClearsIntTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'miles', locationName, TestType.INTEGRATION, false, expectation);
    }

    // Acc tests
    developerSelectsAccTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'hugh', locationName, TestType.ACCEPTANCE, true, expectation);
    }

    developerClearsAccTestsInConfigForLocation(locationName, expectation){
        server.call('testOutputLocations.setUserTestLocationConfigTestTypeTo', 'hugh', locationName, TestType.ACCEPTANCE, false, expectation);
    }


}

export const OutputLocationsActions = new OutputLocationsActionsClass();
