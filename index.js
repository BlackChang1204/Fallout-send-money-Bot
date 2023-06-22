const mineflayer = require('mineflayer') // 讀取mineflayer模塊
const tokens = require('prismarine-tokens-fixed') // 讀取微軟驗證緩存模塊
const config = require(`${process.cwd()}/config.json`) // 獲得config.json資料
const LoginOption = {
  host: config.ip, // 伺服器IP
  username: config.username, // 任意英文數字
  password: config.password, // 任意英文數字
  port: config.port, // 預設25565
  version: false, 
  auth: 'microsoft',
  tokensLocation: './bot_tokens.json',
  tokensDebug: true
};



tokens.use(LoginOption, function(_err, _opts){ // 驗證緩存 BOT登入伺服器
  if (_err) throw _err
  const bot = mineflayer.createBot(_opts)
  bot.on('login', (username, message) => {
    console.log(">>>>>>>>>>>>>>>>>>>> Bot is Online <<<<<<<<<<<<<<<<<<<<")
  })
  


  let GetMoneyPlayer = [] // 讓bot記住哪些玩家領過錢
  bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
    console.log(message)
    for (let i = 0; i < config.whitelist.length; i++) {


      if ((message === "[系統] " + config.whitelist[i] + " 想要傳送到 你 的位置") || (message === "[系統] " + config.whitelist[i] + " 想要你傳送到 該玩家 的位置")) { //接受白名單內的tp/tpahere請求
        bot.chat("/tpaccept")
      }


      if(message === "["+  config.whitelist[i] + " -> 您] bal") { // 讓bot取得/bank中的綠寶石數量
        balName = config.whitelist[i] //儲存發送bal給BOT的白名單ID 防止BOT將訊息發送給其他擁有權限的玩家
        sendMoneyMsg = true //判斷是否需要發送綠寶石數量
        bot.chat("/bal")
      }


      if (message[0] === "金" && sendMoneyMsg) {  // 讓bot回報bank中的綠寶石數量
          bot.chat("/m " + balName + " 擁有綠寶石數量:" + message.slice(4))
          sendMoneyMsg = false


      }


    
      let IDLength = config.whitelist[i].length
      if (message.slice(0, 12+IDLength) === "[" + config.whitelist[i] + " -> 您] cmd ") { // 讓BOT輸入訊息或指令
        bot.chat(message.slice(12+IDLength))
      }
    }



    
    
    let Status = true // BOT目前可不可pay給玩家
    if (" -> 您] " + config.money_password===message.slice(-7-config.money_password.length)) { // 偵測玩家是否私訊BOT正確的領取碼
      let PlayerName = ""
      for (let i = 1; i < message.length; i++) {
        if (message[i] === " ") {
          break
        }
        PlayerName += message[i]
      }


      
      let Give_or_no = true // 判斷玩家使否重複領取
      for (let i = 0; i <= GetMoneyPlayer.length; i++) {
        if (PlayerName === GetMoneyPlayer[i]) {
          Give_or_no = false
          break
        }
      } 


     
      if (Status === false) {
        bot.chat("/m " + PlayerName + " 由於太多玩家私訊領取 BOT忙線中 請幾秒後再嘗試")
        return
      } else if (Give_or_no && Status) { // 若玩家無重複領取 則pay給玩家
          console.log(Status)
          Status = false
          bot.chat("/pay " + PlayerName + " " + config.money)
          console.log(Status)
          
          for (let i = 0; i <= config.whitelist.length; i++) {
            setTimeout(function() {
            bot.chat("/m " + config.whitelist[i] + " " + PlayerName + " 已領取")
            }, 5000);
          }
          GetMoneyPlayer.push(PlayerName)
      }


        
      
  
    }
  })

});

