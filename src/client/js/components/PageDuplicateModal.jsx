
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { withTranslation } from 'react-i18next';
import { format } from 'date-fns';
import urljoin from 'url-join';

import { userPageRoot } from '@commons/util/path-utils';
import { pathUtils } from 'growi-commons';
import { createSubscribedElement } from './UnstatedUtils';

import AppContainer from '../services/AppContainer';
import PageContainer from '../services/PageContainer';
import PagePathAutoComplete from './PagePathAutoComplete';

const PageDuplicateModal = (props) => {
  const { t, appContainer, pageContainer } = props;

  const config = appContainer.getConfig();
  const isReachable = config.isSearchServiceReachable;
  const { path } = pageContainer.state;
  const { crowi } = appContainer.config;

  const [pageNameInput, setPageNameInput] = useState(path);

  /**
   * change pageNameInput
   * @param {string} value
   */
  function onChangePageNameInputHandler(value) {
    setPageNameInput(value);
  }

  return (
    <Modal size="lg" isOpen={pageContainer.state.isPageDuplicateModalShown} toggle={pageContainer.closePageDuplicateModal} className="grw-duplicate-page">
      <ModalHeader tag="h4" toggle={pageContainer.closePageDuplicateModal} className="bg-primary text-light">
        { t('modal_duplicate.label.Duplicate page') }
      </ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label htmlFor="">{ t('modal_duplicate.label.Current page name') }</label><br />
          <code>{ path }</code>
        </div>
        <div className="form-group">
          <label htmlFor="duplicatePageName">{ t('modal_duplicate.label.New page name') }</label><br />
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">{crowi.url}</span>
            </div>
            {isReachable
              // GW-2355 refactor typeahead
              ? <PagePathAutoComplete crowi={appContainer} initializedPath={path} addTrailingSlash />
              : (
                <input
                  type="text"
                  value={pageNameInput}
                  className="form-control flex-fill"
                  onChange={e => onChangePageNameInputHandler(e.target.value)}
                  required
                />
              )}
          </div>
        </div>
      </ModalBody>
    </Modal>

  );
};


/**
 * Wrapper component for using unstated
 */
const PageDuplicateModallWrapper = (props) => {
  return createSubscribedElement(PageDuplicateModal, props, [AppContainer, PageContainer]);
};


PageDuplicateModal.propTypes = {
  t: PropTypes.func.isRequired, //  i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  pageContainer: PropTypes.instanceOf(PageContainer).isRequired,
};

export default withTranslation()(PageDuplicateModallWrapper);
