import GrowiRenderer from '../../GrowiRenderer';

/**
 * reveal.js growi-renderer plugin.
 */
(function(root, factory) {
  // parent window DOM (crowi.js) of presentation window.
  let parentWindow = window.parent;

  // create GrowiRenderer instance and setup.
  let growiRenderer = new GrowiRenderer(parentWindow.crowi, parentWindow.crowiRenderer, {mode: 'editor'});

  let growiRendererPlugin = factory(growiRenderer);
  growiRendererPlugin.initialize();
}(this, function(growiRenderer) {
  const DEFAULT_SLIDE_SEPARATOR = '^\r?\n---\r?\n$';
  const DEFAULT_NOTES_SEPARATOR = 'notes?:';
  const SCRIPT_END_PLACEHOLDER = '__SCRIPT_END__';

  /**
   * Retrieves the markdown contents of a slide section
   * element. Normalizes leading tabs/whitespace.
   * Referred from The reveal.js markdown plugin.
   * https://github.com/hakimel/reveal.js/blob/master/plugin/markdown/markdown.js
   */
  function getMarkdownFromSlide(section) {
    // look for a <script> or <textarea data-template> wrapper
    let template = section.querySelector('[data-template]') || section.querySelector('script');

    // strip leading whitespace so it isn't evaluated as code
    let text = (template || section).textContent;

    // restore script end tags
    text = text.replace(new RegExp(SCRIPT_END_PLACEHOLDER, 'g'), '</script>');

    let leadingWs = text.match(/^\n?(\s*)/)[1].length;
    let leadingTabs = text.match(/^\n?(\t*)/)[1].length;

    if (leadingTabs > 0) {
      text = text.replace(new RegExp('\\n?\\t{' + leadingTabs + '}', 'g'), '\n');
    }
    else if (leadingWs > 1) {
      text = text.replace(new RegExp('\\n? {' + leadingWs + '}', 'g'), '\n');
    }

    return text;
  }

  /**
   * Inspects the given options and fills out default
   * values for what's not defined.
   * Referred from The reveal.js markdown plugin.
   * https://github.com/hakimel/reveal.js/blob/master/plugin/markdown/markdown.js
   */
  function getSlidifyOptions(options) {
    options = options || {};
    options.separator = options.separator || DEFAULT_SLIDE_SEPARATOR;
    options.notesSeparator = options.notesSeparator || DEFAULT_NOTES_SEPARATOR;
    options.attributes = options.attributes || '';

    return options;
  }

  /**
   * Helper function for constructing a markdown slide.
   * Referred from The reveal.js markdown plugin.
   * https://github.com/hakimel/reveal.js/blob/master/plugin/markdown/markdown.js
   */
  function createMarkdownSlide(content, options) {
    options = getSlidifyOptions(options);

    // let notesMatch = content.split(new RegExp(options.notesSeparator, 'mgi'));

    // if (notesMatch.length === 2) {
    //   content = notesMatch[0] + '<aside class="notes">' + growiRenderer.process(notesMatch[1].trim()) + '</aside>';
    // }

    // prevent script end tags in the content from interfering
    // with parsing
    content = content.replace(/<\/script>/g, SCRIPT_END_PLACEHOLDER);

    return '<script type="text/template">' + content + '</script>';
  }

  /**
   * Parses a data string into multiple slides based
   * on the passed in separator arguments.
   * Referred from The reveal.js markdown plugin.
   * https://github.com/hakimel/reveal.js/blob/master/plugin/markdown/markdown.js
   */
  function slidify(markdown, options) {
    options = getSlidifyOptions(options);

    let separatorRegex = new RegExp( options.separator + ( options.verticalSeparator ? '|' + options.verticalSeparator : '' ), 'mg' ),
      horizontalSeparatorRegex = new RegExp( options.separator );

    let matches,
      lastIndex = 0,
      isHorizontal,
      wasHorizontal = true,
      content,
      sectionStack = [];

    // iterate until all blocks between separators are stacked up
    while ((matches = separatorRegex.exec(markdown)) != null) {
      // notes = null;

      // determine direction (horizontal by default)
      isHorizontal = horizontalSeparatorRegex.test( matches[0] );

      if (!isHorizontal && wasHorizontal) {
        // create vertical stack
        sectionStack.push([]);
      }

      // pluck slide content from markdown input
      content = markdown.substring(lastIndex, matches.index);

      if (isHorizontal && wasHorizontal) {
        // add to horizontal stack
        sectionStack.push(content);
      }
      else {
        // add to vertical stack
        sectionStack[sectionStack.length-1].push( content );
      }

      lastIndex = separatorRegex.lastIndex;
      wasHorizontal = isHorizontal;
    }

    // add the remaining slide
    (wasHorizontal ? sectionStack : sectionStack[sectionStack.length-1]).push(markdown.substring(lastIndex));

    let markdownSections = '';

    // flatten the hierarchical stack, and insert <section data-markdown> tags
    for (let i = 0, len = sectionStack.length; i < len; i++ ) {
      // vertical
      if (sectionStack[i] instanceof Array) {
        markdownSections += '<section '+ options.attributes +'>';

        sectionStack[i].forEach(function(child) {
          markdownSections += '<section data-markdown>' + createMarkdownSlide(child, options) + '</section>';
        } );

        markdownSections += '</section>';
      }
      else {
        markdownSections += '<section '+ options.attributes +' data-markdown>' + createMarkdownSlide(sectionStack[i], options) + '</section>';
      }
    }
    return markdownSections;
  }

  /**
   * Add data separator before lines
   * starting with '#' to markdown.
   */
  function divideSlides(markdown) {
    const interceptorManager = growiRenderer.crowi.interceptorManager;
    let context = { markdown };
    // detach code block.
    interceptorManager.process('prePreProcess', context);
    // if there is only '\n' in the first line, replace it.
    context.markdown = context.markdown.replace(/^\n/, '');
    context.markdown = context.markdown.replace(/[\n]+#/g, '\n\n\n#');
    // restore code block.
    interceptorManager.process('postPreProcess', context);
    return context.markdown;
  }

  function processSlides() {
    let sections = document.querySelectorAll('[data-markdown]');
    let section, markdown;
    for (let i = 0, len = sections.length; i < len; i++) {
      section = sections[i];
      // add data separator '\n\n\n' to markdown.
      markdown = divideSlides(getMarkdownFromSlide(section));

      if (section.getAttribute('data-separator')
        || section.getAttribute('data-separator-vertical')
        || section.getAttribute('data-separator-notes')) {
        section.outerHTML = slidify(markdown, {
          separator: section.getAttribute('data-separator'),
          verticalSeparator: section.getAttribute('data-separator-vertical'),
          notesSeparator: section.getAttribute('data-separator-notes')
          // attributes: getForwardedAttributes(section)
        });
      }
      else {
        section.innerHTML = createMarkdownSlide(markdown);
      }
    }
  }

  /**
   * Converts data-markdown slides to HTML slides by GrowiRenderer.
   */
  function convertSlides() {
    let sections = document.querySelectorAll('[data-markdown]');
    let section;
    let markdown;
    const interceptorManager = growiRenderer.crowi.interceptorManager;

    for (let i = 0, len = sections.length; i < len; i++) {
      section = sections[i];

      // Only parse the same slide once
      if (!section.getAttribute('data-markdown-parsed')) {
        section.setAttribute('data-markdown-parsed', 'true');
        markdown = getMarkdownFromSlide(section);
        let context = { markdown };

        interceptorManager.process('preRender', context);
        interceptorManager.process('prePreProcess', context);
        context.markdown = growiRenderer.preProcess(context.markdown);
        interceptorManager.process('postPreProcess', context);
        context['parsedHTML'] = growiRenderer.process(context.markdown);
        interceptorManager.process('prePostProcess', context);
        context.parsedHTML = growiRenderer.postProcess(context.parsedHTML);
        interceptorManager.process('postPostProcess', context);
        interceptorManager.process('preRenderHtml', context);
        interceptorManager.process('postRenderHtml', context);
        section.innerHTML = context.parsedHTML;
      }
    }
  }

  // API
  return {
    initialize: function() {
      growiRenderer.setup();
      processSlides();
      convertSlides();
    }
  };
}));
