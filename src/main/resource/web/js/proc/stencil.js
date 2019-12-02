(function () {

  'use strict';

  var palleteNameAttr = {
    'ref': '.body',
    'ref-x': .5,
    'ref-dy': 6,
    'text-anchor': 'middle'
  };

  joint.shapes.bpmn.Flow = joint.shapes.bpmn.Flow.extend({
    defaults: _.defaultsDeep({
      custom: {
        subType: PROC_CONSTANT.ACTS_TYPE.TRANSITION
      }

    }, joint.shapes.bpmn.Flow.prototype.defaults)
  });

  /**
   * 프로세스
   */
  joint.shapes.app.ProcessView = joint.shapes.app.ActivityView;
  joint.shapes.app.Process = joint.shapes.app.Activity.extend({
    defaults: _.defaultsDeep({
      type: 'app.Process',
      attrs: {
        '.pallete-name': {
          'text': MODELER_CONSTANT.CELL_TYPE.PROCESS.INIT_LABEL
        },
        'body': {
          'stroke-width': '1px'
        },
      },
      content: '',
      subProcess: true,
      participants: [],
      placeholder: MODELER_CONSTANT.CELL_TYPE.PROCESS.LABEL,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.PROCESS,
        // actName: MODELER_CONSTANT.CELL_TYPE.PROCESS.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.PROCESS.NAME
      }
    }, joint.shapes.app.Activity.prototype.defaults)
  });

  /**
   * 서브프로세스
   */

  joint.shapes.app.SubProcessView = joint.shapes.app.ActivityView;
  joint.shapes.app.SubProcess = joint.shapes.app.Activity.extend({
    defaults: _.defaultsDeep({
      type: 'app.SubProcess',
      attrs: {
        '.pallete-name': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.SUBPROCESS.INIT_LABEL
        }, palleteNameAttr),
        '.pallete-name2': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.SUBPROCESS.INIT_LABEL2,
          'ref-dy': 21
        }, palleteNameAttr),
        'body': {
          'stroke-width': '1px'
        },
      },
      content: '',
      subProcess: true,
      participants: [],
      palleteNameLines: 2,
      placeholder: MODELER_CONSTANT.CELL_TYPE.SUBPROCESS.LABEL,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.SUB_PROC,
        // actName: MODELER_CONSTANT.CELL_TYPE.SUBPROCESS.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.SUBPROCESS.NAME
      }
    }, joint.shapes.app.Activity.prototype.defaults)
  });

  /**
   * 단위업무
   */
  joint.shapes.app.ActivityView = joint.shapes.app.ActivityView;
  joint.shapes.app.Activity = joint.shapes.app.Activity.extend({
    defaults: _.defaultsDeep({
      type: 'app.Activity',
      attrs: {
        '.pallete-name': {
          'text': MODELER_CONSTANT.CELL_TYPE.NORMAL.INIT_LABEL
        }
      },
      content: '',
      subProcess: false,
      palleteNameLines: 1,
      placeholder: MODELER_CONSTANT.CELL_TYPE.NORMAL.LABEL,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.ACTIVITY,
        // actName: MODELER_CONSTANT.CELL_TYPE.NORMAL.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.NORMAL.NAME
      }
    }, joint.shapes.app.Activity.prototype.defaults)
  });

  /**
   * 외부단위업무
   */
  joint.shapes.app.ExtActivityView = joint.shapes.app.ActivityView;
  joint.shapes.app.ExtActivity = joint.shapes.app.Activity.extend({
    defaults: _.defaultsDeep({
      type: 'app.ExtActivity',
      attrs: {
        '.body': {
          'stroke-width': '5px'
        },
        '.pallete-name': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.EXT_NORMAL.INIT_LABEL,
        }, palleteNameAttr),
        '.pallete-name2': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.EXT_NORMAL.INIT_LABEL2,
          'ref-dy': 22
        }, palleteNameAttr)
      },
      content: '',
      subProcess: false,
      activityType: 'call-activity',
      palleteNameLines: 2,
      placeholder: MODELER_CONSTANT.CELL_TYPE.EXT_NORMAL.LABEL,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.EXT_ACTIVITY,
        cellName: MODELER_CONSTANT.CELL_TYPE.EXT_NORMAL.NAME
      }
    }, joint.shapes.app.Activity.prototype.defaults)
  });

  joint.shapes.app.Group = joint.shapes.app.Group.extend({
    defaults: _.defaultsDeep({
      type: 'app.Group',
      attrs: {
        '.body': {
          'stroke-dasharray': '1.2',
        },
        '.pallete-name': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.FOLER.INIT_LABEL,
        }, palleteNameAttr),
        '.pallete-name2': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.FOLER.INIT_LABEL2,
          'ref-dy': 21,
        }, palleteNameAttr)
      },
      label: '',
      palleteNameLines: 2,
      placeholder: MODELER_CONSTANT.CELL_TYPE.FOLER.LABEL,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.FOLER,
        // actName: MODELER_CONSTANT.CELL_TYPE.FOLER.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.FOLER.NAME
      }
    }, joint.shapes.app.Group.prototype.defaults)
  });

  joint.shapes.app.InGroupView = joint.shapes.app.RectView;
  joint.shapes.app.InGroup = joint.shapes.app.Rect.extend({
    defaults: _.defaultsDeep({
      type: 'app.InGroup',
      attrs: {
        '.body': _.defaults({
          'stroke-width': 3
        }, joint.custom.options.groupAttr),
        '.pallete-name': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.IN_FOLER.INIT_LABEL,
        }, palleteNameAttr),
        '.pallete-name2': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.IN_FOLER.INIT_LABEL2,
          'ref-dy': 21
        }, palleteNameAttr),
        '.pallete-name3': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.IN_FOLER.INIT_LABEL3,
          'ref-dy': 36
        }, palleteNameAttr)
      },
      palleteNameLines: 3,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.IN_FOLER,
        // actName: MODELER_CONSTANT.CELL_TYPE.IN_FOLER.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.IN_FOLER.NAME
      }
    }, joint.shapes.app.Rect.prototype.defaults)
  });

  joint.shapes.app.ExtGroupView = joint.shapes.app.RectView;
  joint.shapes.app.ExtGroup = joint.shapes.app.Rect.extend({
    defaults: _.defaultsDeep({
      type: 'app.ExtGroup',
      attrs: {
        '.body': _.defaults({
          'stroke': '#969696',
          'stroke-dasharray': '6,3'
        }, joint.custom.options.groupAttr),
        '.pallete-name': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.EXT_FOLER.INIT_LABEL,
        }, palleteNameAttr),
        '.pallete-name2': _.defaults({
          'text': MODELER_CONSTANT.CELL_TYPE.EXT_FOLER.INIT_LABEL2,
          'ref-dy': 21
        }, palleteNameAttr)
      },
      content: '',
      noEmbedded: true,
      palleteNameLines: 2,
      placeholder: MODELER_CONSTANT.CELL_TYPE.EXT_FOLER.LABEL,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.EXT_FOLER,
        // actName: MODELER_CONSTANT.CELL_TYPE.EXT_FOLER.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.EXT_FOLER.NAME
      }
    }, joint.shapes.app.Rect.prototype.defaults)
  });

  joint.shapes.app.Gateway = joint.shapes.app.Gateway.extend({
    defaults: _.defaultsDeep({
      attrs: {
        '.pallete-name': {
          'text': MODELER_CONSTANT.CELL_TYPE.GATEWAY.INIT_LABEL,
        },
      },
      content: '',
      placeholder: MODELER_CONSTANT.CELL_TYPE.GATEWAY.LABEL,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.GATEWAY,
        // actName: MODELER_CONSTANT.CELL_TYPE.GATEWAY.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.GATEWAY.NAME
      }
    }, joint.shapes.app.Gateway.prototype.defaults)
  });

  joint.shapes.app.InOutput = joint.shapes.app.InOutput.extend({
    defaults: joint.util.deepSupplement({
      attrs: {
        '.pallete-name': {
          'text': MODELER_CONSTANT.CELL_TYPE.INOUTPUT.INIT_LABEL,
        }
      },
      content: '',
      placeholder: MODELER_CONSTANT.CELL_TYPE.INOUTPUT.LABEL,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.INOUTPUT,
        // actName: MODELER_CONSTANT.CELL_TYPE.INOUTPUT.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.INOUTPUT.NAME
      }

    }, joint.shapes.app.InOutput.prototype.defaults)
  });

  joint.shapes.app.Rect = joint.shapes.app.Rect.extend({
    defaults: joint.util.deepSupplement({
      attrs: {
        'rect': {
          'fill': 'none',
          'stroke-width': '2px'
        },
        '.pallete-name': {
          'text': MODELER_CONSTANT.CELL_TYPE.RECT.INIT_LABEL,
        }
      },
      placeholder: MODELER_CONSTANT.CELL_TYPE.RECT.LABEL,
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.ETC,
        // actName: MODELER_CONSTANT.CELL_TYPE.RECT.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.RECT.NAME
      }

    }, joint.shapes.app.Rect.prototype.defaults)
  });

  joint.shapes.app.Pool = joint.shapes.app.Pool.extend({
    defaults: joint.util.deepSupplement({
      type: 'app.Pool',
      size: {
        width: 30,
        height: 30
      },
      attrs: {
        '.pallete-name': {
          'text': MODELER_CONSTANT.CELL_TYPE.POOL.INIT_LABEL
        },
      },
      custom: {
        actType: PROC_CONSTANT.ACTS_TYPE.POOL,
        // actName: MODELER_CONSTANT.CELL_TYPE.POOL.INIT_LABEL,
        cellName: MODELER_CONSTANT.CELL_TYPE.POOL.NAME
      }
    }, joint.shapes.app.Pool.prototype.defaults)
  });

})();