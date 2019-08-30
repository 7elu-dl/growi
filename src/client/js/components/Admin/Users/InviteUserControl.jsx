import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';

class InviteUserControl extends React.Component {

  onUserInviteClicked() {
    console.log('hello');
  }

  render() {
    const { t } = this.props;

    return (
      <Fragment>
        <button type="button" className="btn btn-default" onClick={this.onUserInviteClicked}>
          { t('user_management.invite_users') }
        </button>
      </Fragment>
    );
  }

}

const InviteUserControlWrapper = (props) => {
  return createSubscribedElement(InviteUserControl, props, [AppContainer]);
};

InviteUserControl.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
};

export default withTranslation()(InviteUserControlWrapper);
