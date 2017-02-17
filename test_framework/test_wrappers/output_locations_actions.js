
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class OutputLocationActions{

    // Add Location
    developerAddsNewLocation(expectation){
        server.call('testOutputLocations.addNewLocation', RoleType.DEVELOPER, expectation);
    }

    designerAddsNewLocation(expectation){
        server.call('testOutputLocations.addNewLocation', RoleType.DESIGNER, expectation);
    }

    managerAddsNewLocation(expectation){
        server.call('testOutputLocations.addNewLocation', RoleType.MANAGER, expectation);
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
}

export default new OutputLocationActions();