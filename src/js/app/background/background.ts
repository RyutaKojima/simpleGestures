import {SendMessageParameter} from '../types/common';
import actionOpenOptionPage from './Action/open_option_page';
import MessageSender = chrome.runtime.MessageSender;
import {backgroundResponse} from '../types/backgroundResponse';
import {backgroundActions} from './backgroundActions';

let nextMenuSkip = false;

/**
 * フロントからのメッセージリクエストに対する処理
 */
const requestFunction = {
  executeAction(request: SendMessageParameter): backgroundResponse {
    const wasExecuted = backgroundActions(request.event, request.href);

    return {
      wasExecuted,
    };
  },
  nextMenuSkipGet(): backgroundResponse {
    return {
      nextMenuSkip,
    };
  },
  nextMenuSkipOff(): backgroundResponse {
    nextMenuSkip = false;
  },
  nextMenuSkipOn(): backgroundResponse {
    nextMenuSkip = true;
  },
};

/**
 * フロントサイドからのメッセージ受信した時に発生するイベント
 *
 * @param {type} param
 */
chrome.runtime.onMessage.addListener((
    request: SendMessageParameter,
    sender: MessageSender,
    sendResponse,
) => {
  const reqFunc = requestFunction[request.msg];

  if (typeof reqFunc === 'function') {
    sendResponse(reqFunc(request, sender));
  } else {
    sendResponse({message: 'unknown command'});
  }
});

/**
 * 拡張機能がインストール/アップデートされたときに発生するイベント
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    actionOpenOptionPage().then();
  }
});
