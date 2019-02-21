// Meteor / React Services
import React from 'react';

// Ultrawide GUI Components
import DesignEditorHeader           from '../../imports/ui/components/common/DesignEditorHeader.jsx';
import DesignEditorFooter           from '../../imports/ui/components/common/DesignEditorFooter.jsx';
import DesignComponentTarget        from '../../imports/ui/components/edit/DesignComponentTarget.jsx';
import DesignComponentAdd           from '../../imports/ui/components/common/DesignComponentAdd.jsx';
import DesignComponentTextContainer from '../../imports/ui/containers/edit/DesignComponentTextContainer.jsx';
import DomainDictionaryContainer    from '../../imports/ui/containers/edit/DomainDictionaryContainer.jsx';
import DesignUpdateSummaryContainer from '../../imports/ui/containers/summary/UpdateSummaryContainer.jsx';
import MashSelectedItemContainer    from '../../imports/ui/containers/mash/MashSelectedItemContainer.jsx';
import ScenarioFinder               from '../../imports/ui/components/search/ScenarioFinder.jsx';
import TestExpectationSelectedItemContainer    from "../ui/containers/mash/TestExpectationSelectedItemContainer.jsx";
import DesignAnomalyContainer       from '../../imports/ui/containers/item/DesignAnomalyContainer.jsx';
import TabTitle                     from '../../imports/ui/components/common/TabTitle.jsx';

// Ultrawide Services
import {DisplayContext, RoleType, ViewMode, ViewType, WorkPackageType, ComponentType, LogLevel, EditorTab } from "../constants/constants";
import {AddActionIds, UITab} from "../constants/ui_context_ids";
import { log }        from '../common/utils.js';

import { ClientWorkPackageComponentServices }   from "../apiClient/apiClientWorkPackageComponent";
import { ClientDesignVersionServices }          from "../apiClient/apiClientDesignVersion";
import { ClientDesignComponentServices }        from "../apiClient/apiClientDesignComponent";
import { ClientDesignUpdateComponentServices }  from "../apiClient/apiClientDesignUpdateComponent";


// Bootstrap
import {Grid, Row, Col, Tabs, Tab, Glyphicon, Badge} from 'react-bootstrap';

// REDUX services
import store from '../redux/store'
import {setCurrentUserDesignTab, setCurrentUserUpdateTab, setCurrentUserWpTab, setCurrentUserDevTab} from '../redux/actions'



class EditorContainerUiModulesClass{

    getDesignItem(application, displayContext, userContext){
        // Design Item needed only in WP context (otherwise we already have it as the current item)
        if(displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.WP_VIEW || displayContext === DisplayContext.DEV_DESIGN) {
            if(userContext.designUpdateId === 'NONE'){
                return ClientWorkPackageComponentServices.getDesignItem(application._id, WorkPackageType.WP_BASE);
            } else {
                return ClientWorkPackageComponentServices.getDesignItem(application._id, WorkPackageType.WP_UPDATE);
            }
        } else {
            return application;
        }
    }

    getDesignUpdateItem(item, displayContext, designUpdateId){

        switch(displayContext){
            case  DisplayContext.WORKING_VIEW:
                return ClientDesignVersionServices.getDesignUpdateItemForUpdatableVersion(item);
            case DisplayContext.UPDATE_SCOPE:
                // See if this item is in scope - i.e. in the DU
                return ClientDesignVersionServices.getDesignUpdateItemForUpdate(item, designUpdateId);
            case DisplayContext.WP_SCOPE:
            case DisplayContext.DEV_DESIGN:
                if(designUpdateId !== 'NONE'){
                    return ClientDesignVersionServices.getDesignUpdateItemForUpdate(item, designUpdateId);
                } else {
                    return item;
                }
            default:
                return item;
        }
    }

    getWpItem(currentItem, workPackageId){
        return ClientWorkPackageComponentServices.getWorkPackageComponent(currentItem.componentReferenceId, workPackageId);
    }

    getCurrentDesignTab(){

        return store.getState().currentUserDesignTab;
    }

    getCurrentUpdateTab(){

        return store.getState().currentUserUpdateTab;
    }

    getCurrentWpTab(){

        return store.getState().currentUserWpTab;
    }

    getCurrentDevTab(){

        return store.getState().currentUserDevTab;
    }

    setCurrentDesignTab(tab){

        store.dispatch(setCurrentUserDesignTab(tab));
    }

    setCurrentUpdateTab(tab){

        store.dispatch(setCurrentUserUpdateTab(tab));
    }

    setCurrentWpTab(tab){

        store.dispatch(setCurrentUserWpTab(tab));
    }

    setCurrentDevTab(tab){

        store.dispatch(setCurrentUserDevTab(tab));
    }

    // A list of top level applications in the design / design update
    renderApplications(applications, displayContext, userContext, view, mode, testSummary) {
        return applications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={this.getDesignItem(application, displayContext, userContext)}
                    updateItem={this.getDesignUpdateItem(application, displayContext, userContext.designUpdateId)}
                    wpItem={this.getWpItem(application, userContext.workPackageId)}
                    displayContext={displayContext}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                />
            );

        });
    }

    onAddApplication(view, mode, designVersionId, designUpdateId){

        // Add a new application to the design or design update
        if(designUpdateId !== 'NONE') {
            ClientDesignUpdateComponentServices.addApplicationToDesignVersion(view, mode, designVersionId, designUpdateId);
        } else {
            ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersionId);
        }

    }


    getMainEditors(baseApplications, workingApplications, updateApplications, wpApplications, designSummaryData, userContext, userRole, view, mode, viewOptions, editorClass){

        let displayContext = DisplayContext.NONE;

        // Main Editors ------------------------------------------------------------------------------------------------

        let scopeEditor = '';
        let mainEditor = '';
        let viewEditor = '';

        let addComponent = this.getAddComponent(view, mode, userContext);

        switch(view){

            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:

                // Design Edit

                if(mode === ViewMode.MODE_EDIT && userRole === RoleType.DESIGNER) {
                    displayContext = DisplayContext.BASE_EDIT;
                } else {
                    displayContext = DisplayContext.BASE_VIEW;
                }

                mainEditor =
                    <div className="design-editor-container">
                        <DesignEditorHeader
                            displayContext={displayContext}
                        />
                        <div className={editorClass}>
                            {this.renderApplications(baseApplications, displayContext, userContext, view, mode, viewOptions.testSummaryVisible)}
                            {addComponent}
                        </div>
                        <DesignEditorFooter
                            hasDesignSummary={true}
                            displayContext={displayContext}
                            designSummaryData={designSummaryData}
                        />
                    </div>;

                break;

            case ViewType.DESIGN_UPDATABLE:

                displayContext = DisplayContext.WORKING_VIEW;

                mainEditor =
                    <div className="design-editor-container">
                        <DesignEditorHeader
                            displayContext={displayContext}
                        />
                        <div className={editorClass}>
                            {this.renderApplications(workingApplications, displayContext, userContext, view, mode, viewOptions.testSummaryVisible)}
                            {addComponent}
                        </div>
                        <DesignEditorFooter
                            hasDesignSummary={true}
                            displayContext={displayContext}
                            designSummaryData={designSummaryData}
                        />
                    </div>;
                break;

            case ViewType.DESIGN_UPDATE_EDIT:

                displayContext = DisplayContext.UPDATE_EDIT;

                scopeEditor =
                    <div id="scopePane" className="design-editor-container">
                        <DesignEditorHeader
                            displayContext={DisplayContext.UPDATE_SCOPE}
                        />
                        <div className={editorClass}>
                            {this.renderApplications(baseApplications, DisplayContext.UPDATE_SCOPE, userContext, view, mode, viewOptions.testSummaryVisible)}
                        </div>
                        <DesignEditorFooter
                            displayContext={displayContext}
                            hasDesignSummary={false}
                        />
                    </div>;

                mainEditor =
                    <div id="editorPaneEdit" className="design-editor-container">
                        <DesignEditorHeader
                            displayContext={displayContext}
                        />
                        <div className={editorClass}>
                            {this.renderApplications(updateApplications, displayContext, userContext, view, mode, false)}
                            {addComponent}
                        </div>
                        <DesignEditorFooter
                            displayContext={displayContext}
                            hasDesignSummary={false}
                        />
                    </div>;

                viewEditor =
                    <div id="editorPaneWorking" className="design-editor-container">
                        <DesignEditorHeader
                            displayContext={DisplayContext.WORKING_VIEW}
                        />
                        <div className={editorClass}>
                            {this.renderApplications(workingApplications, DisplayContext.WORKING_VIEW, userContext, view, mode, false)}
                        </div>
                        <DesignEditorFooter
                            displayContext={DisplayContext.WORKING_VIEW}
                            hasDesignSummary={false}
                        />
                    </div>;

                break;

            case ViewType.DESIGN_UPDATE_VIEW:

                displayContext = DisplayContext.UPDATE_VIEW;

                mainEditor =
                    <div id="editorPaneView" className="design-editor-container">
                        <DesignEditorHeader
                            displayContext={displayContext}
                        />
                        <div className={editorClass}>
                            {this.renderApplications(updateApplications, displayContext, userContext, view, mode, viewOptions.testSummaryVisible)}
                        </div>
                        <DesignEditorFooter
                            displayContext={displayContext}
                            hasDesignSummary={false}
                        />
                    </div>;


                viewEditor =
                    <div id="editorPaneWorking" className="design-editor-container">
                        <DesignEditorHeader
                            displayContext={DisplayContext.WORKING_VIEW}
                        />
                        <div className={editorClass}>
                            {this.renderApplications(workingApplications, DisplayContext.WORKING_VIEW, userContext, view, mode, false)}
                        </div>
                        <DesignEditorFooter
                            displayContext={DisplayContext.WORKING_VIEW}
                            hasDesignSummary={false}
                        />
                    </div>;

                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_SCOPE_WAIT:

                const testSummaryAvailableForView = (view === ViewType.WORK_PACKAGE_BASE_VIEW || view === ViewType.WORK_PACKAGE_UPDATE_VIEW);

                displayContext = DisplayContext.WP_VIEW;

                if(view === ViewType.WORK_PACKAGE_SCOPE_WAIT){

                    scopeEditor =
                        <div className="design-editor-container">
                            <DesignEditorHeader
                                displayContext={DisplayContext.WP_SCOPE}
                            />
                            <div className="design-editor-wait">
                                Updating scope - please wait
                            </div>
                            <DesignEditorFooter
                                displayContext={DisplayContext.WP_SCOPE}
                                hasDesignSummary={false}
                            />
                        </div>;

                    // Actual View of the WP
                    mainEditor =
                        <div className="design-editor-container">
                            <DesignEditorHeader
                                displayContext={displayContext}
                            />
                            <div className="design-editor-wait">
                                Updating scope - please wait
                            </div>
                            <DesignEditorFooter
                                displayContext={displayContext}
                                hasDesignSummary={false}
                            />
                        </div>;

                } else {

                    scopeEditor =
                        <div className="design-editor-container">
                            <DesignEditorHeader
                                displayContext={DisplayContext.WP_SCOPE}
                            />
                            <div className={editorClass}>
                                {this.renderApplications(baseApplications, DisplayContext.WP_SCOPE, userContext, view, mode, viewOptions.testSummaryVisible)}
                            </div>
                            <DesignEditorFooter
                                displayContext={DisplayContext.WP_SCOPE}
                                hasDesignSummary={false}
                            />
                        </div>;

                    // Actual View of the WP
                    mainEditor =
                        <div className="design-editor-container">
                            <DesignEditorHeader
                                displayContext={displayContext}
                            />
                            <div className={editorClass}>
                                {this.renderApplications(wpApplications, displayContext, userContext, view, mode, (viewOptions.testSummaryVisible && testSummaryAvailableForView))}
                            </div>
                            <DesignEditorFooter
                                displayContext={displayContext}
                                hasDesignSummary={false}
                            />
                        </div>;

                }


                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                displayContext = DisplayContext.DEV_DESIGN;

                mainEditor =
                    <div className="design-editor-container">
                        <DesignEditorHeader
                            displayContext={displayContext}
                        />
                        <div className={editorClass}>
                            {this.renderApplications(wpApplications, displayContext, userContext, view, mode, viewOptions.testSummaryVisible)}
                        </div>
                        <DesignEditorFooter
                            displayContext={displayContext}
                            hasDesignSummary={false}
                        />
                    </div>;
        }


        return{
            mainEditor:     mainEditor,
            scopeEditor:    scopeEditor,
            viewEditor:     viewEditor,
            displayContext: displayContext
        }

    }

    getAddComponent(view, mode, userContext){

        let addComponent = <div></div>;

        if ((view === ViewType.DESIGN_UPDATE_EDIT || view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED) && mode === ViewMode.MODE_EDIT) {
            // Editing a design or design update so include the Add Application
            addComponent =
                <table>
                    <tbody>
                    <tr>
                        <td id="addApplication" className="control-table-data-app">
                            <DesignComponentAdd
                                uiContextId={AddActionIds.UI_CONTEXT_ADD_APPLICATION}
                                addText="Add Application"
                                onClick={ () => this.onAddApplication(view, mode, userContext.designVersionId, userContext.designUpdateId)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>;
        }

        return addComponent;
    }

    getDesignDetails(userContext, view, displayContext){

        return(
            <div id="detailsPane">
                <DesignComponentTextContainer params={{
                    currentContext: userContext,
                    view: view,
                    displayContext: displayContext
                }}/>
            </div>
        );
    }

    getDesignVersionAnomalies(userContext){

        return(
            <div id="anomaliesPane">
                <DesignAnomalyContainer
                    params={{
                        userContext: userContext
                    }}
                />
            </div>
        )
    }

    getTestExpectations(view, userContext){

        const displayContext = DisplayContext.TEST_EXPECTATIONS;

        let childComponentType = 'NONE';

        if (userContext.designComponentType !== 'NONE') {
            switch (userContext.designComponentType) {
                case ComponentType.FEATURE:
                    childComponentType = ComponentType.FEATURE_ASPECT;
                    break;
                case ComponentType.FEATURE_ASPECT:
                    childComponentType = ComponentType.SCENARIO;
                    break;
                case ComponentType.SCENARIO:
                    childComponentType = ComponentType.TEST_EXPECTATION;
                    break;
            }
        }

        return (
            <div id="testExpectationsPane">
                <TestExpectationSelectedItemContainer
                    params={{
                        childComponentType: childComponentType,
                        designItemId: 'NONE',
                        userContext: userContext,
                        view: view,
                        displayContext: displayContext
                    }}
                />
            </div>
        )

    }

    getTestResults(view, userContext){

        const displayContext = DisplayContext.TEST_RESULTS;

        let childComponentType = 'NONE';

        if (userContext.designComponentType !== 'NONE') {
            switch (userContext.designComponentType) {
                case ComponentType.FEATURE:
                    childComponentType = ComponentType.FEATURE_ASPECT;
                    break;
                case ComponentType.FEATURE_ASPECT:
                    childComponentType = ComponentType.SCENARIO;
                    break;
                case ComponentType.SCENARIO:
                    childComponentType = ComponentType.TEST_EXPECTATION;
                    break;
            }
        }

        return (
            <div id="testExpectationsPane">
                <TestExpectationSelectedItemContainer
                    params={{
                        childComponentType: childComponentType,
                        designItemId: 'NONE',
                        userContext: userContext,
                        view: view,
                        displayContext: displayContext
                    }}
                />
            </div>
        )

    }

    getAccTestsPane(view, userContext){

        let accTests = '';

        switch(view){

            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:

                // Tests are Displayed at a Feature Level or Lower

                if(userContext.designComponentType !== 'NONE'){
                    switch(userContext.designComponentType){
                        case ComponentType.APPLICATION:
                        case ComponentType.DESIGN_SECTION:
                            // Tests not displayed for these items
                            accTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: 'NONE',
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_ACC_TESTS
                                }}/>;
                            break;
                        case ComponentType.FEATURE:
                            accTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.FEATURE_ASPECT,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_ACC_TESTS
                                }}/>;
                            break;
                        case ComponentType.FEATURE_ASPECT:
                            accTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.SCENARIO,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_ACC_TESTS
                                }}/>;
                            break;
                        case ComponentType.SCENARIO:
                            accTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.TEST,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_ACC_TESTS
                                }}/>;

                            break;
                    }
                } else {
                    accTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: 'NONE',
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_ACC_TESTS
                        }}/>;
                }

                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                // Tests are viewable at all levels

                // Acceptance Tests Pane
                if(userContext.designComponentType !== 'NONE'){
                    switch(userContext.designComponentType){
                        case ComponentType.APPLICATION:
                            accTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.DESIGN_SECTION,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_ACC_TESTS
                                }}/>;
                            break;
                        case ComponentType.DESIGN_SECTION:
                            accTests =
                                <div>
                                    <MashSelectedItemContainer params={{
                                        childComponentType: ComponentType.FEATURE,
                                        designItemId: 'NONE',
                                        userContext: userContext,
                                        view: view,
                                        displayContext: DisplayContext.MASH_ACC_TESTS
                                    }}/>
                                    <MashSelectedItemContainer params={{
                                        childComponentType: ComponentType.DESIGN_SECTION,
                                        designItemId: 'NONE',
                                        userContext: userContext,
                                        view: view,
                                        displayContext: DisplayContext.MASH_ACC_TESTS
                                    }}/>
                                </div>;
                            break;
                        case ComponentType.FEATURE:
                            accTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.FEATURE_ASPECT,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_ACC_TESTS
                                }}/>;
                            break;
                        case ComponentType.FEATURE_ASPECT:
                            accTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.SCENARIO,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_ACC_TESTS
                                }}/>;
                            break;
                        case ComponentType.SCENARIO:
                            accTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.TEST,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_ACC_TESTS
                                }}/>;

                            break;
                    }
                } else {
                    accTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: 'NONE',
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_ACC_TESTS
                        }}/>;
                }

        }

        return accTests;
    }

    getIntTestsPane(view, userContext){

        let intTests = '';

        switch(view){

            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:

                // Tests are Displayed at a Feature Level or Lower

                if(userContext.designComponentType !== 'NONE'){
                    switch(userContext.designComponentType){
                        case ComponentType.APPLICATION:
                        case ComponentType.DESIGN_SECTION:
                            // Tests not displayed for these items
                            intTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: 'NONE',
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_INT_TESTS
                                }}/>;
                            break;
                        case ComponentType.FEATURE:
                            intTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.FEATURE_ASPECT,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_INT_TESTS
                                }}/>;
                            break;
                        case ComponentType.FEATURE_ASPECT:
                            intTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.SCENARIO,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_INT_TESTS
                                }}/>;
                            break;
                        case ComponentType.SCENARIO:
                            intTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.TEST,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_INT_TESTS
                                }}/>;

                            break;
                    }
                } else {
                    intTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: 'NONE',
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_INT_TESTS
                        }}/>;
                }

                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                // Tests are viewable at all levels

                // Integration Tests Pane
                if(userContext.designComponentType !== 'NONE'){
                    switch(userContext.designComponentType){
                        case ComponentType.APPLICATION:
                            intTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.DESIGN_SECTION,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_INT_TESTS
                                }}/>;
                            break;
                        case ComponentType.DESIGN_SECTION:
                            intTests =
                                <div>
                                    <MashSelectedItemContainer params={{
                                        childComponentType: ComponentType.FEATURE,
                                        designItemId: 'NONE',
                                        userContext: userContext,
                                        view: view,
                                        displayContext: DisplayContext.MASH_INT_TESTS
                                    }}/>
                                    <MashSelectedItemContainer params={{
                                        childComponentType: ComponentType.DESIGN_SECTION,
                                        designItemId: 'NONE',
                                        userContext: userContext,
                                        view: view,
                                        displayContext: DisplayContext.MASH_INT_TESTS
                                    }}/>
                                </div>;
                            break;
                        case ComponentType.FEATURE:
                            intTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.FEATURE_ASPECT,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_INT_TESTS
                                }}/>;
                            break;
                        case ComponentType.FEATURE_ASPECT:
                            intTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.SCENARIO,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_INT_TESTS
                                }}/>;
                            break;
                        case ComponentType.SCENARIO:
                            intTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.TEST,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_INT_TESTS
                                }}/>;

                            break;
                    }
                } else {
                    intTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: 'NONE',
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_INT_TESTS
                        }}/>;
                }
        }

        return intTests;

    }

    getUnitTestsPane(view, userContext){

        let unitTests = '';

        switch(view){

            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:

                // Tests are Displayed at a Feature Level or Lower

                if(userContext.designComponentType !== 'NONE'){
                    switch(userContext.designComponentType){
                        case ComponentType.APPLICATION:
                        case ComponentType.DESIGN_SECTION:
                            // Tests not displayed for these items
                            unitTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: 'NONE',
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_UNIT_TESTS
                                }}/>;
                            break;
                        case ComponentType.FEATURE:
                            unitTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.FEATURE_ASPECT,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_UNIT_TESTS
                                }}/>;
                            break;
                        case ComponentType.FEATURE_ASPECT:
                            unitTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.SCENARIO,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_UNIT_TESTS
                                }}/>;
                            break;
                        case ComponentType.SCENARIO:
                            unitTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.TEST,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_UNIT_TESTS
                                }}/>;

                            break;
                    }
                } else {
                    unitTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: 'NONE',
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_UNIT_TESTS
                        }}/>;
                }

                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                // Tests are viewable at all levels

                if(userContext.designComponentType !== 'NONE'){
                    switch(userContext.designComponentType){
                        case ComponentType.APPLICATION:
                            unitTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.DESIGN_SECTION,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_UNIT_TESTS
                                }}/>;
                            break;
                        case ComponentType.DESIGN_SECTION:
                            unitTests =
                                <div>
                                    <MashSelectedItemContainer params={{
                                        childComponentType: ComponentType.FEATURE,
                                        designItemId: 'NONE',
                                        userContext: userContext,
                                        view: view,
                                        displayContext: DisplayContext.MASH_UNIT_TESTS
                                    }}/>
                                    <MashSelectedItemContainer params={{
                                        childComponentType: ComponentType.DESIGN_SECTION,
                                        designItemId: 'NONE',
                                        userContext: userContext,
                                        view: view,
                                        displayContext: DisplayContext.MASH_UNIT_TESTS
                                    }}/>
                                </div>;
                            break;
                        case ComponentType.FEATURE:
                            unitTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.FEATURE_ASPECT,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_UNIT_TESTS
                                }}/>;
                            break;
                        case ComponentType.FEATURE_ASPECT:
                            unitTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.SCENARIO,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_UNIT_TESTS
                                }}/>;
                            break;
                        case ComponentType.SCENARIO:
                            unitTests =
                                <MashSelectedItemContainer params={{
                                    childComponentType: ComponentType.TEST,
                                    designItemId: 'NONE',
                                    userContext: userContext,
                                    view: view,
                                    displayContext: DisplayContext.MASH_UNIT_TESTS
                                }}/>;

                            break;
                    }
                } else {
                    unitTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: 'NONE',
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_UNIT_TESTS
                        }}/>;
                }

        }

        return unitTests;

    }

    getDomainDictionary(userContext){

        return(
            <div id="domainDictionary">
                <DomainDictionaryContainer params={{
                    designId: userContext.designId,
                    designVersionId: userContext.designVersionId
                }}/>
            </div>
        );
    }

    getScenarioFinder(displayContext){

        // Scenario Finder - what it will search in depends on context
        return(
            <ScenarioFinder
                displayContext={displayContext}
            />
        );
    }

    getUpdateSummary(userContext){

        return(
            <div id="updateSummary">
                <DesignUpdateSummaryContainer params={{
                    userContext: userContext
                }}/>
            </div>
        );
    }

    getTabTitle(view, tabKey){

        let isActiveTab = false;

        switch(view){

            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:

                isActiveTab = (this.getCurrentDesignTab() === tabKey);
                break;

            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.DESIGN_UPDATE_EDIT:

                isActiveTab = (this.getCurrentUpdateTab() === tabKey);
                break;

            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_SCOPE_WAIT:

                isActiveTab = (this.getCurrentWpTab() === tabKey);
                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                isActiveTab = (this.getCurrentDevTab() === tabKey);
                break;
        }

        let tabBadgeFormat = ' faded';
        if(isActiveTab){
            tabBadgeFormat = '';
        }

        switch(tabKey){

            case EditorTab.TAB_DETAILS:
                return <TabTitle tabText={'Details'} glyphIconName={'list-alt'} badgeClass={'tab-badge tab-details' + tabBadgeFormat}/>;
            case EditorTab.TAB_TEST_EXPECTATIONS:
                return <TabTitle tabText={'Expectations'} glyphIconName={'check'} badgeClass={'tab-badge tab-test' + tabBadgeFormat}/>;
            case EditorTab.TAB_TEST_RESULTS:
                return <TabTitle tabText={'Results'} glyphIconName={'check'} badgeClass={'tab-badge tab-test' + tabBadgeFormat}/>;
            case EditorTab.TAB_ANOMALIES:
                return <TabTitle tabText={'Anomalies'} glyphIconName={'warning-sign'} badgeClass={'tab-badge tab-problems' + tabBadgeFormat}/>;
            case EditorTab.TAB_DOMAIN_DICT:
                return <TabTitle tabText={'Domain'} glyphIconName={'book'} badgeClass={'tab-badge tab-domain' + tabBadgeFormat}/>;
            case EditorTab.TAB_SCENARIO_SEARCH:
                return <TabTitle tabText={'Search'} glyphIconName={'search'} badgeClass={'tab-badge tab-search' + tabBadgeFormat}/>;
            case EditorTab.TAB_WORKING_VIEW:
                return <TabTitle tabText={'Progress'} glyphIconName={'search'} badgeClass={'tab-badge tab-progress' + tabBadgeFormat}/>;
            case EditorTab.TAB_UPDATE_SUMMARY:
                return <TabTitle tabText={'Summary'} glyphIconName={'search'} badgeClass={'tab-badge tab-summary' + tabBadgeFormat}/>;
        }

    }

    getTabsView(view, userRole, userContext, colWidth, colId, editors){


        const activeDesignTabKey = this.getCurrentDesignTab();
        const activeUpdateTabKey = this.getCurrentUpdateTab();
        const activeWpTabKey = this.getCurrentWpTab();
        const activeDevTabKey = this.getCurrentDevTab();

        const detailsTabTitle = this.getTabTitle(view, EditorTab.TAB_DETAILS);
        const testExpectationsTabTitle = this.getTabTitle(view, EditorTab.TAB_TEST_EXPECTATIONS);
        const testResultsTabTitle = this.getTabTitle(view, EditorTab.TAB_TEST_RESULTS);
        const anomaliesTabTitle = this.getTabTitle(view, EditorTab.TAB_ANOMALIES);
        const dictionaryTabTitle = this.getTabTitle(view, EditorTab.TAB_DOMAIN_DICT);
        const findTabTitle = this.getTabTitle(view, EditorTab.TAB_SCENARIO_SEARCH);
        const workingViewTabTitle = this.getTabTitle(view, EditorTab.TAB_WORKING_VIEW);
        const summaryTabTitle = this.getTabTitle(view, EditorTab.TAB_UPDATE_SUMMARY);

        switch(view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:

                if(userRole === RoleType.GUEST_VIEWER){

                    return(
                        <Col id={colId} md={colWidth} className="close-col">
                            <Tabs className="top-tabs" activeKey={activeDesignTabKey} id="all-tabs" onSelect={(tab) => this.setCurrentDesignTab(tab)}>
                                <Tab eventKey={EditorTab.TAB_DETAILS} title={detailsTabTitle}>{this.getDesignDetails(userContext, view, editors.displayContext)}</Tab>
                                <Tab eventKey={EditorTab.TAB_ANOMALIES} title={anomaliesTabTitle}>{this.getDesignVersionAnomalies(userContext)}</Tab>
                                <Tab eventKey={EditorTab.TAB_DOMAIN_DICT} title={dictionaryTabTitle}>>{this.getDomainDictionary(userContext)}</Tab>
                                <Tab eventKey={EditorTab.TAB_SCENARIO_SEARCH} title={findTabTitle}>{this.getScenarioFinder(DisplayContext.BASE_VIEW)}</Tab>
                            </Tabs>
                        </Col>
                    );

                } else {

                    return(
                        <Col id={colId} md={colWidth} className="close-col">
                            <Tabs className="top-tabs" activeKey={activeDesignTabKey} id="all-tabs" onSelect={(tab) => this.setCurrentDesignTab(tab)}>
                                <Tab eventKey={EditorTab.TAB_DETAILS} title={detailsTabTitle}>{this.getDesignDetails(userContext, view, editors.displayContext)}</Tab>
                                <Tab eventKey={EditorTab.TAB_ANOMALIES} title={anomaliesTabTitle}>{this.getDesignVersionAnomalies(userContext)}</Tab>
                                <Tab eventKey={EditorTab.TAB_TEST_EXPECTATIONS} title={testExpectationsTabTitle}>{this.getTestExpectations(view, userContext)}</Tab>
                                <Tab eventKey={EditorTab.TAB_TEST_RESULTS} title={testResultsTabTitle}>{this.getTestResults(view, userContext)}</Tab>
                                <Tab eventKey={EditorTab.TAB_DOMAIN_DICT} title={dictionaryTabTitle}>{this.getDomainDictionary(userContext)}</Tab>
                                <Tab eventKey={EditorTab.TAB_SCENARIO_SEARCH} title={findTabTitle}>{this.getScenarioFinder(DisplayContext.BASE_VIEW)}</Tab>
                            </Tabs>
                        </Col>
                    );
                }

            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.DESIGN_UPDATE_EDIT:

                return(
                    <Col id={colId} md={colWidth} className="close-col">
                        <Tabs className="top-tabs" activeKey={activeUpdateTabKey} id="updatable-view_tabs" onSelect={(tab) => this.setCurrentUpdateTab(tab)}>
                            <Tab eventKey={EditorTab.TAB_ANOMALIES} title={anomaliesTabTitle}>{this.getDesignVersionAnomalies(userContext)}</Tab>
                            <Tab eventKey={EditorTab.TAB_WORKING_VIEW} title={workingViewTabTitle}>{editors.viewEditor}</Tab>
                            <Tab eventKey={EditorTab.TAB_UPDATE_SUMMARY} title={summaryTabTitle}>{this.getUpdateSummary(userContext)}</Tab>
                            <Tab eventKey={EditorTab.TAB_DOMAIN_DICT} title={dictionaryTabTitle}>>{this.getDomainDictionary(userContext)}</Tab>
                            <Tab eventKey={EditorTab.TAB_SCENARIO_SEARCH} title={findTabTitle}>{this.getScenarioFinder(DisplayContext.UPDATE_SCOPE)}</Tab>
                        </Tabs>
                    </Col>
                );

            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_SCOPE_WAIT:

                return(
                    <Col id={colId} md={colWidth} className="close-col">
                        <Tabs className="top-tabs" activeKey={activeWpTabKey} id="updatable-view_tabs" onSelect={(tab) => this.setCurrentWpTab(tab)}>
                            <Tab eventKey={EditorTab.TAB_DETAILS} title={detailsTabTitle}>{this.getDesignDetails(userContext, view, editors.displayContext)}</Tab>
                            <Tab eventKey={EditorTab.TAB_ANOMALIES} title={anomaliesTabTitle}>{this.getDesignVersionAnomalies(userContext)}</Tab>
                            <Tab eventKey={EditorTab.TAB_DOMAIN_DICT} title={dictionaryTabTitle}>>{this.getDomainDictionary(userContext)}</Tab>
                        </Tabs>
                    </Col>
                );

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                return(
                    <Col id={colId} md={colWidth} className="close-col">
                        <Tabs className="top-tabs" activeKey={activeDevTabKey} id="updatable-view_tabs" onSelect={(tab) => this.setCurrentDevTab(tab)}>
                            <Tab eventKey={EditorTab.TAB_DETAILS} title={detailsTabTitle}>{this.getDesignDetails(userContext, view, editors.displayContext)}</Tab>
                            <Tab eventKey={EditorTab.TAB_ANOMALIES} title={anomaliesTabTitle}>{this.getDesignVersionAnomalies(userContext)}</Tab>
                            <Tab eventKey={EditorTab.TAB_TEST_EXPECTATIONS} title={testExpectationsTabTitle}>{this.getTestExpectations(view, userContext)}</Tab>
                            <Tab eventKey={EditorTab.TAB_TEST_RESULTS} title={testResultsTabTitle}>{this.getTestResults(view, userContext)}</Tab>
                            <Tab eventKey={EditorTab.TAB_DOMAIN_DICT} title={dictionaryTabTitle}>>{this.getDomainDictionary(userContext)}</Tab>
                        </Tabs>
                    </Col>
                );
        }
    }

    calculateColumnWidths(view, mode, viewOptions){

        // Start by assuming 2 cols
        let col1width = 6;
        let col2width = 6;
        let col3width = 6;
        let col4width = 6;
        let col5width = 6;
        let col6width = 6;

        let displayedItems = 0;

        switch(view) {

            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:

                if (viewOptions.designShowAllAsTabs) {

                    // Layout is 6 - 6 unless test summary visible
                    if (viewOptions.testSummaryVisible) {
                        col1width = 8;
                        col2width = 4;
                    }

                } else {

                    // Default - design editor is always displayed
                    displayedItems = 1;

                    // Details
                    if (viewOptions.designDetailsVisible) {

                        displayedItems++;
                    }

                    // Domain Dictionary
                    if (viewOptions.designDomainDictVisible) {

                        if (displayedItems === 2) {
                            // There are now 3 cols so change widths
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                            col5width = 4;
                            col6width = 4;
                        }

                        displayedItems++;
                    }

                    if (viewOptions.devAccTestsVisible) {

                        switch (displayedItems) {
                            case 1:
                                // Now 2 items
                                col1width = 6;
                                col2width = 6;
                                col3width = 6;
                                col4width = 6;
                                col5width = 6;
                                col6width = 6;
                                break;
                            case 2:
                                // Now 3 items
                                col1width = 4;
                                col2width = 4;
                                col3width = 4;
                                col4width = 4;
                                col5width = 4;
                                col6width = 4;
                                break;
                            case 3:
                                // Now 4 items
                                col1width = 3;
                                col2width = 3;
                                col3width = 3;
                                col4width = 3;
                                col5width = 3;
                                col6width = 3;
                                break;
                        }

                        displayedItems++;
                    }

                    if (viewOptions.devIntTestsVisible) {

                        switch (displayedItems) {
                            case 1:
                                // Now 2 items
                                col1width = 6;
                                col2width = 6;
                                col3width = 6;
                                col4width = 6;
                                col5width = 6;
                                col6width = 6;
                                break;
                            case 2:
                                // Now 3 items
                                col1width = 4;
                                col2width = 4;
                                col3width = 4;
                                col4width = 4;
                                col5width = 4;
                                col6width = 4;
                                break;
                            case 3:
                                // Now 4 items
                                col1width = 3;
                                col2width = 3;
                                col3width = 3;
                                col4width = 3;
                                col5width = 3;
                                col6width = 3;
                                break;
                            case 4:
                                // Now 5 items
                                col1width = 3;
                                col2width = 3;
                                col3width = 2;
                                col4width = 2;
                                col5width = 2;
                                col6width = 2;
                                break;
                        }

                        displayedItems++;
                    }

                    if (viewOptions.devUnitTestsVisible) {

                        switch (displayedItems) {
                            case 1:
                                // Now 2 items
                                col1width = 6;
                                col2width = 6;
                                col3width = 6;
                                col4width = 6;
                                col5width = 6;
                                col6width = 6;
                                break;
                            case 2:
                                // Now 3 items
                                col1width = 4;
                                col2width = 4;
                                col3width = 4;
                                col4width = 4;
                                col5width = 4;
                                col6width = 4;
                                break;
                            case 3:
                                // Now 4 items
                                col1width = 3;
                                col2width = 3;
                                col3width = 3;
                                col4width = 3;
                                col5width = 3;
                                col6width = 3;
                                break;
                            case 4:
                                // Now 5 items
                                col1width = 3;
                                col2width = 3;
                                col3width = 2;
                                col4width = 2;
                                col5width = 2;
                                col6width = 2;
                                break;
                            case 5:
                                // Now 6 items
                                col1width = 2;
                                col2width = 2;
                                col3width = 2;
                                col4width = 2;
                                col5width = 2;
                                col6width = 2;
                                break;
                        }

                        displayedItems++;
                    }

                    // Test Summary - this actually just makes col 1 wider
                    if (viewOptions.testSummaryVisible) {

                        switch (displayedItems) {
                            case 1:
                                // Col 1 gets bigger
                                col1width = 12;
                                col2width = 0;
                                col3width = 0;
                                col4width = 0;
                                col5width = 0;
                                col6width = 0;
                                break;
                            case 2:
                                // Col 1 gets bigger
                                col1width = 8;
                                col2width = 4;
                                col3width = 4;
                                col4width = 4;
                                col5width = 4;
                                col6width = 4;
                                break;
                            case 3:
                                // Col 1 gets bigger
                                col1width = 6;
                                col2width = 3;
                                col3width = 3;
                                col4width = 3;
                                col5width = 3;
                                col6width = 3;
                                break;
                            case 4:
                                // Col 1 gets bigger
                                col1width = 6;
                                col2width = 2;
                                col3width = 2;
                                col4width = 2;
                                col5width = 2;
                                col6width = 2;
                                break;
                            case 5:
                                // Col 1 gets bigger - but no room :(
                                col1width = 2;
                                col2width = 2;
                                col3width = 2;
                                col4width = 2;
                                col5width = 2;
                                col6width = 2;
                                break;
                        }
                    }
                }
                break;

            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.DESIGN_UPDATE_EDIT:

                if(mode === ViewMode.MODE_EDIT){

                    // Editable DU

                    // Layout is SCOPE | UPDATE | TEXT (o) | DV PROGRESS (o) | SUMMARY (o)  | DICT (o)

                    // Default scope and editor
                    displayedItems = 2;

                    if(viewOptions.updateShowAllAsTabs){

                        if(viewOptions.testSummaryVisible){
                            col1width = 6;
                            col2width = 3;
                            col3width = 3;
                        } else {
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                        }

                    } else {

                        if (viewOptions.designDetailsVisible) {

                            // There are now 3 cols so change widths
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                            col4width = 4;
                            col5width = 4;
                            col6width = 4;

                            displayedItems++;
                        }

                        if (viewOptions.updateProgressVisible) {

                            switch (displayedItems) {
                                case 2:
                                    // There are now 3 cols so change widths
                                    col1width = 4;
                                    col2width = 4;
                                    col3width = 4;
                                    col4width = 4;
                                    col5width = 4;
                                    col6width = 4;
                                    break;
                                case 3:
                                    // There are now 4 cols so change widths
                                    col1width = 3;
                                    col2width = 3;
                                    col3width = 3;
                                    col4width = 3;
                                    col5width = 3;
                                    col6width = 3;
                                    break;
                            }

                            displayedItems++;
                        }

                        if (viewOptions.updateSummaryVisible) {

                            switch (displayedItems) {
                                case 2:
                                    // There are now 3 cols so change widths
                                    col1width = 4;
                                    col2width = 4;
                                    col3width = 4;
                                    col4width = 4;
                                    col5width = 4;
                                    col6width = 4;
                                    break;
                                case 3:
                                    // There are now 4 cols so change widths
                                    col1width = 3;
                                    col2width = 3;
                                    col3width = 3;
                                    col4width = 3;
                                    col5width = 3;
                                    col6width = 3;
                                    break;
                                case 4:
                                    // There are now 5 cols so change widths
                                    col1width = 2;
                                    col2width = 3;
                                    col3width = 2;
                                    col4width = 2;
                                    col5width = 3;
                                    col6width = 2;
                                    break;
                            }
                            displayedItems++;
                        }

                        if (viewOptions.designDomainDictVisible) {

                            switch (displayedItems) {
                                case 2:
                                    // There are now 3 cols so change widths
                                    col1width = 4;
                                    col2width = 4;
                                    col3width = 4;
                                    col4width = 4;
                                    col5width = 4;
                                    col6width = 4;
                                    break;
                                case 3:
                                    // There are now 4 cols so change widths
                                    col1width = 3;
                                    col2width = 3;
                                    col3width = 3;
                                    col4width = 3;
                                    col5width = 3;
                                    col6width = 3;

                                    break;
                                case 4:
                                    // There are now 5 cols so change widths
                                    col1width = 2;
                                    col2width = 3;
                                    col3width = 2;
                                    col4width = 2;
                                    col5width = 3;
                                    col6width = 2;

                                    break;
                                case 5:
                                    // There are now 6 cols so change widths
                                    col1width = 2;
                                    col2width = 2;
                                    col3width = 2;
                                    col4width = 2;
                                    col5width = 2;
                                    col6width = 2;
                            }
                            displayedItems++;
                        }

                        if (viewOptions.testSummaryVisible) {

                            switch (displayedItems) {
                                case 2:
                                    col1width = 7;
                                    col2width = 5;
                                    col3width = 5;
                                    col4width = 5;
                                    col5width = 5;
                                    col6width = 5;
                                    break;
                                case 3:
                                    col1width = 6;
                                    col2width = 3;
                                    col3width = 3;
                                    col4width = 3;
                                    col5width = 3;
                                    col6width = 3;
                                    break;
                                case 4:
                                    col1width = 6;
                                    col2width = 2;
                                    col3width = 2;
                                    col4width = 2;
                                    col5width = 2;
                                    col6width = 2;
                                    break;
                                case 5:
                                    col1width = 4;
                                    col2width = 2;
                                    col3width = 2;
                                    col4width = 2;
                                    col5width = 2;
                                    col6width = 2;
                                    break;
                                case 6:
                                    col1width = 2;
                                    col2width = 2;
                                    col3width = 2;
                                    col4width = 2;
                                    col5width = 2;
                                    col6width = 2;
                            }

                        }

                    }

                } else {

                    // Read Only or View DU

                    // Layout is UPDATE | TEXT (o) | PROGRESS (o) | SUMMARY (o) | DICT (o)
                    // or UPDATE + TEST SUMMARY | TEXT (o) | PROGRESS (o) | SUMMARY (o) | DICT (o)

                    // Default editor
                    displayedItems = 1;

                    if(viewOptions.updateShowAllAsTabs){

                        col1width = 6;
                        col2width = 6;

                    } else {

                        if (viewOptions.designDetailsVisible) {

                            // There are now 2 cols so change widths
                            col1width = 6;
                            col2width = 6;
                            col3width = 6;
                            col4width = 6;
                            col5width = 6;

                            displayedItems++;
                        }

                        if (viewOptions.updateProgressVisible) {

                            switch (displayedItems) {
                                case 1:
                                    // There are now 2 cols so change widths
                                    col1width = 6;
                                    col2width = 6;
                                    col3width = 6;
                                    col4width = 6;
                                    col5width = 6;
                                    break;
                                case 2:
                                    // There are now 3 cols so change widths
                                    col1width = 4;
                                    col2width = 4;
                                    col3width = 4;
                                    col4width = 4;
                                    col5width = 4;
                                    break;
                            }

                            displayedItems++;
                        }

                        if (viewOptions.updateSummaryVisible) {

                            switch (displayedItems) {
                                case 1:
                                    // There are now 2 cols so change widths
                                    col1width = 6;
                                    col2width = 6;
                                    col3width = 6;
                                    col4width = 6;
                                    col5width = 6;
                                    break;
                                case 2:
                                    // There are now 3 cols so change widths
                                    col1width = 4;
                                    col2width = 4;
                                    col3width = 4;
                                    col4width = 4;
                                    col5width = 4;
                                    break;
                                case 3:
                                    // There are now 4 cols so change widths
                                    col1width = 3;
                                    col2width = 3;
                                    col3width = 3;
                                    col4width = 3;
                                    col5width = 3;
                                    break;
                            }
                            displayedItems++;
                        }

                        if (viewOptions.designDomainDictVisible) {

                            switch (displayedItems) {
                                case 1:
                                    // There are now 2 cols so change widths
                                    col1width = 6;
                                    col2width = 6;
                                    col3width = 6;
                                    col4width = 6;
                                    col5width = 6;
                                    break;
                                case 2:
                                    // There are now 3 cols so change widths
                                    col1width = 4;
                                    col2width = 4;
                                    col3width = 4;
                                    col4width = 4;
                                    col5width = 4;
                                    break;
                                case 3:
                                    // There are now 4 cols so change widths
                                    col1width = 3;
                                    col2width = 3;
                                    col3width = 3;
                                    col4width = 3;
                                    col5width = 3;
                                    break;
                                case 4:
                                    // There are now 5 cols so change widths
                                    col1width = 3;
                                    col2width = 2;
                                    col3width = 2;
                                    col4width = 3;
                                    col5width = 2;
                            }
                            displayedItems++;
                        }

                        if (viewOptions.testSummaryVisible) {
                            // Expand col 1
                            switch (displayedItems) {
                                case 1:
                                    col1width = 12;
                                    col2width = 0;
                                    col3width = 0;
                                    col4width = 0;
                                    col5width = 0;
                                    break;
                                case 2:
                                    col1width = 8;
                                    col2width = 4;
                                    col3width = 4;
                                    col4width = 4;
                                    col5width = 4;
                                    break;
                                case 3:
                                    col1width = 6;
                                    col2width = 3;
                                    col3width = 3;
                                    col4width = 3;
                                    col5width = 3;
                                    break;
                                case 4:
                                    col1width = 6;
                                    col2width = 2;
                                    col3width = 2;
                                    col4width = 2;
                                    col5width = 2;
                                    break;
                                case 5:
                                    col1width = 4;
                                    col2width = 2;
                                    col3width = 2;
                                    col4width = 2;
                                    col5width = 2;
                            }
                        }

                    }

                }
                break;

            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:

                // Layout is WP + opt Test Summary | TEXT | opt DICT |
                // WHAT OPTIONAL COMPONENTS ARE VISIBLE (Besides Scope and WP)

                // Start by assuming only 2 cols
                col1width = 6;
                col2width = 6;
                col3width = 6;

                // Default - WP
                displayedItems = 2;

                if(viewOptions.workShowAllAsTabs){

                    // Always 2 cols only..
                    col1width = 6;
                    col2width = 6;
                    col3width = 6;

                } else {

                    // Domain Dictionary
                    if (viewOptions.designDomainDictVisible) {

                        // There are now 3 cols
                        col1width = 4;
                        col2width = 4;
                        col3width = 4;

                        displayedItems++;
                    }
                }

                // Test Summary - this actually just makes col 1 wider
                if(viewOptions.testSummaryVisible){

                    switch(displayedItems){
                        case 1:
                            col1width = 12;
                            col2width = 0;
                            col3width = 0;
                            break;
                        case 2:
                            col1width = 7;
                            col2width = 5;
                            col3width = 5;
                            break;
                        case 3:
                            col1width = 6;
                            col2width = 3;
                            col3width = 3;
                            break;
                    }
                }

                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_SCOPE_WAIT:


                // Layout is SCOPE | WP | opt TEXT | opt DICT

                // WHAT OPTIONAL COMPONENTS ARE VISIBLE (Besides Scope and WP)

                // Start by assuming only 2 cols
                col1width = 6;
                col2width = 6;
                col3width = 6;
                col4width = 6;

                // Default - Scope + WP
                displayedItems = 2;

                if(viewOptions.workShowAllAsTabs){

                    col1width = 4;
                    col2width = 4;
                    col3width = 4;

                } else {

                    // Details
                    if (viewOptions.designDetailsVisible) {

                        // Now 3 cols
                        col1width = 4;
                        col2width = 4;
                        col3width = 4;
                        col4width = 4;

                        displayedItems++;
                    }

                    // Domain Dictionary
                    if (viewOptions.designDomainDictVisible) {

                        switch (displayedItems) {
                            case 2:
                                // There are now 3 cols
                                col1width = 4;
                                col2width = 4;
                                col3width = 4;
                                col4width = 4;
                                break;
                            case 3:
                                // There are now 4 cols
                                col1width = 3;
                                col2width = 3;
                                col3width = 3;
                                col4width = 3;
                                break;
                        }
                    }
                }
                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                // Default - WP
                displayedItems = 1;

                if(viewOptions.workShowAllAsTabs){

                    // Main design plus tabs column
                    col1width = 6;
                    col2width = 6;

                } else {

                    // Details
                    if (viewOptions.designDetailsVisible) {

                        displayedItems++;
                    }

                    // Acceptance (Feature) Tests
                    if (viewOptions.devAccTestsVisible) {

                        switch (displayedItems) {
                            case 1:
                                // There are now 2 cols so change widths
                                col1width = 5;
                                col2width = 7;
                                col3width = 7;
                                col4width = 7;
                                col5width = 7;
                                col6width = 7;
                                break;
                        }

                        displayedItems++;

                    }

                    // Integration Tests
                    if (viewOptions.devIntTestsVisible) {

                        switch (displayedItems) {
                            case 2:
                                // There are now 3 cols so change widths
                                col1width = 4;
                                col2width = 4;
                                col3width = 4;
                                col4width = 4;
                                col5width = 4;
                                col6width = 4;
                                break;
                            case 3:
                                // There are now 4 cols so change widths
                                col1width = 3;
                                col2width = 3;
                                col3width = 3;
                                col4width = 3;
                                col5width = 3;
                                col6width = 3;
                                break;
                        }
                        displayedItems++;
                    }

                    // Unt Tests
                    if (viewOptions.devUnitTestsVisible) {

                        switch (displayedItems) {
                            case 2:
                                // There are now 3 cols so change widths
                                col1width = 4;
                                col2width = 4;
                                col3width = 4;
                                col4width = 4;
                                col5width = 4;
                                col6width = 4;
                                break;
                            case 3:
                                // There are now 4 cols so change widths
                                col1width = 3;
                                col2width = 3;
                                col3width = 3;
                                col4width = 3;
                                col5width = 3;
                                col6width = 3;
                                break;
                            case 4:
                                // There are now 5 cols so change widths
                                col1width = 3;
                                col2width = 2;
                                col3width = 2;
                                col4width = 2;
                                col5width = 3;
                                col6width = 3;
                                break;

                        }
                        displayedItems++;
                    }

                    // Domain Dictionary
                    if (viewOptions.designDomainDictVisible) {

                        switch (displayedItems) {
                            case 2:
                                // There are now 3 cols so change widths
                                col1width = 4;
                                col2width = 4;
                                col3width = 4;
                                col4width = 4;
                                col5width = 4;
                                col6width = 4;
                                break;
                            case 3:
                                // There are now 4 cols so change widths
                                col1width = 3;
                                col2width = 3;
                                col3width = 3;
                                col4width = 3;
                                col5width = 3;
                                col6width = 3;
                                break;
                            case 4:
                                // There are now 5 cols so change widths
                                col1width = 4;
                                col2width = 2;
                                col3width = 2;
                                col4width = 2;
                                col5width = 2;
                                col6width = 2;
                                break;
                            case 5:
                                // There are now 6 cols so change widths
                                col1width = 2;
                                col2width = 2;
                                col3width = 2;
                                col4width = 2;
                                col5width = 2;
                                col6width = 2;
                                break;

                        }
                        displayedItems++;
                    }

                    // Test Summary - this actually just makes col 1 wider
                    if (viewOptions.testSummaryVisible) {

                        switch (displayedItems) {
                            case 1:
                                col1width = 12;
                                col2width = 0;
                                col3width = 0;
                                col4width = 0;
                                col5width = 0;
                                col6width = 0;
                                break;
                            case 2:
                                col1width = 7;
                                col2width = 5;
                                col3width = 5;
                                col4width = 5;
                                col5width = 5;
                                col6width = 5;
                                break;
                            case 3:
                                col1width = 6;
                                col2width = 3;
                                col3width = 3;
                                col4width = 3;
                                col5width = 3;
                                col6width = 3;
                                break;
                            case 4:
                                col1width = 6;
                                col2width = 2;
                                col3width = 2;
                                col4width = 2;
                                col5width = 2;
                                col6width = 2;
                                break;
                            case 5:
                                col1width = 4;
                                col2width = 2;
                                col3width = 2;
                                col4width = 2;
                                col5width = 2;
                                col6width = 2;
                                break;
                            case 6:
                                col1width = 7;
                                col2width = 1;
                                col3width = 1;
                                col4width = 1;
                                col5width = 1;
                                col6width = 1;
                                break;
                        }
                    }
                }
                break;

        }

        return{
            col1width:  col1width,
            col2width:  col2width,
            col3width:  col3width,
            col4width:  col4width,
            col5width:  col5width,
            col6width:  col6width,
        }
    }

    getLayout(view, mode, userRole, viewOptions, colWidths, editors, userContext){

        // TODO - Change to one test results view option

        let layout = '';
        let col1 = '';
        let col2 = '';
        let col3 = '';
        let col4 = '';
        let col5 = '';
        let col6 = '';

        log((msg) => console.log(msg), LogLevel.PERF, 'Col widths are {} {} {} {} {} {}', colWidths.col1width, colWidths.col2width, colWidths.col3width, colWidths.col4width, colWidths.col5width, colWidths.col6width);

        switch(view) {

            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:

                // Design Editor layout
                col1 =
                    <Col id="column1" md={colWidths.col1width} className="close-col">
                        {editors.mainEditor}
                    </Col>;


                // Optional display columns
                if(viewOptions.designShowAllAsTabs){

                    col2 = this.getTabsView(view, userRole, userContext, colWidths.col2width, 'column2', editors);

                    layout =
                        <Grid >
                            <Row>
                                {col1}
                                {col2}
                            </Row>
                        </Grid>;

                } else {

                    if (viewOptions.designDetailsVisible) {
                        col2 =
                            <Col id="column2" md={colWidths.col2width} className="close-col">
                                {this.getDesignDetails(userContext, view, editors.displayContext)}
                            </Col>;
                    }

                    if (viewOptions.designDomainDictVisible) {
                        col3 =
                            <Col id="column3" md={colWidths.col3width} className="close-col">
                                {this.getDomainDictionary(userContext)}
                            </Col>;
                    }

                    if (viewOptions.devAccTestsVisible) {
                        col4 =
                            <Col id="column4" md={colWidths.col4width} className="close-col">
                                {this.getAccTestsPane(view, userContext)}
                            </Col>;
                    }

                    if (viewOptions.devIntTestsVisible) {
                        col5 =
                            <Col id="column5" md={colWidths.col5width} className="close-col">
                                {this.getIntTestsPane(view, userContext)}
                            </Col>;
                    }

                    if (viewOptions.devUnitTestsVisible) {
                        col6 =
                            <Col id="column6" md={colWidths.col6width} className="close-col">
                                {this.getUnitTestsPane(view, userContext)}
                            </Col>;
                    }

                    // Make up the layout based on the view options
                    layout =
                        <Grid >
                            <Row>
                                {col1}
                                {col2}
                                {col3}
                                {col4}
                                {col5}
                                {col6}
                            </Row>
                        </Grid>;

                }
                break;

            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.DESIGN_UPDATE_EDIT:

                if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT){

                    // Editable DU

                    if(viewOptions.updateShowAllAsTabs){

                        col1 =
                            <Col id="scopeCol" md={colWidths.col1width} className="close-col">
                                {editors.scopeEditor}
                            </Col>;


                        col2 =
                            <Col id="editCol" md={colWidths.col2width} className="close-col">
                                {editors.mainEditor}
                            </Col>;

                        col3 = this.getTabsView(view, userRole, userContext, colWidths.col3width, 'tabsCol', editors);

                        layout =
                            <Grid >
                                <Row>
                                    {col1}
                                    {col2}
                                    {col3}
                                </Row>
                            </Grid>;

                    } else {

                        col1 =
                            <Col id="scopeCol" md={colWidths.col1width} className="close-col">
                                {editors.scopeEditor}
                            </Col>;


                        col2 =
                            <Col id="editCol" md={colWidths.col2width} className="close-col">
                                {editors.mainEditor}
                            </Col>;

                        if (viewOptions.designDetailsVisible) {
                            col3 =
                                <Col id="detailsCol" md={colWidths.col3width} className="close-col">
                                    {this.getDesignDetails(userContext, view, editors.displayContext)}
                                </Col>;
                        }

                        if (viewOptions.updateProgressVisible) {
                            col4 =
                                <Col id="workingCol" md={colWidths.col4width} className="close-col">
                                    {editors.viewEditor}
                                </Col>;
                        }

                        if (viewOptions.updateSummaryVisible) {
                            col5 =
                                <Col id="summaryCol" md={colWidths.col5width} className="close-col">
                                    {this.getUpdateSummary(userContext)}
                                </Col>;
                        }

                        if (viewOptions.designDomainDictVisible) {
                            col6 =
                                <Col id="dictCol" md={colWidths.col6width} className="close-col">
                                    {this.getDomainDictionary(userContext)}
                                </Col>;
                        }

                        // Make up the layout based on the view options
                        layout =
                            <Grid >
                                <Row>
                                    {col1}
                                    {col2}
                                    {col3}
                                    {col4}
                                    {col5}
                                    {col6}
                                </Row>
                            </Grid>;
                    }

                } else {

                    // Read Only or View DU

                    if(viewOptions.updateShowAllAsTabs){

                        col1 =
                            <Col id="viewCol" md={colWidths.col1width} className="close-col">
                                {editors.mainEditor}
                            </Col>;

                        col2 = this.getTabsView(view, userRole, userContext, colWidths.col2width, 'tabsCol', editors);

                        layout =
                            <Grid >
                                <Row>
                                    {col1}
                                    {col2}
                                </Row>
                            </Grid>;

                    } else {

                        col1 =
                            <Col id="viewCol" md={colWidths.col1width} className="close-col">
                                {editors.mainEditor}
                            </Col>;

                        if (viewOptions.designDetailsVisible) {
                            col2 =
                                <Col id="detailsCol" md={colWidths.col2width} className="close-col">
                                    {this.getDesignDetails(userContext, view, editors.displayContext)}
                                </Col>;
                        }

                        if (viewOptions.updateProgressVisible) {
                            col3 =
                                <Col id="workingCol" md={colWidths.col3width} className="close-col">
                                    {editors.viewEditor}
                                </Col>;
                        }

                        if (viewOptions.updateSummaryVisible) {
                            col4 =
                                <Col id="summaryCol" md={colWidths.col4width} className="close-col">
                                    {this.getUpdateSummary(userContext)}
                                </Col>;
                        }

                        if (viewOptions.designDomainDictVisible) {
                            col5 =
                                <Col id="dictCol" md={colWidths.col5width} className="close-col">
                                    {this.getDomainDictionary(userContext)}
                                </Col>;
                        }

                        // Make up the layout based on the view options
                        layout =
                            <Grid >
                                <Row>
                                    {col1}
                                    {col2}
                                    {col3}
                                    {col4}
                                    {col5}
                                </Row>
                            </Grid>;
                    }
                }
                break;

            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:

                // Layout is WP + opt Test Summary | TEXT | opt DICT |
                // WHAT OPTIONAL COMPONENTS ARE VISIBLE (Besides Scope and WP)

                // Create the layout depending on the current view...
                if(viewOptions.workShowAllAsTabs){

                    // Col 1 - Content
                    col1 =
                        <Col md={colWidths.col1width} className="close-col">
                            {editors.mainEditor}
                        </Col>;

                    // Col 2 - Tabs
                    col2 = this.getTabsView(view, userRole, userContext, colWidths.col2width, 'tabsCol', editors);

                    // Make up the layout based on the view options
                    layout =
                        <Grid >
                            <Row>
                                {col1}
                                {col2}
                            </Row>
                        </Grid>;

                } else {

                    // Col 1 - Content
                    col1 =
                        <Col md={colWidths.col1width} className="close-col">
                            {editors.mainEditor}
                        </Col>;

                    // Col 2 - Details
                    col2 =
                        <Col md={colWidths.col2width} className="close-col">
                            {this.getDesignDetails(userContext, view, editors.displayContext)}
                        </Col>;

                    // Col 3 - Domain Dictionary - Optional
                    if (viewOptions.designDomainDictVisible) {
                        col3 =
                            <Col md={colWidths.col3width}>
                                {this.getDomainDictionary(userContext)}
                            </Col>;
                    }

                    // Make up the layout based on the view options
                    layout =
                        <Grid>
                            <Row>
                                {col1}
                                {col2}
                                {col3}
                            </Row>
                        </Grid>;
                }
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_SCOPE_WAIT:

                // Layout is SCOPE | WP | opt TEXT | opt DICT

                // WHAT OPTIONAL COMPONENTS ARE VISIBLE (Besides Scope and WP)

                if(viewOptions.workShowAllAsTabs){

                    // Col 1 - Scope
                    col1 =
                        <Col md={colWidths.col1width} className="close-col">
                            {editors.scopeEditor}
                        </Col>;

                    // Col 2 - Content
                    col2 =
                        <Col md={colWidths.col2width} className="close-col">
                            {editors.mainEditor}
                        </Col>;

                    // Col 3 - Tabs
                    col3 = this.getTabsView(view, userRole, userContext, colWidths.col3width, 'tabsCol', editors);

                    // Make up the layout based on the view options
                    layout =
                        <Grid >
                            <Row>
                                {col1}
                                {col2}
                                {col3}
                            </Row>
                        </Grid>;

                } else {

                    // Create the layout depending on the current view...

                    // Col 1 - Scope
                    col1 =
                        <Col md={colWidths.col1width} className="close-col">
                            {editors.scopeEditor}
                        </Col>;

                    // Col 2 - Content
                    col2 =
                        <Col md={colWidths.col2width} className="close-col">
                            {editors.mainEditor}
                        </Col>;

                    // Col 3 - Details - Optional
                    if (viewOptions.designDetailsVisible) {
                        col3 =
                            <Col md={colWidths.col3width} className="close-col">
                                {this.getDesignDetails(userContext, view, editors.displayContext)}
                            </Col>;
                    }

                    // Col 4 - Domain Dictionary - Optional
                    if (viewOptions.designDomainDictVisible) {
                        col4 =
                            <Col md={colWidths.col4width} className="close-col">
                                {this.getDomainDictionary(userContext)}
                            </Col>;
                    }

                    // Make up the layout based on the view options
                    layout =
                        <Grid >
                            <Row>
                                {col1}
                                {col2}
                                {col3}
                                {col4}
                            </Row>
                        </Grid>;
                }
                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                if(viewOptions.workShowAllAsTabs){

                    col1 =
                        <Col id="designCol" md={colWidths.col1width} className="close-col">
                            {editors.mainEditor}
                        </Col>;

                    col2 = this.getTabsView(view, userRole, userContext, colWidths.col2width, 'tabsCol', editors);

                    layout =
                        <Grid >
                            <Row>
                                {col1}
                                {col2}
                            </Row>
                        </Grid>;

                } else {
                    col1 =
                        <Col md={colWidths.col1width} className="close-col">
                            {editors.mainEditor}
                        </Col>;

                    if (viewOptions.designDetailsVisible) {
                        col2 =
                            <Col md={colWidths.col2width} className="close-col">
                                {this.getDesignDetails(userContext, view, editors.displayContext)}
                            </Col>;
                    }

                    if (viewOptions.devAccTestsVisible) {
                        col3 =
                            <Col md={colWidths.col3width} className="close-col">
                                {this.getAccTestsPane(view, userContext)}
                            </Col>;
                    }


                    if (viewOptions.devIntTestsVisible) {
                        col4 =
                            <Col md={colWidths.col4width} className="close-col">
                                {this.getIntTestsPane(view, userContext)}
                            </Col>;
                    }

                    if (viewOptions.devUnitTestsVisible) {
                        col5 =
                            <Col md={colWidths.col5width} className="close-col">
                                {this.getUnitTestsPane(view, userContext)}
                            </Col>;
                    }

                    if (viewOptions.designDomainDictVisible) {
                        col6 =
                            <Col md={colWidths.col6width} className="close-col">
                                {this.getDomainDictionary(userContext)}
                            </Col>;
                    }

                    // Make up the layout based on the view options
                    layout =
                        <Grid>
                            <Row>
                                {col1}
                                {col2}
                                {col3}
                                {col4}
                                {col5}
                                {col6}
                            </Row>
                        </Grid>;
                }
                break;
        }

        return layout;


    }
}

export const EditorContainerUiModules = new EditorContainerUiModulesClass();