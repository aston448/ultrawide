
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