// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuDropdownItem from '../../components/common/UltrawideMenuDropdownItem.jsx';

// Ultrawide Services
import { RoleType } from '../../../constants/constants.js';
import ClientDataServices from '../../../apiClient/apiClientDataServices.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Dropdown List Items Container
//
// ---------------------------------------------------------------------------------------------------------------------


export class DropdownItems extends Component {

    constructor(props) {
        super(props);

    }

    renderListItems(listItems, clickAction){
        return listItems.map((item) => {

            return (
                <UltrawideMenuDropdownItem
                    key={item.key}
                    itemName={item.itemName}
                    action={item.action}
                    hasCheckbox={item.hasCheckbox}
                    checkboxIsChecked={item.checkboxValue}
                    viewOptionType={item.viewOptionType}
                    clickAction={clickAction}
                />
            );
        });
    }


    render() {

        const {itemsList, clickAction, userRole} = this.props;

        let background = '';

        switch(userRole){
            case RoleType.DESIGNER:
                background = 'menu-designer';
                break;
            case RoleType.DEVELOPER:
                background = 'menu-developer';
                break;
            case RoleType.MANAGER:
                background = 'menu-manager';
                break;
            case RoleType.GUEST_VIEWER:
                background = 'menu-viewer';
                break;
        }

        return (
            <ul className={'dropdown-menu ' + background}>
                {this.renderListItems(itemsList, clickAction)}
            </ul>
        )
    }
}

DropdownItems.propTypes = {
    itemsList: PropTypes.array.isRequired,
    clickAction: PropTypes.func.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        view: state.currentAppView,
        mode: state.currentViewMode,
        userContext: state.currentUserItemContext,
        userViewOptions: state.currentUserViewOptions,
        viewDataValue: state.currentViewOptionsDataValue
    }
}

export default DropdownItemsContainer = createContainer(({params}) => {

    const itemsList = ClientDataServices.getDropdownMenuItems(
        params.menuType,
        params.view,
        params.mode,
        params.userRole,
        params.userViewOptions
    );

    return {
        itemsList: itemsList,
        clickAction: params.clickAction
    }


}, connect(mapStateToProps)(DropdownItems));