import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class OutputLocationsVerifications{

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

}

export default new OutputLocationsVerifications();
