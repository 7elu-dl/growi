import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import urljoin from 'url-join';

import { createSubscribedElement } from '../../UnstatedUtils';

import AppContainer from '../../../services/AppContainer';
import AdminNotificationContainer from '../../../services/AdminNotificationContainer';


class GlobalNotification extends React.Component {

  renderNotification() {
    const { t, adminNotificationContainer } = this.props;
    const { globalNotifications } = adminNotificationContainer.state;

    globalNotifications.map((notification) => {
      return (
        <tr>
          <td className="align-middle td-abs-center">
            {/* GW-807 switch enable notification */}
            <input type="checkbox" className="js-switch" data-size="small" data-id="{{ notification._id.toString() }}" />
          </td>
          <td>
            {notification.triggerPath}
          </td>
          <td>
            {notification.triggerEvents.includes('pageCreate') && (
              <span className="label label-success" data-toggle="tooltip" data-placement="top" title="Page Create">
                <i className="icon-doc"></i> CREATE
              </span>
            )}
            {notification.triggerEvents.includes('pageEdit') && (
              <span className="label label-warning" data-toggle="tooltip" data-placement="top" title="Page Edit">
                <i className="icon-pencil"></i> EDIT
              </span>
            )}
            {notification.triggerEvents.includes('pageMove') && (
              <span className="label label-warning" data-toggle="tooltip" data-placement="top" title="Page Move">
                <i className="icon-action-redo"></i> MOVE
              </span>
            )}
            {notification.triggerEvents.includes('pageDelete') && (
              <span className="label label-danger" data-toggle="tooltip" data-placement="top" title="Page Delte">
                <i className="icon-fire"></i> DELETE
              </span>
            )}
            {notification.triggerEvents.includes('pageLike') && (
              <span className="label label-info" data-toggle="tooltip" data-placement="top" title="Page Like">
                <i className="icon-like"></i> LIKE
              </span>
            )}
            {notification.triggerEvents.includes('comment') && (
              <span className="label label-default" data-toggle="tooltip" data-placement="top" title="New Comment">
                <i className="icon-fw icon-bubble"></i> POST
              </span>
            )}
          </td>
          <td>
            {notification.__t === 'mail'
              && <span data-toggle="tooltip" data-placement="top" title="Email"><i className="ti-email"></i> {notification.toEmail}</span>}
            {notification.__t === 'slack'
              && <span data-toggle="tooltip" data-placement="top" title="Slack"><i className="fa fa-slack"></i> {notification.slackChannels}</span>}
          </td>
          <td className="td-abs-center">
            <div className="btn-group admin-group-menu">
              <button type="button" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                <i className="icon-settings"></i> <span className="caret"></span>
              </button>
              <ul className="dropdown-menu" role="menu">
                <li>
                  <a href={urljoin('/admin/global-notification/', notification.id)}>
                    <i className="icon-fw icon-note"></i> {t('Edit')}
                  </a>
                </li>
                {/*  TODO GW-780 create delete modal  */}
                <li className="btn-delete">
                  <a
                    href="#"
                    data-setting-id="{{ notification.id }}"
                    data-target="#admin-delete-global-notification"
                    data-toggle="modal"
                  >
                    <i className="icon-fw icon-fire text-danger"></i> {t('Delete')}
                  </a>
                </li>

              </ul>
            </div>
          </td>
        </tr>
      );
    });

  }

  render() {
    const { t, adminNotificationContainer } = this.props;
    const { globalNotifications } = adminNotificationContainer.state;
    return (
      <React.Fragment>

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
              {this.renderNotification()}
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
