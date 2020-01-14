const qiniu = require('qiniu')
const QiniuManager = require('./src/utils/QiniuManager')
const path = require('path')


var accessKey = 'hoFpxX2IdHXjDc7jVSDRYrMPJsV0xk1QqH288R6J'
var secretKey = 'ZW4RDTOITtv4G1dqoF5lRcXzUx4ZN3XeUEGNteZ4'
var localFile = "/Users/yanqiang/Documents/md/test1.md"
var key='test.md'
const downloadPath = path.join(__dirname, key)

const manager = new QiniuManager(accessKey, secretKey, 'electron-notes')
// manager.uploadFile(key, localFile).then(data => {
//   console.log('上传成功', data)
//   return manager.deleteFile(key)
// }).then(data => {
//   console.log('删除成功', data)
// })

// manager.uploadFile(key, localFile).then(data => {
//   console.log('上传成功', data)
// })
// manager.getBuckteDomain().then(data => {
//   console.log(data)
// })
// manager.generateDownloadLink(key).then(data => {
//   console.log(data)
//   return manager.generateDownloadLink('first.md')
// }).then(data => {
//   console.log(data)
// })
// manager.deleteFile(key)

// manager.downLoadFile(key, downloadPath).then(() => {
//   console.log('下载文件成功！')
// }).catch(err => {
//   console.log('下载出错', err)
// })


// var bucketManager = new qiniu.rs.BucketManager(mac, config);

// // 公开空间访问链接
// var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
// console.log(publicDownloadUrl);
