const TelegramBot = require('node-telegram-bot-api')

class TelegramService {
  constructor (telegramToken, chatId = null) {
    this.token = telegramToken
    this.chatId = chatId
    this.bot = new TelegramBot(this.token, { polling: true })

    this.bot.onText(/\/captura/, async (msg) => {
      const chatId = this.chatId || msg.chat.id
      console.log("captura")
      // const message = msg.text.replace('/captura','')
      // await this.screenshoot();
    });

    this.bot.on('message', async (msg) => {
      const chatId = this.chatId || msg.chat.id

      console.log(msg.txt)

      if (msg.photo) {
        
        await this.analyzeImage(msg, chatId)
      }
    })
  }

  async sendAdminMessage (message) {
    try {
      await this.bot.sendMessage(this.chatId, message)
      
    } catch (error) {
      console.error('Error al enviar el mensaje:', error)
    }
  }

  async sendMessage (chatId, message) {
    try {
      
      await this.bot.sendMessage(chatId, message)
    } catch (error) {
      console.error('Error al enviar el mensaje:', error)
    }
  }

  async analyzeImage (message, chatId) {
    const fileId = message.photo[message.photo.length - 1].file_id
    try {
      const fileUrl = await this.bot.getFileLink(fileId)
      console.log(fileUrl)
    } catch (error) {
      console.error('Error al obtener la imagen:', error)
    }
  }
}

module.exports = TelegramService