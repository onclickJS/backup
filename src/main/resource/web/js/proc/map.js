/*! Rappid v2.3.1 - HTML5 Diagramming Framework

Copyright (c) 2015 client IO

 2018-05-08 


This Source Code Form is subject to the terms of the Rappid License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/

var App = window.App || {};

(function(_, joint) {

    'use strict';

    joint.setTheme('imez');

    App.MainView = joint.mvc.View.extend({

        className: 'app',
        mapType: 'process-grid', // process-grid: 프로세스 맵, mega: 상관도

        init: function() {
          this.initializePaper();
        },

        initializePaper: function() {

          var graph = this.graph = new joint.dia.Graph;

          var paper = this.paper = new joint.dia.Paper({
            width: 1,   // 넓게 잡으면 element 이동시 paper scroll 움직일 수 있음.
            height: 1,  // height 분할 단위로 쓰임.
            gridSize: 1,
            drawGrid: false,
            model: graph,
            defaultLink: new joint.shapes.bpmn.Flow,
            defaultConnectionPoint: joint.shapes.bpmn.Flow.connectionPoint,
            interactive: false
          });
//           var paperScroller = this.paperScroller = new joint.ui.PaperScroller({
//             autoResizePaper: true,
//             paper: paper,
//             cursor: 'grab',
//             padding: 0,
//           });

          this.$('.paper-container').append(paper.el);
//           this.$('.paper-container').append(paperScroller.el);
          // paperScroller.render().center();
        },
        drawFromJSON: function(modelerJson, mapType) {

          this.mapType = mapType;

          // json 데이터가 없을 경우, default json
          if (!modelerJson || !modelerJson.cells.length) {
            modelerJson = MODELER_CONSTANT.defaultGraph[this.mapType] || MODELER_CONSTANT.defaultGraph.default;
          }

          // json 으로 그림 그리는 부분
          this.graph.fromJSON(modelerJson);
//          this.adjustPaperScroller();

        },
        adjustPaperScroller: function() {

          if (this.mapType === 'process-grid') {

            // paper 영역이 pool 사이즈에 딱 맞게 변경
            this.paper.fitToContent({
//              padding: 0,
              gridWidth: 1,
              gridHeight: 1,
              padding: {
                // pool height 보다 1px 더 크게 paper 사이즈를 잡아야 bottom border 가 나옴
                bottom: 1
              },
              allowNewOrigin: 'any'
            });
            var point = new g.Point(0, 2);
            
            setTimeout(function () {
              // paper scroller 위치 지정
              // this.paperScroller.positionPoint(point, 0, 0);
            }.bind(this), 100);
            
          } else {

            // graph에 그려진 elements(네모), links(선) 모두 가져옴
            var cells = this.graph.getCells();

            if (cells.length > 0) {
              
              // paper 영역이 그림부분 사이즈에 딱 맞게 변경
              // graph 가 그려진 후의 paper 사이즈가 모델러보다 큰 경우 배율 조정
              // this.paperScroller.zoomToFit({padding: 30, maxScale: 1});

            } else {
              // cells 가 없는 빈 화면일 때, point 위치가 top-left에 오도록 조정
              var point = new g.Point(-20, -20, {  deep: true });
              // this.paperScroller.positionPoint(point, 0, 0);
            }
          }
        },
        getElementInOrder: function() {

          var elems = this.graph.getElements();
          var actsData = {};

          for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            if (elems[i].get('type') !== "app.Pool") {
              var index = elem.get('index');
              var elemData = elem.get('custom');
              actsData[index] = {
                actName: elemData.actName,
                actSeq: elemData.actSeq,
                actType: elemData.actType,
              };
            }
          }
          return actsData;
        },
        getImage: function(callbackFn) {
          this.paper.toJPEG(function (dataURL) {
            callbackFn(dataURL);
          });
        }

    });

})(_, joint);
