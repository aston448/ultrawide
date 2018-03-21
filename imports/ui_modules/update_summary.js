import {EditorTab, LogLevel, ViewType} from "../constants/constants";
import {log} from "../common/utils";
import store from "../redux/store";

class UpdateSummaryUiServices {


    shouldSummaryUpdate(props, nextProps, context){

        let shouldUpdate = false;

        const updateTab = store.getState().currentUserUpdateTab;
        const updateView = (props.view === ViewType.DESIGN_UPDATE_VIEW || props.view === ViewType.DESIGN_UPDATE_EDIT);
        const updateListView = (props.view === ViewType.SELECT);

        log((msg) => console.log(msg), LogLevel.PERF, '  Should Upd Summ Update: UPD: {}, Context: {}, View {} ', updateView, context, props.view);

        if(context === 'SUMMARY') {
            // Update when changing to new DU or recalculating content
            if (
                nextProps.userContext.designUpdateId !== props.userContext.designUpdateId ||
                nextProps.addOrgHeaders.length !== props.addOrgHeaders.length ||
                nextProps.addFncHeaders.length !== props.addFncHeaders.length ||
                nextProps.removeHeaders.length !== props.removeHeaders.length ||
                nextProps.changeHeaders.length !== props.changeHeaders.length ||
                nextProps.moveHeaders.length !== props.moveHeaders.length ||
                nextProps.queryHeaders.length !== props.queryHeaders.length

            ) {
                shouldUpdate = true;
            }
        }

        // Update only if Summary showing not as a tab or if it is the currently visible tab for the view
        // But only if it needs updating anyway...
        if( (shouldUpdate || context === 'ACTION') &&
            (
            (updateListView) ||
            (updateView && props.userViewOptions.updateSummaryVisible && !props.userViewOptions.updateShowAllAsTabs) ||
            (updateView && props.userViewOptions.updateShowAllAsTabs && updateTab === EditorTab.TAB_UPDATE_SUMMARY)
            )
         ){
            shouldUpdate = true;
        } else {
            shouldUpdate = false;
        }

        return shouldUpdate;
    }
}

export default new UpdateSummaryUiServices();