import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import loggerFactory from '@alias/logger';

import { createSubscribedElement } from '../../UnstatedUtils';
import { toastSuccess, toastError } from '../../../util/apiNotification';

import AppContainer from '../../../services/AppContainer';
import AdminNotificationContainer from '../../../services/AdminNotificationContainer';
import GlobalNotificationList from './GlobalNotificationList';

const logger = loggerFactory('growi:GlobalNotification');

class GlobalNotification extends React.Component {

  constructor() {
    super();

    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  async onClickSubmit() {
    const { t, adminNotificationContainer } = this.props;

    try {
      await adminNotificationContainer.updateGlobalNotificationForPages();
      toastSuccess(t('toaster.update_successed', { target: t('Notification Settings') }));
    }
    catch (err) {
      toastError(err);
      logger.error(err);
    }
  }

  render() {
    const { t, adminNotificationContainer } = this.props;
    const { globalNotifications } = adminNotificationContainer.state;
    return (
      <React.Fragment>

        <h2 className="border-bottom mb-5">通知が有効になるページ</h2>

        <div className="row my-3">
          <div className="col-xs-offset-4 col-xs-5">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onClickSubmit}
              disabled={adminNotificationContainer.state.retrieveError}
            >{t('Update')}
            </button>
          </div>
        </div>

        <a href="/admin/global-notification/new">
          <p className="btn btn-default">{t('notification_setting.add_notification')}</p>
        </a>

        <h2 className="border-bottom mb-5">{t('notification_setting.notification_list')}</h2>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ON/OFF</th>
              {/* eslint-disable-next-line react/no-danger */}
              <th>{t('notification_setting.trigger_path')} <span dangerouslySetInnerHTML={{ __html: t('notification_setting.trigger_path_help') }} /></th>
              <th>{t('notification_setting.trigger_events')}</th>
              <th>{t('notification_setting.notify_to')}</th>
              <th></th>
            </tr>
          </thead>
          {globalNotifications.length !== 0 && (
            <tbody className="admin-notif-list">
              <GlobalNotificationList />
            </tbody>
          )}
        </table>

      </React.Fragment>
    );
  }

}

const GlobalNotificationWrapper = (props) => {
  return createSubscribedElement(GlobalNotification, props, [AppContainer, AdminNotificationContainer]);
};

GlobalNotification.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminNotificationContainer: PropTypes.instanceOf(AdminNotificationContainer).isRequired,

};

export default withTranslation()(GlobalNotificationWrapper);
