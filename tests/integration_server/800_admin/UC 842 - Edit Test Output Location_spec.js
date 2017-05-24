
import TestFixtures                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType, UltrawideDirectory} from '../../../imports/constants/constants.js';

describe('UC 842 - Edit Test Output Location', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 842 - Edit Test Output Location');
    });

    after(function(){

    });

    beforeEach(function(){

        // Don't need any design data for these tests
        TestFixtures.clearAllData();

        // Add a new location
        OutputLocationsActions.developerAddsNewLocation();
    });

    afterEach(function(){

    });


    // Actions
    it('Any user can update and save the properties of a Test Output Location', function(){

        TestFixtures.clearTestResultsFiles('Location1');

        // Setup
        const oldDetails = {
            locationName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
            locationIsShared:   false,
            locationPath:       'NONE',
            locationFullPath:   'NONE'
        };

        const newDetailsDev = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test_dev/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test_dev/'
        };

        const newDetailsDes = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test_des/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test_des/'
        };

        const newDetailsMan = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test_man/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test_man/'
        };

        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, oldDetails));

        // Execute - developer
        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetailsDev);

        // Verify
        expect(OutputLocationsVerifications.location_DetailsAre('Location1', newDetailsDev));

        // Execute - designer
        OutputLocationsActions.designerSavesLocation('Location1', newDetailsDes);

        // Verify
        expect(OutputLocationsVerifications.location_DetailsAre('Location1', newDetailsDes));

        // Execute - developer
        OutputLocationsActions.managerSavesLocation('Location1', newDetailsMan);

        // Verify
        expect(OutputLocationsVerifications.location_DetailsAre('Location1', newDetailsMan));
    });

    // Conditions
    it('A Test Output Location may not be given the same name as an existing Test Output Location', function(){

        const defaultDetails = {
            locationName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
            locationIsShared:   false,
            locationPath:       'NONE',
            locationFullPath:   'NONE'
        };

        // Setup - update the new Location
        const newDetails = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test_test/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test_test/'
        };

        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);

        // Add another location
        OutputLocationsActions.developerAddsNewLocation();

        // Execute - try to update it with same name - Location1
        const expectation = {success:false, message: TestOutputLocationValidationErrors.LOCATION_INVALID_NAME_DUPLICATE};
        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails, expectation);

        // Verify - still default
        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, defaultDetails));
    });

    it('A Test Output Location may not be given the same path as an existing Test Output Location', function(){

        const defaultDetails = {
            locationName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
            locationIsShared:   false,
            locationPath:       'NONE',
            locationFullPath:   'NONE'
        };

        // Setup - update the new Location
        const newDetails = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test_test/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test_test/'
        };

        const dupePathDetails = {
            locationName:       'Location2',
            locationIsShared:   true,
            locationPath:       'test_test/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test_test/'
        };

        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);

        // Add another location
        OutputLocationsActions.developerAddsNewLocation();

        // Execute - try to update it with same name - Location1
        const expectation = {success:false, message: TestOutputLocationValidationErrors.LOCATION_INVALID_PATH_DUPLICATE};
        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, dupePathDetails, expectation);

        // Verify - still default
        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, defaultDetails));

    });

    // Consequences
    it('When a Test Output Location path is specified the corresponding directories are created on the Ultrawide server', function(){

        TestFixtures.clearTestResultsFiles('Location1');

        // Setup - update the new Location
        const newDetails = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test/integration/build/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test/integration/build/'
        };

        // Execute
        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);

        // Verify
        expect(OutputLocationsVerifications.locationDirectoryExists('test/integration/build/'));

    });

    it('When a Test Output Location path is modified the old directories are removed and new created on the Ultrawide server', function(){

        TestFixtures.clearTestResultsFiles('Location1');

        // Setup - update the new Location
        let newDetails = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test/integration/build/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test/integration/build/'
        };

        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);

        // Check
        expect(OutputLocationsVerifications.locationDirectoryExists('test/integration/build/'));

        // Now change the path
        newDetails = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test/unit/build/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test/unit/build/'
        };

        OutputLocationsActions.developerSavesLocation('Location1', newDetails);

        // Verify old gone
        expect(OutputLocationsVerifications.locationDirectoryDoesNotExist('test/integration/build/'));

        // And new created
        expect(OutputLocationsVerifications.locationDirectoryExists('test/unit/build/'));

    });

    it('When a Test Output Location path directory is renamed the corresponding directory is renamed on the Ultrawide server', function(){

        TestFixtures.clearTestResultsFiles('Location1');

        // Setup - update the new Location
        let newDetails = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test/integration/build/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test/integration/build/'
        };

        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);

        // Check
        expect(OutputLocationsVerifications.locationDirectoryExists('test/integration/build/'));

        // Now change the path
        newDetails = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test/integration/test/',
            locationFullPath:   process.env.ULTRAWIDE_DATA_STORE + UltrawideDirectory.TEST_OUTPUT_DIR + 'test/integration/test/'
        };

        OutputLocationsActions.developerSavesLocation('Location1', newDetails);

        // Verify old gone
        expect(OutputLocationsVerifications.locationDirectoryDoesNotExist('test/integration/build/'));

        // And new created
        expect(OutputLocationsVerifications.locationDirectoryExists('test/integration/test/'));
    });

});
