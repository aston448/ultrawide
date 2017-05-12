// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import TextEditor           from '../../components/edit/TextEditor.jsx';
import Narrative            from '../../components/edit/Narrative.jsx';

// Ultrawide Services
import { DetailsType, ViewMode, DisplayContext, ComponentType }      from  '../../../constants/constants.js';

// Bootstrap
import {InputGroup} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Details Item - New / Old Names and Text Details for a Design Item
//
// ---------------------------------------------------------------------------------------------------------------------

export class DetailsItem extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        const {itemType, item, displayContext, view} = this.props;

        // Items -------------------------------------------------------------------------------------------------------
        const nameItem =
            <InputGroup>
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
                <TextEditor
                    designComponent={item}
                    detailsType={itemType}
                />
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
            </InputGroup>;

        const nameFeature =
            <InputGroup>
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
                <TextEditor
                    designComponent={item}
                    detailsType={itemType}
                />
                <Narrative
                    designComponent={item}
                    mode={ViewMode.MODE_VIEW}
                    displayContext={DisplayContext.BASE_VIEW}
                    view={view}
                    testSummary={false}
                    displayOldValue={false}
                />
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
            </InputGroup>;

        const newNameItem =
            <InputGroup>
                <InputGroup.Addon className="details-item-new">
                    <div>NEW:</div>
                </InputGroup.Addon>
                <TextEditor
                    designComponent={item}
                    detailsType={itemType}
                />
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
            </InputGroup>;


        const newNameFeature =
            <InputGroup>
                <InputGroup.Addon className="details-item-new">
                    <div>NEW:</div>
                </InputGroup.Addon>
                <TextEditor
                    designComponent={item}
                    detailsType={itemType}
                />
                <Narrative
                    designComponent={item}
                    mode={ViewMode.MODE_VIEW}
                    displayContext={DisplayContext.BASE_VIEW}
                    view={view}
                    testSummary={false}
                    displayOldValue={false}
                />
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
            </InputGroup>;

        const oldNameItem =
            <InputGroup>
                <InputGroup.Addon className="details-item-old">
                    <div>OLD:</div>
                </InputGroup.Addon>
                <TextEditor
                    designComponent={item}
                    detailsType={itemType}
                />
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
            </InputGroup>;

        const oldNameFeature =
            <InputGroup>
                <InputGroup.Addon className="details-item-old">
                    <div>OLD:</div>
                </InputGroup.Addon>
                <TextEditor
                    designComponent={item}
                    detailsType={itemType}
                />
                <Narrative
                    designComponent={item}
                    mode={ViewMode.MODE_VIEW}
                    displayContext={DisplayContext.BASE_VIEW}
                    view={view}
                    testSummary={false}
                    displayOldValue={true}
                />
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
            </InputGroup>;

        const textItem =
            <InputGroup>
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
                <TextEditor
                    designComponent={item}
                    detailsType={itemType}
                />
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
            </InputGroup>;

        const newTextItem =
            <InputGroup>
                <InputGroup.Addon className="details-item-new">
                    <div>NEW:</div>
                </InputGroup.Addon>
                <TextEditor
                    designComponent={item}
                    detailsType={itemType}
                />
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
            </InputGroup>;

        const oldTextItem =
            <InputGroup>
                <InputGroup.Addon className="details-item-old">
                    <div>OLD:</div>
                </InputGroup.Addon>
                <TextEditor
                    designComponent={item}
                    detailsType={itemType}
                />
                <InputGroup.Addon>
                    <div></div>
                </InputGroup.Addon>
            </InputGroup>;

        // Layout ------------------------------------------------------------------------------------------------------

        switch(itemType){
            case DetailsType.DETAILS_NAME:
                if(item.componentType === ComponentType.FEATURE){
                    return (
                        <div className="details-item">
                            {nameFeature}
                        </div>
                    );
                } else {
                    return (
                        <div className="details-item">
                            {nameItem}
                        </div>
                    );
                }
            case DetailsType.DETAILS_NAME_NEW:
                if(item.componentType === ComponentType.FEATURE){
                    return (
                        <div className="details-item">
                            {newNameFeature}
                        </div>
                    );
                } else {
                    return (
                        <div className="details-item">
                            {newNameItem}
                        </div>
                    );
                }
            case DetailsType.DETAILS_NAME_OLD:
                if(item.componentType === ComponentType.FEATURE){
                    return (
                        <div className="details-item">
                            {oldNameFeature}
                        </div>
                    );
                } else {
                    return (
                        <div className="details-item">
                            {oldNameItem}
                        </div>
                    );
                }
            case DetailsType.DETAILS_TEXT:
                return(
                    <div className="details-item">
                        {textItem}
                    </div>
                );
            case DetailsType.DETAILS_TEXT_NEW:
                return(
                    <div className="details-item">
                        {newTextItem}
                    </div>
                );
            case DetailsType.DETAILS_TEXT_OLD:
                return(
                    <div className="details-item">
                        {oldTextItem}
                    </div>
                );
        }

    }
}

DetailsItem.propTypes = {
    itemType:       PropTypes.string.isRequired,
    item:           PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:    state.currentUserItemContext,
        userRole:       state.currentUserRole,
        view:           state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DetailsItem);