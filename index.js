const scriptName = "test1";
const Jsoup = org.jsoup.Jsoup;
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  /*
   room : 메세지를 받은 방 이름
   메시지 내용
   전송자 닉네임단체/오픈채팅여부응답용객체
   
   
   */

  if (msg.indexOf("/") != -1) {
    if (msg.indexOf("/시세") != -1) {
      if (msg.length <= 4) {
        replier.reply("코인명 또는 코인 별칭을 입력해주세요...\nex1) /시세 BTT\nex2) /시세 비트토렌트");
      } else {
        var reqUrl = "https://api.upbit.com/v1/ticker?markets=";
        var reqCoinInfoUrl = "https://api.upbit.com/v1/market/all?isDetails=true";
        var reqUrl1 = "";
        var reqUrl2 = "";
        var reqUrl3 = reqUrl + "KRW-BTC";
        var checkMsg = /[a-zA-Z]/;
        var coinNameTmp = msg.substring(4, msg.length);
        var coinName = "";
        if (checkMsg.test(coinNameTmp)) {
          coinName = coinNameTmp;
          reqUrl1 = reqUrl + "KRW-" + msg.substring(4, msg.length);
          reqUrl2 = reqUrl + "BTC-" + msg.substring(4, msg.length);
        } else {
          try {
            var resCoinName = Jsoup.connect(reqCoinInfoUrl).ignoreContentType(true).get().text();
            var coinNameData = JSON.parse(resCoinName);
            for (var i = 0; i < coinNameData.length; i++) {
              if (coinNameData[i].korean_name == msg.substring(4, msg.length)) {
                coinName = coinNameData[i].market.substring(4, coinNameData[i].market.length);
                reqUrl1 = reqUrl + "KRW-" + coinName;
                reqUrl2 = reqUrl + "BTC-" + coinName;
                break;
              }
            }
          }          catch (e) {
  console.log(e);
}
        }
        /*
        var xhr = new XMLHttpRequest();
        xhr.open('GET', reqUrl);
        xhr.onload = () => {
          var data = xhr.response;
          replier.reply(data);
        };
        xhr.send();
        */

        var replyMsg = "";
        replyMsg += "(카톡)[" + msg.substring(4, msg.length) + "]";
        replyMsg += "\n-----KRW(단위 : 원)-----";
        try {
          var response1 = Jsoup.connect(reqUrl1).ignoreContentType(true).get().text();
          var coinData1 = JSON.parse(response1);
          if (coinData1[0].change == 'RISE') {
            replyMsg += "\n전일대비 상승중(굿)...";
          } else if (coinData1[0].change == 'FALL') {
            replyMsg += "\n전일대비 하락중(부르르)...";
          } else {
            replyMsg += "\n";
          }
          replyMsg += "" + "\n현재가 : " + coinData1[0].trade_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "\n당일고가 : " + coinData1[0].high_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "\n당일저가 : " + coinData1[0].low_price;
        }        catch (e) {
  replyMsg += "\nKRW Market에 존재하지 않는 코인";
}
        replyMsg += "\n-----BTC(단위 : 사토시(원))-----";
        try {
          var response2 = Jsoup.connect(reqUrl2).ignoreContentType(true).get().text();
          var coinData2 = JSON.parse(response2);
          var response3 = Jsoup.connect(reqUrl3).ignoreContentType(true).get().text();
          var coinData3 = JSON.parse(response3);
          if (coinData2[0].change == 'RISE') {
            replyMsg += "\n전일대비 상승중(굿)...";
          } else {
            replyMsg += "\n전일대비 하락중(부르르)...";
          }
          replyMsg += "" + "\n현재가 : " + Math.round(coinData2[0].trade_price * 100000000) + "(" + (coinData2[0].trade_price * coinData3[0].trade_price).toFixed(1) + ")" + "\n당일고가 : " + Math.round(coinData2[0].high_price * 100000000) + "(" + (coinData2[0].high_price * coinData3[0].trade_price).toFixed(1) + ")" + "\n당일저가  : " + Math.round(coinData2[0].low_price * 100000000) + "(" + (coinData2[0].low_price * coinData3[0].trade_price).toFixed(1) + ")";
        }        catch (e) {
  replyMsg += "\nBTC Market에 존재하지 않는 코인";
}
        replier.reply(replyMsg + "\n\n*시세 참고용도로만 사용해주세요*");
      }
    } else if (msg.indexOf("/가이드") != -1) {
      replier.reply("[dongqBot 가이드]\n1. /제작자 \n2./시세 [코인명]");
    } else if (msg.indexOf("/제작자") != -1) {
      replier.reply("dongqda@kakao.com");
    } else if (msg.indexOf("/유의종목") != -1) {
      var dangerCoinMsg = "[유의종목]";
      var dangerCoin = "";
      try {
        resCoinInfo = Jsoup.connect(reqCoinInfoUrl).ignoreContentType(true).get().text();
        var coinDangerData = JSON.parse(resCoinInfo);
        for (var forCDD = 0; forCDD < coinDangerData.length; forCDD++) {
          if (coinDangerData[i].market_warning != "NONE") {
            dangerCoin += "\n" + coinDangerData[i].korean_name;
          } else {
          }
        }
      }      catch (e) {
}
    }
    if (dangerCoin.length > 0) {
      replier.reply(dangerCoinMsg + dangerCoin);
    } else {
      replier.reply(dangerCoinMsg + "\n유의 종목이 존재하지 않습니다");
    }
  } else if ("일일점검 ") {
  }
}
function onCreate(savedInstanceState, activity) {
  //var textView = new android.widget.TextView(activity);
  //textView.setText("Hello, World!");
  //textView.setTextColor(&android.graphics.Color.DKGRAY);
  //activity.setContentView(textView);
}
function onStart(activity) {
}
function onResume(activity) {
}
function onPause(activity) {
}
function onStop(activity) {
}
;
