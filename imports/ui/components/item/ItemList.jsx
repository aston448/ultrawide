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
import {ItemListType, LogLevel, ViewType} from "../../../constants/constants";

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

    getWindowSizeClass(listType){
        let sizeClass = ClientUserSettingsServices.getWindowSizeClassForDesignItemList();

        if(listType === ItemListType.BACKLOG_ITEM){
            sizeClass = sizeClass + '-backlog'
        }

        return sizeClass;
    }

    footerAction(){
        this.props.footerActionFunction()
    }

    bodyData(){
        return this.props.bodyDataFunction();
    }

    render() {

        const {headerText, hasFooterAction, footerAction, footerActionUiContext, footerText, listType} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Item List');

        let bodyClass = this.getWindowSizeClass(listType);


        let containerType = 'item-container';
        let containerHeaderType = 'item-container-header';
        let containerFooterType = 'item-container-footer';

        switch(listType){

            case ItemListType.ULTRAWIDE_ITEM:
            case ItemListType.DESIGN_ANOMALY:
            case ItemListType.BACKLOG_ITEM:
                containerType = 'item-container';
                containerHeaderType = 'item-container-header';
                containerFooterType = 'item-container-footer';
                break;
            case ItemListType.WORK_ITEM_IN:
                containerType = 'item-container-in';
                containerHeaderType = 'item-container-header-in';
                containerFooterType = 'item-container-footer-in';
                break;
            case ItemListType.WORK_ITEM_IT:
                containerType = 'item-container-it';
                containerHeaderType = 'item-container-header-it';
                containerFooterType = 'item-container-footer-it';
                bodyClass = '';
                break;
            case ItemListType.WORK_ITEM_WP:
                containerType = 'item-container-wp';
                containerHeaderType = 'item-container-header-wp';
                containerFooterType = 'item-container-footer-wp';
                bodyClass = '';
                break;
            case ItemListType.WORK_ITEM_DU_WP:
                containerType = 'item-container-wp';
                containerHeaderType = 'item-container-header-wp';
                containerFooterType = 'item-container-footer';
                bodyClass = '';
                break;
            case ItemListType.WORK_ITEM_SUMM:
                containerType = 'item-container-su';
                containerHeaderType = 'item-container-header-su';
                containerFooterType = 'item-container-footer-su';
                bodyClass = '';
                break;
        }

        if(hasFooterAction) {
            return (

                <div className={containerType}>
                    <div className={containerHeaderType}>{headerText}</div>
                    <div className={bodyClass}>
                        {this.bodyData()}
                    </div>
                    <div className={containerFooterType}>
                        <div id={footerActionUiContext} className="design-item-add">
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

                <div className={containerType}>
                    <div className={containerHeaderType}>{headerText}</div>
                    <div className={bodyClass}>
                        {this.bodyData()}
                    </div>
                    <div className={containerFooterType}>
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
    footerText: PropTypes.string,
    listType: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        summaryItem: state.currentUserBacklogItem,
        testLocation: state.currentUserTestOutputLocationId,
        view: state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ItemList);