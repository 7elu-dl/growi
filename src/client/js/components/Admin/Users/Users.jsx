import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import PaginationWrapper from '../../PaginationWrapper';
import InviteUserControl from './InviteUserControl';
import UserTable from './UserTable';

import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';

class UserPage extends React.Component {

  constructor(props) {
    super();

    this.state = {
      users: [],
      activePage: 1,
      pagingLimit: Infinity,
    };

  }

  // TODO unstatedContainerを作ってそこにリファクタすべき
  componentDidMount() {
    const jsonData = document.getElementById('admin-user-page');
    const users = JSON.parse(jsonData.getAttribute('users'));

    this.setState({
      users,
    });
  }


  render() {
    const { t } = this.props;

    return (
      <Fragment>
        <p>
          <InviteUserControl />
          <a className="btn btn-default btn-outline ml-2" href="/admin/users/external-accounts">
            <i className="icon-user-follow" aria-hidden="true"></i>
            { t('user_management.external_account') }
          </a>
        </p>
        <UserTable
          users={this.state.users}
        />
        <PaginationWrapper
          activePage={this.state.activePage}
          changePage={this.handlePage}
          totalItemsCount={this.state.totalUsers}
          pagingLimit={this.state.pagingLimit}
        >
        </PaginationWrapper>
      </Fragment>
    );
  }

}

const UserPageWrapper = (props) => {
  return createSubscribedElement(UserPage, props, [AppContainer]);
};

UserPage.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,

};

export default withTranslation()(UserPageWrapper);
