const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')
const LogService = require('./log-service.js')

class StreamRTSP {
  constructor(rtspUrl, outputDir= '/src/storage/shoots') {
    this.rtspUrl = process.env.RTSP_URL
    this.outputDir = path.join(global.__basedir, outputDir)
    this.logService = new LogService('snapshot_log.txt')

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
  
  async takeSnapshot() {
    const outputFilePath = path.join(this.outputDir, `snapshot_${Date.now()}.jpg`)
    const timestamp = new Date().toISOString()
    
    try{
      return new Promise((resolve,  reject) => {
        ffmpeg(this.rtspUrl)
          .outputOptions('-frames:v 1')
          .on('end', () => {
            const filename = outputFilePath;
            this.logService.logMessage({ timestamp, filename })
            resolve({success: true,  filename})
          })
          .on('error', (err) => {
            const filename = outputFilePath;
            this.logService.logMessage({ timestamp, filename, err })
            resolve({success: false,  filename: null})
          })
          .save(outputFilePath)
          
      })
    }catch(error){
      const filename = path.basename(outputFilePath);
      this.logService.logMessage({ timestamp, filename, error })
    }
  }
}

module.exports = StreamRTSP