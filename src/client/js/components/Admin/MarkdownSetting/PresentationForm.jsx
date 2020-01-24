import React from 'react';
import { Button } from 'reactstrap';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import loggerFactory from '@alias/logger';

import { createSubscribedElement } from '../../UnstatedUtils';
import { toastSuccess, toastError } from '../../../util/apiNotification';

import AppContainer from '../../../services/AppContainer';
import AdminMarkDownContainer from '../../../services/AdminMarkDownContainer';

const logger = loggerFactory('growi:markdown:presentation');

class PresentationForm extends React.Component {

  constructor(props) {
    super(props);

    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  async onClickSubmit() {
    const { t } = this.props;

    try {
      await this.props.adminMarkDownContainer.updatePresentationSetting();
      toastSuccess(t('markdown_setting.updated_presentation'));
    }
    catch (err) {
      toastError(err);
      logger.error(err);
    }
  }


  render() {
    const { t, adminMarkDownContainer } = this.props;
    const { pageBreakSeparator, pageBreakCustomSeparator } = adminMarkDownContainer.state;

    return (
      <React.Fragment>
        <fieldset className="form-group col-12 my-2">

          <p className="col-12 col-sm-3 control-label font-weight-bold text-left mt-3">
            { t('markdown_setting.Page break setting') }
          </p>

          <div className="form-group form-check-inline col-12 my-3">
            <div className="col-4 align-self-start">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  className="custom-control-input"
                  id="pageBreakOption1"
                  checked={pageBreakSeparator === 1}
                  onChange={() => adminMarkDownContainer.switchPageBreakSeparator(1)}
                />
                <label className="custom-control-label" htmlFor="pageBreakOption1">
                  <p className="font-weight-bold">{ t('markdown_setting.Preset one separator') }</p>
                  <div className="mt-3">
                    { t('markdown_setting.Preset one separator desc') }
                    <pre><code>{ t('markdown_setting.Preset one separator value') }</code></pre>
                  </div>
                </label>
              </div>
            </div>
            <div className="col-4 align-self-start">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  className="custom-control-input"
                  id="pageBreakOption2"
                  checked={pageBreakSeparator === 2}
                  onChange={() => adminMarkDownContainer.switchPageBreakSeparator(2)}
                />
                <label className="custom-control-label" htmlFor="pageBreakOption2">
                  <p className="font-weight-bold">{ t('markdown_setting.Preset two separator') }</p>
                  <div className="mt-3">
                    { t('markdown_setting.Preset two separator desc') }
                    <pre><code>{ t('markdown_setting.Preset two separator value') }</code></pre>
                  </div>
                </label>
              </div>
            </div>
            <div className="col-4 align-self-start">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="pageBreakOption3"
                  className="custom-control-input"
                  checked={pageBreakSeparator === 3}
                  onChange={() => adminMarkDownContainer.switchPageBreakSeparator(3)}
                />
                <label className="custom-control-label" htmlFor="pageBreakOption3">
                  <p className="font-weight-bold">{ t('markdown_setting.Custom separator') }</p>
                  <div className="mt-3">
                    { t('markdown_setting.Custom separator desc') }
                    <input
                      className="form-control"
                      value={pageBreakCustomSeparator}
                      onChange={(e) => { adminMarkDownContainer.setPageBreakCustomSeparator(e.target.value) }}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </fieldset>
        <div className="form-group col-12 m-3">
          <div className="offset-4 col-8">
            <Button
              type="submit"
              color="primary"
              onClick={this.onClickSubmit}
              disabled={adminMarkDownContainer.state.retrieveError != null}
            >
              { t('Update') }
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }

}

const PresentationFormWrapper = (props) => {
  return createSubscribedElement(PresentationForm, props, [AppContainer, AdminMarkDownContainer]);
};

PresentationForm.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminMarkDownContainer: PropTypes.instanceOf(AdminMarkDownContainer).isRequired,

};

export default withTranslation()(PresentationFormWrapper);
