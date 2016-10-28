import fs from 'fs';

import {DesignComponents}       from '../collections/design/design_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';
import {FeatureBackgroundSteps} from '../collections/design/feature_background_steps.js';
import {ScenarioSteps}          from '../collections/design/scenario_steps.js';
import {WorkPackages}           from '../collections/work/work_packages.js';

import {ComponentType, WorkPackageType, LogLevel} from '../constants/constants.js';
import {log} from '../common/utils.js';

class FeatureFileServices{

    // Convert a whole base design feature into a Gherkin feature file
    writeFeatureFile(featureReferenceId, userContext, filePath){


        log((msg) => console.log(msg), LogLevel.TRACE, 'Exporting feature file to {}', filePath);

        const wp = WorkPackages.findOne({_id: userContext.workPackageId});

        // This function should always be called in a WP context
        if(!wp){return;}

        let feature = null;
        let scenarios = null;
        let featureName = '';

        switch (wp.workPackageType){
            case WorkPackageType.WP_BASE:
                feature = DesignComponents.findOne(
                    {
                        designVersionId: userContext.designVersionId,
                        componentReferenceId: featureReferenceId
                    }
                );

                featureName = feature.componentName;

                scenarios = DesignComponents.find(
                    {
                        designVersionId: userContext.designVersionId,
                        componentType: ComponentType.SCENARIO,
                        componentFeatureReferenceId: featureReferenceId
                    }
                ).fetch();
                break;

            case WorkPackageType.WP_UPDATE:
                feature = DesignUpdateComponents.findOne(
                    {
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        componentReferenceId: featureReferenceId
                    }
                );

                featureName = feature.componentNameNew;

                scenarios = DesignUpdateComponents.find(
                    {
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        componentType: ComponentType.SCENARIO,
                        componentFeatureReferenceId: featureReferenceId
                    }
                ).fetch();
                break;
        }

        log((msg) => console.log(msg), LogLevel.TRACE, 'Feature exporting is {}', featureName);

        const backgroundSteps = FeatureBackgroundSteps.find(
            {
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                featureReferenceId: featureReferenceId
            }
        ).fetch();


        const fileName = featureName.replace(/ /g, '_') + '.feature';

        let fileText = '@test\n';

        // Header ------------------------------------------------------------------------------------------------------
        fileText += ('Feature: ' + featureName + '\n\n');

        // Narrative - could add here TODO? ----------------------------------------------------------------------------

        // Background --------------------------------------------------------------------------------------------------
        fileText += ('  Background:\n');

        backgroundSteps.forEach((step) => {
            fileText += ('    ' + step.stepType + ' ' + step.stepText + '\n');
        });

        fileText += '\n';

        // Scenarios ---------------------------------------------------------------------------------------------------
        scenarios.forEach((scenario) => {
            let scenarioSteps = [];

            fileText += '  @test\n';
            fileText += '  Scenario: ' + scenario.componentName + '\n';

            scenarioSteps = ScenarioSteps.find(
                {
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId,
                    scenarioReferenceId: scenario.componentReferenceId
                }
            ).fetch();

            scenarioSteps.forEach((step) => {
                fileText += ('    ' + step.stepType + ' ' + step.stepText + '\n');
            });

            fileText += '\n';

        });

        fs.writeFileSync(filePath + fileName, fileText);

    };

    getFeatureFiles(filePath){
        log((msg) => console.log(msg), LogLevel.TRACE, "Looking fro FEATURE FILES at {}", filePath);

        if(filePath != 'NONE'){

            let featureFiles = [];
            let files = fs.readdirSync(filePath);

            log((msg) => console.log(msg), LogLevel.TRACE, "Found {} files", files.length);

            files.forEach((file) => {
                let fileText = '';

                log((msg) => console.log(msg), LogLevel.TRACE, "Checking file {} with ending {} ", file, file.substring(file.length - 8));

                // Don't use endsWith - not supported by IE
                if (file.substring(file.length - 8) === '.feature'){

                    featureFiles.push(file);
                }
            });

            return featureFiles;

        } else {
            return [];
        }
    };

    getFeatureFileText(filePath, fileName){

        return fs.readFileSync(filePath + fileName);

    }

    getFeatureName(fileText){

        let featureStartIndex = fileText.indexOf('Feature:');
        let featureEndIndex = 0;



        if(featureStartIndex >= 0){

            featureEndIndex = fileText.indexOf('\n', featureStartIndex);

            log((msg) => console.log(msg), LogLevel.TRACE, "Looking for feature name from {} to {}", featureStartIndex, featureEndIndex);

            return(
                {
                    feature: fileText.substring(featureStartIndex + 8, featureEndIndex).trim(),
                    tag: this.getTag(fileText, featureStartIndex)
                }
            )

        } else {
            return '';
        }
    }

    getFeatureScenarios(fileText){

        let scenarioStartIndex = fileText.indexOf('Scenario:', 0);
        let scenarioEndIndex = 0;
        let scenarios = [];

        while (scenarioStartIndex >= 0){
            scenarioEndIndex = fileText.indexOf('\n', scenarioStartIndex);

            log((msg) => console.log(msg), LogLevel.TRACE, "Looking for scenario name from {} to {}", scenarioStartIndex, scenarioEndIndex);

            scenarios.push(
                {
                    scenario: fileText.substring(scenarioStartIndex + 9, scenarioEndIndex).trim(),
                    tag: this.getTag(fileText, scenarioStartIndex)
                }
            );
            scenarioStartIndex = fileText.indexOf('Scenario:', scenarioEndIndex);
        }



        // let scenarioRegex = new RegExp('/Scenario:/', 'g');
        //
        // let scenarios = [];
        //
        // let matchArr, start, end;
        //
        // while ((matchArr = scenarioRegex.exec(fileText)) !== null) {
        //     log((msg) => console.log(msg), LogLevel.TRACE, "Found scenario at index {}", matchArr.index);
        //     start = matchArr.index;
        //     end = fileText.indexOf('\n', start);
        //
        //     scenarios.push(fileText.substring(start + 9, end).trim());
        // }

        return scenarios;

    }

    getTag(fileText, tagLocation){

        // Assume that we pass in the location of a Feature: or Scenario: found in the file text.

        // We progress back until we hit an @

        const lastAtPos = fileText.lastIndexOf('@', tagLocation);

        const tagEnd = fileText.indexOf('\n', lastAtPos);

        const tag = fileText.substring(lastAtPos, tagEnd);

        log((msg) => console.log(msg), LogLevel.TRACE, "Found tag {}", tag);

        return tag;
    }

}

export default new FeatureFileServices();
