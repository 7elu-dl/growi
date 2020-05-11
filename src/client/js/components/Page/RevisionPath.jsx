import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import PagePath from '../../models/PagePath';
import LinkedPagePath from '../../models/LinkedPagePath';
import PagePathHierarchicalLink from '../PageList/PagePathHierarchicalLink';

import CopyDropdown from './CopyDropdown';

const RevisionPath = (props) => {
  // define styles
  const buttonStyle = {
    marginLeft: '0.5em',
    padding: '0 2px',
  };

  const {
    pageId, isPageInTrash, isPageForbidden,
  } = props;

  const pagePathModel = new PagePath(props.pagePath, false, true);
  const linkedPagePathLatter = new LinkedPagePath(pagePathModel.latter);

  return (
    <>
      <span className="d-flex align-items-center flex-wrap">
        <PagePathHierarchicalLink linkedPagePath={linkedPagePathLatter} basePath={pagePathModel.isRoot ? undefined : pagePathModel.former} />
        <CopyDropdown pagePath={props.pagePath} pageId={pageId} buttonStyle={buttonStyle} />
        { !isPageInTrash && !isPageForbidden && (
          <a href="#edit" className="d-block d-edit-none text-muted btn btn-secondary bg-transparent btn-edit border-0" style={buttonStyle}>
            <i className="icon-note" />
          </a>
        ) }
      </span>
    </>
  );
};

RevisionPath.propTypes = {
  t: PropTypes.func.isRequired, // i18next

  pagePath: PropTypes.string.isRequired,
  pageId: PropTypes.string,
  isPageForbidden: PropTypes.bool,
  isPageInTrash: PropTypes.bool,
};

RevisionPath.defaultProps = {
  isPageForbidden: false,
  isPageInTrash: false,
};

export default withTranslation()(RevisionPath);
