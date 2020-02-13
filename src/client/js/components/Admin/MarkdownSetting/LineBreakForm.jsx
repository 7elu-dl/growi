/* eslint-disable react/no-danger */
import React from 'react';
import { Button } from 'reactstrap';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import loggerFactory from '@alias/logger';

import { createSubscribedElement } from '../../UnstatedUtils';
import { toastSuccess, toastError } from '../../../util/apiNotification';


import AppContainer from '../../../services/AppContainer';
import AdminMarkDownContainer from '../../../services/AdminMarkDownContainer';

const logger = loggerFactory('growi:importer');

class LineBreakForm extends React.Component {

  constructor(props) {
    super(props);

    this.onClickSubmit = this.onClickSubmit.bind(this);
  }


  async onClickSubmit() {
    const { t } = this.props;

    try {
      await this.props.adminMarkDownContainer.updateLineBreakSetting();
      toastSuccess(t('toaster.update_successed', { target: t('admin:markdown_setting.lineBreak_header') }));
    }
    catch (err) {
      toastError(err);
      logger.error(err);
    }
  }

  renderLineBreakOption() {
    const { t, adminMarkDownContainer } = this.props;
    const { isEnabledLinebreaks } = adminMarkDownContainer.state;

    const helpLineBreak = { __html: t('admin:markdown_setting.lineBreak_options.enable_lineBreak_desc') };

    return (
      <div className="form-group text-left my-3">
        <div className="col-8 offset-4">
          <div className="custom-control custom-switch checkbox-success">
            <input
              type="checkbox"
              className="custom-control-input"
              id="isEnabledLinebreaks"
              checked={isEnabledLinebreaks}
              onChange={() => { adminMarkDownContainer.setState({ isEnabledLinebreaks: !isEnabledLinebreaks }) }}
            />
            <label className="custom-control-label" htmlFor="isEnabledLinebreaks">
              {t('admin:markdown_setting.lineBreak_options.enable_lineBreak') }
            </label>
          </div>
          <p className="help-block" dangerouslySetInnerHTML={helpLineBreak} />
        </div>
      </div>
    );
  }

  renderLineBreakInCommentOption() {
    const { t, adminMarkDownContainer } = this.props;
    const { isEnabledLinebreaksInComments } = adminMarkDownContainer.state;

    const helpLineBreakInComment = { __html: t('admin:markdown_setting.lineBreak_options.enable_lineBreak_for_comment_desc') };

    return (
      <div className="form-group text-left my-3">
        <div className="col-8 offset-4">
          <div className="custom-control custom-switch checkbox-success">
            <input
              type="checkbox"
              className="custom-control-input"
              id="isEnabledLinebreaksInComments"
              checked={isEnabledLinebreaksInComments}
              onChange={() => { adminMarkDownContainer.setState({ isEnabledLinebreaksInComments: !isEnabledLinebreaksInComments }) }}
            />
            <label className="custom-control-label" htmlFor="isEnabledLinebreaksInComments">
              {t('admin:markdown_setting.lineBreak_options.enable_lineBreak') }
            </label>
          </div>
          <p className="help-block" dangerouslySetInnerHTML={helpLineBreakInComment} />
        </div>
      </div>
    );
  }

  render() {
    const { t, adminMarkDownContainer } = this.props;

    return (
      <React.Fragment>
        <fieldset className="col-12">
          {this.renderLineBreakOption()}
          {this.renderLineBreakInCommentOption()}
        </fieldset>
        <div className="form-group col-12 m-3">
          <div className="offset-4 col-8">
            <Button
              type="submit"
              color="primary"
              onClick={this.onClickSubmit}
              disabled={adminMarkDownContainer.state.retrieveError != null}
            >
              {t('Update')}
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }

}

/**
 * Wrapper component for using unstated
 */
const LineBreakFormWrapper = (props) => {
  return createSubscribedElement(LineBreakForm, props, [AppContainer, AdminMarkDownContainer]);
};

LineBreakForm.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminMarkDownContainer: PropTypes.instanceOf(AdminMarkDownContainer).isRequired,
};

export default withTranslation()(LineBreakFormWrapper);
