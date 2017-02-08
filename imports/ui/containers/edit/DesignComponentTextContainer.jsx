// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import TextEditor from '../../components/edit/TextEditor.jsx';
import ScenarioStepsContainer from './ScenarioStepsContainer.jsx';

// Ultrawide Services
import { ViewType, ComponentType, DisplayContext, StepContext } from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import { Panel } from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services


// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Text Editor Container - gets data for the text sections and Scenario Steps for Design Version Edit / View
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignComponentText extends Component {
    constructor(props) {
        super(props);

    }

    render(){

        const {currentDesignComponent, currentUpdateComponent, mode, view, context, userContext} = this.props;


        let panel1 = <div></div>;
        let panel2 = <div></div>;
        let panel3 = <div></div>;
        let panel4 = <div></div>;

        // Set the source data item
        let mainComponent = null;
        let baseComponent = null;
        let mainComponentFeatureReference = 'NONE';
        let baseComponentFeatureReference = 'NONE';
        let textTitle = '';
        let titleName = '';
        let titleNameOld = '';

        switch(view)
        {
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_UPDATE_WP:
                mainComponent = currentUpdateComponent;
                baseComponent = currentDesignComponent;
                if(mainComponent) {
                    mainComponentFeatureReference = mainComponent.componentFeatureReferenceIdNew;
                    console.log("Feature ref is: " + mainComponent.componentFeatureReferenceIdNew);
                    titleName = mainComponent.componentNameNew;
                    titleNameOld = mainComponent.componentNameOld;
                    textTitle = 'NEW: ' + TextLookups.componentTypeName(mainComponent.componentType) + ' - ' + titleName;
                }
                if(baseComponent){
                    baseComponentFeatureReference = baseComponent.componentFeatureReferenceId;
                }
                break;

            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.DEVELOP_BASE_WP:
                mainComponent = currentDesignComponent;
                if(mainComponent) {
                    mainComponentFeatureReference = mainComponent.componentFeatureReferenceId;
                    titleName = mainComponent.componentName;
                    textTitle = TextLookups.componentTypeName(mainComponent.componentType) + ' - ' + titleName;
                }
                break;

            default:
                console.log("Unknown view type: " + view);
        }

        // Could be up to 4 panels:
        // 1. Item Text
        // 2. Item steps (Scenario only)
        // 3. Old Item Text (if update)
        // 4. Old Item Steps (if Scenario and Update)

        // No item text for Feature Aspects as they are purely for organisation of Scenarios
        if(mainComponent && mainComponent.componentType != ComponentType.FEATURE_ASPECT) {

            let itemStyle = '';

            // Determine the look of the title
            //itemStyle = 'text-title'    //getComponentClass(mainComponent.componentType, mainComponent.componentLevel);

            // Panel 1 is always the main component text
            panel1 =
                <div>
                    <Panel className="panel-text panel-text-body" header={textTitle}>
                        <div>
                            <TextEditor
                                designComponent={mainComponent}
                                mode={mode}
                                view={view}
                                context={context}
                                userContext={userContext}
                            />
                        </div>
                    </Panel>
                </div>;

            // Define panel 2 for Feature background steps if a Feature (could be for an update or base version)
            //console.log("PANEL 2: componentType: " + mainComponent.componentType + " current component: " + mainComponent);
            if(mainComponent && mainComponent.componentType === ComponentType.FEATURE) {
                panel2 =
                    <div>
                        <Panel className="panel-steps panel-steps-body" header="Feature Background Steps">
                            <ScenarioStepsContainer params={{
                                view: view,
                                displayContext: context,
                                stepContext: StepContext.STEP_FEATURE,
                                designId: mainComponent.designId,
                                designVersionId: mainComponent.designVersionId,
                                updateId: mainComponent.designUpdateId,
                                parentReferenceId: mainComponentFeatureReference
                            }}/>
                        </Panel>
                    </div>;
            }

            // Define panel 2 for scenario steps if a Scenario (could be for an update or base version).  Shows both background and scenario steps.  Background here is always read only.
            console.log("PANEL 2: componentType: " + mainComponent.componentType + " current component feature ref: " + mainComponentFeatureReference + " Display Context: " + context);
            if(mainComponent && mainComponent.componentType === ComponentType.SCENARIO && (mainComponentFeatureReference != 'NONE')) {
                panel2 =
                    <div>
                        <Panel className="panel-steps panel-steps-body" header={'Scenario Steps: ' + titleName}>
                            <ScenarioStepsContainer params={{
                                view: view,
                                displayContext: context,
                                stepContext: StepContext.STEP_FEATURE_SCENARIO,
                                designId: mainComponent.designId,
                                designVersionId: mainComponent.designVersionId,
                                updateId: mainComponent.designUpdateId,
                                parentReferenceId: mainComponentFeatureReference
                            }}/>
                            <ScenarioStepsContainer params={{
                                view: view,
                                displayContext: context,
                                stepContext: StepContext.STEP_SCENARIO,
                                designId: mainComponent.designId,
                                designVersionId: mainComponent.designVersionId,
                                updateId: mainComponent.designUpdateId,
                                parentReferenceId: mainComponent.componentReferenceId
                            }}/>
                        </Panel>
                        {/*<Panel className="panel-steps panel-steps-body" header="Scenario Steps">*/}

                        {/*</Panel>*/}
                    </div>;
            }

            // Define panel 3 for updates - base item text - only shown if a current component exists
            if((view === ViewType.DESIGN_UPDATE_EDIT || view === ViewType.DESIGN_UPDATE_VIEW) && baseComponent){
                let baseTextTitle = 'OLD: ' + TextLookups.componentTypeName(baseComponent.componentType) + ' - ' + titleNameOld;
                panel3 =
                    <div>
                        <Panel className="panel-text panel-text-body" header={baseTextTitle}>
                            <div>
                                <TextEditor
                                    designComponent={baseComponent}
                                    mode={mode}
                                    view={view}
                                    context={DisplayContext.BASE_VIEW}
                                    userContext={userContext}
                                />
                            </div>
                        </Panel>
                    </div>;

                // And define panel 4 for Base version scenario steps if a Scenario in an update
                if(baseComponent && baseComponent.componentType === ComponentType.SCENARIO) {
                    panel4 =
                        <div>
                            <Panel className="panel-steps panel-steps-body" header={'OLD Scenario Steps: ' + titleNameOld}>
                                <ScenarioStepsContainer params={{
                                    view: view,
                                    displayContext: DisplayContext.BASE_VIEW,
                                    stepContext: StepContext.STEP_FEATURE_SCENARIO,
                                    designId: baseComponent.designId,
                                    designVersionId: baseComponent.designVersionId,
                                    updateId: baseComponent.designUpdateId,
                                    parentReferenceId: baseComponentFeatureReference
                                }}/>
                                <ScenarioStepsContainer params={{
                                    view: view,
                                    displayContext: DisplayContext.BASE_VIEW,
                                    stepContext: StepContext.STEP_SCENARIO,
                                    designId: baseComponent.designId,
                                    designVersionId: baseComponent.designVersionId,
                                    updateId: 'NONE',
                                    scenarioReferenceId: baseComponent.componentReferenceId,
                                    parentReferenceId: baseComponentFeatureReference
                                }}/>

                            </Panel>
                        </div>;
                }
            }

            return (

                <Grid className="close-grid" fluid={true}>
                    <Row>
                        <Col md={12} className="close-col">
                            {panel1}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="close-col">
                            {panel2}
                        </Col>
                    </Row>
                    <Row>
                        <div className="new-old-divider"></div>
                    </Row>
                    <Row>
                        <Col md={12} className="close-col">
                            {panel3}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="close-col">
                            {panel4}
                        </Col>
                    </Row>
                </Grid>
            )

        } else {
            return (
                <Panel header="">
                </Panel>
            )
        }

    }
}

DesignComponentText.propTypes = {
    currentDesignComponent: PropTypes.object,
    currentUpdateComponent: PropTypes.object,
    mode: PropTypes.string,
    view: PropTypes.string,
    context: PropTypes.string,
    userContext: PropTypes.object
};


export default DesignComponentTextContainer = createContainer(({params}) => {

    // Get the various bits of text we need for the design component context.  Will include Scenario Steps for Scenarios
    return ClientContainerServices.getTextDataForDesignComponent(params.currentContext, params.mode, params.view, params.displayContext);


}, DesignComponentText);