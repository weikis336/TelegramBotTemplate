
const StreamRTSP = require('../services/stream-rtsp.js')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-snapshot', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-snapshot') {
      const data = JSON.parse(message)
      const streamRTSP = new StreamRTSP(process.env.RTSP_URL)
      const response =  await streamRTSP.takeSnapshot()

      console.log(response.filename, data.chatId)
      global.__telegramService.sendPhoto(data.chatId, `${response.filename}`)
    }
  })
}