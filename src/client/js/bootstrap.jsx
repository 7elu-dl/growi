import React from 'react';

import loggerFactory from '@alias/logger';
import Xss from '@commons/service/xss';

import HeaderSearchBox from './components/HeaderSearchBox';
import NavbarToggler from './components/Navbar/NavbarToggler';
import PersonalDropdown from './components/Navbar/PersonalDropdown';
import Sidebar from './components/Sidebar';
import StaffCredit from './components/StaffCredit/StaffCredit';

import AppContainer from './services/AppContainer';
import WebsocketContainer from './services/WebsocketContainer';
import PageCreateButton from './components/Navbar/PageCreateButton';
import PageCreateModal from './components/PageCreateModal';
import PagePutBuckModal from './components/PagePutBuckModal';
import PageDeleteModal from './components/PageDeleteModal';

const logger = loggerFactory('growi:app');

if (!window) {
  window = {};
}

// setup xss library
const xss = new Xss();
window.xss = xss;

// create unstated container instance
const appContainer = new AppContainer();
// eslint-disable-next-line no-unused-vars
const websocketContainer = new WebsocketContainer(appContainer);

logger.info('unstated containers have been initialized');

appContainer.init();
appContainer.injectToWindow();

/**
 * define components
 *  key: id of element
 *  value: React Element
 */
const componentMappings = {
  'grw-navbar-toggler': <NavbarToggler />,

  'search-top': <HeaderSearchBox />,
  'search-sidebar': <HeaderSearchBox crowi={appContainer} />,
  'personal-dropdown': <PersonalDropdown />,

  'create-page-button': <PageCreateButton />,
  'create-page-button-icon': <PageCreateButton isIcon />,
  'page-create-modal': <PageCreateModal />,
  'page-delete-modal': <PageDeleteModal />,
  'page-put-back-modal': <PagePutBuckModal />,

  'grw-sidebar-wrapper': <Sidebar />,

  'staff-credit': <StaffCredit />,
};

export { appContainer, componentMappings };
