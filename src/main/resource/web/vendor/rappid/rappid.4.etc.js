(function () {

  joint.linkTools.SourceArrowhead = joint.linkTools.SourceArrowhead.extend({
    name: 'source-arrowhead',
    ratio: 0,
    arrowheadType: 'source',
    attributes: {
      'd': ' M 0, 0 m -7.5, 0 a 7.5,7.5 0 1,0 15,0 a 7.5,7.5 0 1,0 -15,0',
      'fill': '#33334F',
      'stroke': '#FFFFFF',
      'stroke-width': 2,
      'cursor': 'move',
      'class': 'source-arrowhead'
    }
  });

  /**
   * cell을 둘러 싸고 있는 테두리 설정
   */
  joint.ui.FreeTransform = joint.ui.FreeTransform.extend({
    update: function () {

      var gap = 3;
      var viewportCTM = this.options.paper.matrix();

      var bbox = this.options.cell.getBBox({
        useModelGeometry: false
      });

      bbox.x *= viewportCTM.a;
      bbox.x += viewportCTM.e;
      bbox.y *= viewportCTM.d;
      bbox.y += viewportCTM.f;
      bbox.width *= viewportCTM.a;
      bbox.height *= viewportCTM.d;

      var angle = g.normalizeAngle(this.options.cell.get('angle') || 0);

      var transformVal = 'rotate(' + angle + 'deg)';

      var type = this.options.cell.get('type');
      if (type === 'bpmn.Group') {
        bbox.y -= (joint.custom.options.elemLabelHeight + gap);
        bbox.height += (joint.custom.options.elemLabelHeight + gap);
      }

      // select 했을 때 보이는 테두리 사이즈 지정
      this.$el.css({
        'width': bbox.width + (gap * 2),
        'height': bbox.height + (gap * 2),
        'left': bbox.x - gap,
        'top': bbox.y - gap,
        'transform': transformVal,
        '-webkit-transform': transformVal, // chrome + safari
        '-ms-transform': transformVal // IE 9
      });
      var shift = Math.floor(angle * (this.DIRECTIONS.length / 360));

      if (shift != this._previousDirectionsShift) {

        // Create the current directions array based on the calculated = false; shift.
        var directions = this.DIRECTIONS.slice(shift).concat(this.DIRECTIONS.slice(0, shift));

        // Apply the array on the halo divs.
        this.$('.resize').removeClass(this.DIRECTIONS.join(' ')).each(function (index, el) {
          $(el).addClass(directions[index]);
        });

        this._previousDirectionsShift = shift;
      }
    }
  });

  /**
   * navigator
   */
  joint.shapes.app.NavigatorElementView = joint.dia.ElementView.extend({

    rect: null,

    initialize: function () {
      this.listenTo(this.model, 'change:position', this.translate);
      this.listenTo(this.model, 'change:size', this.resize);
      this.listenTo(this.model, 'change:angle', this.rotate);
    },

    render: function () {
      this.rect = V('rect', {
        fill: '#31d0c6'
      }).appendTo(this.el)
      this.update();
    },

    update: function () {
      this.rect.attr(this.model.get('size'));
      this.updateTransformation();
    }
  });

  joint.shapes.app.NavigatorLinkView = joint.dia.LinkView.extend({

    initialize: function () {},

    render: function () {},

    update: function () {}
  });


  joint.layout.FlowGridLayout = {

    layout: function (graphOrCells, opt) {

      var graph;

      if (graphOrCells instanceof joint.dia.Graph) {
        graph = graphOrCells;
      } else {
        // `dry: true` for not overriding original graph reference
        // `sort: false` to prevent elements to change their order based on the z-index
        graph = (new joint.dia.Graph()).resetCells(graphOrCells, {
          dry: true,
          sort: false
        });
      }

      // This is not needed anymore.
      graphOrCells = null;

      opt = opt || {};

      var elements = this._quickSort(graph.getElements(), 'y');

      // number of columns
      var columns = opt.columns || 1;
      var rows = Math.ceil(elements.length / columns);

      // shift the element vertically by a given amount
      var dx = opt.dx || 0;
      var dy = opt.dy || 0;
      // position the elements in the centre of a grid cell
      // coordinates of the most top-left element.
      var marginY = opt.marginY || 0;

      // height of a row
      var rowHeights = [];
      var rowHeight = opt.rowHeight;
      if (!rowHeight || joint.util.isString(rowHeight)) {
        rowHeight = this._maxDim(elements, 'height') + dy;
      }

      for (var j = 0; j < rows; j++) {
        rowHeights.push(rowHeight);
      }

      var rowsY = this._accumulate(rowHeights, marginY);

      // Wrap all graph changes into a batch.
      graph.startBatch('layout');

      // iterate the elements and position them accordingly
      elements.forEach(function (element, index) {

        var position = element.get('position');
        var elementSize = element.get('size');

        element.set('index', index);

        // x
        var elementWidth = element.get('size').width;
        var elementX = position.x < 0 ? 0 : position.x;       // x를 0 이상으로 한다.
        var paddingX = (opt.sublaneWidth - elementWidth) / 2; // lane 왼쪽과 element의 간격 (center 위치하도록)

        var laneIndex = Math.round((elementX - paddingX) / opt.sublaneWidth);  // 위치해야할 lane index (0 ~ )

        if (laneIndex > opt.sublaneCount - 1) {
          laneIndex = opt.sublaneCount - 1;
        }

        elementX = (laneIndex * opt.sublaneWidth) + paddingX;
        elementX += dx;

        // y
        var rIndex = Math.floor(index / columns);
        var rHeight = rowHeights[rIndex];
        var cy = (rHeight - elementSize.height) / 2; // rowHeight 영역 내 middle 에 위치하기 위해
        var elementY = rowsY[rIndex] + dy + cy;

        element.position(elementX, elementY, opt);
      });

      graph.stopBatch('layout');
    },
    _quickSort: function (elems, axis) {

      axis = axis || 'y';
      if (elems.length <= 1) {
        return elems;
      }

      var pivot = elems[Math.ceil(elems.length / 2)];
      var less = [];
      var more = [];
      var equal = [];

      for (var i = 0; i < elems.length; i++) {

        var elem = elems[i]
        var elemVal = elem.get('position')[axis];
        var pivotVal = pivot.get('position')[axis];

        if (elemVal < pivotVal) {
          less.push(elem);
        } else if (elemVal > pivotVal) {
          more.push(elem);
        } else {
          equal.push(elem);
        }
      }
      return Array.prototype.concat(this._quickSort(less), equal, this._quickSort(more));
    },

    // find maximal dimension (width/height) in an array of the elements
    _maxDim: function (elements, dimension) {
      return elements.reduce(function (max, el) {
        return Math.max(el.get('size')[dimension], max);
      }, 0);
    },

    _elementsAtRow: function (elements, rowIndex, numberOfColumns) {
      var elementsAtRow = [];
      var i = numberOfColumns * rowIndex;
      var n = i + numberOfColumns;
      for (; i < n; i++) {
        elementsAtRow.push(elements[i]);
      }
      return elementsAtRow;
    },

    _elementsAtColumn: function (elements, columnIndex, numberOfColumns) {
      var elementsAtColumn = [];
      var i = columnIndex;
      var n = elements.length;
      for (; i < n; i += numberOfColumns) {
        elementsAtColumn.push(elements[i]);
      }
      return elementsAtColumn;
    },

    _accumulate: function (array, baseVal) {
      return array.reduce(function (res, val, i) {
        res.push(res[i] + val);
        return res;
      }, [baseVal || 0]);
    }
  };

  // srv 용
  joint.ui.widgets.srvSeparator = joint.ui.widgets.separator.extend({
    render: function () {
      if (this.options.width) {
        this.$el.css({
          width: this.options.width
        });
      }

      // 추가
      this.$el.addClass('bar');
      this.$el.removeClass('joint-theme-imez joint-widget');
      return this;
    }
  });

  joint.ui.widgets.srvUndo = joint.ui.widgets.undo.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default');
      this.$el.removeClass('joint-theme-imez joint-widget');

      this.$el.append('<i class="ico ico-undo"></i>');
      return this;
    }
  });

  joint.ui.widgets.srvRedo = joint.ui.widgets.redo.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default');
      this.$el.removeClass('joint-theme-imez joint-widget');

      this.$el.append('<i class="ico ico-redo"></i>');
      return this;
    }
  });

  joint.ui.widgets.srvCopy = joint.ui.widgets.button.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default');
      this.$el.removeClass('joint-theme-imez joint-widget');

      this.$el.append('<i class="ico ico-copy"></i>');
      return this;
    }
  });

  joint.ui.widgets.srvPaste = joint.ui.widgets.button.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default');
      this.$el.removeClass('joint-theme-imez joint-widget');

      this.$el.append('<i class="ico ico-paste"></i>');
      return this;
    }
  });

  joint.ui.widgets.srvImage = joint.ui.widgets.button.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default');
      this.$el.removeClass('joint-theme-imez joint-widget');

      this.$el.append('<i class="ico ico-photo"></i>');
      return this;
    }
  });

  joint.ui.widgets.srvPrint = joint.ui.widgets.button.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default');
      this.$el.removeClass('joint-theme-imez joint-widget');

      this.$el.append('<i class="ico ico-print-lg"></i>');
      return this;
    }
  });

  joint.ui.widgets.srvView = joint.ui.widgets.button.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default');
      this.$el.removeClass('joint-theme-imez joint-widget');

      this.$el.append('<i class="ico ico-view"></i>');
      return this;
    }
  });

  joint.ui.widgets.srvFront = joint.ui.widgets.button.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default');
      this.$el.removeClass('joint-theme-imez joint-widget');

      this.$el.append('<i class="ico ico-first"></i>');
      return this;
    }
  });


  joint.ui.widgets.srvBack = joint.ui.widgets.button.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default');
      this.$el.removeClass('joint-theme-imez joint-widget');

      this.$el.append('<i class="ico ico-last"></i>');
      return this;
    }
  });

  joint.ui.widgets.mapModify = joint.ui.widgets.button.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default type3');
      this.$el.removeClass('joint-theme-imez joint-widget');
      this.$el.text(opt.text);
      return this;
    }
  });

  joint.ui.widgets.megaModify = joint.ui.widgets.button.extend({
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default type3');
      this.$el.removeClass('joint-theme-imez joint-widget');
      this.$el.text(opt.text);
      return this;
    }
  });

  joint.ui.widgets.srvZoomIn = joint.ui.widgets.button.extend({
    references: ['paperScroller'],
    options: {
      maxScale: 2
    },
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default tool-zoom');
      this.$el.removeClass('joint-theme-imez joint-widget');
      this.$el.append('<i class="ico ico-zoom-in"></i>');
      return this;
    },
    pointerdown: function(evt) {
      var opt = this.options;
      var paperScroller = this.getReferences().paperScroller;
      var crnScale = paperScroller._sx;
      var nextScale = this.searchNextScale(crnScale) / 100;
      if (nextScale === crnScale) {
        return;
      }
      paperScroller.zoom(nextScale, { absolute: true, max: opt.maxScale});
      joint.ui.widgets.button.prototype.pointerdown.call(this, evt);
    },
    searchNextScale: function(scale) {
      var value = scale * 100;
      var selOptions = joint.ui.widgets.zoomSelect.prototype.options.options;
      for (var i = 0; i < selOptions.length; i++) {
        var selOption = selOptions[i];
        if (value < selOption.value) {
          return selOption.value;
        }
      }
      return selOptions[selOptions.length-1].value;
    }
  });

  joint.ui.widgets.srvZoomOut = joint.ui.widgets.button.extend({
    references: ['paperScroller'],
    options: {
      minScale: 0.5
    },
    render: function () {
      var opt = this.options;
      this.$el.addClass('btn btn-default tool-zoom');
      this.$el.removeClass('joint-theme-imez joint-widget');
      this.$el.append('<i class="ico ico-zoom-out"></i>');
      return this;
    },
    pointerdown: function(evt) {
      var opt = this.options;
      var paperScroller = this.getReferences().paperScroller;
      var crnScale = paperScroller._sx;
      var nextScale = this.searchNextScale(crnScale) / 100;
      if (nextScale === crnScale) {
        return;
      }
      paperScroller.zoom(nextScale, { absolute: true, min: opt.minScale});
      joint.ui.widgets.button.prototype.pointerdown.call(this, evt);
    },
    searchNextScale: function(scale) {
      var value = scale * 100;
      var selOptions = joint.ui.widgets.zoomSelect.prototype.options.options;
      for (var i = selOptions.length-1; i > -1; i--) {
        var selOption = selOptions[i];
        if (value > selOption.value) {
          return selOptions[i].value;
        }
      }
      return selOptions[0].value;
    }
  });

  joint.ui.widgets.srvZoomSlider = joint.ui.widgets.zoomSlider.extend({
    references: ['paperScroller'],
    render: function() {

      var opt = this.options;
      var $units;

      this.$output = $('<span/>').text(opt.value);
      this.$output.addClass('tool-zoom percentage');

      this.$units = $('<span/>').text(opt.unit);

      this.$el.append([this.$output, this.$units]);

      return this;
    },
    setValue: function(value) {
      this.$output.text(value);
      this.$output.trigger('change');
    }
  });

  joint.ui.widgets.zoomSelect = joint.ui.widgets.selectBox.extend({

    references: ['paperScroller'],
    options: {
      maxScale: 2,
      selectBoxOptionsClass: 'map-scale',
      options: [
        {content: '50%', value: 50},
        {content: '75%', value: 75},
        {content: '90%', value: 90},
        {content: '100%', value: 100},
        {content: '125%', value: 125},
        {content: '150%', value: 150},
        {content: '200%', value: 200}
      ],
    },
    scale: 1,
    bindEvents: function() {
      this.selectBox.on('option:select', function(option) {
        var paperScroller = this.getReferences().paperScroller;
        var nextScale = option.value / 100;
        if (nextScale === paperScroller._sx) {
          return;
        }
        paperScroller.zoom(nextScale, { absolute: true, max: this.options.maxScale});
      }, this);

      this.getReferences().paperScroller.options.paper.on('scale', function(value) {
        this.setValue(Math.floor(value * 100));
        this.scale = value;
      }, this);
    },
    setValue: function(value) {
      var selOption = this.changeValueForSelect(value);
      this.selectBox.selectByValue(selOption.value);
      this.selectBox.trigger('option:select', selOption);
    },
    changeValueForSelect: function(value) {
      var selOptions = this.options.options;
      for (var i = 0; i < selOptions.length; i++) {
        var selOption = selOptions[i];
        if (value < selOption.value) {
          return selOptions[i-1];
        }
      }
      return selOptions[selOptions.length-1];
    }
});

  // admin 용
  joint.ui.widgets.paste = joint.ui.widgets.button.extend({});
  joint.ui.widgets.image = joint.ui.widgets.button.extend({});
  joint.ui.widgets.print = joint.ui.widgets.button.extend({});
  joint.ui.widgets.view = joint.ui.widgets.button.extend({});
  joint.ui.widgets.copy = joint.ui.widgets.button.extend({});
  joint.ui.widgets.front = joint.ui.widgets.button.extend({});
  joint.ui.widgets.back = joint.ui.widgets.button.extend({});

}());