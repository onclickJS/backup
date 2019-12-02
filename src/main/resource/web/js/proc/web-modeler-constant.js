var MODELER_CONSTANT = (function () {
  var CLICKED_ACTION = {
    POPUP: 'POPUP',
    INSPECTOR: 'INSPECTOR',
    EDITABLE: 'EDITABLE',
    NONE: 'NONE'
  };


  var UPDATE_TYPE = {
    STRING_TO_ARRAY: 'STRING_TO_ARRAY'
  }

  /*
   * changeOnPaperList: 페이퍼에 올리지 마자 바꿀 데이터를 요소에 적용 updateViewList: 팝업을 닫아서 받은
   * 새로운 데이터를 요소에 적용
   */
  var CELL_TYPE = {
    EMPTY: {
      NAME: 'EMPTY',
      LABEL: 'EMPTY',
      INIT_LABEL: 'EMPTY',
      CLICKED: CLICKED_ACTION.POPUP
    },
    INOUTPUT: {
      NAME: 'INOUTPUT',
      LABEL: '입/출력',
      INIT_LABEL: '입/출력',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'content',
        valuePath: 'actName'
      }],
      updateDataList: [],
      changeOnPaperList: []
    },
    PROCEDURE: {
      NAME: 'PROCEDURE',
      LABEL: '프러시저',
      INIT_LABEL: '프러시저',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'content',
        valuePath: 'actName'
      }],
      changeOnPaperList: []
    },
    NORMAL: {
      NAME: 'NORMAL',
      LABEL: '단위업무',
      INIT_LABEL: '단위업무',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
          targetPath: 'content',
          valuePath: 'actName'
        }
      ],
      updateDataList: [{
        targetPath: 'type',
        value: 'app.Activity'
      }],
      changeOnPaperList: []
    },
    EXT_NORMAL: {
      NAME: 'EXT_NORMAL',
      LABEL: '외부 단위업무',
      INIT_LABEL: '외부',
      INIT_LABEL2: '단위업무',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
          targetPath: 'content',
          valuePath: 'actName'
        }
      ],
      updateDataList: [{
        targetPath: 'type',
        value: 'app.ExtActivity'
      }],
      changeOnPaperList: [{
        targetPath: 'attrs/.participants/display',
        value: 'block'
      }]
    },
    SUBPROCESS: {
      NAME: 'SUBPROCESS',
      LABEL: '서브 프로세스',
      INIT_LABEL: '서브',
      INIT_LABEL2: '프로세스',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'content',
        valuePath: 'actName'
      }],
      updateDataList: [{
        targetPath: 'type',
        value: 'app.SubProcess'
      }, {
        targetPath: 'participants',
        value: []
      }]
    },
    PROCESS: {
      NAME: 'PROCESS',
      LABEL: '프로세스',
      INIT_LABEL: '프로세스',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'content',
        valuePath: 'actName'
      }],
      updateDataList: [{
        targetPath: 'type',
        value: 'app.Process'
      }, {
        targetPath: 'participants',
        value: []
      }]
    },
    FOLER: {
      NAME: 'FOLER',
      LABEL: '프로세스 그룹',
      INIT_LABEL: '프로세스',
      INIT_LABEL2: '그룹',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'label',
        valuePath: 'actName'
      }],
      changeOnPaperList: []
    },
    IN_FOLER: {
      NAME: 'IN_FOLER',
      LABEL: '내부 프로세스 영역',
      INIT_LABEL: '내부',
      INIT_LABEL2: '프로세스',
      INIT_LABEL3: '영역',
      CLICKED: CLICKED_ACTION.INSPECTOR,
      updateViewList: [],
      changeOnPaperList: []
    },
    EXT_FOLER: {
      NAME: 'EXT_FOLER',
      LABEL: '외주 프로세스',
      INIT_LABEL: '외주',
      INIT_LABEL2: '프로세스',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'content',
        valuePath: 'actName'
      }],
      changeOnPaperList: []
    },

    GATEWAY: {
      NAME: 'GATEWAY',
      LABEL: '판단기회',
      INIT_LABEL: '판단기회',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'content',
        valuePath: 'actName'
      }],
      changeOnPaperList: []
    },
    ANNOTATION: {
      NAME: 'ANNOTATION',
      LABEL: '설명',
      INIT_LABEL: '설명',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'content',
        valuePath: 'actName'
      }],
      changeOnPaperList: []
    },
    RECT: {
      NAME: 'RECT',
      LABEL: '기본도형',
      INIT_LABEL: '기본도형',
      CLICKED: CLICKED_ACTION.INSPECTOR,
      updateViewList: []
    },
    ARROW_ONE_WAY: {
      NAME: 'ARROW_ONE_WAY',
      LABEL: '단방향화살표',
      INIT_LABEL: '단방향화살표',
      CLICKED: CLICKED_ACTION.NONE
    },
    ARROW_TWO_WAY: {
      NAME: 'ARROW_TWO_WAY',
      LABEL: '양방향화살표',
      INIT_LABEL: '양방향화살표',
      CLICKED: CLICKED_ACTION.NONE
    },
    TRANSITION: {
      NAME: 'TRANSITION',
      LABEL: '트렌지션',
      INIT_LABEL: '트렌지션',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'label',
        valuePath: 'actName'
      }]
    },

    START_EVENT: {
      NAME: 'START_EVENT',
      LABEL: '시작',
      INIT_LABEL: '시작',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'label',
        valuePath: 'actName'
      }]
    },
    END_EVENT: {
      NAME: 'END_EVENT',
      LABEL: '끝',
      INIT_LABEL: '끝',
      CLICKED: CLICKED_ACTION.POPUP,
      updateViewList: [{
        targetPath: 'label',
        valuePath: 'actName'
      }]
    },
    POOL: {
      NAME: 'POOL',
      LABEL: '풀',
      INIT_LABEL: '풀',
      CLICKED: CLICKED_ACTION.NONE,
      changeOnPaperList: [{
        targetPath: 'lanes',
        value: {
          "label": "Pool",
          "sublanes": [{
              "label": "1",
              "sublanes": []
            },
            {
              "label": "2",
              "sublanes": []
            },
            {
              "label": "3",
              "sublanes": []
            }
          ]
        }
      }]
    },
    POOL2: {
      NAME: 'POOL2',
      LABEL: '풀',
      INIT_LABEL: '풀',
      CLICKED: CLICKED_ACTION.INSPECTOR,
      changeOnPaperList: [{
        targetPath: 'lanes',
        value: {
          "label": "Pool",
          "sublanes": [{
              "label": "1",
              "sublanes": []
            },
            {
              "label": "2",
              "sublanes": []
            },
            {
              "label": "3",
              "sublanes": []
            }
          ]
        }
      }]
    },
  };

  var defaultGraph = {
    'process-grid': {
      "type": "bpmn",
      "elemMaxSeq": 0,
      "cells": [{
        "type": "app.Pool",
        "size": {
          "width": 594,
          "height": 527
        },
        "custom": {
          "actName": "풀",
          "cellName": "SL",
          "actSeq": 1
        },
        "position": {
          "x": 0,
          "y": 0
        },
        "isRotated": false,
        "isMovable": false,
        "label": "풀",
        "z": 90,
        "lanes": {
          "label": "Pool",
          "sublanes": [{
            "label": "lane 1",
            "sublanes": []
          }, {
            "label": "lane 2",
            "sublanes": []
          }, {
            "label": "lane 3",
            "sublanes": []
          }, {
            "label": "lane 4",
            "sublanes": []
          }]
        }
      }]
    },
    default: {'type': 'bpmn','cells': [],'elemMaxSeq': 0}
  };

  var defaultData_link = {
    transSeq: 0,
    fromNodeSeq: 0,
    toNodeSeq: 0,
    subType: PROC_CONSTANT.ACTS_TYPE.TRANSITION,
    transName: '',
    transDesc: '',
    id: ''
  }

  var defaultData_elem = {
    actSeq: 0,
    actType: '',
    actName: '',
    actDesc: '',
    relatedActSeq: '',
    relatedProcId: '',
    id: '',
    isInitAct: false
  }

  return {
    CLICKED_ACTION: CLICKED_ACTION,
    CELL_TYPE: CELL_TYPE,
    UPDATE_TYPE: UPDATE_TYPE,
    defaultGraph: defaultGraph,
    defaultData_link: defaultData_link,
    defaultData_elem: defaultData_elem
  }
})();