// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {MenuAction, RoleType} from '../../../constants/constants.js';

import ClientAppHeaderServices          from '../../../apiClient/apiClientAppHeader.js';
import ClientTestIntegrationServices    from '../../../apiClient/apiClientTestIntegration.js';

// Bootstrap
import {InputGroup, Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Menu Item - Direct Action item in App Header menu
//
// ---------------------------------------------------------------------------------------------------------------------

export class UltrawideMenuDropdownItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isHighlighted: false,
            checkboxChecked: this.props.checkboxIsChecked
        }

    }

    componentWillReceiveProps(newProps){

        this.setState({checkboxChecked: newProps.checkboxIsChecked})
    }

    highlightMe(){
        this.setState({isHighlighted: true})
    }

    unhighlightMe(){
        this.setState({isHighlighted: false})
    }

    action(action, viewOptionType, view, userContext, userRole, userViewOptions, currentViewDataValue, testDataFlag){
        event.preventDefault();

        console.log("Dropdown item action " + action + " with dev int tests set to " + userViewOptions.devIntTestsVisible);

        if(this.props.hasCheckbox) {
            this.setState({checkboxChecked: !this.state.checkboxChecked})
        }

        this.props.clickAction(false);

        switch(action){
            case MenuAction.MENU_ACTION_GOTO_TEST_CONFIG:
                ClientAppHeaderServices.setViewTestOutput();
                break;
            case MenuAction.MENU_ACTION_GOTO_SELECTION:
                ClientAppHeaderServices.setViewSelection();
                break;
            case MenuAction.MENU_ACTION_GOTO_CONFIG:
                ClientAppHeaderServices.setViewConfigure();
                break;
            case MenuAction.MENU_ACTION_GOTO_DESIGNS:
                ClientAppHeaderServices.setViewDesigns();
                break;
            case MenuAction.MENU_ACTION_VIEW_DICT:
            case MenuAction.MENU_ACTION_VIEW_ACC_FILES:
            case MenuAction.MENU_ACTION_VIEW_UNIT_TESTS:
            case MenuAction.MENU_ACTION_VIEW_INT_TESTS:
            case MenuAction.MENU_ACTION_VIEW_ACC_TESTS:
            case MenuAction.MENU_ACTION_VIEW_TEST_SUMM:
            case MenuAction.MENU_ACTION_VIEW_DETAILS:
            case MenuAction.MENU_ACTION_VIEW_PROGRESS:
            case MenuAction.MENU_ACTION_VIEW_UPD_SUMM:
                ClientAppHeaderServices.toggleViewOption(viewOptionType, userViewOptions, userContext.userId);
                break;
            case MenuAction.MENU_ACTION_VIEW_ALL_TABS:
                ClientAppHeaderServices.toggleTabsViewOption(viewOptionType, userViewOptions, userContext.userId);
                break;
            case MenuAction.MENU_ACTION_REFRESH_TESTS:
                ClientTestIntegrationServices.refreshTestData(userContext);
                break;
        }

    }

    render() {

        const {itemName, action, hasCheckbox, viewOptionType, view, mode, userContext, userRole, userViewOptions, testDataFlag, currentViewDataValue} = this.props;

        let highlight = '';

        switch(userRole){
            case RoleType.DESIGNER:
                highlight = 'menu-highlight-designer';
                break;
            case RoleType.DEVELOPER:
                highlight = 'menu-highlight-developer';
                break;
            case RoleType.MANAGER:
                highlight = 'menu-highlight-manager';
                break;
        }

        const className = this.state.isHighlighted ? 'dropdown-item-name ' + highlight : 'dropdown-item-name';

        let checkedStatus = ((this.state.checkboxChecked) ? 'in-scope' : 'out-scope');

        if(hasCheckbox) {
            return (
                <li id={itemName}>
                    <InputGroup onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()}
                                onMouseUp={() => this.action(action, viewOptionType, view, userContext, userRole, userViewOptions, currentViewDataValue, testDataFlag)}>
                        <InputGroup.Addon>
                            <div className={checkedStatus}><Glyphicon glyph="ok"/></div>
                        </InputGroup.Addon>
                        <div className={className}>{itemName}</div>
                    </InputGroup>
                </li>
            )
        } else {
            return (
                <li id={itemName}>
                    <div className={className} onMouseEnter={() => this.highlightMe()}
                         onMouseLeave={() => this.unhighlightMe()} onMouseUp={() => this.action(action, viewOptionType, view, userContext, userRole, userViewOptions, currentViewDataValue, testDataFlag)}>
                        {itemName}
                    </div>
                </li>
            )
        }
    }
}

UltrawideMenuDropdownItem.propTypes = {
    itemName: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    hasCheckbox: PropTypes.bool.isRequired,
    checkboxIsChecked: PropTypes.bool.isRequired,
    viewOptionType: PropTypes.string.isRequired,
    clickAction: PropTypes.func.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:                       state.currentAppView,
        mode:                       state.currentViewMode,
        userContext:                state.currentUserItemContext,
        userRole:                   state.currentUserRole,
        userViewOptions:            state.currentUserViewOptions,
        testDataFlag:               state.testDataFlag,
        currentViewDataValue:       state.currentViewOptionsDataValue,
        designVersionDataLoaded:    state.designVersionDataLoaded,
        workPackageDataLoaded:      state.workPackageDataLoaded,
        testIntegrationDataLoaded:  state.testIntegrationDataLoaded,
        testSummaryDataLoaded:      state.testSummaryDataLoaded,
        testDataStale:              state.testDataStale,
        mashDataStale:              state.mashDataStale
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UltrawideMenuDropdownItem);