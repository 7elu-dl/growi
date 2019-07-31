import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';
import { toastSuccess, toastError } from '../../../util/apiNotification';

class StatusSuspendedForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };

  }

  render() {
    const { t, user }= this.props;
    const me = this.props.appContainer.me;

    return ();
  }

}

/**
 * Wrapper component for using unstated
 */
const StatusSuspendedFormWrapper = (props) => {
  return createSubscribedElement(StatusSuspendedForm, props, [AppContainer]);
};

StatusSuspendedForm.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,

  user: PropTypes.object.isRequired,
};

export default withTranslation()(StatusSuspendedFormWrapper);
