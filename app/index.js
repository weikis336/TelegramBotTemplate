( async () => {

  global.__basedir = __dirname
  require('dotenv').config()

  const TelegramService = require('./src/services/telegram-service.js')
  const StreamRTSP = require('./src/services/stream-rtsp.js')

  const telegramService = new TelegramService(process.env.API_TG_BOT, process.env.CHAT_ID)
  const streamRTSP = new StreamRTSP(process.env.RTSP_URL)
  
  const result = await streamRTSP.takeSnapshot()
    
  if(result){
    telegramService.sendAdminMessage("Captura realizada")
  }
})()
