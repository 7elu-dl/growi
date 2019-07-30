import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import PasswordResetModal from './PasswordResetModal';

import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';

class UserMenu extends React.Component {


  activateUser() {
    const { appContainer } = this.props;

    appContainer.apiPost('/admin/user/{userId}/activate');
  }

  susupendUser() {
    const { appContainer } = this.props;

    appContainer.apiPost('/admin/user/{userId}/suspend');
  }

  removeUser() {
    const { appContainer } = this.props;

    appContainer.apiPost('/admin/user/{user._id}/removeCompletely');
  }

  removeFromAdmin() {
    const { appContainer } = this.props;

    appContainer.apiPost('/admin/user/{user._id}/removeFromAdmin');
  }

  giveAdminAccess() {
    const { appContainer } = this.props;

    appContainer.apiPost('/admin/user/{user._id}/makeAdmin');
  }


  render() {
    const { t, user } = this.props;
    const me = this.props.appContainer.me;

    let contentOfStatus;
    let adminMenu;

    if (user.status === 1) {
      contentOfStatus = (
        <a className="mx-4" onClick={this.activateUser}>
          <i className="icon-fw icon-user-following"></i> { t('user_management.accept') }
        </a>
      );
    }
    if (user.status === 2) {
      contentOfStatus = (
        user.username !== me
          ? (
            <a onClick={this.susupendUser}>
              <i className="icon-fw icon-ban"></i>{ t('user_management.deactivate_account') }
            </a>
          )
          : (
            <div className="mx-4">
              <i className="icon-fw icon-ban mb-2"></i>{ t('user_management.deactivate_account') }
              <p className="alert alert-danger">{ t('user_management.your_own') }</p>
            </div>
          )
      );
    }
    if (user.status === 3) {
      contentOfStatus = (
        <div>
          <a className="mx-4" onClick={this.activateUser}>
            <i className="icon-fw icon-action-redo"></i> { t('Undo') }
          </a>
          {/* label は同じだけど、こっちは論理削除 */}
          <a className="mx-4" onClick={this.removeUser}>
            <i className="icon-fw icon-fire text-danger"></i> { t('Delete') }
          </a>
        </div>
      );
    }
    if (user.status === 1 || user.status === 5) {
      contentOfStatus = (
        <li className="dropdown-button">
          <a className="mx-4" onClick={this.removeUser}>
            <i className="icon-fw icon-fire text-danger"></i> { t('Delete') }
          </a>
        </li>
      );
    }

    if (user.admin === true && user.status === 2) {
      adminMenu = (
        user.username !== me
          ? (
            <a onClick={this.removeFromAdmin}>
              <i className="icon-fw icon-user-unfollow mb-2"></i> { t('user_management.remove_admin_access') }
            </a>
          )
          : (
            <div className="mx-4">
              <i className="icon-fw icon-user-unfollow mb-2"></i>{ t('user_management.remove_admin_access') }
              <p className="alert alert-danger">{ t('user_management.cannot_remove') }</p>
            </div>
          )
      );
    }
    if (user.admin === false && user.status === 2) {
      adminMenu = (
        <a onClick={this.giveAdminAccess}>
          <i className="icon-fw icon-magic-wand"></i>{ t('user_management.give_admin_access') }
        </a>
      );
    }

    return (
      <Fragment>
        <div className="btn-group admin-user-menu">
          <button type="button" className="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
            <i className="icon-settings"></i> <span className="caret"></span>
          </button>
          <ul className="dropdown-menu" role="menu">
            <li className="dropdown-header">{ t('user_management.edit_menu') }</li>
            <li>
              <a>
                <PasswordResetModal user={user} />
              </a>
            </li>
            <li className="divider"></li>
            <li className="dropdown-header">{ t('status') }</li>
            <li>
              {contentOfStatus}
            </li>
            <li className="divider pl-0"></li>
            <li className="dropdown-header">{ t('user_management.administrator_menu') }</li>
            <li>{adminMenu}</li>
          </ul>
        </div>
      </Fragment>
    );
  }

}

const UserMenuWrapper = (props) => {
  return createSubscribedElement(UserMenu, props, [AppContainer]);
};

UserMenu.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,

  user: PropTypes.object.isRequired,
};

export default withTranslation()(UserMenuWrapper);
