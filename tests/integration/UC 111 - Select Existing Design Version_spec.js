import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 111 - Select Existing Design Version', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        // Name first Design Version
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Add Basic Data to the Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testFixtures.AddBasicDesignData', 'Design1', 'DesignVersion1');
        // Create a second Design Version
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

    });

    afterEach(function(){

    });


    // Actions
    it('An existing Design Version can be selected as the current working Design Version', function(){

        // Work on Design1
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');

        // Select DV1
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');

        // Verify Context has DV1
        server.call('verifyDesignVersions.currentDesignVersionNameIs', 'DesignVersion1', 'gloria');

        // Select DV2
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');

        // Verify Context has DV2
        server.call('verifyDesignVersions.currentDesignVersionNameIs', 'DesignVersion2', 'gloria');

    });


    // Consequences
    it('When a new Design Version is chosen previous user context except for the Design is cleared', function(){

        // Work on Design1
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');

        // Select DV1
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');

        // Select a component of DV1
        server.call('testDesigns.editDesignVersion', 'Design1', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignComponents.selectComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');

        server.call('verifyUserContext.designComponentIs', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');

        // Change to DV2
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');

        // Verify that old design component cleared
        server.call('verifyUserContext.designComponentIsNone', 'gloria');
    });

});
