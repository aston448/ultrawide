// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';

// Ultrawide Services

// Bootstrap

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Item Container - Standard container for Design Items: Designs, Design Versions, Work Packages, Design Updates
//
// ---------------------------------------------------------------------------------------------------------------------

export default class ItemContainer extends Component {
    constructor(props) {
        super(props);

    }

    footerAction(){
        this.props.footerActionFunction()
    }

    bodyData(){
        return this.props.bodyDataFunction();
    }

    render() {

        const {headerText, hasFooterAction, footerAction} = this.props;

        if(hasFooterAction) {
            return (

                <div className="item-container">
                    <div className="item-container-header">{headerText}</div>
                    <div className="scroll-col">
                        {this.bodyData()}
                    </div>
                    <div className="item-container-footer">
                        <div className="design-item-add">
                            <DesignComponentAdd
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
                    <div className="scroll-col">
                        {this.bodyData()}
                    </div>
                    <div className="item-container-footer">
                    </div>
                </div>
            )
        }
    }
}

ItemContainer.propTypes = {
    headerText: PropTypes.string,
    bodyDataFunction: PropTypes.func,
    hasFooterAction: PropTypes.bool.isRequired,
    footerAction: PropTypes.string,
    footerActionFunction: PropTypes.func,
};
