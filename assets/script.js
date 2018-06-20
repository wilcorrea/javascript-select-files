/**
 * @param $event
 */
function dropHandler ($event) {
  let i

  // Prevent default behavior (Prevent file from being opened)
  $event.preventDefault()

  const files = []
  if ($event.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (i = 0; i < $event.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if ($event.dataTransfer.items[i].kind === 'file') {
        let file = $event.dataTransfer.items[i].getAsFile()
        files.push(file)
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (i = 0; i < $event.dataTransfer.files.length; i++) {
      let file = $event.dataTransfer.files[i]
      files.push(file)
    }
  }

  updateSize(files)

  // Pass event to removeDragData for cleanup
  removeDragData($event)
}

/**
 * @param $event
 */
function removeDragData ($event) {
  // console.log('Removing drag data')

  if ($event.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    $event.dataTransfer.items.clear()
    return
  }
  // Use DataTransfer interface to remove the drag data
  $event.dataTransfer.clearData()
}

/**
 * @param $event
 */
function dragOverHandler ($event) {
  // console.log('File(s) in drop zone')

  // Prevent default behavior (Prevent file from being opened)
  $event.preventDefault()
}

/**
 * @param files
 */
function updateSize (files) {
  if (!files) {
    files = document.getElementById('fileInput').files
  }

  let bytes = 0,
    count = files.length,
    list = [],
    data = []
  for (let index = 0; index < count; index++) {
    /*
    lastModified:1529182639895
    lastModifiedDate:Sat Jun 16 2018 17:57:19 GMT-0300 (-03) {}
    name:"file.png"
    size:44387
    type:"image/png"
    webkitRelativePath: ""
     */
    bytes += files[index].size
    let tr = '<tr class="">' +
      '      <td>' +
      '        <p class="name">' + files[index].name + '</p>' +
      '      </td>' +
      '      <td>' +
      '        <p class="size text-right">' + human(files[index].size) + '</p>' +
      '      </td>' +
      '    </tr>'
    list.push(tr)
    parseBase64(files[index], function (content) {
      data.push({
        name: files[index].name,
        content: content
      })
      if (data.length === count) {
        process(data)
      }
    })
  }

  document.getElementById('fileList').innerHTML = list.join('')
}

/**
 * @param bytes
 * @returns {string}
 */
function human (bytes) {
  let size = bytes + ' bytes'
  // optional code for multiples approximation
  const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let multiple = 0, approximation = bytes / 1024
  for (; approximation > 1; approximation /= 1024, multiple++) {
    size = approximation.toFixed(3) + ' ' + units[multiple]
  }
  return size
}

/**
 * @param {File} file
 * @param {Function} callback
 */
function parseBase64 (file, callback) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  // noinspection SpellCheckingInspection
  reader.onload = function () {
    callback(reader.result)
  }
  // noinspection SpellCheckingInspection
  reader.onerror = function (error) {
    console.error(error)
    callback(undefined)
  }
}

/**
 * @param data
 */
function process (data) {
  console.log('~> data ' , data)
  window.alert('Process ' + data.length + ' files!')
}
