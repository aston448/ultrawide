import React from 'react';

import {Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap,
    convertFromRaw, convertToRaw, getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator} from 'draft-js';

import {log} from "../common/utils";

import {
    ComponentType, DisplayContext, LogLevel, UpdateMergeStatus, UpdateScopeType,
    ViewType, WorkPackageScopeType
} from "../constants/constants";

import { ClientDomainDictionaryServices } from "../apiClient/apiClientDomainDictionary";
import { ClientDesignComponentServices } from "../apiClient/apiClientDesignComponent";


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


class ComponentUiModulesClass{

    componentShouldUpdate(props, nextProps, state, nextState){

        log((msg) => console.log(msg), LogLevel.PERF, "COMPONENT {} SHOULD UPDATE FOR CONTEXT {}", props.currentItem.componentNameNew, props.displayContext);

        if(this.shouldUpdateCommon(props, nextProps, state, nextState, 'COMPONENT')){
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of COMMON", props.currentItem.componentNameNew);
            return true;
        }

        // Do refresh if this specific component is gaining or losing focus
        let currentItemId = props.currentItem._id;
        let openItemId = props.currentItem._id;

        if(props.displayContext === DisplayContext.WP_VIEW || props.displayContext === DisplayContext.DEV_DESIGN){
            openItemId = props.wpItem._id;
        }

        if((nextProps.userContext.designComponentId === currentItemId) && (props.userContext.designComponentId !== currentItemId)){
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of FOCUS", props.currentItem.componentNameNew);
            return true;
        }

        if((nextProps.userContext.designComponentId !== currentItemId) && (props.userContext.designComponentId === currentItemId)){
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of FOCUS", props.currentItem.componentNameNew);
            return true;
        }

        // If this specific item has been opened or closed...
        if(nextProps.openItemsFlag.item === openItemId && (nextProps.isOpen !== props.isOpen)){
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of OPEN CLOSE", props.currentItem.componentNameNew);
            return true;
        }


        if(nextState.open !== state.open) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of OPEN state", props.currentItem.componentNameNew);
            return true;
        }

        if(nextState.highlighted !== state.highlighted) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HIGHLIGHTED state", props.currentItem.componentNameNew);
            return true;
        }

        if(nextProps.currentItem.isRemovable !== props.currentItem.isRemovable) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of REMOVABLE", props.currentItem.componentNameNew);
            return true;
        }

        if(nextProps.mode !== props.mode) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of MODE", props.currentItem.componentNameNew);
            return true;
        }

        if(nextProps.testDataFlag !== props.testDataFlag) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of TEST DATA", props.currentItem.componentNameNew);
            return true;
        }

        if(nextProps.testSummary !== props.testSummary) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of TEST SUMMARY", props.currentItem.componentNameNew);
            return true;
        }

        switch (nextProps.view) {
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:

                if(nextState.editing !== state.editing) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of EDIT", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextState.editorState !== state.editorState) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of EDITOR STATE", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.componentNameNew !== props.currentItem.componentNameNew) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of NAME CHANGE", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.componentNarrativeNew !== props.currentItem.componentNarrativeNew) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of NARRATIVE CHANGE", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.isDragDropHovering !== props.isDragDropHovering) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of DRAG DROP", props.currentItem.componentNameNew);
                    return true;
                }

                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:

                if(nextState.editing !== state.editing) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of EDIT", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.isRemoved !== props.currentItem.isRemoved) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of LOGICAL DELETE", props.currentItem.componentNameNew);
                    console.log('HEADER SHOULD UPDATE');
                    return true;
                }

                if(nextState.editorState !== state.editorState) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of EDITOR STATE", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.componentNameNew !== props.currentItem.componentNameNew) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of NAME CHANGE", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.isDragDropHovering !== props.isDragDropHovering) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of DRAG DROP", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.updateMergeStatus !== props.currentItem.updateMergeStatus) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of MERGE STATUS", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.updateItem && props.updateItem){

                    if (nextProps.updateItem.scopeType !== props.updateItem.scopeType) {
                        log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of UPDATE SCOPE CHANGE", props.currentItem.componentNameNew);
                        return true;
                    }

                    if(nextProps.updateItem.isRemovable !== props.updateItem.isRemovable) {
                        log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of UPDATE REMOVABLE", props.currentItem.componentNameNew);
                        return true;
                    }
                }



                break;

        }

        return false;

    }

    componentHeaderShouldUpdate(props, nextProps, state, nextState){

        log((msg) => console.log(msg), LogLevel.PERF, "HEADER SHOULD UPDATE FOR CONTEXT {}", props.displayContext);

        if(this.shouldUpdateCommon(props, nextProps, state, nextState, 'HEADER')){
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER COMMON", props.currentItem.componentNameNew);
            return true;
        }

        if(nextState.highlighted !== state.highlighted) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER HIGHLIGHTED state", props.currentItem.componentNameNew);
            return true;
        }

        if(nextState.editing !== state.editing) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER EDIT", props.currentItem.componentNameNew);
            return true;
        }

        if(nextState.editorState !== state.editorState) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER EDITOR STATE", props.currentItem.componentNameNew);
            return true;
        }

        if(nextProps.testSummary !== props.testSummary) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER TEST SUMMARY", props.currentItem.componentNameNew);
            return true;
        }

        if(nextProps.testDataFlag !== props.testDataFlag) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER TEST DATA", props.currentItem.componentNameNew);
            return true;
        }

        if(nextProps.isOpen !== props.isOpen) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER IS OPEN", props.currentItem.componentNameNew);
            return true;
        }

        if(nextProps.mode !== props.mode) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER MODE", props.currentItem.componentNameNew);
            return true;
        }

        if(nextProps.currentItem.isRemovable !== props.currentItem.isRemovable) {
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER REMOVABLE", props.currentItem.componentNameNew);
            return true;
        }


        switch (props.view) {
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:

                if(nextProps.currentItem.componentNameNew !== props.currentItem.componentNameNew) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER NAME CHANGE", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.componentNarrativeNew !== props.currentItem.componentNarrativeNew) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of NARRATIVE CHANGE", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.isDragDropHovering !== props.isDragDropHovering) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER DRAG DROP", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.isDragging !== props.isDragging) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER DRAG", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.updateMergeStatus !== props.currentItem.updateMergeStatus) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER MERGE STATUS", props.currentItem.componentNameNew);
                    return true;
                }

                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:

                if(nextProps.currentItem.componentNameNew !== props.currentItem.componentNameNew) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER NAME CHANGE", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.isRemoved !== props.currentItem.isRemoved) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER LOGICAL DELETE", props.currentItem.componentNameNew);
                    console.log('HEADER SHOULD UPDATE');
                    return true;
                }

                if(nextProps.isDragDropHovering !== props.isDragDropHovering) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER DRAG DROP", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.isDragging !== props.isDragging) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER DRAG", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.updateMergeStatus !== props.currentItem.updateMergeStatus) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER MERGE STATUS", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.currentItem.updateMergeStatus !== props.currentItem.updateMergeStatus) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER MERGE STATUS", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextState.inScope !== state.inScope) {
                    log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER SCOPE CHANGE", props.currentItem.componentNameNew);
                    return true;
                }

                if(nextProps.updateItem && props.updateItem){

                    if (nextProps.updateItem.scopeType !== props.updateItem.scopeType) {
                        log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER UPDATE SCOPE CHANGE", props.currentItem.componentNameNew);
                        return true;
                    }

                    if(nextProps.updateItem.isRemovable !== props.updateItem.isRemovable) {
                        log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of HEADER UPDATE REMOVABLE", props.currentItem.componentNameNew);
                        return true;
                    }
                }
                break;

        }

        return false;
    }


    shouldUpdateCommon(props, nextProps, state, nextState, source){

        if(nextProps.domainTermsVisible !== props.domainTermsVisible){
            log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of DOMAIN TERMS", props.currentItem.componentNameNew);
            return true;
        }

        // If test summary data has changed due to changed expectations
        if(props.testSummaryData && nextProps.testSummaryData && props.currentItem.componentType === ComponentType.FEATURE) {
            if (props.testSummaryData.featureExpectedTestCount !== nextProps.testSummaryData.featureExpectedTestCount) {
                log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of TEST SUMMARY DATA", props.currentItem.componentNameNew);
                return true;
            }
        }

        // Check for scope updates

        // IF: Scope items exist and the display context is SCOPE and the update flag has been triggered and this item is one of the update items or the one that is currently changing or a parent of the changing item

        if(nextProps.updateScopeItems && props.updateScopeItems && nextProps.displayContext === DisplayContext.UPDATE_SCOPE) {
            if ((nextProps.updateScopeItems.flag !== props.updateScopeItems.flag) && ((nextProps.updateScopeItems.currentParents.includes(nextProps.currentItem._id)) || (nextProps.currentItem._id === nextProps.updateScopeItems.changingItemId))) {
                log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of DU SCOPE", props.currentItem.componentNameNew);
                return true;
            }
        }

        // console.log('Update Common %s: current item is %s; children are %o ', nextProps.currentItem.componentNameNew, nextProps.currentItem._id, nextProps.workPackageScopeItems.currentChildren);

        if(nextProps.workPackageScopeItems && props.workPackageScopeItems && nextProps.displayContext === DisplayContext.WP_SCOPE) {
            if ((nextProps.workPackageScopeItems.flag !== props.workPackageScopeItems.flag) && (
                (nextProps.workPackageScopeItems.currentParents.includes(nextProps.currentItem._id)) ||
                (nextProps.workPackageScopeItems.currentChildren.includes(nextProps.currentItem._id)) ||
                (nextProps.currentItem._id === nextProps.workPackageScopeItems.changingItemId)
            )) {
                log((msg) => console.log(msg), LogLevel.PERF, " *** Updating {} because of WP SCOPE", props.currentItem.componentNameNew);
                return true;
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


    shouldComponentListUpdate(type, newProps, oldProps){

        let shouldUpdate = false;

        // Look for movement in the list.  As we are using a decimal index the total will change
        let oldIndexTotal = 0;
        let newIndexTotal = 0;
        let oldNarrative = '';
        let newNarrative = '';
        let oldNames = '';
        let newNames = '';
        let oldRemoved = 0;
        let newRemoved = 0;
        let oldScope = 0;
        let newScope = 0;
        let newRemovable = 0;
        let oldRemovable = 0;

        if(type === 'Feature'){
            oldProps.components.forEach((component) => {
                oldNarrative += component.componentNarrativeNew;
            });

            newProps.components.forEach((component) => {
                newNarrative += component.componentNarrativeNew;
            });
        }

        oldProps.components.forEach((component) => {
            oldIndexTotal += component.componentIndexNew;
            oldNames += component.componentNameNew;
            if(component.isRemoved){
                oldRemoved++;
            }
            if(component.isRemovable){
                oldRemovable++;
            }
            if(component.scopeType === UpdateScopeType.SCOPE_IN_SCOPE){
                oldScope++;
            }
        });

        newProps.components.forEach((component) => {
            newIndexTotal += component.componentIndexNew;
            newNames += component.componentNameNew;
            if(component.isRemoved){
                newRemoved++;
            }
            if(component.isRemovable){
                newRemovable++;
            }
            if(component.scopeType === UpdateScopeType.SCOPE_IN_SCOPE){
                newScope++;
            }
        });

        if(
            newProps.components.length !== oldProps.components.length ||
            newIndexTotal !== oldIndexTotal ||
            oldNarrative !== newNarrative ||
            oldNames !== newNames ||
            oldRemoved !== newRemoved ||
            oldRemovable !== newRemovable ||
            oldScope !== newScope
        ){
            shouldUpdate = true;
        }

        log((msg) => console.log(msg), LogLevel.PERF, '{} List Should Update: {} Len: {} to {}; Index: {} to {}; Removed {} to {}; Scope {} to {}', type, shouldUpdate, oldProps.components.length, newProps.components.length, oldIndexTotal, newIndexTotal, oldRemoved, newRemoved, oldScope, newScope);

        return shouldUpdate;
    }

}
 export const ComponentUiModules = new ComponentUiModulesClass();