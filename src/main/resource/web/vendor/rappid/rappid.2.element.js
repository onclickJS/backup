/**
 * magnet: 링크 연결하면서 해당 elem에 over하면 자석 처럼 붙는 느낌나면서 select 박스 생기는 것
 */
(function () {
  // chrome에서 ie 테스트 용
  // joint.env.test = function () {
  //   return false;
  // }
  //sgResize 
  joint.custom = {};
  joint.custom.options = {};

  // embed 관련
  joint.custom.options.embed = {};
  joint.custom.options.embed.parentTypes = [
    'app.Group',
    'app.InGroup',
    'app.Pool'
  ];

  joint.custom.options.embed.noChildTypes = [
    'app.InGroup',
    'app.ExtGroup',
    'app.Pool'
  ];

  // link 관련
  joint.custom.options.link = {};
  joint.custom.options.link.defaultLabels = [
    { 
      attrs: { 
        text: {fill: '#ffffff'}, 
        rect: {fill: '#666666', stroke: '#666666'} 
      }
    }
  ];

  // attrs 관련
  joint.custom.options.elemLabelHeight = 12;

  joint.custom.options.headerHeight = 30;
  joint.custom.options.sublaneWidth = 150;

  joint.custom.options.rectAttr =  {
    fill: '#ffffff',
    stroke: '#4c4c4c',   
    width: 120,
    height: 49,
    'vector-effect': 'non-scaling-stroke'
  };

  joint.custom.options.groupAttr =  {
    width: 200,
    height: 200,
    stroke: '#4c4c4c',
    'stroke-width': 2,
    fill: 'transparent',
    'vector-effect': 'non-scaling-stroke'
  };

  joint.custom.options.contentAttr = {
    // 'text': '', // 있으면 옛날 데이터들이 안됌
    'font-size': joint.custom.options.elemLabelHeight,
    'ref': '.body',
    'ref-x': .5,
    'ref-y': .5,
    'y-alignment': 'middle',
    'x-alignment': 'middle',
    'text-anchor': 'middle',
    'word-spacing': '-1px',
    'letter-spacing': 0
  };

  joint.custom.options.placeholderAttr = _.defaults({
    'opacity': 0.4
  }, joint.custom.options.contentAttr);

  joint.custom.options.labelAttr = {
    'ref': '.body',
    'ref-x': .5,
    'ref-dy': joint.custom.options.elemLabelHeight,
    'font-size': joint.custom.options.elemLabelHeight,
    'fill': '#4c4c4c',
    'y-alignment': 'middle'
  };

  joint.custom.options.textAttr = {
    'fill': '#4c4c4c',
    'font-size': joint.custom.options.elemLabelHeight
  };

  joint.custom.options.palleteNameAttr = {
    'ref': '.body',
    'ref-x': .5,
    'ref-dy': 6,
    'text-anchor': 'middle'
  };

  joint.shapes.app = joint.shapes.app || {};

  joint.dia.Element.define('app.Element', {
    attrs: {        
      rect: {
        fill: '#ffffff',
        stroke: '#000000',
        width: 80,
        height: 100
      },
      text: {
        fill: '#000000',
        'font-size': 14,
        'font-family': 'Noto Sans KR, Noto Sans CJK KR, sans-serif'
      },
      '.content': joint.custom.options.contentAttr,
      '.placeholder': joint.custom.options.placeholderAttr
    },
    label: null,
    content: null,
  }, {
    markup: [
      '<g class="rotatable">',
      '<g class="scalable">',
      '<rect class="body"/>',
      '</g>',
      '<text class="content"/>',
      '<text class="placeholder"/>',
      '</g>'
    ].join(''),
    initialize: function() {
      joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    }
  });

  joint.shapes.app.ElementView = joint.dia.ElementView.extend({

    _initializePorts: function () {
      // 이전에는 attrs/.label/text에 값이 있었기 때문에 label에는 데이터가 없음.
  
      var model = this.model;
      var elemAttrs = this.model.get('attrs');
      var custom = this.model.get('custom');
  
      if (!custom) {
        return;
      }
  
      // var actName = custom['actName'];
  
      this.renderLabel();
    },
    initialize: function () {

      this.removeOldData();
      // console.log('joint.shapes.app.ElementView');
      joint.dia.ElementView.prototype.initialize.apply(this, arguments);

      // Keep this for backwards compatibility:
      this.noSVGForeignObjectElement = true; //!joint.env.test('svgforeignobject');
      this.listenTo(this.model, 'change:content change:size', function (cell) {
        // avoiding pass of extra paramters
        this.updateContent(cell);
      });

      this.listenTo(this.model, 'change:label', function (cell, label) {
        this.renderLabel();
      });

      this.listenTo(this.model, 'change:placeholder', function (cell) {
        this.changePlaceholder(cell);
      });
    },

    removeOldData: function() {
      attrs = this.model.get('attrs');
      if (attrs['.content']) delete attrs['.content'].html;
      delete attrs['.fobj'];
      delete attrs['.fobj div'];
      delete attrs['.fobj-label'];
      delete attrs['.div-label'];
      delete attrs['.outer'];
      delete attrs['body'];
      delete attrs['rect'];
      this.model.attr(attrs);
    },

    update: function (cell, renderingOnlyAttrs) {

      var model = this.model;

      // Update everything but the content first.
      var noTextAttrs = joint.util.omit(renderingOnlyAttrs || model.get('attrs'), '.content', '.label', '.placeholder');
      joint.dia.ElementView.prototype.update.call(this, model, noTextAttrs);

      if (!renderingOnlyAttrs || joint.util.has(renderingOnlyAttrs, '.content')) {
        // Update the content itself.
        this.updateContent(model, renderingOnlyAttrs);
      }
      if (!renderingOnlyAttrs || joint.util.has(renderingOnlyAttrs, '.label')) {
        // Update the content itself.
        this.renderLabel();
      }
    },

    updateContent: function (cell, renderingOnlyAttrs) {

      var contentText = cell.get('content');

      // content를 사용하지 않는 element 는 return;
      if (contentText == null) { return; }

      // Create copy of the text attributes
      var textAttrs = joint.util.merge({}, (renderingOnlyAttrs || cell.get('attrs'))['.content']);

      delete textAttrs.text;
      delete textAttrs.html;

      // Break the content to fit the element size taking into account the attributes
      // set on the model.

      var size = _.cloneDeep(cell.get('size'));
      var type = cell.get('type');
      if (type === 'app.Gateway') {
        size.width -= 60;
        size.height -= 10;
      } else {
        size.width -= 20;
      }
      var text = joint.util.breakText(contentText, size, textAttrs, {
        // measuring sandbox svg document
        // eol: '^CL^',
        svgDocument: this.paper.svg
      });

      // Create a new attrs with same structure as the model attrs { text: { *textAttributes* }}
      var attrs = joint.util.setByPath({}, '.content', textAttrs, '/');

      // Replace text attribute with the one we just processed.
      // ex) cell.attr('.rank/text', joint.util.breakText(rank, { width: 165, height: 45 }, cell.attr('.rank')));
      attrs['.content'].text = text;

      attrs = this.setPlaceholder(cell, attrs, contentText);

      // Update the view using renderingOnlyAttributes parameter.
      joint.dia.ElementView.prototype.update.call(this, cell, attrs);
    },
    changePlaceholder: function(cell) {

      // change:placeholder 이벤트가 직접 들어왔을 때
      var viewText = cell.get('content') || cell.get('label');
      var plcText = viewText ? '' : cell.get('placeholder');
      var attrs = joint.util.setByPath({}, '.placeholder/text', plcText, '/');
      joint.dia.ElementView.prototype.update.call(this, cell, attrs);

    },
    setPlaceholder: function(cell, attrs, text) {
      
      // change:content, change:label, update 등 연관 값이 변경되어
      // 연관 값에 따라 placeholder를 지정해 줌
      var placeholder = cell.get('placeholder');
      if (placeholder === undefined) return;
      
      attrs['.placeholder'] = cell.get('attrs')['.placeholder'] || {};
      // content 데이터가 없을 경우 placeholder를 보인다.
      if (!text) {
        attrs['.placeholder'].text = placeholder;
      } else {
        attrs['.placeholder'].text = '';
      }

      return attrs;
    },

    resize: function (cell, changed, opt) {

      this.renderLabel();

      var width = this.model.get('size').width;
      var height = this.model.get('size').height;

      this.model.attr('.body/width', width);
      this.model.attr('.body/height', height);
  
      // 기존 코드
      if (this.scalableNode) return this.sgResize.apply(this, arguments);
      if (this.model.attributes.angle) this.rotate();
      this.update();
      // - 기존 코드
    },
    renderLabel: function () {
      var labelText = this.model.get('label');
      this.labelLayoutAndUpdate(labelText);
    },
    labelLayoutAndUpdate: function (labelText) {

      // 사이즈 변경이나 label 내용 변경이 있을 때 cell에 맞게 label layout 변경
      // label 사용하지 않는 element 는 return;
      if (labelText == null) return;
  
      var changedAttrs = {};

      var textAttrs = this.model.get('attrs')['.label'];
      var attrs = joint.util.setByPath({}, '.label', textAttrs, '/');
  
      var eWidth = this.model.get('size').width;
      var textSize = joint.custom.options.elemLabelHeight;
      var textCount = eWidth / textSize * (this.model.get('type') === 'bpmn.Group' ? 1 : 4);
      labelText = labelText.substr(0, textCount) + (textCount < labelText.length ? '...' : '');
  
      try {
        attrs['.label'].text = labelText;
      } catch (err) {
        return;
      }
  
      attrs = this.setPlaceholder(this.model, attrs, labelText);
      joint.dia.ElementView.prototype.update.call(this, this.model, attrs);
    },

    prepareEmbedding: function(data) {

      data || (data = {});

      var model = data.model || this.model;
      var paper = data.paper || this.paper;
      var graph = paper.model;

      // Before we start looking for suitable parent we remove the current one.
      var parentId = model.parent();
      parentId && graph.getCell(parentId).unembed(model, { ui: true });

      // 추가 2018.11.16
      if (joint.custom.options.embed.noChildTypes.indexOf(model.get('type')) > -1) { return; }

      model.startBatch('to-front');

      // Bring the model to the front with all his embeds.
      model.toFront({ deep: true, ui: true });

      // Note that at this point cells in the collection are not sorted by z index (it's running in the batch, see
      // the dia.Graph._sortOnChangeZ), so we can't assume that the last cell in the collection has the highest z.
      var maxZ = graph.get('cells').max('z').get('z');
      var connectedLinks = graph.getConnectedLinks(model, { deep: true, includeEnclosed: true });

      // Move to front also all the inbound and outbound links that are connected
      // to any of the element descendant. If we bring to front only embedded elements,
      // links connected to them would stay in the background.
      joint.util.invoke(connectedLinks, 'set', 'z', maxZ + 1, { ui: true });

      model.stopBatch('to-front');

    }
  });

  //
  // "visibility": "visible",
  // "data-sub-process": true
  joint.shapes.app.ActivityView = joint.shapes.app.ElementView;
  joint.shapes.app.Element.define('app.Activity', {
    size: {
      width: 39,
      height: 30
    },
    subProcess: false,
    attrs: {
      '.body': _.defaults({}, joint.custom.options.rectAttr),
      'text': _.defaults({}, joint.custom.options.textAttr),
      '.content': _.defaults({}, joint.custom.options.contentAttr),
      '.label': _.defaults({}, joint.custom.options.labelAttr),
      '.pallete-name': _.defaults({}, joint.custom.options.palleteNameAttr),
      '.sub-process': {
        'ref': '.body',
        'ref-x': .5, 
        transform: 'scale(0.5) translate(-11, 31)',
        'ref-dy': -31, 
        'stroke': 'none',
        'd': ''
      }
    }
  }, {
    markup: 
    '<g class="rotatable">' + 
      '<g class="scalable">' + 
        '<rect class="body"/>' + 
      '</g>' + 
      '<text class="content"/>' + 
      '<text class="placeholder"/>' + 
      '<g class="sub-process">' +
      '<path class="sub-process-icon" fill-rule="evenodd" fill="rgb(76, 89, 102)" transform="translate(0 8)" d="M-0,22.005 L-0,-0.005 L22,-0.005 L22,22.005 L-0,22.005 ZM21,1 L1,1 L1,21 L21,21 L21,1 ZM10.012,4.003 L11.992,4.003 L11.992,9.966 L18,9.966 L18,11.995 L11.992,11.995 L11.992,18.013 L10.012,18.013 L10.012,11.995 L4.007,11.995 L4.007,9.966 L10.012,9.966 L10.012,4.003 Z"/>' +
      '</g>' +
      '<g class="stencil-view">' + 
        '<text class="pallete-name"/>' + 
        '<text class="pallete-name2"/>' + 
      '</g>' + 
    '</g>'
  });
  joint.shapes.app.Activity = joint.shapes.app.Activity.extend(joint.shapes.bpmn.SubProcessInterface);
  

  joint.shapes.app.GroupView = joint.shapes.app.ElementView;
  joint.shapes.app.Group = joint.shapes.app.Element.extend({
    markup: 
      '<g class="rotatable">' +
        '<g class="scalable">' +
          '<rect class="body"/>' +
        '</g>' +
        '<rect class="label-rect"/>' +
        '<g class="label-group">' +
          '<text class="label"/>' +
        '</g>' +
        '<text class="placeholder"/>' +
        '<g class="stencil-view">' +
          '<text class="pallete-name"/>' +
          '<text class="pallete-name2"/>' +
        '</g>' +
      '</g>',
    defaults: _.defaultsDeep({
      size: {
        width: 39,
        height: 30
      },
      attrs: {
        '.': {
          magnet: true
        },
        '.body': _.defaults({ 'rx': 5, 'ry': 5, 'stroke-width': 1 }, joint.custom.options.groupAttr),
        'text': _.defaults({}, joint.custom.options.textAttr),
        '.label-rect': {
          'ref': '.body',
          'ref-width': 1,
          'ref-x': 0,
          'ref-y': (joint.custom.options.elemLabelHeight + 14) * -1,
          'height': joint.custom.options.elemLabelHeight + 14,
          'fill': 'none',
          'stroke': 'none'
        },
        '.label-group': {
          ref: '.label-rect',
          'ref-x': 0,
          'ref-y': 0
        },
        '.label': _.defaults({ 'ref': '.label-rect', 'x-alignment': 'middle'}, joint.custom.options.labelAttr),
        '.placeholder': _.defaults({ 'text': '', 'ref': '.label-rect', 'ref-y': 0, 'x-alignment': 'middle'}, joint.custom.options.labelAttr),
        '.pallete-name': _.defaults({}, joint.custom.options.palleteNameAttr)
      }
    }, joint.shapes.app.Element.prototype.defaults)
  });

  joint.shapes.app.GatewayView = joint.shapes.app.ElementView;
  joint.shapes.app.Element.define('app.Gateway', {
    size: {
      // 'width': 46,
      // 'height': 30
      width: 39,
      height: 30
    },
    attrs: {
      '.body': _.defaults({points: '40,0 80,40 40,80 0,40'}, joint.custom.options.rectAttr),
      'text': _.defaults({}, joint.custom.options.textAttr),
      '.pallete-name': _.defaults({}, joint.custom.options.palleteNameAttr),
      '.content': _.defaults({}, joint.custom.options.contentAttr)
    },
    icon: 'cross',
  }, {
    markup: 
      '<g class="rotatable">' +
        '<g class="scalable">' +
          '<polygon class="body"/>' +
        '</g>' +
        '<text class="content"/>' +
        '<text class="placeholder"/>' + 
        '<g class="stencil-view">' +
          '<text class="pallete-name"/>' +
        '</g>' + 
      '</g>'
  });


  joint.shapes.app.InOutputView = joint.shapes.app.ElementView;
  joint.shapes.app.InOutput = joint.shapes.app.Element.extend({
    markup: [
      '<g class="rotatable">',
      '<g class="scalable">',
      '<path class="body" d="M180,20v90c0,5.5-4.5,10-10,10H10c-5.5,0-10-4.5-10-10V10c0-5.5,4.5-10,10-10h150L180,20z"/>',
      '<path class="body" d="M160,0v9.6c0,0,0,4.7,3.1,7.3c4,3.3,8.6,3,8.6,3l8.4,0.2"/>',
      '</g>',
      '<text class="content"/>',
      '<text class="placeholder"/>' + 
      '<g class="stencil-view">',
      '<text class="pallete-name"/>',
      '</g>',
      '</g>',
    ].join(''),
    defaults: joint.util.deepSupplement({
      type: 'app.InOutput',
      size: {
        width: 39,
        height: 30
      },
      attrs: {
        '.': {
          magnet: true
        },
        '.body': _.defaults({}, joint.custom.options.rectAttr),
        'text': _.defaults({}, joint.custom.options.textAttr),
        '.pallete-name': _.defaults({}, joint.custom.options.palleteNameAttr),
        '.content': _.defaults({}, joint.custom.options.contentAttr)
      }
    }, joint.shapes.app.Element.prototype.defaults)
  });


  joint.shapes.app.RectView = joint.shapes.app.ElementView;
  joint.shapes.app.Rect = joint.shapes.app.Element.extend({
    markup: [
      '<g class="rotatable">',
      '<g class="scalable">',
      '<rect class="body" width="28" height="30"/>',
      '</g>',
      '<text class="content"/>',
      '<text class="placeholder"/>' + 
      '<g class="stencil-view">',
      '<text class="pallete-name"/>',
      '<text class="pallete-name2"/>',
      '<text class="pallete-name3"/>',
      '</g>',
      '</g>',
    ].join(''),
    defaults: joint.util.deepSupplement({
      type: 'app.Rect',
      size: {
        width: 39,
        height: 30
      },
      attrs: {
        '.': {
          magnet: true
        },
        '.body': _.defaults({}, joint.custom.options.rectAttr),
        'text': _.defaults({}, joint.custom.options.textAttr),
        '.pallete-name': _.defaults({}, joint.custom.options.palleteNameAttr),
        '.content': _.defaults({}, joint.custom.options.contentAttr)
      }
    }, joint.shapes.app.Element.prototype.defaults)
  });


  /**
   * @desc 링크
   */
  joint.shapes.bpmn.Flow = joint.shapes.bpmn.Flow.extend({
    markup: [{
      tagName: 'path',
      selector: 'wrapper',
      attributes: {
        'fill': 'none',
        'cursor': 'pointer',
        'stroke': 'transparent'
      }
    }, {
      tagName: 'path',
      selector: 'line',
      attributes: {
        'fill': 'none',
        'pointer-events': 'none'
      }
    }],
    defaults: _.defaultsDeep({
      type: 'bpmn.Flow',
      router: {
        name: 'orthogonal'  // orthogonal
      },
      connector: {
        name: 'rounded'
      },
      attrs: {
        line: {
          connection: true,
          stroke: '#666',
          strokeDasharray: '0',
          strokeWidth: 1,
          strokeLinejoin: 'round',
          fill: 'none',
          sourceMarker: {
            type: 'path',
            d: 'M 0 0 0 0',
            stroke: 'none'
          },
          targetMarker: {
            type: 'path',
            d: 'M 0 -4.5 -10 0 0 4.5 z',
            stroke: 'none'
          }
        },
        wrapper: {
          connection: true,
          strokeWidth: 10,
          strokeLinejoin: 'round'
        }
      }
    }, joint.shapes.bpmn.Flow.prototype.defaults),
    defaultLabel: {
      attrs: {
        rect: {
          fill: '#666666',
          stroke: '#666666',
          strokeWidth: 1,
          rx: 15,
          ry: 15,
          refWidth: 10,   // label 크기를 기준으로
          refHeight: 10,
          refX: -5,       // label 위치를 기준으로
          refY: -5
        },
        text: {
          fill: '#ffffff'
          // 'font-size': joint.custom.options.elemLabelHeight
        }
      },
      position: {
        distance: 0.5, // place label at midpoint by default
      }
    },
    initialize: function() {

      joint.dia.Link.prototype.initialize.apply(this, arguments);

      this.listenTo(this, 'change:flowType', this.onFlowTypeChange);

      this.onFlowTypeChange(this, this.get('flowType'));
    },
    getMarkerWidth: function (type) {
      var d = (type === 'source') ? this.attr('line/sourceMarker/d') : this.attr('line/targetMarker/d');
      return this.getDataWidth(d);
    },

    getDataWidth: _.memoize(function (d) {
      return (new g.Path(d)).bbox().width;
    }),

    onFlowTypeChange: function (cell, type) {

      var attrs;

      switch (type) {

        case 'normal':
          attrs = {};
          break;

        case 'association':
          attrs = {
            line: {
              targetMarker: {
                d: 'M 0 0'
              },
              strokeDasharray: '4,4'
            }
          };
          break;

        case 'twoway':
          attrs = {
            line: {
              sourceMarker: {
                d: 'M 0 -4.5 -10 0 0 4.5 z'
              }
            }
          };
          break;

        default:
          throw 'BPMN: Unknown Flow Type: ' + type;
      }

      cell.attr(joint.util.merge({}, this.defaults.attrs, attrs));
    }

  }, {

    connectionPoint: function (line, view, magnet, opt, type, linkView) {
      try {
        var markerWidth = linkView.model.getMarkerWidth(type);
        opt = {
          offset: markerWidth,
          stroke: true
        };
      } catch (err) {
        opt = {
          name: 'boundary',
          args: {
            sticky: true,
            stroke: true
          }
        };
      }

      // connection point for UML shapes lies on the root group containg all the shapes components
      if (view.model.get('type').indexOf('uml') === 0) opt.selector = 'root';
      return joint.connectionPoints.boundary.call(this, line, view, magnet, opt, type, linkView);
    }
  });

  // joint.shapes.bpmn.FlowView = joint.dia.LinkView.extend({
  //   options: {
  //     shortLinkLength: 50,
  //     doubleLinkTools: false,
  //     longLinkLength: 155,
  //     linkToolsOffset: 10,
  //     doubleLinkToolsOffset: 10,
  //     sampleInterval: 50,
  //   },
  // });

}());
