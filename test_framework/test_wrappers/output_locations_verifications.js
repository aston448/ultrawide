import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class OutputLocationsVerifications{

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    locationExistsCalled(locationName){
        server.call('verifyTestOutputLocations.locationExistsCalled', locationName,
            (function(error, result){
                return(error === null);
            })
        );
    };

    locationDoesNotExistCalled(locationName){
        server.call('verifyTestOutputLocations.locationDoesNotExistCalled', locationName,
            (function(error, result){
                return(error === null);
            })
        );
    };

    location_DetailsAre(locationName, locationDetails){
        server.call('verifyTestOutputLocations.locationDetailsAre', locationName, locationDetails,
            (function(error, result){
                return(error === null);
            })
        );
    };

    // LOCATION FILES --------------------------------------------------------------------------------------------------

    locationFileExistsForLocation_Called(locationName, fileAlias){
        server.call('verifyTestOutputLocations.locationHasFile', locationName, fileAlias,
            (function(error, result){
                return(error === null);
            })
        );
    };

    locationFileDoesNotExistForLocation_Called(locationName, fileAlias){
        server.call('verifyTestOutputLocations.locationDoesNotHaveFile', locationName, fileAlias,
            (function(error, result){
                return(error === null);
            })
        );
    };

    locationFile_ForLocation_HasDetails(fileAlias, locationName, fileDetails){
        server.call('verifyTestOutputLocations.locationFileDetailsAre', locationName, fileAlias, fileDetails,
            (function(error, result){
                return(error === null);
            })
        )
    };

    // USER CONFIG -----------------------------------------------------------------------------------------------------

    designerHasTestConfigLocation(locationName){
        server.call('verifyTestOutputLocations.userConfigIncludesLocation', locationName, 'gloria', RoleType.DESIGNER,
            (function(error, result){
                return(error === null);
            })
        );
    };

    developerHasTestConfigLocation(locationName){
        server.call('verifyTestOutputLocations.userConfigIncludesLocation', locationName, 'hugh', RoleType.DEVELOPER,
            (function(error, result){
                return(error === null);
            })
        );
    };

    anotherDeveloperHasTestConfigLocation(locationName){
        server.call('verifyTestOutputLocations.userConfigIncludesLocation', locationName, 'davey', RoleType.DEVELOPER,
            (function(error, result){
                return(error === null);
            })
        );
    };

    managerHasTestConfigLocation(locationName){
        server.call('verifyTestOutputLocations.userConfigIncludesLocation', locationName, 'miles', RoleType.MANAGER,
            (function(error, result){
                return(error === null);
            })
        );
    };

    designerDoesNotHaveTestConfigLocation(locationName){
        server.call('verifyTestOutputLocations.userConfigDoesNotIncludeLocation', locationName, 'gloria', RoleType.DESIGNER,
            (function(error, result){
                return(error === null);
            })
        );
    };

    developerDoesNotHaveTestConfigLocation(locationName){
        server.call('verifyTestOutputLocations.userConfigDoesNotIncludeLocation', locationName, 'hugh', RoleType.DEVELOPER,
            (function(error, result){
                return(error === null);
            })
        );
    };

    anotherDeveloperDoesNotHaveTestConfigLocation(locationName){
        server.call('verifyTestOutputLocations.userConfigDoesNotIncludeLocation', locationName, 'davey', RoleType.DEVELOPER,
            (function(error, result){
                return(error === null);
            })
        );
    };

    managerDoesNotHaveTestConfigLocation(locationName){
        server.call('verifyTestOutputLocations.userConfigDoesNotIncludeLocation', locationName, 'miles', RoleType.MANAGER,
            (function(error, result){
                return(error === null);
            })
        );
    };

    designerTestConfigurationIs(locationName, configDetails){
        server.call('verifyTestOutputLocations.userConfigDetailsAre', locationName, 'gloria', RoleType.DESIGNER, configDetails,
            (function(error, result){
                return(error === null);
            })
        );
    }

    developerTestConfigurationIs(locationName, configDetails){
        server.call('verifyTestOutputLocations.userConfigDetailsAre', locationName, 'hugh', RoleType.DEVELOPER, configDetails,
            (function(error, result){
                return(error === null);
            })
        );
    }

    anotherDeveloperTestConfigurationIs(locationName, configDetails){
        server.call('verifyTestOutputLocations.userConfigDetailsAre', locationName, 'davey', RoleType.DEVELOPER, configDetails,
            (function(error, result){
                return(error === null);
            })
        );
    }

    managerTestConfigurationIs(locationName, configDetails){
        server.call('verifyTestOutputLocations.userConfigDetailsAre', locationName, 'miles', RoleType.MANAGER, configDetails,
            (function(error, result){
                return(error === null);
            })
        );
    }
}

export default new OutputLocationsVerifications();
