import React from 'react';
import PropTypes from 'prop-types';

import dateFnsFormat from 'date-fns/format';

import ReactUtils from '../ReactUtils';
import UserPicture from '../User/UserPicture';
import RevisionBody from '../Page/RevisionBody';

/**
 *
 * @author Yuki Takei <yuki@weseek.co.jp>
 *
 * @export
 * @class Comment
 * @extends {React.Component}
 */
export default class Comment extends React.Component {

  constructor(props) {
    super(props);

    this.isCurrentUserIsAuthor = this.isCurrentUserEqualsToAuthor.bind(this);
    this.isCurrentRevision = this.isCurrentRevision.bind(this);
    this.getRootClassName = this.getRootClassName.bind(this);
    this.getRevisionLabelClassName = this.getRevisionLabelClassName.bind(this);
    this.deleteBtnClickedHandler = this.deleteBtnClickedHandler.bind(this);
    this.renderHtml = this.renderHtml.bind(this);
  }

  isCurrentUserEqualsToAuthor() {
    return this.props.comment.creator.username === this.props.currentUserId;
  }

  isCurrentRevision() {
    return this.props.comment.revision === this.props.currentRevisionId;
  }

  getRootClassName() {
    return "page-comment "
        + (this.isCurrentUserEqualsToAuthor() ? 'page-comment-me ' : '');
  }

  getRevisionLabelClassName() {
    return 'page-comment-revision label '
        + (this.isCurrentRevision() ? 'label-primary' : 'label-default');
  }

  deleteBtnClickedHandler() {
    this.props.deleteBtnClicked(this.props.comment);
  }

  renderHtml(markdown, highlightKeywords) {
    var context = {
      markdown,
      dom: this.revisionBodyElement,
      currentPagePath: this.props.pagePath,
    };

    const crowiRenderer = this.props.crowiRenderer;
    const interceptorManager = this.props.crowi.interceptorManager;
    interceptorManager.process('preCommentRender', context)
      .then(() => interceptorManager.process('preCommentPreProcess', context))
      .then(() => {
        context.markdown = crowiRenderer.preProcess(context.markdown);
      })
      .then(() => interceptorManager.process('postCommentPreProcess', context))
      .then(() => {
        var parsedHTML = crowiRenderer.process(context.markdown);
        context['parsedHTML'] = parsedHTML;
      })
      .then(() => interceptorManager.process('preCommentPostProcess', context))
      .then(() => {
        context.parsedHTML = crowiRenderer.postProcess(context.parsedHTML, context.dom);

        // highlight
        if (highlightKeywords != null) {
          context.parsedHTML = this.getHighlightedBody(context.parsedHTML, highlightKeywords);
        }
      })
      .then(() => interceptorManager.process('postCommentPostProcess', context))
      .then(() => interceptorManager.process('preCommentRenderHtml', context))
      .then(() => {
        this.setState({ html: context.parsedHTML });
      })
      // process interceptors for post rendering
      .then(() => interceptorManager.process('postCommentRenderHtml', context));

  }

  render() {
    const comment = this.props.comment;
    const creator = comment.creator;
    const isMarkdown = comment.isMarkdown;

    // temporary from here
    let markdownText = isMarkdown ? 'markdown' : 'plain';
    // to here

    const rootClassName = this.getRootClassName();
    const commentDate = dateFnsFormat(comment.createdAt, 'YYYY/MM/DD HH:mm');
    const commentBody = isMarkdown ? ReactUtils.nl2br(comment.comment) : ReactUtils.nl2br(comment.comment);
    const creatorsPage = `/user/${creator.username}`;
    const revHref = `?revision=${comment.revision}`;
    const revFirst8Letters = comment.revision.substr(-8);
    const revisionLavelClassName = this.getRevisionLabelClassName();

    return (
      <div className={rootClassName}>
        <a href={creatorsPage}>
          <UserPicture user={creator} />
        </a>
        <div className="page-comment-main">
          <div className="page-comment-creator">
            <a href={creatorsPage}>{creator.username}</a>
            <p>{markdownText}!!!</p>
          </div>
          <div className="page-comment-body">{commentBody}</div>
          <div className="page-comment-meta">
            {commentDate}&nbsp;
            <a className={revisionLavelClassName} href={revHref}>{revFirst8Letters}</a>
          </div>
          <div className="page-comment-control">
            <button className="btn btn-link" onClick={this.deleteBtnClickedHandler}>
              <i className="ti-close"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  currentRevisionId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  deleteBtnClicked: PropTypes.func.isRequired,
  crowi: PropTypes.object.isRequired,
  crowiRenderer: PropTypes.object.isRequired,
  pagePath: PropTypes.string.isRequired,
  highlightKeywords: PropTypes.string,
};
