import {DisplayContext, EditorTab, LogLevel, ViewType} from "../constants/constants";
import store from "../redux/store";
import {log} from "../common/utils";


class TestResultsUiServicesClass {
    
    shouldContainerUpdate(props, nextProps, context){

        let shouldUpdate = false;

        const designTab = store.getState().currentUserDesignTab;
        const devTab = store.getState().currentUserDevTab;

        const designView = (props.view === ViewType.DESIGN_NEW || props.view === ViewType.DESIGN_PUBLISHED || props.view === ViewType.DESIGN_UPDATABLE);
        const devView = (props.view === ViewType.DEVELOP_BASE_WP || props.view === ViewType.DEVELOP_UPDATE_WP);


        // When Item changes, update only if Test showing not as a tab or if it is the currently visible tab for the view
        if(((nextProps.userContext.designComponentId !== props.userContext.designComponentId) || context === 'RENDER') && (
                (designView && props.userViewOptions.devAccTestsVisible && props.displayContext === DisplayContext.MASH_ACC_TESTS && !(props.userViewOptions.designShowAllAsTabs)) ||
                (designView && props.userViewOptions.devIntTestsVisible && props.displayContext === DisplayContext.MASH_INT_TESTS && !(props.userViewOptions.designShowAllAsTabs)) ||
                (designView && props.userViewOptions.devUnitTestsVisible && props.displayContext === DisplayContext.MASH_UNIT_TESTS && !(props.userViewOptions.designShowAllAsTabs)) ||
                (devView && props.userViewOptions.devAccTestsVisible && props.displayContext === DisplayContext.MASH_ACC_TESTS && !(props.userViewOptions.workShowAllAsTabs)) ||
                (devView && props.userViewOptions.devIntTestsVisible && props.displayContext === DisplayContext.MASH_INT_TESTS && !(props.userViewOptions.workShowAllAsTabs)) ||
                (devView && props.userViewOptions.devUnitTestsVisible && props.displayContext === DisplayContext.MASH_UNIT_TESTS && !(props.userViewOptions.workShowAllAsTabs)) ||
                (designView && props.userViewOptions.designShowAllAsTabs && designTab === EditorTab.TAB_ACC_TESTS && props.displayContext === DisplayContext.MASH_ACC_TESTS) ||
                (designView && props.userViewOptions.designShowAllAsTabs && designTab === EditorTab.TAB_INT_TESTS && props.displayContext === DisplayContext.MASH_INT_TESTS) ||
                (designView && props.userViewOptions.designShowAllAsTabs && designTab === EditorTab.TAB_UNIT_TESTS && props.displayContext === DisplayContext.MASH_UNIT_TESTS) ||
                (devView && props.userViewOptions.workShowAllAsTabs && devTab === EditorTab.TAB_ACC_TESTS && props.displayContext === DisplayContext.MASH_ACC_TESTS) ||
                (devView && props.userViewOptions.workShowAllAsTabs && devTab === EditorTab.TAB_INT_TESTS && props.displayContext === DisplayContext.MASH_INT_TESTS) ||
                (devView && props.userViewOptions.workShowAllAsTabs && devTab === EditorTab.TAB_UNIT_TESTS && props.displayContext === DisplayContext.MASH_UNIT_TESTS)
            )
        ){
            shouldUpdate = true;
        }

        // Update if switching to tab
        if(
            (props.userViewOptions.designShowAllAsTabs || props.userViewOptions.workShowAllAsTabs) && (
                (designView && nextProps.designTab === EditorTab.TAB_ACC_TESTS && nextProps.displayContext === DisplayContext.MASH_ACC_TESTS) ||
                (designView && nextProps.designTab === EditorTab.TAB_INT_TESTS && nextProps.displayContext === DisplayContext.MASH_INT_TESTS) ||
                (designView && nextProps.designTab === EditorTab.TAB_UNIT_TESTS && nextProps.displayContext === DisplayContext.MASH_UNIT_TESTS) ||
                (devView && nextProps.devTab === EditorTab.TAB_ACC_TESTS && nextProps.displayContext === DisplayContext.MASH_ACC_TESTS) ||
                (devView && nextProps.devTab === EditorTab.TAB_INT_TESTS && nextProps.displayContext === DisplayContext.MASH_INT_TESTS) ||
                (devView && nextProps.devTab === EditorTab.TAB_UNIT_TESTS && nextProps.displayContext === DisplayContext.MASH_UNIT_TESTS)
            )
        ){
            shouldUpdate = true;
        }

        return shouldUpdate;
    }
    
}

export const TestResultsUiServices = new TestResultsUiServicesClass();