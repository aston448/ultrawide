import React from 'react';

import {Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap,
    convertFromRaw, convertToRaw, getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator} from 'draft-js';

import {log} from "../common/utils";

import {
    ComponentType, DisplayContext, LogLevel, UpdateMergeStatus, UpdateScopeType,
    ViewType, WorkPackageScopeType
} from "../constants/constants";

import ClientDomainDictionaryServices from "../apiClient/apiClientDomainDictionary";
import ClientDesignComponentServices from "../apiClient/apiClientDesignComponent";


const styles = {
    domainTerm: {
        color: 'rgba(96, 96, 255, 1.0)',
        //backgroundColor: 'rgba(240, 255, 240, 1.0)',
        fontWeight: 300,
        //textDecoration: 'underline'
    }
};

const DomainSpan = (props) => {
    const {properties} = props;
    return <span {...properties} style={styles.domainTerm}>{props.children}</span>;  //
};


class ComponentUiModules{

    componentShouldUpdate(props, nextProps, state, nextState){

        if(this.shouldUpdateCommon(props, nextProps, state, nextState)){
            return true;
        }

        // Do refresh if this specific component is gaining or losing focus
        let currentItemId = props.currentItem._id;
        let openItemId = props.currentItem._id;

        if(props.displayContext === DisplayContext.WP_VIEW || props.displayContext === DisplayContext.DEV_DESIGN){
            openItemId = props.wpItem._id;
        }

        if((nextProps.userContext.designComponentId === currentItemId) && (props.userContext.designComponentId !== currentItemId)){
            return true;
        }

        if((nextProps.userContext.designComponentId !== currentItemId) && (props.userContext.designComponentId === currentItemId)){
            return true;
        }

        // If this specific item has been opened or closed...
        if(nextProps.openItemsFlag.item === openItemId){
            return true;
        }

        if(props.view === ViewType.DESIGN_UPDATE_EDIT) {

            // Look for Design Update scoping trigger

            if (nextProps.updateScopeFlag !== props.updateScopeFlag) {

                // If its one of the descoped items
                if (nextProps.updateScopeItems.removed.includes(nextProps.currentItem.componentReferenceId)) {
                    return true;
                }

                // Or its in the update scope
                if (props.updateItem || nextProps.updateItem) {
                    return true;
                }
            }
        }

        let shouldComponentUpdate = false;

        switch (nextProps.view) {
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                shouldComponentUpdate =!(
                    nextState.open === state.open &&
                    nextState.highlighted === state.highlighted &&
                    nextState.editing === state.editing &&
                    nextState.editorState === state.editorState &&
                    nextProps.testSummary === props.testSummary &&
                    nextProps.currentItem.componentNameNew === props.currentItem.componentNameNew &&
                    nextProps.currentItem.isRemovable === props.currentItem.isRemovable &&
                    nextProps.isDragDropHovering === props.isDragDropHovering &&
                    nextProps.mode === props.mode &&
                    nextProps.testDataFlag === props.testDataFlag
                );
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                shouldComponentUpdate =!(
                    nextState.open === state.open &&
                    nextState.highlighted === state.highlighted &&
                    nextState.editing === state.editing &&
                    nextState.editorState === state.editorState &&
                    nextProps.testSummary === props.testSummary &&
                    nextProps.currentItem.componentNameNew === props.currentItem.componentNameNew &&
                    nextProps.currentItem.isRemovable === props.currentItem.isRemovable &&
                    nextProps.currentItem.updateMergeStatus === props.currentItem.updateMergeStatus &&
                    nextProps.isDragDropHovering === props.isDragDropHovering &&
                    nextProps.mode === props.mode &&
                    nextProps.testDataFlag === props.testDataFlag
                );
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                shouldComponentUpdate = !(
                    nextState.open === state.open &&
                    nextState.highlighted === state.highlighted &&
                    nextProps.currentItem.isRemovable === props.currentItem.isRemovable &&
                    nextProps.mode === props.mode &&
                    nextProps.testDataFlag === props.testDataFlag &&
                    nextProps.testSummary === props.testSummary
                );
        }

        return shouldComponentUpdate;

    }

    componentHeaderShouldUpdate(props, nextProps, state, nextState){

        if(this.shouldUpdateCommon(props, nextProps, state, nextState)){
            return true;
        }

        // Check for scope updates in Update Editor
        if(props.view === ViewType.DESIGN_UPDATE_EDIT) {

            if (nextProps.updateScopeFlag !== props.updateScopeFlag) {
                // An update has been triggered.  Render if this item is in the update

                // If its one of the descoped items
                if (nextProps.updateScopeItems.removed.includes(props.currentItem.componentReferenceId)) {
                    return true;
                }

                // Or its in the scope
                if (nextProps.updateItem) {
                    return true;
                }
            }
        }

        switch (props.view) {
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                return !(
                    nextState.highlighted === state.highlighted &&
                    nextState.editing === state.editing &&
                    nextState.editorState === state.editorState &&
                    nextProps.testSummary === props.testSummary &&
                    nextProps.isOpen === props.isOpen &&
                    nextProps.currentItem.componentNameNew === props.currentItem.componentNameNew &&
                    nextProps.currentItem.isRemovable === props.currentItem.isRemovable &&
                    nextProps.isDragDropHovering === props.isDragDropHovering &&
                    nextProps.mode === props.mode &&
                    nextProps.isDragging === props.isDragging &&
                    nextProps.testDataFlag === props.testDataFlag
                );
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                return !(
                    nextState.highlighted === state.highlighted &&
                    nextState.editing === state.editing &&
                    nextState.inScope === state.inScope &&
                    nextState.parentScope === state.parentScope &&
                    nextState.editorState === state.editorState &&
                    nextProps.testSummary === props.testSummary &&
                    nextProps.isOpen === props.isOpen &&
                    nextProps.currentItem.componentNameNew === props.currentItem.componentNameNew &&
                    nextProps.currentItem.isRemovable === props.currentItem.isRemovable &&
                    nextProps.currentItem.updateMergeStatus === props.currentItem.updateMergeStatus &&
                    nextProps.isDragDropHovering === props.isDragDropHovering &&
                    nextProps.mode === props.mode &&
                    nextProps.isDragging === props.isDragging &&
                    nextProps.testDataFlag === props.testDataFlag
                );
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                return !(
                    nextState.highlighted === state.highlighted &&
                    nextState.editing === state.editing &&
                    nextState.editorState === state.editorState &&
                    nextProps.mode === props.mode &&
                    nextProps.currentItem.isRemovable === props.currentItem.isRemovable &&
                    nextProps.testSummary === props.testSummary &&
                    nextProps.testDataFlag === props.testDataFlag &&
                    nextProps.isOpen === props.isOpen
                );
        }
    }


    shouldUpdateCommon(props, nextProps, state, nextState){

        if(nextProps.domainTermsVisible !== props.domainTermsVisible){
            return true;
        }

        // If a scenario and test expectations have changed
        if(props.currentItem.componentType === ComponentType.SCENARIO){
            if(props.currentItem.requiresAcceptanceTest !== nextProps.currentItem.requiresAcceptanceTest){
                return true;
            }
            if(props.currentItem.requiresIntegrationTest !== nextProps.currentItem.requiresIntegrationTest){
                return true;
            }
            if(props.currentItem.requiresUnitTest !== nextProps.currentItem.requiresUnitTest){
                return true;
            }
        }

        // Check for scope updates in WP Editor
        if(props.view === ViewType.WORK_PACKAGE_BASE_EDIT || props.view === ViewType.WORK_PACKAGE_UPDATE_EDIT) {

            if (nextProps.workPackageScopeFlag !== props.workPackageScopeFlag) {
                // An update has been triggered.  Render if this item is in the WP

                // If its one of the descoped items
                if (nextProps.workPackageScopeItems.removed.includes(props.currentItem.componentReferenceId)) {
                    return true;
                }

                // Or its in the scope
                if (nextProps.wpItem) {
                    return true;
                }
            }
        }

        return false;
    }

    setComponentNameEditorText(state, props, newRawText){

        let currentContent = null;
        let compositeDecorator = null;
        let item = props.currentItem;

        if(!item){
            return state;
        }

        // Decoration for Scenarios only - and not if greyed out in WP scope
        if(item.componentType === ComponentType.SCENARIO) {

            log((msg) => console.log(msg), LogLevel.TRACE, "Decorator check: Component: {} Context: {}", item.componentType, props.displayContext);

            // Item is a Scenario
            if(props.displayContext === DisplayContext.WP_SCOPE || props.displayContext === DisplayContext.UPDATE_SCOPE){
                // We are in a WP or Update Scope context
                if((props.displayContext === DisplayContext.WP_SCOPE) && item.scopeType === WorkPackageScopeType.SCOPE_ACTIVE){
                    // The WP Scenario is active
                    compositeDecorator = new CompositeDecorator([
                        {
                            strategy: ClientDomainDictionaryServices.getDomainTermDecoratorFunction(item.designVersionId),
                            component: DomainSpan,
                        }
                    ]);
                }

                if(props.domainTermsVisible && (props.displayContext === DisplayContext.UPDATE_SCOPE) && (item.scopeType === UpdateScopeType.SCOPE_IN_SCOPE)){
                    // The Update Scenario is active
                    compositeDecorator = new CompositeDecorator([
                        {
                            strategy: ClientDomainDictionaryServices.getDomainTermDecoratorFunction(item.designVersionId),
                            component: DomainSpan,
                        }
                    ]);
                }

            } else {
                // We are not in WP scope context so OK for all Scenarios as long as not inserted as peers in an update
                if(props.domainTermsVisible && !(props.updateItem && props.updateItem.scopeType === UpdateScopeType.SCOPE_PEER_SCOPE)) {
                    compositeDecorator = new CompositeDecorator([
                        {
                            strategy: ClientDomainDictionaryServices.getDomainTermDecoratorFunction(item.designVersionId),
                            component: DomainSpan,
                        }
                    ]);
                }
            }

            EditorState.set(state.editorState, {decorator: compositeDecorator});
        }

        if(newRawText){

            // Immediate update of latest text
            log((msg) => console.log(msg), LogLevel.TRACE, "Updating title editor with {}", newRawText);

            // Don't want to update SCOPE in DU when content is edited
            if(!(props.view === ViewType.DESIGN_UPDATE_EDIT && props.displayContext === DisplayContext.UPDATE_SCOPE)){
                currentContent = convertFromRaw(newRawText);
            }

        } else {
            // Getting stored text
            let existingRawText = null;

            switch (props.view) {
                case ViewType.DESIGN_NEW:
                case ViewType.DESIGN_PUBLISHED:

                    existingRawText = item.componentNameRawNew;
                    break;
                case ViewType.DESIGN_UPDATABLE:
                    // If there is an item whose name has changed then create a new editor entry showing both
                    if((item.componentNameOld !== item.componentNameNew)  && item.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED) {
                        existingRawText = this.getNewAndOldRawText(item.componentNameNew, item.componentNameOld);
                    } else {
                        existingRawText = item.componentNameRawNew;
                    }

                    break;
                case ViewType.DESIGN_UPDATE_EDIT:

                    switch(props.displayContext){
                        case  DisplayContext.UPDATE_SCOPE:
                            // The editor shows the Old DV Values
                            existingRawText = item.componentNameRawOld;
                            break;
                        case DisplayContext.UPDATE_VIEW:
                        case DisplayContext.UPDATE_EDIT:
                            // The editor shows what's in the actual DU
                            if(props.updateItem) {
                                existingRawText = props.updateItem.componentNameRawNew;
                            }
                            break;
                        case DisplayContext.WORKING_VIEW:
                            // The editor shows the New DV Values
                            if((item.componentNameOld !== item.componentNameNew)  && item.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED) {
                                existingRawText = this.getNewAndOldRawText(item.componentNameNew, item.componentNameOld);
                            } else {
                                existingRawText = item.componentNameRawNew;
                            }
                    }
                    break;

                case ViewType.DESIGN_UPDATE_VIEW:

                    switch(props.displayContext){
                        case  DisplayContext.UPDATE_SCOPE:
                            // Scope uses the base DV components
                            existingRawText = item.componentNameRawOld;
                            break;
                        case DisplayContext.UPDATE_VIEW:
                        case DisplayContext.UPDATE_EDIT:
                            // The editor shows what's in the actual DU
                            if(props.updateItem) {
                                existingRawText = props.updateItem.componentNameRawNew;
                            }
                            break;
                        case DisplayContext.WORKING_VIEW:
                            // The editor shows the New DV Values
                            if((item.componentNameOld !== item.componentNameNew)  && item.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED) {
                                existingRawText = this.getNewAndOldRawText(item.componentNameNew, item.componentNameOld);
                            } else {
                                existingRawText = item.componentNameRawNew;
                            }
                    }
                    break;

                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:

                    existingRawText = item.componentNameRawNew;
                    break;
            }

            if (existingRawText) {
                currentContent = convertFromRaw(existingRawText, compositeDecorator);
            } else {
                state = {editorState: EditorState.createEmpty(compositeDecorator)};
                return;
            }

        }

        // Got some content...
        if (currentContent && currentContent.hasText()) {
            log((msg) => console.log(msg), LogLevel.TRACE, "Updating title editor with {}", currentContent.getPlainText());
            state.name = currentContent.getPlainText();
            state.editorState = EditorState.createWithContent(currentContent, compositeDecorator);
        } else {
            state = {editorState: EditorState.createEmpty(compositeDecorator)};
        }

        return state;
    }

    getNewAndOldRawText(newText, oldText){
        return ClientDesignComponentServices.getNewAndOldRawText(newText, oldText);
    }

}
 export default new ComponentUiModules()