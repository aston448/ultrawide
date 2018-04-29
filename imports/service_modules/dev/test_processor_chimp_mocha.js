import fs from 'fs';

// Ultrawide Services
import {ComponentType, LogLevel}   from '../../constants/constants.js';
import {log}        from '../../common/utils.js';

// Data Access
import { DesignComponentData }                      from '../../data/design/design_component_db.js';
import { DesignUpdateComponentData }                from '../../data/design_update/design_update_component_db.js';


// Plugin class to read test results from a screen scraped chimp mocha JSON reported file
class ChimpMochaTestServicesClass {

    writeIntegrationTestFile(userContext, outputDir){

        if(Meteor.isServer) {

            // Get the selected Feature - already validated that current item is a Feature
            let feature = null;

            // Are we working from an Initial Design or a Design Update?
            if(userContext.designUpdateId === 'NONE') {
                feature = DesignComponentData.getDesignComponentById(userContext.designComponentId);
            } else {
                feature = DesignUpdateComponentData.getUpdateComponentById(userContext.designComponentId);
            }

            if(!feature){
                log((msg) => console.log(msg), LogLevel.ERROR, "No Feature found");
                return;
            }

            const fileName = feature.componentNameNew + '_spec.js';

            log((msg) => console.log(msg), LogLevel.DEBUG, "Writing integration test file {}", fileName);


            // Safety - don't export if file exists to prevent accidental overwrite of good data
            if(fs.existsSync(outputDir + fileName)){
                log((msg) => console.log(msg), LogLevel.DEBUG, "File {} already exists, not overwriting.", fileName);
                throw new Meteor.Error("FILE_EXISTS", "Integration test exists already for this Feature.  Remove file first if you want to replace it");
            }

            let fileText = '';

            // Add the top parts
            fileText += "describe('" + feature.componentNameNew + "', function(){\n";
            fileText += "\n";
            fileText += "    before(function(){\n\n";
            fileText += "    });";
            fileText += "\n";
            fileText += "\n";
            fileText += "    after(function(){\n\n";
            fileText += "    });";
            fileText += "\n";
            fileText += "\n";
            fileText += "    beforeEach(function(){\n\n";
            fileText += "    });";
            fileText += "\n";
            fileText += "\n";
            fileText += "    afterEach(function(){\n\n";
            fileText += "    });";
            fileText += "\n";
            fileText += "\n";

            // Now loop through the Scenarios creating pending tests
            let featureAspects = [];

            if(userContext.designUpdateId === 'NONE') {
                featureAspects = DesignComponentData.getFeatureAspects(userContext.designVersionId, feature.componentReferenceId);
            } else {
                featureAspects = DesignUpdateComponentData.getNonRemovedAspectsForFeature(userContext.designUpdateId, feature.componentReferenceId);
            }

            featureAspects.forEach((aspect) =>{
                let scenarios = [];

                if(userContext.designUpdateId === 'NONE') {
                    scenarios = DesignComponentData.getChildComponentsOfType(userContext.designVersionId, ComponentType.SCENARIO, aspect.componentReferenceId)
                } else {
                    scenarios = DesignUpdateComponentData.getNonRemovedChildComponentsOfType(userContext.designUpdateId, ComponentType.SCENARIO, aspect.componentReferenceId);
                }

                // Add Feature aspect comment and scenarios if there are any
                if(scenarios.length > 0) {

                    fileText += "\n    describe('" + aspect.componentNameNew + "', function(){\n";

                    scenarios.forEach((scenario) => {

                        fileText += "        it('" + scenario.componentNameNew + "');\n\n";

                    });

                    // End aspect describe
                    fileText += "    });\n"
                }

            });

            // And tidy up the bottom
            fileText += "});\n";

            // And write the file
            fs.writeFileSync(outputDir + fileName, fileText);

            log((msg) => console.log(msg), LogLevel.DEBUG, "File written: {}", fileName);
        }

    }


}

export const ChimpMochaTestServices = new ChimpMochaTestServicesClass();