// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuDropdownItemsContainer from '../../containers/common/UltrawideMenuDropdownItemsContainer.jsx';

// Ultrawide Services
import {RoleType} from '../../../constants/constants.js'

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Menu Item - Direct Action item in App Header menu
//
// ---------------------------------------------------------------------------------------------------------------------

export class UltrawideMenuDropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isHighlighted: false,
            shouldDisplayItems: false
        }

    }

    highlightMe(){
        this.setState({isHighlighted: true});
        this.setDisplayItems(true);
    }

    unhighlightMe(){
        this.setState({isHighlighted: false});
    }

    // This wheeze stops the menu being displayed after changing view
    setDisplayItems(state){
        this.setState({shouldDisplayItems: state});
        if(!state){
            this.setState({isHighlighted: false});
        }
    }

    action(){
        console.log("CLICKED");
        this.props.actionFunction();
    }

    render() {

        const {itemName, menuType, view, mode, userViewOptions, userRole} = this.props;

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

        const className = this.state.isHighlighted ? highlight : '';

        if(this.state.shouldDisplayItems){
            return(
                <div className="dropdown top-menu-item" onMouseEnter={() => this.highlightMe()}>
                    <div data-toggle="dropdown" className={'dropdown-toggle ' + className} onMouseLeave={() => this.unhighlightMe()}>{itemName} <b className="caret"></b></div>
                    <UltrawideMenuDropdownItemsContainer params={{
                        menuType: menuType,
                        view: view,
                        mode: mode,
                        userViewOptions: userViewOptions,
                        clickAction: (newState) => this.setDisplayItems(newState)
                    }}
                    />
                </div>
            )

        } else {
            return(
                <div className="dropdown top-menu-item" onMouseEnter={() => this.highlightMe()}>
                    <div data-target="#" data-toggle="dropdown" className={'dropdown-toggle ' + className} onMouseLeave={() => this.unhighlightMe()}>{itemName} <b className="caret"></b></div>
                </div>
            )
        }

    }
}

UltrawideMenuDropdown.propTypes = {
    itemName: PropTypes.string.isRequired,
    menuType: PropTypes.string.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        userViewOptions:        state.currentUserViewOptions,
        userRole:               state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UltrawideMenuDropdown);

