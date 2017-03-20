// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuDropdownItem from '../common/UltrawideMenuDropdownItem.jsx';

// Ultrawide Services

// Bootstrap

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Menu Item - Direct Action item in App Header menu
//
// ---------------------------------------------------------------------------------------------------------------------

export default class UltrawideMenuDropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isHighlighted: false,
            shouldDisplayItems: false
        }

    }

    renderListItems(listItems){
        return listItems.map((item) => {
            return (
                <UltrawideMenuDropdownItem
                    key={item.key}
                    itemName={item.itemName}
                    actionFunction={item.actionFunction}
                    hasCheckbox={item.hasCheckbox}
                    checkboxValue={item.checkboxValue}
                    clickAction={() => this.unhighlightMe()}/>
            );
        });
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

        const {itemName, itemsList} = this.props;

        const className = this.state.isHighlighted ? 'menu-highlight' : '';

        console.log("Render " + className);



            if(itemsList.length > 0 && this.state.shouldDisplayItems){
                return(
                    <div className="dropdown top-menu-item" onMouseEnter={() => this.highlightMe()}>
                        <div data-toggle="dropdown" className={'dropdown-toggle ' + className} onMouseLeave={() => this.unhighlightMe()}>{itemName} <b className="caret"></b></div>
                        <ul className="dropdown-menu" onMouseLeave={() => this.unhighlightMe()} onMouseUp={() => this.setDisplayItems(false)}>
                            {this.renderListItems(itemsList)}
                        </ul>
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
    itemsList: PropTypes.array.isRequired,
};