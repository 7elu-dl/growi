import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';

class UserTable extends React.Component {


  render() {
    const { t } = this.props;

    return (
      <Fragment>
        <h2>{ t('User_Management') }</h2>

        <table className="table table-default table-bordered table-user-list">
          <thead>
            <tr>
              <th width="100px">#</th>
              <th>{ t('status') }</th>
              <th><code>{ t('User') }</code></th>
              <th>{ t('Name') }</th>
              <th>{ t('Email') }</th>
              <th width="100px">{ t('Created') }</th>
              <th width="150px">{ t('Last_Login') }</th>
              <th width="70px"></th>
            </tr>
          </thead>
        </table>
      </Fragment>
    );
  }

}

const UserTableWrapper = (props) => {
  return createSubscribedElement(UserTable, props, [AppContainer]);
};

UserTable.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
};

export default withTranslation()(UserTableWrapper);
