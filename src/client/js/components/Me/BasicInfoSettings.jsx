
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import loggerFactory from '@alias/logger';

import { toastSuccess, toastError } from '../../util/apiNotification';
import { createSubscribedElement } from '../UnstatedUtils';

import AppContainer from '../../services/AppContainer';
import PersonalContainer from '../../services/PersonalContainer';

const logger = loggerFactory('growi:basicInfoSettings');

class BasicInfoSettings extends React.Component {

  constructor(appContainer) {
    super();

    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  async onClickSubmit() {
    const { t, personalContainer } = this.props;

    try {
      await personalContainer.updateBasicInfo();
      toastSuccess(t('toaster:update_successed', { target: t('Basic Info') }));
    }
    catch (err) {
      toastError(err);
      logger.error(err);
    }
  }

  render() {
    const { t, personalContainer } = this.props;

    return (
      <Fragment>

        <div className="row mb-3">
          <label htmlFor="userForm[name]" className="col-sm-2 text-right">{t('Name')}</label>
          <div className="col-sm-4 text-left">
            <input
              className="form-control"
              type="text"
              name="userForm[name]"
              defaultValue={personalContainer.state.name}
              onChange={(e) => { personalContainer.changeName(e.target.value) }}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="userForm[email]" className="col-sm-2 text-right">{t('Email')}</label>
          <div className="col-sm-4 text-left">
            <input
              className="form-control"
              type="text"
              name="userForm[email]"
              defaultValue={personalContainer.state.email}
              onChange={(e) => { personalContainer.changeEmail(e.target.value) }}
            />
          </div>
          <div className="col-sm-offset-2 col-sm-10">
            <p className="help-block">
              { t('page_register.form_help.email') }
              <ul>
                <li><code></code></li>
              </ul>
            </p>
          </div>
        </div>

        <div className="row mb-3">
          <label className="col-xs-2 text-right">{t('Disclose E-mail')}</label>
          <div className="col-xs-4">
            <div className="radio radio-primary radio-inline">
              <input
                type="radio"
                id="radioEmailShow"
                name="userForm[isEmailPublished]"
                checked={personalContainer.state.isEmailPublished}
                onClick={() => { personalContainer.changeIsEmailPublished(true) }}
              />
              <label htmlFor="radioEmailShow">{t('Show')}</label>
            </div>
            <div className="radio radio-primary radio-inline">
              <input
                type="radio"
                id="radioEmailHide"
                name="userForm[isEmailPublished]"
                checked={!personalContainer.state.isEmailPublished}
                onClick={() => { personalContainer.changeIsEmailPublished(false) }}
              />
              <label htmlFor="radioEmailHide">{t('Hide')}</label>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <label className="col-xs-2 text-right">{t('Language')}</label>
          <div className="col-xs-4">
            <div className="radio radio-primary radio-inline">
              <input
                type="radio"
                id="radioLangEn"
                name="userForm[lang]"
                checked={personalContainer.state.lang === 'English'}
                onClick={() => { personalContainer.changeLang('English') }}
              />
              <label htmlFor="radioLangEn">{t('English')}</label>
            </div>
            <div className="radio radio-primary radio-inline">
              <input
                type="radio"
                id="radioLangJa"
                name="userForm[lang]"
                checked={personalContainer.state.lang === 'Japanese'}
                onClick={() => { personalContainer.changeLang('Japanese') }}
              />
              <label htmlFor="radioLangJa">{t('Japanese')}</label>
            </div>
          </div>
        </div>

        <div className="row my-3">
          <div className="col-xs-offset-4 col-xs-5">
            <button type="button" className="btn btn-primary" onClick={this.onClickSubmit}>{t('Update')}</button>
          </div>
        </div>

      </Fragment>
    );
  }

}

const BasicInfoSettingsWrapper = (props) => {
  return createSubscribedElement(BasicInfoSettings, props, [AppContainer, PersonalContainer]);
};

BasicInfoSettings.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  personalContainer: PropTypes.instanceOf(PersonalContainer).isRequired,
};

export default withTranslation()(BasicInfoSettingsWrapper);
