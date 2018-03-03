// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentAdd               from '../../components/common/DesignComponentAdd.jsx';
import UltrawideMenuItem                from '../common/UltrawideMenuItem.jsx';

// Ultrawide Services
import {ViewType, ViewMode, DetailsViewType, MenuType, LogLevel}  from '../../../constants/constants.js';
import {AddActionIds}                                   from "../../../constants/ui_context_ids.js";
import {log} from "../../../common/utils";

import ClientDomainDictionaryServices   from '../../../apiClient/apiClientDomainDictionary.js';
import ClientTestIntegrationServices    from '../../../apiClient/apiClientTestIntegration.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Details View Footer
//
// ---------------------------------------------------------------------------------------------------------------------

export class DetailsViewFooter extends Component {
    constructor(props) {
        super(props);

    }

    onExportIntTests(){
        ClientTestIntegrationServices.exportIntegrationTestFile(this.props.userContext, this.props.userRole);
    }

    addDomainTerm(userRole, view, mode, designId, designVersionId){
        ClientDomainDictionaryServices.addNewDictionaryTerm(userRole, view, mode, designId, designVersionId);
    }

    render() {

        const {detailsType, actionsVisible, view, mode, userRole, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Details View Footer');

        let footerContent = <div></div>;
        let footerClass = 'design-editor-footer';


        let menuOptions = '';

        const exportIntOption =
            <UltrawideMenuItem
                menuType={MenuType.MENU_EDITOR}
                itemName="Export"
                actionFunction={ () => this.onExportIntTests()}
            />;

        // Which menu options should be visible
        switch(detailsType){
            case DetailsViewType.VIEW_INT_TESTS:
            case DetailsViewType.VIEW_UNIT_TESTS:
                if(actionsVisible){
                    menuOptions =
                        <div>
                            {exportIntOption}
                        </div>;
                } else {
                    footerClass = 'details-editor-footer';
                }
                break;
            case DetailsViewType.VIEW_DOM_DICT:

                // Add Dict item available if in editing view
                if((view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT) {
                    footerContent =
                        <div id="addDomainTerm">
                            <DesignComponentAdd
                                uiContextId={AddActionIds.UI_CONTEXT_ADD_DOMAIN_TERM}
                                addText="Add new Domain Term"
                                onClick={() => this.addDomainTerm(userRole, view, mode, userContext.designId, userContext.designVersionId)}
                            />
                        </div>;
                }
                break;

            case DetailsViewType.VIEW_DETAILS_NEW:
            case DetailsViewType.VIEW_DETAILS_OLD:
                footerClass = 'details-editor-footer';
                break;

        }
        
        return(
            <div className={footerClass}>
                {footerContent}
                {menuOptions}
            </div>
        );
    }
}

DetailsViewFooter.propTypes = {
    detailsType:        PropTypes.string.isRequired,
    actionsVisible:     PropTypes.bool.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        userContext:            state.currentUserItemContext,
        userRole:               state.currentUserRole,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DetailsViewFooter);