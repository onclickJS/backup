var WORK_ACTION = {
  MODIFY: 'Modify', // 작성
  SAVE: 'Save', // 저장
  DELETE: 'Delete', // 삭제
  IMMEDIATE_PUBLISH: 'ImmediatePublish', // 즉시공개
  MODIFY_REQUEST: 'ModifyRequest', // 작성요청
  REVIEW_REQUEST: 'ReviewRequest', // 검토 요청
  REVIEW_COMPLETE: 'ReviewComplete', // 검토 완료
  CANCEL: 'Cancel', // 검토 요청 취소
  APPROVE_REQUEST: 'ApproveRequest', // 승인요청
  APPROVE: 'Approve', // 승인
  REJECT: 'Reject', // 반려
  REVISION: 'Revision', // 개정
  REMODIFY: 'ReModify', // 재작성
  PUBLISH: 'Publish', // 공개
  CIRCULATION_REQUEST: 'CirculationRequest', // 회람요청
  CIRCULATION_COMPLETE: 'CirculationComplete' // 회람완료
};

var APPROVAL_AUTH = {
  MODIFIER: 'M',
  REVIEWER: 'R',
  APPROVER: 'A'
};

function getWorkRequestCompleteUsers(info) {
  var approvalWorkRequest = info.approvalWorkRequest;
  info.modifier = {
    userType: 'U',
    userName: info.modifierName,
    userId: info.modifier
  };
  info.revewers = [];
  info.approver = null;

  if (info.immediatePublishFlag && info.immediatePublishFlag == 'Y') {
    // return 작성자만
    return;
  }

  var reviewItems = getLastReviews(approvalWorkRequest);
  var approveItems = _sortByWorkSeqDesc(_getCompleteItems(approvalWorkRequest,
          APPROVAL_AUTH.APPROVER, WORK_ACTION.APPROVE));

  var getUserInfo = function(item) {
    if (!item) { return null; }
    return {
      userType: 'U',
      userName: item.workerName,
      userId: item.worker
    };
  }

  reviewItems.forEach(function(reviewer) {
    info.revewers.push(getUserInfo(reviewer));
  });

  info.approver = getUserInfo(approveItems[0]);
}

function getLastReviews(approvalWorkRequest) {
  var workItems = approvalWorkRequest.workItems;
  var descWorkItems = _sortByWorkSeqDesc(workItems);

  var revewerList = [];
  var pre;

  descWorkItems.forEach(function(workItem) {
    if (workItem.workItemState == 'C') {
      if (workItem.prtcpAuth == APPROVAL_AUTH.APPROVER
              && workItem.workAction == WORK_ACTION.APPROVE) {
        pre = workItem;
      }
      if (workItem.prtcpAuth == APPROVAL_AUTH.MODIFIER
              && workItem.workAction == WORK_ACTION.REVIEW_REQUEST) {
        pre = null;
        return;
      }
      if (pre && workItem.prtcpAuth == APPROVAL_AUTH.REVIEWER
              && workItem.workAction == WORK_ACTION.REVIEW_COMPLETE) {
        revewerList.push(workItem);
      }
    }
  });

  return _sortByWorkSeqAsc(revewerList);
}

function _getCompleteItems(approvalWorkRequest, auth, workAction) {
  if (!approvalWorkRequest) { return; }
  if (!approvalWorkRequest.workItems
          || approvalWorkRequest.workItems.length == 0) { return; }
  var findItems = approvalWorkRequest.workItems.filter(function(item) {
    return item.prtcpAuth == auth && item.workAction == workAction;
  });
  return findItems;
}

function _sortByWorkSeqDesc(arr, arrange) {
  return arr.sort(function(a, b) {
    return b.workSeq - a.workSeq;
  });
}