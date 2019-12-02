// paperScroller background (paper-scroller-background) 가 4px 오버되서 생성됨
joint.ui.PaperScroller = joint.ui.PaperScroller.extend({
  // Position the paper inside the paper wrapper and resize the wrapper.
  addPadding: function (left, right, top, bottom) {

    var base = this.getPadding();

    var padding = this._padding = {
      left: Math.round(base.left + (left || 0)),
      top: Math.round(base.top + (top || 0)),
      bottom: Math.round(base.bottom + (bottom || 0)),
      right: Math.round(base.right + (right || 0))
    };

    // 수정 부분
    var scrollGap = 10;
    var pdWidth = padding.left + this.options.paper.options.width + padding.right - scrollGap;
    var pdHeight = padding.top + this.options.paper.options.height + padding.bottom - scrollGap;
    this.$background.css({
      width: pdWidth,
      height: pdHeight
    });
    // console.log('web-modeler:paper height1: ', this.options.paper.options.height);
    // console.log('web-modeler:paper height2: ', pdHeight);
    this.options.paper.$el.css({
      left: padding.left,
      top: padding.top
    });

    return this;
  }
});