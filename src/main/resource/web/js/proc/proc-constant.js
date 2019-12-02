var PROC_CONSTANT = (function () {
  var PROC_TYPE = {
    PROCESS: 'P',
    FOLDER: 'F'
  };
  var PROC_MNG_TYPE = {
    PROCESS: 'P',
    DOCUMENT: 'D'
  };
  var PROC_MAP_TYPE = {
    MAP: 'M',
    DOCUMENT: 'D'
  };
  // 상관도사용 : P, IO, F, IF, EF, T
  // 맵 : SL, P, A, EA, SP, G, T
  var ACTS_TYPE = {
//    START_EVENT:    'S',        // 시작 이벤트
//    END_EVENT:      'E',        // 종료 이벤트
    PROCESS:        'P',        // 프로세스
    SUB_PROC:       'SP',       // 서브프로세스
    ACTIVITY:       'A',        // 단위업무
    EXT_ACTIVITY:   'EA',       // 외부 단위업무
    INOUTPUT:       'IO',       // 입출력
    FOLER:          'F',        // 그룹 : GROUP
    IN_FOLER:       'IF',       // 내부 프로세스 영역 : IN_GROUP
    EXT_FOLER:      'EF',       // 외주 프로세스 : EXT_GROUP
    GATEWAY:        'G',        // 분기처리
//    ETC:            'ETC',      // 기타 도형
    POOL:           'SL',       // pool
    TRANSITION:     'T'         // transition 라인 
  };
  
  return {
    PROC_TYPE: PROC_TYPE,
    PROC_MNG_TYPE: PROC_MNG_TYPE,
    PROC_MAP_TYPE: PROC_MAP_TYPE,
    ACTS_TYPE: ACTS_TYPE
  }
})();