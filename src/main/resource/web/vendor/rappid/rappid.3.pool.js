(function () {

  /**
   * lane size 조정 가능
   */
  joint.shapes.app.Pool = joint.shapes.bpmn.Pool.extend({

    markup: ['<g class="rotatable">',
      '<g class="scalable"><rect class="body"/></g>',
      // '<svg overflow="hidden" class="blackbox-wrap"><text class="blackbox-label"/></svg>',
      // '<rect class="pool-header"/><text class="pool-label"/>',
      '<g class="lanes"/>',    
      // '<image class="resizer-x"/>' + 
      // '<image class="resizer-y"/>' + 
      '<g class="stencil-view">',
      '<text class="pallete-name"/>',
      '</g>',
      '</g>'
    ].join(''),

    laneMarkup: 
    '<g class="lane">' + 
      '<rect class="lane-body"/>' + 
      '<rect class="lane-header"/>' + 
      '<text class="lane-label"/>' + 
      '<path class="lane-header-border-bottom"/>' + 
      '<path class="lane-header-border-top"/>' + 
      '<path class="lane-body-border-bottom"/>' + 
    // '<image class="resizer-x"/>' + 
    // '<image class="resizer-y"/>' + 
    '</g>',
    isMovable: false,
    useLaneResizer: false,  // 각 레인별 resize 가능 여부
    minWidth: 600,
    minHeight: 200,
    minLaneHeight: 40,
    usePoolHeader: false,
    defaults: joint.util.deepSupplement({
      type: 'app.Pool',
      size: {
        width: 39,
        height: 30
      },

      attrs: {        
        '.': {
          magnet: false // magnet: 링크 연결하면서 해당 elem에 over하면 자석 처럼 붙는 느낌나면서 select 박스 생기는 것
        },
        '.pallete-name': _.defaults({}, joint.custom.options.palleteNameAttr),
        '.body': {
          width: 200,
          height: 500,
          stroke: '#dedede',
        },
        '.pool-header': {
          ref: '.body',
          width: 'none',
          height: 20,
          fill: '#eef1f5',
          stroke: '#ccc',
          'stroke-width': 1,
          'ref-width': 1,
          'ref-height': 'none',
          'pointer-events': 'visiblePainted',
        },
        '.pool-label': {
          ref: '.pool-header',
          'ref-y': 10,
          'ref-x': .5,
          transform: 'rotate(0)',
          'y-alignment': 'middle',
        },
        '.lane-header': {
          fill: '#eef1f6',
          stroke: 'none',
          'pointer-events': 'visiblePainted'
        },
        '.lane-header-border-bottom': {
          d: 'M 0 0 L ' + joint.custom.options.sublaneWidth + ' 0',
          'stroke-width': 0.5,
          stroke: '#b7c1ca',
        },
        '.lane-header-border-top': {
          d: 'M 0 0 L ' + joint.custom.options.sublaneWidth + ' 0',
          'stroke-width': 0.5,
          stroke: '#b2b2b2',
        },
        '.lane-body-border-bottom': {
          d: 'M 0 0 L ' + joint.custom.options.sublaneWidth + ' 0',
          'stroke-width': 0.5,
          stroke: '#b2b2b2',
        },
        '.lane-label': {
          fill: '#4c4c4c',
          transform: 'rotate(0)',
          'ref-x': .5,
          'ref-y': 13,
          'y-alignment': 'middle',
          'text-anchor': 'middle',
          'font-family': 'Noto Sans KR, Noto Sans CJK KR, sans-serif',
          'font-size': 13
        },
        '.lane-body': {
          fill: 'none',
          stroke: 'none',
          'stroke-width': 1,
          'pointer-events': 'stroke'
        },
        '.resizer-x': {
          width: 31,
          height: 13,
          'ref-dx': 0,
          'ref-y': 0.5,
          'xlink:href': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAANCAMAAABmbkWbAAAAFVBMVEUAAACzs7Ozs7Ozs7Ozs7Ozs7Ozs7OqM5/rAAAABnRSTlMAAIXz9Pm3EuIQAAAAJUlEQVR4AWMYKoCJmYmRkRFOYsizsjEDZeAkpn4WkE44OVS8DQBWlgBqJNk40wAAAABJRU5ErkJggg==',
          transform: 'translate(0, -15.5) rotate(90)',
        },
        '.resizer-y': {
          width: 31,
          height: 13,
          'ref-x': 0.5,
          'ref-dy': -13,
          'xlink:href': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAANCAMAAABmbkWbAAAAFVBMVEUAAACzs7Ozs7Ozs7Ozs7Ozs7Ozs7OqM5/rAAAABnRSTlMAAIXz9Pm3EuIQAAAAJUlEQVR4AWMYKoCJmYmRkRFOYsizsjEDZeAkpn4WkE44OVS8DQBWlgBqJNk40wAAAABJRU5ErkJggg==',
          transform: 'translate(-5, 0)',
        }
      }

    }, joint.shapes.bpmn.Pool.prototype.defaults)

  });

  joint.shapes.app.PoolView = joint.shapes.bpmn.PoolView.extend({

    options: {
      headerHeight: joint.custom.options.headerHeight,
      sublaneWidth: joint.custom.options.sublaneWidth
    },

    events: {
      'mousedown .lane-header': 'mousedownLaneHeader',
      'mousedown .lane-label': 'mousedownLaneLabel'
    },

    initialize: function () {

      this.listenTo(this.model, 'change:lanes', function (cell, lanes) {
        this.renderLanes(lanes);
      });

      this.isMovable = this.model.get('isMovable') || false;

      this.minWidth = this.model.get('minWidth') || 600;
      this.minHeight = this.model.get('minHeight') || 200;
      this.minLaneHeight = this.model.get('minLaneHeight') || 40;
      joint.dia.ElementView.prototype.initialize.apply(this, arguments);

    },
    pointerdown: function(evt, x, y) {

      joint.dia.CellView.prototype.pointerdown.apply(this, arguments);
      this.notify('element:pointerdown', evt, x, y);

      try {
        className = evt.target.classList.value;
        // 이벤트 중복 호출 차단
        if (className.indexOf('resizer') > -1) {
          evt.preventDefault();   // 해당 이벤트 외의 별도의 브라우저 행동을 막는다.
          evt.stopPropagation();  // 부모 태그로의 이벤트 전파를 stop
          return;
        }
      } catch (err) {}

      // pool은 이동 금지 됌
      if (!this.isMovable) return;
      this.dragStart(evt, x, y);
    },
    pointermove: function(evt, x, y) {

      // drag 관련 제거
      var data = this.eventData(evt);
      switch (data.action) {
        case 'move':
          if (!this.isMovable) return;
          this.drag(evt, x, y);
          break;
        case 'magnet':
          this.dragMagnet(evt, x, y);
          break;
      }

      if (!data.stopPropagation) {
        joint.dia.CellView.prototype.pointermove.apply(this, arguments);
        this.notify('element:pointermove', evt, x, y);
      }

      // Make sure the element view data is passed along.
      // It could have been wiped out in the handlers above.
      this.eventData(evt, data);
    },

    pointerup: function(evt, x, y) {

      // drag 관련 제거
      var data = this.eventData(evt);
      switch (data.action) {
        case 'move':
          if (!this.isMovable) return;
          this.dragEnd(evt, x, y);
          break;
        case 'magnet':
          this.dragMagnetEnd(evt, x, y);
          return;
      }

      if (!data.stopPropagation) {
        this.notify('element:pointerup', evt, x, y);
        joint.dia.CellView.prototype.pointerup.apply(this, arguments);
      }
    },
    
    renderLanes: function (lanes) {
      // 세로형 Pool

      lanes = lanes || {};

      // index keeps track on how many lanes we created
      this.index = 0;

      var headerHeight = lanes.headerHeight === undefined ? this.options.headerHeight : lanes.headerHeight;
      this.lanesAttrs = {
        '.pool-header': { height: headerHeight },
        '.pool-label': { text: lanes.label || '' }
      };

      this.$lanes.empty();

      if (lanes.sublanes) {
        // recursion start
        
        // subline 갯수 에 비례하게 pool width 변경
        this.changePoolSize(lanes.sublanes);

        var usePoolHeader = this.model.usePoolHeader;
        this.renderSublanes(lanes.sublanes, 0, usePoolHeader ? headerHeight : 0, 1, 'lanes');
      }

      // We don't want the lanes attributes to be stored on model.
      // That's why we are using renderingOnlyAttrs parameter in ElementView.update
      this.update(this.model, joint.util.merge({}, this.model.get('attrs'), this.lanesAttrs));
    },
    changePoolSize: function (sublanes) {
      // sublanes length * sublane width
      var poolSize = this.model.get('size');
      var poolHeight = poolSize.height;
      var poolWidth = sublanes.length * this.options.sublaneWidth;

      this.resizePool(poolWidth, poolHeight);
    },
    renderSublanes: function (lanes, prevX, prevY, prevRatio, prevPath) {
      // 세로형 Pool

      var defaultHeaderHeight = this.options.headerHeight;
      var path = prevPath + '/sublanes/';

      joint.util.toArray(lanes).reduce(function (xSum, lane, index) {

        var className = 'lane' + this.index;
        var bodySelector = '.' + className + ' .lane-body';
        var headerSelector = '.' + className + ' .lane-header';
        var labelSelector = '.' + className + ' .lane-label';
        var headerBorderBottomSelector = '.' + className + ' .lane-header-border-bottom';
        var headerBorderTopSelector = '.' + className + ' .lane-header-border-top';
        var bodyBorderBottomSelector = '.' + className + ' .lane-body-border-bottom';
        

        if (lane.name) {
          // add custom css class if specified
          className += ' ' + lane.name;
        }

        // append a new lane to the pool
        var lanePath = path + index;
        var svgLane = this.laneMarkup.clone()
          .addClass(className)
          .attr({
            'data-lane-path': lanePath,
            'data-lane-index': this.index
          });

        this.$lanes.append(svgLane.node);

        // var ratio = ratios[index];
        var headerHeight = lane.headerHeight === undefined ? defaultHeaderHeight : lane.headerHeight;
        var x = prevX + xSum + 1;
        var fillColor = index % 2 ? '#eef3f6' : '#f4f8f9';

        this.lanesAttrs[bodySelector] = {
          ref: '.body',
          'width': this.options.sublaneWidth - 2,
          'ref-height': 1, //-prevY,
          'x': x,
          'ref-y': prevY,
          fill: fillColor
        };

        this.lanesAttrs[headerSelector] = {
          height: headerHeight,
          ref: '.body',
          'width': this.options.sublaneWidth - 2,
          'x': x,
          'ref-y': prevY
        };

        this.lanesAttrs[labelSelector] = {
          text: lane.label,
          ref: headerSelector
        };

        this.lanesAttrs[headerBorderBottomSelector] = {
          ref: headerSelector,
          'ref-x': -1,
          'ref-y': '100%'
        };

        this.lanesAttrs[headerBorderTopSelector] = {
          ref: headerSelector,
          'ref-x': -1,
          'ref-y': 0
        };

        this.lanesAttrs[bodyBorderBottomSelector] = {
          ref: bodySelector,
          'ref-x': -1,
          'ref-y': '100%'
        };

        this.index++;

        if (lane.sublanes) {

          // recursively render any child lanes
          // this.renderSublanes(lane.sublanes, x, prevY + headerHeight, ratio, lanePath);
          this.renderSublanes(lane.sublanes, x, prevY + headerHeight, 0, lanePath);
        }

        // return ratioSum + ratio;
        return xSum + this.options.sublaneWidth;

      }.bind(this), 0);
    },

    checkRatios: function (ratios) {
      // 전체 합이 1인지 확인

      if (!ratios.length) { return ratios; }

      var ratioSum = 0;
      for (var i = 0; i < ratios.length; i++) {
        var ratio = ratios[i];
        ratioSum += ratio;
      }

      if (Math.round(ratioSum) === 1) return ratios;
      
      // 전체 합이 1이 아닌 경우, 
      // 마지막 lane의 ratio에 1과의 차이값 만큼 ratio값을 더한다.
      var emptyRatio = 1 - ratioSum;
      ratios[ratios.length - 1] += emptyRatio;

      return ratios;
    },

    mousedownLaneLabel: function(evt) {
      
      var $myLane;
      var $myLaneLabel;
      var $target = $(evt.target);
      var className = $target.attr('class');

      if (className === 'lane-label') {
        $myLaneLabel = $target;
      } else {
        $myLaneLabel = $target.parent();
      }
      $myLane = $myLaneLabel.parent();

      this.mousedownLane($myLane, $myLaneLabel[0]);
    },
    mousedownLaneHeader: function(evt) {
      var $target = $(evt.target);
      var $myLane = $target.parent();
      this.mousedownLane($myLane, evt.target);
    },
    mousedownLane: function($myLane, target) {
      
      var poolView = this;
      var myIndex = parseInt($myLane.attr('data-lane-index'));
      var lanes = this.model.get('lanes');
      var sublanes = lanes.sublanes;

      var laneInfo = sublanes[myIndex];

      var popup = new joint.ui.Popup({
        events: {
          'click #btn-cancel': 'remove',
          'click #btn-insp-del': function() {
            if (sublanes.length < 2) {
              return;
            }
            sublanes.splice(myIndex, 1);
            poolView.model.set('lanes', lanes);
            poolView.renderLanes(lanes);
            this.remove();
          },
          'click #btn-change': function() {
            var laneName = this.$('.lane-name').val();
            laneInfo.label = laneName;
            poolView.model.set('lanes', lanes);
            poolView.renderLanes(lanes);
          },
          'input #labels-text': function() {
            var laneName = this.$('.lane-name').val();
            laneInfo.label = laneName;
            poolView.model.set('lanes', lanes);
            poolView.renderLanes(lanes);
          }
        },
        content: [
            '<div class="layer-lane-edit tooltip-group relation" style="width:410px;">',
            '  <div class="tooltip-area">',
            '    <div class="tooltip-inner">',
            '      <span style="width:300px"> ',
            '        <input type="text" id="labels-text" class="form-control lane-name" class="form-control" maxlength="10">',
            '      </span>',
            '      <button type="button" id="btn-insp-del" class="btn btn-default type10 mg-l10"><i class="gi gi-sm ico-trash"></i></button>',
            '    </div>',
            '    <span class="bg-tooltip-top"></span>',
            '    <button type="button" id="btn-cancel" class="btn btn-default type9"><i class="ico ico-close-layer"></i></button>',
            '  </div>',
            '</div>'
        ].join(''),
        target: target,
        root: $('body')
      });
      popup.render();

      labelInfoInit(laneInfo);
      
      function labelInfoInit(laneInfo) {
        popup.$('#labels-text').val(laneInfo.label);
        popup.$('#labels-text').focus();
      }

    },
    resizePool: function(width, height, resizeOpt) {
      this.model.resize(width, height, resizeOpt); 
    }
  });

}());



