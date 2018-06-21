import React from 'react';
import PropTypes from 'prop-types';
import ReactUtils from '../ReactUtils';

import * as toastr from 'toastr';

import Editor from '../PageEditor/Editor';
import CommentPreview from '../PageComment/CommentPreview';

import Button from 'react-bootstrap/es/Button';
import Tab from 'react-bootstrap/es/Tab';
import Tabs from 'react-bootstrap/es/Tabs';
import UserPicture from '../User/UserPicture';

/**
 *
 * @author Yuki Takei <yuki@weseek.co.jp>
 *
 * @export
 * @class Comment
 * @extends {React.Component}
 */

export default class CommentForm extends React.Component {

  constructor(props) {
    super(props);

    const config = this.props.crowi.getConfig();
    const isUploadable = config.upload.image || config.upload.file;
    const isUploadableFile = config.upload.file;

    this.state = {
      comment: '',
      isMarkdown: true,
      html: '',
      key: 1,
      isUploadable,
      isUploadableFile,
      errorMessage: undefined,
    };

    this.updateState = this.updateState.bind(this);
    this.updateStateCheckbox = this.updateStateCheckbox.bind(this);
    this.postComment = this.postComment.bind(this);
    this.renderHtml = this.renderHtml.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.apiErrorHandler = this.apiErrorHandler.bind(this);
    this.onUpload = this.onUpload.bind(this);
  }

  updateState(value) {
    this.setState({comment: value});
  }

  updateStateCheckbox(event) {
    const value = event.target.checked;
    this.setState({isMarkdown: value});
  }

  handleSelect(key) {
    this.setState({ key });
    this.renderHtml(this.state.comment);
  }

  /**
   * Load data of comments and rerender <PageComments />
   */
  postComment(event) {
    event.preventDefault();
    this.props.crowi.apiPost('/comments.add', {
      commentForm: {
        comment: this.state.comment,
        _csrf: this.props.crowi.csrfToken,
        page_id: this.props.pageId,
        revision_id: this.props.revisionId,
        is_markdown: this.state.isMarkdown,
      }
    })
      .then((res) => {
        if (this.props.onPostComplete != null) {
          this.props.onPostComplete(res.comment);
        }
        this.setState({
          comment: '',
          isMarkdown: true,
          html: '',
          key: 1,
          errorMessage: undefined,
        });
        // reset value
        this.refs.editor.setValue('');
      })
      .catch(err => {
        const errorMessage = err.message || 'An unknown error occured when posting comment';
        this.setState({ errorMessage });
      });
  }

  getCommentHtml() {
    return (
      <CommentPreview
        html={this.state.html}
        inputRef={el => this.previewElement = el}/>
    );
  }

  renderHtml(markdown) {
    var context = {
      markdown,
      dom: this.previewElement,
    };

    const crowiRenderer = this.props.crowiRenderer;
    const interceptorManager = this.props.crowi.interceptorManager;
    interceptorManager.process('preRenderCommnetPreview', context)
      .then(() => interceptorManager.process('prePreProcess', context))
      .then(() => {
        context.markdown = crowiRenderer.preProcess(context.markdown);
      })
      .then(() => interceptorManager.process('postPreProcess', context))
      .then(() => {
        var parsedHTML = crowiRenderer.process(context.markdown);
        context['parsedHTML'] = parsedHTML;
      })
      .then(() => interceptorManager.process('prePostProcess', context))
      .then(() => {
        context.parsedHTML = crowiRenderer.postProcess(context.parsedHTML, context.dom);
      })
      .then(() => interceptorManager.process('postPostProcess', context))
      .then(() => interceptorManager.process('preRenderCommentPreviewHtml', context))
      .then(() => {
        this.setState({ html: context.parsedHTML });
      })
      // process interceptors for post rendering
      .then(() => interceptorManager.process('postRenderCommentPreviewHtml', context));
  }

  generateInnerHtml(html) {
    return {__html: html};
  }

  onUpload(file) {
    const endpoint = '/attachments.add';

    // create a FromData instance
    const formData = new FormData();
    formData.append('_csrf', this.props.crowi.csrfToken);
    formData.append('file', file);
    formData.append('path', this.props.pagePath);
    formData.append('page_id', this.props.pageId || 0);

    // post
    this.props.crowi.apiPost(endpoint, formData)
      .then((res) => {
        const url = res.url;
        const attachment = res.attachment;
        const fileName = attachment.originalName;

        let insertText = `[${fileName}](${url})`;
        // when image
        if (attachment.fileFormat.startsWith('image/')) {
          // modify to "![fileName](url)" syntax
          insertText = '!' + insertText;
        }
        this.refs.editor.insertText(insertText);
      })
      .catch(this.apiErrorHandler)
      // finally
      .then(() => {
        this.refs.editor.terminateUploadingState();
      });
  }

  apiErrorHandler(error) {
    console.error(error);
    toastr.error(error.message, 'Error occured', {
      closeButton: true,
      progressBar: true,
      newestOnTop: false,
      showDuration: '100',
      hideDuration: '100',
      timeOut: '3000',
    });
  }

  render() {
    const crowi = this.props.crowi;
    const username = crowi.me;
    const user = crowi.findUser(username);
    const creatorsPage = `/user/${username}`;
    const comment = this.state.comment;
    const commentPreview = this.state.isMarkdown ? this.getCommentHtml(): ReactUtils.nl2br(comment);
    const emojiStrategy = this.props.crowi.getEmojiStrategy();

    const editorOptions = Object.assign(this.props.editorOptions || {}, { lineNumbers: false });
    return (
      <div>
        <form className="form page-comment-form" id="page-comment-form" onSubmit={this.postComment}>
          { username &&
            <div className="comment-form">
              <div className="comment-form-user">
                <a href={creatorsPage}>
                  <UserPicture user={user} />
                </a>
              </div>
              <div className="comment-form-main">
                <div className="comment-write">
                  <Tabs activeKey={this.state.key} id="comment-form-tabs" onSelect={this.handleSelect} animation={false}>
                    <Tab eventKey={1} title="Write">
                      {/* <textarea className="comment-form-comment form-control" id="comment-form-comment" name="comment" required placeholder="Write comments here..." value={this.state.comment} onChange={this.updateState} >
                      </textarea> */}
                       <Editor ref="editor"
                       value={this.state.comment}
                       editorOptions={editorOptions}
                       isMobile={this.props.crowi.isMobile}
                       isUploadable={this.state.isUploadable}
                       isUploadableFile={this.state.isUploadableFile}
                       emojiStrategy={emojiStrategy}
                       // onScroll={this.onEditorScroll}
                       // onScrollCursorIntoView={this.onEditorScrollCursorIntoView}
                       onChange={this.updateState}
                       // onSave={this.onSave}
                       onUpload={this.onUpload}
                      />
                    </Tab>
                    { this.state.isMarkdown == true &&
                    <Tab eventKey={2} title="Preview">
                      <div className="comment-form-preview">
                       {commentPreview}
                      </div>
                    </Tab>
                    }
                  </Tabs>
                </div>
                <div className="comment-submit d-flex">
                  { this.state.key == 1 &&
                    <label>
                      <input type="checkbox" id="comment-form-is-markdown" name="isMarkdown" checked={this.state.isMarkdown} value="1" onChange={this.updateStateCheckbox} /> Markdown
                    </label>
                  }
                  <div style={{flex: 1}}></div>{/* spacer */}
                  { this.state.errorMessage &&
                    <span className="text-danger text-right mr-2">{this.state.errorMessage}</span>
                  }
                  <Button type="submit" value="Submit" bsStyle="primary" className="fcbtn btn btn-sm btn-primary btn-outline btn-rounded btn-1b">
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          }
        </form>
      </div>
    );
  }
}

CommentForm.propTypes = {
  crowi: PropTypes.object.isRequired,
  crowiRenderer:  PropTypes.object.isRequired,
  onPostComplete: PropTypes.func,
  pageId: PropTypes.string,
  revisionId: PropTypes.string,
  pagePath: PropTypes.string,
  editorOptions: PropTypes.object,
};
