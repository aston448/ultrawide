// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import UltrawideMenuDropdownItem from '../../components/common/UltrawideMenuDropdownItem.jsx';

// Ultrawide Services
import { DetailsViewType, ViewMode} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientDomainDictionaryServices from '../../../apiClient/apiClientDomainDictionary.js';

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
            console.log('Adding dropdown item ' + item.itemName + ' with action ' + item.action);
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

        const {itemsList, clickAction} = this.props;


        console.log("Render Dropdown List with list of length " + itemsList.length);


        return (
            <ul className="dropdown-menu">
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

    const itemsList = ClientContainerServices.getDropdownMenuItems(
        params.menuType,
        params.view,
        params.mode);

    return {
        itemsList: itemsList,
        clickAction: params.clickAction
    }


}, connect(mapStateToProps)(DropdownItems));