import {EditorTab, ViewType, LogLevel, ViewMode} from "../constants/constants";
import {log} from "../common/utils";

import store from "../redux/store";


class DomainDictUiServicesClass{

    shouldDictionaryUpdate(props){

        let shouldUpdate = false;



        const designTab = store.getState().currentUserDesignTab;
        const updateTab = store.getState().currentUserUpdateTab;
        const wpTab = store.getState().currentUserWpTab;
        const devTab = store.getState().currentUserDevTab;

        const designView = (props.view === ViewType.DESIGN_NEW || props.view === ViewType.DESIGN_PUBLISHED || props.view === ViewType.DESIGN_UPDATABLE);
        const updateView = (props.view === ViewType.DESIGN_UPDATE_VIEW || props.view === ViewType.DESIGN_UPDATE_EDIT);
        const wpView = (props.view === ViewType.WORK_PACKAGE_BASE_VIEW || props.view === ViewType.WORK_PACKAGE_BASE_EDIT || props.view === ViewType.WORK_PACKAGE_UPDATE_VIEW || props.view === ViewType.WORK_PACKAGE_UPDATE_EDIT);
        const devView = (props.view === ViewType.DEVELOP_BASE_WP || props.view === ViewType.DEVELOP_UPDATE_WP);

        log((msg) => console.log(msg), LogLevel.PERF, '  Should Dom Dict Update: DES {}, UPD: {}, WP: {}, DEV: {} ', designView, updateView, wpView, devView);

        log((msg) => console.log(msg), LogLevel.PERF, '  Tabs Options: DES {}, UPD: {}, WRK: {}', props.userViewOptions.designShowAllAsTabs, props.userViewOptions.updateShowAllAsTabs, props.userViewOptions.workShowAllAsTabs);

        // Update only if Dict showing not as a tab or if it is the currently visible tab for the view
        if(
            (designView && props.userViewOptions.designDomainDictVisible && !props.userViewOptions.designShowAllAsTabs) ||
            (updateView && props.userViewOptions.designDomainDictVisible && !props.userViewOptions.updateShowAllAsTabs) ||
            ((devView || wpView ) && props.userViewOptions.designDomainDictVisible && !props.userViewOptions.workShowAllAsTabs) ||
            (designView && props.userViewOptions.designShowAllAsTabs && designTab === EditorTab.TAB_DOMAIN_DICT) ||
            (updateView && props.userViewOptions.updateShowAllAsTabs && updateTab === EditorTab.TAB_DOMAIN_DICT) ||
            (wpView && props.userViewOptions.workShowAllAsTabs && wpTab === EditorTab.TAB_DOMAIN_DICT) ||
            (devView && props.userViewOptions.workShowAllAsTabs && devTab === EditorTab.TAB_DOMAIN_DICT)
        ){
            shouldUpdate = true;
        }

        return shouldUpdate;
    }

    shouldDictionaryTermUpdate(props, nextProps, state, nextState){

        return(
            (state.editorState !== nextState.editorState) ||
            (state.termEditable) ||
            (state.definitionEditable) ||
            (state.termEditable !== nextState.termEditable) ||
            (state.definitionEditable !== nextState.definitionEditable)
        )

    }
}

export const DomainDictUiServices = new DomainDictUiServicesClass();