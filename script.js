function updateSize () {
  let bytes = 0,
    files = document.getElementById('uploadInput').files,
    count = files.length
  for (let index = 0; index < count; index++) {
    // console.log('~> index: ', files[index])
    /*
    lastModified:1529182639895
    lastModifiedDate:Sat Jun 16 2018 17:57:19 GMT-0300 (-03) {}
    name:"file.png"
    size:44387
    type:"image/png"
    webkitRelativePath: ""
     */
    bytes += files[index].size
  }

  let size = bytes + ' bytes'
  // optional code for multiples approximation
  const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let multiple = 0, approximation = bytes / 1024
  for (; approximation > 1; approximation /= 1024, multiple++) {
    size = approximation.toFixed(3) + ' ' + units[multiple] + ' (' + bytes + ' bytes)'
  }

  // end of optional code
  document.getElementById('fileCount').innerHTML = String(count)
  document.getElementById('fileSize').innerHTML = size
  document.getElementById('fileList').innerHTML = size
}
