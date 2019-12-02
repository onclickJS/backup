var scripts = [
  'web/vendor/jquery/jquery.min.js',
  'web/vendor/jquery/jquery.tmpl.min.js',
  'web/vendor/lodash/lodash.min.js',
  'web/vendor/backbone/backbone-min.js',
  'web/vendor/graphlib/graphlib.core.min.js',
  'web/vendor/dagre/dagre.core.min.js',
  'web/vendor/rappid/rappid.1.js',
  'web/vendor/rappid/rappid.2.element.js',
  'web/vendor/rappid/rappid.3.pool.js',
  'web/vendor/rappid/rappid.4.etc.js',
  'web/vendor/rappid/rappid.5.paper.js',
  'web/js/common.js',
  'web/js/work-action-service.js',
  'proc/js/proc-constant.js',
  'proc/js/web-modeler-constant.js',
  'proc/js/stencil.js',
  'proc/js/map.js'
];
var cssList = [
  'web/css/pdf.css',
  'web/vendor/rappid/rappid.1.css',
  'web/vendor/web-modeler/css/web-modeler-layout.css',
  'web/vendor/web-modeler/css/web-modeler.css',
  'web/vendor/froala/css/froala_style.min.css'
];

class IncludeResource {
  constructor(depth) {
    this.depth = depth;
    this.prePath = '';
    for (var i = 0; i < this.depth; i++) {
      this.prePath += '../';
    }
  }
  includeCss() {
    var len = cssList.length;
    for (var i = 0; i < len; i++) {
      var css = cssList[i];
      console.debug(this.prePath + css);
      document.write('<link type=\"text\/css\" rel=\"stylesheet\" media=\"all\" href=\"' + this.prePath + css + '\"><\/linkt>');
    }
  }
  includeJS() {
    var len = scripts.length;
    for (var i = 0; i < len; i++) {
      var js = scripts[i];
      console.debug(this.prePath + js);
      document.write('<script type=\"text\/javascript\" src=\"' + this.prePath + js + '\"><\/script>');
    }
  }
  init() {
    this.includeCss();
    this.includeJS();
  }
}