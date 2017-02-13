
// Ultrawide Collections
import {TestOutputLocations}        from '../../collections/dev/test_output_locations.js'
import {TestOutputLocationFiles}    from '../../collections/dev/test_output_location_files.js'


// Ultrawide Services
import { TestLocationType, ComponentType} from '../../constants/constants.js';
import { DefaultLocationText } from '../../constants/default_names.js';

//======================================================================================================================
//
// Server Code for Test Output Locations.
//
// Methods called directly by Server API
//
//======================================================================================================================

class TestOutputLocationServices {

    // Add a new design an its default draft design version
    addLocation() {

        if (Meteor.isServer) {

            // Create a new default entry...
            let locationId = TestOutputLocations.insert(
                {
                    locationName:           DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
                    locationType:           TestLocationType.SHARED
                }
            );
        }

    };
}

export default new TestOutputLocationServices();