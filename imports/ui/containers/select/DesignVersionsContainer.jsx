// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignVersion                from '../../components/select/DesignVersion.jsx';
import DesignUpdatesContainer       from './DesignUpdatesContainer.jsx';
import ItemContainer                from '../../components/common/ItemContainer.jsx';

// Ultrawide Services
import {DesignVersionStatus}        from '../../../constants/constants.js';
import ClientContainerServices      from '../../../apiClient/apiClientDataServices.js';
import ClientDesignVersionServices  from '../../../apiClient/apiClientDesignVersion.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Data Container - selects the Design Versions in the current Design
//
// ---------------------------------------------------------------------------------------------------------------------


export class DesignVersionsList extends Component {
    constructor(props) {
        super(props);

    }

    renderDesignVersionsList(designVersions){
        if (designVersions) {
            return designVersions.map((designVersion) => {
                return (
                    <DesignVersion
                        key={designVersion._id}
                        designVersion={designVersion}
                    />
                );
            });
        }
    }

    getCurrentVersionStatus(designVersionId){
        return ClientDesignVersionServices.getDesignVersionStatus(designVersionId);
    }

    render() {

        // There is no Add Design Version.  One is created by default for a new Design and when Updates are merged into a new Design Version.

        const {designVersions, userRole, userContext} = this.props;

        // Column layout -----------------------------------------------------------------------------------------------
        let col1Size = 3;
        let col2Size = 9;

        if(userContext.designVersionId !== 'NONE'){
            const dvStatus = this.getCurrentVersionStatus(userContext.designVersionId);
            if( dvStatus === DesignVersionStatus.VERSION_UPDATABLE || dvStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE){
                col1Size = 2;
                col2Size = 10;
            }
        }

        // Design Versions Container -----------------------------------------------------------------------------------
        const headerText = 'Design Versions';
        const bodyDataFunction = () => this.renderDesignVersionsList(designVersions);
        const hasFooterAction = false;
        const footerAction = '';
        const footerActionFunction = null;

        // The Updates container contains either the Updates for an Updatable Design Version or just the WPs for an initial version

        return (
            <Grid>
                <Row>
                    <Col md={col1Size} className="item-col">
                        <ItemContainer
                            headerText={headerText}
                            bodyDataFunction={bodyDataFunction}
                            hasFooterAction={hasFooterAction}
                            footerAction={footerAction}
                            footerActionFunction={footerActionFunction}
                        />
                    </Col>
                    <Col md={col2Size} className="item-col">
                        <DesignUpdatesContainer params={{
                            currentDesignVersionId: userContext.designVersionId
                        }}/>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

DesignVersionsList.propTypes = {
    designVersions: PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
let DesignVersionsListRedux = connect(mapStateToProps)(DesignVersionsList);


export default DesignVersionsContainer = createContainer(({params}) => {

    return ClientContainerServices.getDesignVersionsForCurrentDesign(params.currentDesignId);

}, DesignVersionsListRedux);