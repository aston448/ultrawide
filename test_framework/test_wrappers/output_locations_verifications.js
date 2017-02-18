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
}

export default new OutputLocationsVerifications();
