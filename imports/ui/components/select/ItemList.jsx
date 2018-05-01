// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentAdd from '../common/DesignComponentAdd.jsx';

// Ultrawide Services
import { ClientUserSettingsServices }  from '../../../apiClient/apiClientUserSettings.js';
import {log} from "../../../common/utils";
import {LogLevel, ViewType} from "../../../constants/constants";

// Bootstrap

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Item Container - Standard container for Design Items: Designs, Design Versions, Work Packages, Design Updates
//
// ---------------------------------------------------------------------------------------------------------------------

export class ItemList extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps){
        // Need to update list if details of an item in the list change so careful here
        return true;
    }

    getWindowSizeClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignItemList();
    }

    footerAction(){
        this.props.footerActionFunction()
    }

    bodyData(){
        return this.props.bodyDataFunction();
    }

    render() {

        const {headerText, hasFooterAction, footerAction, footerActionUiContext, footerText} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Item List');

        const bodyClass = this.getWindowSizeClass();

        if(hasFooterAction) {
            return (

                <div className="item-container">
                    <div className="item-container-header">{headerText}</div>
                    <div className={bodyClass}>
                        {this.bodyData()}
                    </div>
                    <div className="item-container-footer">
                        <div className="design-item-add">
                            <DesignComponentAdd
                                uiContextId={footerActionUiContext}
                                addText={footerAction}
                                onClick={ () => this.footerAction()}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (

                <div className="item-container">
                    <div className="item-container-header">{headerText}</div>
                    <div className={bodyClass}>
                        {this.bodyData()}
                    </div>
                    <div className="item-container-footer">
                        {footerText}
                    </div>
                </div>
            )
        }
    }
}

ItemList.propTypes = {
    headerText: PropTypes.string,
    bodyDataFunction: PropTypes.func,
    hasFooterAction: PropTypes.bool.isRequired,
    footerAction: PropTypes.string,
    footerActionFunction: PropTypes.func,
    footerActionUiContext: PropTypes.string,
    footerText: PropTypes.string
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        summaryItem: state.currentUserSummaryItem,
        testLocation: state.currentUserTestOutputLocationId,
        view: state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ItemList);