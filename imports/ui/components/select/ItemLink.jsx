// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {RoleType, DesignVersionStatus, DesignUpdateStatus} from '../../../constants/constants.js';

import ClientWorkPackageServices        from '../../../apiClient/apiClientWorkPackage.js';

// Bootstrap
import {InputGroup}                 from 'react-bootstrap';
import {Glyphicon}                  from 'react-bootstrap';
import {FormControl}                from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Item Version Component - Editable version for items, e.g. Design, Design Version, Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

export class ItemLink extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            open: false,
            linkEditable: false,
            linkValue: this.props.currentItemLink,
            highlighted: false,
        };

    }

    // Allow editing of link
    editItemLink(){
        event.preventDefault();
        this.setState({linkEditable: true});

    }

    saveItemLink(currentItemId){
        event.preventDefault();

        let newLink = this.state.linkValue;

        ClientWorkPackageServices.updateWorkPackageLink(currentItemId, newLink);

        this.setState({linkEditable: false});
    }

    handleLinkKeyEvents(event, currentItemId) {
        if(event.charCode === 13){
            // Enter Key
            this.saveItemLink(currentItemId);
        }
    }

    handleLinkChange(event) {
        this.setState({linkValue: event.target.value});
    }


    undoItemLinkChange(){
        event.preventDefault();
        this.setState({linkValue: this.props.currentItemLink});
        this.setState({linkEditable: false});
    }

    render(){
        const {currentItemId, currentItemLink, currentItemStatus, currentItemType, itemStatusClass, userRole} = this.props;

        let refEditorEditing = <div></div>;
        let refEditorNotEditing = <div></div>;
        let refReadOnly = <div></div>;

        //console.log("Render DI Header for " + userRole + " with item " + currentItemType + " caled " + currentItemName);


        let linkEditorEditing =
            <div>
                <InputGroup>
                    <div className="editableItem">
                        <FormControl
                            id="linkEdit"
                            type="text"
                            value={this.state.linkValue}
                            placeholder={currentItemLink}
                            onChange={(event) => this.handleLinkChange(event)}
                            onKeyPress={(event) => this.handleLinkKeyEvents(event, currentItemId)}
                        />
                    </div>
                    <InputGroup.Addon onClick={ () => this.saveItemLink(currentItemId)}>
                        <div id="editLinkOk" className="green"><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.undoItemLinkChange()}>
                        <div id="editLinkCancel" className="red"><Glyphicon glyph="arrow-left"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        let wpLink =
            <a id="linkLabel" href={currentItemLink} target="_blank">Open Link</a>;

        if(currentItemLink === 'NONE'){
            wpLink = <div  id="linkLabel" className="greyed-out">Link Not Set</div>
        }

        let linkEditorNotEditing =
            <div>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        {wpLink}
                    </div>
                    <InputGroup.Addon onClick={ () => this.editItemLink()}>
                        <div id="editLink" className="blue"><Glyphicon glyph="edit"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;



        // Return the view wanted
        let titleClass = 'design-item-header';

        switch(userRole){
            case RoleType.GUEST_VIEWER:
            case RoleType.ADMIN:

                return (<div></div>);

            case RoleType.DEVELOPER:
            case RoleType.MANAGER:
            case RoleType.DESIGNER:
                // Developers are aware of new stuff but can't access it yet.  They cannot edit names of things.
                if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW){

                    titleClass = 'design-item-header greyed-out'
                }

                if (this.state.linkEditable) {
                    return (<div className={'design-item-header ' + itemStatusClass}>{linkEditorEditing}</div>);
                } else {
                    return (<div className={'design-item-header ' + itemStatusClass}>{linkEditorNotEditing}</div>);
                }

        }


    }
}


ItemLink.propTypes = {
    currentItemType: PropTypes.string.isRequired,
    currentItemId: PropTypes.string.isRequired,
    currentItemLink: PropTypes.string.isRequired,
    currentItemStatus: PropTypes.string.isRequired,
    itemStatusClass: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ItemLink);



