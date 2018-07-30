const { exec } = require('child_process');

export default (fileInput, fileOutput) => {
  return new Promise((resolve, reject) => {
    exec(`python ${__dirname}/morphology_viewer.py ${fileInput} ${fileOutput}`, error => {
      if (error) {
        return reject(error);
      }
      // For some reason, this is returning before completion
      return resolve()
    });
  })
}
