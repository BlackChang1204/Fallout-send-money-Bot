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
  


  let GetMoneyPlayer = [] // 查詢BOT身上的綠寶石數目
  bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
    console.log(message)
    if(message === "[BlackChangTW -> 您] bal") {
      bot.chat("/bal")
    }
    if (message[0] === "金") { 
      bot.chat("/m " + config.whitelist + " 擁有綠寶石數量:" + message.slice(4))
    }




    if (message==="[系統] " + config.whitelist + " 想要傳送到 你 的位置") { // tp/tpahere請求處理
      bot.chat('/tpaccept')}
    if (message==="[系統] " + config.whitelist + " 想要你傳送到 該玩家 的位置") {
      bot.chat('/tpaccept')}



    if (message.slice(0, 12+config.whitelist.length) === "[" + config.whitelist + " -> 您] cmd ") { // 讓BOT輸入訊息或指令
      bot.chat(message.slice(12+config.whitelist.length))}
    
    
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
          setTimeout(function() {
            bot.chat("/m " + config.whitelist + " " + PlayerName + " 已領取")
          }, 5000);
          Status = true
          GetMoneyPlayer.push(PlayerName)
          console.log(Status)
      }


        
      
  
    }
  })

});

