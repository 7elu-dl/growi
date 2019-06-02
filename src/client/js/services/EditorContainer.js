import { Container } from 'unstated';

/**
 * Service container related to options for Editor/Preview
 * @extends {Container} unstated Container
 */
export default class EditorContainer extends Container {

  constructor(appContainer, defaultEditorOptions, defaultPreviewOptions) {
    super();

    this.appContainer = appContainer;
    this.appContainer.registerContainer(this);

    this.state = {
      tags: [],
      editorOptions: {},
      previewOptions: {},
    };

    this.initOptions('editorOptions', 'editorOptions', defaultEditorOptions);
    this.initOptions('previewOptions', 'previewOptions', defaultPreviewOptions);
  }

  initOptions(stateKey, localStorageKey, defaultOptions) {
    // load from localStorage
    const optsStr = window.localStorage[localStorageKey];

    let loadedOpts = {};
    // JSON.parseparse
    if (optsStr != null) {
      try {
        loadedOpts = JSON.parse(optsStr);
      }
      catch (e) {
        this.localStorage.removeItem(localStorageKey);
      }
    }

    // set to state obj
    this.state[stateKey] = Object.assign(defaultOptions, loadedOpts);
  }

  saveOptsToLocalStorage() {
    window.localStorage.setItem('editorOptions', JSON.stringify(this.state.editorOptions));
    window.localStorage.setItem('previewOptions', JSON.stringify(this.state.previewOptions));
  }

  setCaretLine(line) {
    const pageEditor = this.appContainer.getComponentInstance('PageEditor');
    if (pageEditor != null) {
      pageEditor.setCaretLine(line);
    }
  }

  focusToEditor() {
    const pageEditor = this.appContainer.getComponentInstance('PageEditor');
    if (pageEditor != null) {
      pageEditor.focusToEditor();
    }
  }

}
