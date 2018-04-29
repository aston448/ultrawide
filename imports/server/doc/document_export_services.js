

import officegen from 'officegen';
import fs from 'fs';
import async from 'async';
import {convertFromRaw} from 'draft-js';

import { WordExportModules } from './word_export_modules.js';

import { DesignData }           from '../../../imports/data/design/design_db.js';
import { DesignVersionData }    from '../../../imports/data/design/design_version_db.js';
import { DesignComponentData }  from '../../../imports/data/design/design_component_db.js';
import { DomainDictionaryData }from '../../../imports/data/design/domain_dictionary_db.js';

import { log } from '../../../imports/common/utils.js';

import { ComponentType, UpdateMergeStatus, LogLevel, UltrawideDirectory } from "../../constants/constants";
import { DefaultDetailsText } from "../../constants/default_names";

class DocumentExportServicesClass{

    exportWordDocument(designId, designVersionId, options){

        log((msg) => console.log(msg), LogLevel.INFO, 'Exporting DV as Word Doc with options: Section {}, Feature {}, Narrative: {}, Scenario {}',
            options.includeSectionText, options.includeFeatureText, options.includeNarrativeText, options.includeScenarioText);

        let docx = officegen ( {
            type: 'docx',
            orientation: 'portrait',
            pageMargins: { top: 100, left: 100, bottom: 100, right: 100 }
        } );

        docx.on ( 'error', ( err ) => {
            log((msg) => console.log(msg), LogLevel.ERROR, 'Error generating document: {}', err);
        });


        // Get Data ----------------------------------------------------------------------------------------------------
        const designVersionData = this.getDesignVersionData(designId, designVersionId);

        // Make the Doc ------------------------------------------------------------------------------------------------
        let paragraph = docx.createP();

        // Front Page
        WordExportModules.mainTitle(paragraph, designVersionData.designName);
        paragraph = docx.createP();
        WordExportModules.subTitle(paragraph, designVersionData.designVersionName + ' version: ' + designVersionData.designVersionNumber);



        // Get the applications in the order they are in the Design Version
        const applications = this.getApplications(designVersionId);

        applications.forEach((application) => {

            if(application.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {

                WordExportModules.newPage(docx);

                paragraph = docx.createP();
                WordExportModules.application(paragraph, application.componentNameNew);

                // Details
                if (options.includeSectionText){
                    let details = convertFromRaw(application.componentTextRawNew).getPlainText();

                    if (details !== DefaultDetailsText.NEW_APPLICATION_DETAILS) {
                        paragraph = docx.createP();
                        WordExportModules.details(paragraph, details);
                    }
                }

                // Recursively get sections
                this.getChildDesignSections(docx, designVersionId, application.componentReferenceId, options);
            }

        });

        // Domain Dictionary
        const dictionary = DomainDictionaryData.getAllTerms(designId, designVersionId);

        WordExportModules.newPage(docx);

        paragraph = docx.createP();
        WordExportModules.application(paragraph, 'Domain Dictionary');

        paragraph = docx.createP ();
        paragraph.addHorizontalLine ();

        dictionary.forEach((term) => {

            paragraph = docx.createP();
            WordExportModules.term(paragraph, term.domainTermNew);

            let definition = convertFromRaw(term.domainTextRaw).getPlainText();

            paragraph = docx.createP();
            WordExportModules.definition(paragraph, definition);

            paragraph = docx.createP ();
            paragraph.addHorizontalLine ();

        });


        // Write File --------------------------------------------------------------------------------------------------

        const dataStore = process.env.ULTRAWIDE_DATA_STORE;
        const exportDir = dataStore + UltrawideDirectory.EXPORT_DIR;
        const fileName = designVersionData.designVersionName.trim().replace(/ /g, '_', ) + '.docx';

        let out = fs.createWriteStream ( exportDir + fileName );

        out.on ( 'error', function ( err ) {
            log((msg) => console.log(msg), LogLevel.ERROR, 'Error creating file stream: {}', err);
        });

        async.parallel ([
            function ( done ) {
                out.on ( 'close', function () {
                    log((msg) => console.log(msg), LogLevel.INFO, 'Exported {} to {}', fileName, exportDir);
                        done ( null );
                });
                docx.generate ( out );
            }

        ], function ( err ) {
            if ( err ) {
                log((msg) => console.log(msg), LogLevel.ERROR, 'Error creating file: {}', err);
            }
        });
    }

    getDesignVersionData(designId, designVersionId){

        const design = DesignData.getDesignById(designId);
        const designVersion = DesignVersionData.getDesignVersionById(designVersionId);

        return{
            designName:             design.designName,
            designVersionName:      designVersion.designVersionName,
            designVersionNumber:    designVersion.designVersionNumber
        }
    }

    getApplications(designVersionId){

        return DesignVersionData.getAllApplications(designVersionId);
    }

    getChildDesignSections(docx, designVersionId, parentReferenceId, options){

        const childComponents = DesignComponentData.getChildComponents(designVersionId, parentReferenceId);

        let featureCount = 0;
        let paragraph = null;

        childComponents.forEach((component) => {

            if(component.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {

                if (component.componentType === ComponentType.DESIGN_SECTION) {

                    // Start new sections on new pages if we are including section text
                    if (options.includeSectionText) {
                        WordExportModules.newPage(docx);
                    } else {
                        WordExportModules.newLine(docx);
                    }

                    paragraph = docx.createP();
                    WordExportModules.designSection(paragraph, component.componentNameNew, component.componentLevel);

                    // Details
                    if (options.includeSectionText) {
                        let details = convertFromRaw(component.componentTextRawNew).getPlainText();

                        if (details !== DefaultDetailsText.NEW_DESIGN_SECTION_DETAILS) {
                            paragraph = docx.createP();
                            WordExportModules.details(paragraph, details);
                        }
                    }

                    this.getChildDesignSections(docx, designVersionId, component.componentReferenceId, options)

                } else {

                    // It must be a feature

                    // For all features apart from the first one, start a new page
                    // if(featureCount > 0){
                    //     WordExportModules.newPage(docx);
                    // }

                    this.writeFeature(docx, designVersionId, component.componentReferenceId, options);

                    featureCount++;
                }
            }

        });
    }

    writeFeature(docx, designVersionId, featureRefId, options){

        let  paragraph = docx.createP ();
        paragraph.addHorizontalLine ();

        const feature = DesignComponentData.getDesignComponentByRef(designVersionId, featureRefId);

        paragraph = docx.createP();
        WordExportModules.feature(paragraph, feature.componentNameNew);

        if(options.includeNarrativeText) {
            let narrativeText = feature.componentNarrativeNew.replace('So', 'so');

            paragraph = docx.createP();

            WordExportModules.narrative(paragraph, narrativeText);
        }

        // Details
        if (options.includeFeatureText) {
            let details = convertFromRaw(feature.componentTextRawNew).getPlainText();

            if (details !== DefaultDetailsText.NEW_FEATURE_DETAILS) {
                paragraph = docx.createP();
                WordExportModules.details(paragraph, details);
            }
        }

        this.writeFeatureAspects(docx, designVersionId, featureRefId, options)
    }

    writeFeatureAspects(docx, designVersionId, featureRefId, options){

        const aspects = DesignComponentData.getFeatureAspects(designVersionId, featureRefId);

        aspects.forEach((aspect) => {

            if(aspect.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {

                // Only include aspect if it has scenarios
                if (DesignComponentData.getChildCount(designVersionId, aspect.componentReferenceId) > 0) {

                    let paragraph = docx.createP();

                    WordExportModules.aspect(paragraph, aspect.componentNameNew);

                    this.writeScenarios(docx, designVersionId, aspect.componentReferenceId, options);
                }
            }
        });

    }

    writeScenarios(docx, designVersionId, aspectRefId, options){

        const scenarios = DesignComponentData.getNonRemovedChildComponentsOfType(designVersionId, ComponentType.SCENARIO, aspectRefId);

        scenarios.forEach((scenario) => {

            let paragraph = docx.createListOfDots();
            WordExportModules.scenario(paragraph, scenario.componentNameNew);

            // Details
            if(options.includeScenarioText) {
                let details = convertFromRaw(scenario.componentTextRawNew).getPlainText();

                if (details !== DefaultDetailsText.NEW_SCENARIO_DETAILS) {
                    paragraph = docx.createP();
                    WordExportModules.details(paragraph, details);
                }
            }
        });
    }

}

export const DocumentExportServices = new DocumentExportServicesClass();