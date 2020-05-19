
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

const PagePutBackModal = (props) => {
  const { t, appContainer, pageContainer } = props;

  const config = appContainer.getConfig();
  const isReachable = config.isSearchServiceReachable;
  const { path } = pageContainer.state;
  const userPageRootPath = userPageRoot(appContainer.currentUser);
  const parentPath = pathUtils.addTrailingSlash(path);
  const now = format(new Date(), 'yyyy/MM/dd');

  const [todayInput1, setTodayInput1] = useState(t('Memo'));
  const [todayInput2, setTodayInput2] = useState('');
  const [pageNameInput, setPageNameInput] = useState(parentPath);
  const [template, setTemplate] = useState(null);


  return (
    <Modal isOpen={appContainer.state.isPutBackModalShown} toggle={appContainer.closePageCreateModal}>
      <ModalHeader tag="h4" toggle={appContainer.closePageCreateModal} className="bg-primary text-light">
        { t('New Page') }
      </ModalHeader>
      <ModalBody>
        put back modal
      </ModalBody>
    </Modal>

  );
};


/**
 * Wrapper component for using unstated
 */
const ModalControlWrapper = (props) => {
  return createSubscribedElement(PagePutBackModal, props, [AppContainer, PageContainer]);
};


PagePutBackModal.propTypes = {
  t: PropTypes.func.isRequired, //  i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  pageContainer: PropTypes.instanceOf(PageContainer).isRequired,
};

export default withTranslation()(ModalControlWrapper);
