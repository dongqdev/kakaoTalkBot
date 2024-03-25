const scriptName = "test";
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
 
function jsoupFnc(url){
  try {
    var response = Jsoup.connect(url).ignoreContentType(true).get().text();
    var resData = JSON.parse(response);
    return resData;
  } catch (e) {
    return ("JSOUP_ERROR\nurl : "+url+"ERROR_MSG : "+e);  
  }
}

//메세지 보내는 함수

 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  /*
    room : 방 이름
    msg : 메시지 내용
    sender : 전송자
    isGroupChat : 단체/오픈채팅여부
    imageDB : 프로필사진
    packageName : 몰라 보롬이가 채워 넣어바
  */

    
    
    function rp(arg){
      replier.reply(arg);
    }

  //코인관련 API URL
  //업비트 전체 코인이름
  var upbitCoinNameUrl = "https://api.upbit.com/v1/market/all?isDetails=true";
  //업비트 코인 시세(뒤쪽에 BTT를 붙여서 검색)
  var upbitKrwUrl = "https://api.upbit.com/v1/ticker?markets=KRW-";
  var upbitBtcUrl = "https://api.upbit.com/v1/ticker?markets=BTC-";
  var onlyBtcUrl = "https://api.upbit.com/v1/ticker?markets=KRW-BTC";
  //코인원(all 또는 심볼 가능)
  var coinOneUrl = "https://api.coinone.co.kr/ticker?currency=";
  //빗썸(all 또는 심볼 가능)
  var bitThumbUrl = "https://api.bithumb.com/public/ticker/";
  //바이낸스(allPrices 또는 심볼 가능)
  var binance = "https://api.binance.com/api/v1/ticker/coinSimbol";
  //코빗(btc_krw)
  var korbitUrl = "https://api.korbit.co.kr/v1/ticker?currency_pair=";
  //폴로닉스(현재 기준, 거래소 내 모든 화폐)
  var poloniexUrl = "https://poloniex.com/public?command=returnTicker";
  //코인마켓 캡(시총 순서대로 불러옴)
  var coinMarketCapUrl = "https://api.coinmarketcap.com/v1/ticker/?limit=100";    

  //메세지 내용
  var replyMsg = "";

  if (msg.indexOf("/") != -1) {
    if (msg.indexOf("/시세") != -1) {
      if (msg.length <= 4) {
        replier.reply("코인명 또는 코인 별칭을 입력해주세요...\nex1) /시세 BTT\nex2) /시세 비트토렌트");
      } else {
        
        var checkMsg = /[a-zA-Z]/;
        var coinNameTmp = msg.substring(4, msg.length);
        var coinName = "";
        
        //F1 : 한글로 입력하는 경우, 코인명을 심볼로 바꿔줌
        if (checkMsg.test(coinNameTmp)) {  //심볼을 입력한 경우
          coinName = coinNameTmp;
          upbitKrwUrl += coinName;
          upbitBtcUrl += coinName;
        } else {  //한글을 입력한 경우
          try {
            var coinNameData = jsoupFnc(upbitCoinNameUrl);
            for (var i = 0; i < coinNameData.length; i++) {
              if (coinNameData[i].korean_name == coinNameTmp) {  //API 데이터와 한글로 입력한 코인이 같은 값이면
                coinName = coinNameData[i].market.substring(4, coinNameData[i].market.length);
                upbitKrwUrl += coinName;
                upbitBtcUrl += coinName;
                break;
              }
            }
          } catch (e) {}
        }
        //F1
        
        replyMsg += "(카톡)[" + msg.substring(4, msg.length) + "]";
        replyMsg += "\n-----KRW(단위 : 원)-----";
        try {
          var upbitKrw = jsoupFnc(upbitKrwUrl);
          if (upbitKrw[0].change == 'RISE') {
            replyMsg += "\n전일대비 상승중(굿)...";
          } else if (upbitKrw[0].change == 'FALL') {
            replyMsg += "\n전일대비 하락중(부르르)...";
          } else {
            replyMsg += "\n";
          }
          replyMsg += "" 
          + "\n현재가 : " + upbitKrw[0].trade_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
          + "\n당일고가 : " + upbitKrw[0].high_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
          + "\n당일저가 : " + upbitKrw[0].low_price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } catch (e) {
          replyMsg += "\nKRW Market에 존재하지 않는 코인";
        }
        replyMsg += "\n-----BTC(단위 : 사토시(원))-----";
        try {
          var upbitBtc = jsoupFnc(upbitBtcUrl);
          var bitCoinKrw = jsoupFnc(onlyBtcUrl);
          if (upbitBtc[0].change == 'RISE') {
            replyMsg += "\n전일대비 상승중(굿)...";
          } else {
            replyMsg += "\n전일대비 하락중(부르르)...";
          }
          replyMsg += "" 
          + "\n현재가 : " + Math.round(upbitBtc[0].trade_price * 100000000) 
          + "(" + (upbitBtc[0].trade_price * bitCoinKrw[0].trade_price).toFixed(1) + ")" 
          + "\n당일고가 : " + Math.round(upbitBtc[0].high_price * 100000000) 
          + "(" + (upbitBtc[0].high_price * bitCoinKrw[0].trade_price).toFixed(1) + ")" 
          + "\n당일저가  : " + Math.round(upbitBtc[0].low_price * 100000000)   
          + "(" + (upbitBtc[0].low_price * bitCoinKrw[0].trade_price).toFixed(1) + ")";
        } catch (e) {
          replyMsg += "\nBTC Market에 존재하지 않는 코인";
        }
        replyMsg += "\n\n*시세 참고용도로만 사용해주세요\n*기능은 비정기적으로 업데이트 됩니다";
        rp(replyMsg);
      }
    } else if (msg.indexOf("/가이드") != -1) {
      replier.reply(""
      +"[dongqBot 가이드]"
      +"\n1. /제작자"
      +"\n2./시세 [코인명]");
    } else if (msg.indexOf("/제작자") != -1) {
      replier.reply("dongqda@kakao.com");
    } else if (msg.indexOf("/유의종목") != -1) {
      var dangerCoinMsg = "[유의종목]";
      var dangerCoin = "";
      try {
        var coinDangerData = jsoupFnc(upbitCoinNameUrl);
        for (var forCDD = 0; forCDD < coinDangerData.length; forCDD++) {
          if (coinDangerData[i].market_warning != "NONE") {
            dangerCoin += "\n" + coinDangerData[i].korean_name;
          }
        }
      } catch (e) {}
    
      if (dangerCoin.length > 0) {
        replier.reply(dangerCoinMsg + dangerCoin);
      } else {
        replier.reply(dangerCoinMsg + "\n유의 종목이 존재하지 않습니다");
      }
      
    } 
  }
}

function onCreate(savedInstanceState, activity) {
//var textView = new android.widget.TextView(activity);
//textView.setText("Hello, World!");
//textView.setTextColor(&android.graphics.Color.DKGRAY);
//activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}