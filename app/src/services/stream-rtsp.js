const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

class StreamRTSP {
  constructor(rtspUrl, outputDir= '/src/storage/shoots') {
    this.rtspUrl = rtspUrl
    this.outputDir = path.join(global.__basedir, outputDir)

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
  
  async takeSnapshot() {
    const outputFilePath = path.join(this.outputDir, `snapshot_${Date.now()}.jpg`)

    return new Promise((resolve, reject) => {
      ffmpeg(this.rtspUrl)
        .outputOptions('-frames:v 1')
        .on('end', () => {
            console.log('Snapshot taken:', outputFilePath);
            resolve(true)
        })
        .on('error', (err) => {
            console.error('Error taking snapshot:', err);
            resolve(false)
        })
        .save(outputFilePath)
    })
  }
}

module.exports = StreamRTSP