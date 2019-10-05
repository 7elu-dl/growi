import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import PasswordResetModal from './PasswordResetModal';
import PaginationWrapper from '../../PaginationWrapper';
import InviteUserControl from './InviteUserControl';
import UserTable from './UserTable';

import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';
import UsersContainer from '../../../services/UsersContainer';

class UserPage extends React.Component {

  constructor(props) {
    super();

    this.state = {
      activePage: 1,
      pagingLimit: Infinity,
    };

  }

  render() {
    const { t, usersContainer } = this.props;

    return (
      <Fragment>
        {usersContainer.state.userForPasswordResetModal && <PasswordResetModal />}
        <p>
          <InviteUserControl />
          <a className="btn btn-default btn-outline ml-2" href="/admin/users/external-accounts">
            <i className="icon-user-follow" aria-hidden="true"></i>
            { t('user_management.external_account') }
          </a>
        </p>
        <UserTable />
        <PaginationWrapper
          activePage={this.state.activePage}
          changePage={this.handlePage} // / TODO GW-314 create function
          totalItemsCount={usersContainer.state.users.length}
          pagingLimit={this.state.pagingLimit}
        />
      </Fragment>
    );
  }

}

const UserPageWrapper = (props) => {
  return createSubscribedElement(UserPage, props, [AppContainer, UsersContainer]);
};

UserPage.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  usersContainer: PropTypes.instanceOf(UsersContainer).isRequired,

};

export default withTranslation()(UserPageWrapper);
