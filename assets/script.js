/**
 * Lida com o drop dos arquivos
 * @param {DragEvent} $event
 */
function dropHandler ($event) {
  let i

  // evita o comportamento padrão
  $event.preventDefault()

  const files = []
  // analisa os items do drop
  if ($event.dataTransfer.items) {
    for (i = 0; i < $event.dataTransfer.items.length; i++) {
      if ($event.dataTransfer.items[i].kind === 'file') {
        // recupera os itens como arquivos
        let file = $event.dataTransfer.items[i].getAsFile()
        files.push(file)
      }
    }
  } else {
    // trabalha com os arquivos diretamente no evento
    for (i = 0; i < $event.dataTransfer.files.length; i++) {
      let file = $event.dataTransfer.files[i]
      files.push(file)
    }
  }

  // processa os arquivos capturados
  parseFiles(files)

  // dá uma limpeza na área de transferência
  removeDragData($event)
}

/**
 * Limpa a área de transferência do evento
 * @param {DragEvent} $event
 */
function removeDragData ($event) {
  // console.log('Removing drag data')

  if ($event.dataTransfer.items) {
    // limpa os itens da área de transferência do evento
    $event.dataTransfer.items.clear()
    return
  }
  // limpa a área de transferência
  $event.dataTransfer.clearData()
}

/**
 * Evita o comportamento padrão do navegador
 * @param {DragEvent} $event
 */
function dragOverHandler ($event) {
  // console.log('File(s) in drop zone')

  // evita o comportamento padrão
  $event.preventDefault()
}

/**
 * Processa os arquivos que estão sendo manipulados
 * @param {Array} files
 */
function parseFiles (files) {
  // se não tiver sido enviado por parâmetros o files é pego do input
  if (!files) {
    files = document.getElementById('fileInput').files
  }

  let count = files.length,
    list = [],
    data = []
  // percorre o array de arquivos
  for (let index = 0; index < count; index++) {
    /*
    lastModified:1529182639895
    lastModifiedDate:Sat Jun 16 2018 17:57:19 GMT-0300 (-03) {}
    name:"file.png"
    size:44387
    type:"image/png"
    webkitRelativePath: ""
     */
    // concatena a tr para exibir na table
    let tr = '<tr class="">' +
      '      <td>' +
      '        <p class="name">' + files[index].name + '</p>' +
      '      </td>' +
      '      <td>' +
      '        <p class="size text-right">' + human(files[index].size) + '</p>' +
      '      </td>' +
      '    </tr>'
    list.push(tr)

    // converte o arquivo para base64
    parseBase64(files[index], function (content) {
      data.push({
        name: files[index].name,
        content: content
      })
      // se este for o último processado finaliza o processo
      if (data.length === count) {
        process(data)
      }
    })
  }

  // exibe as tr na table
  document.getElementById('fileList').innerHTML = list.join('')
}

/**
 * Converte bytes em uma unidade mais amigável
 * @param {int} bytes
 * @returns {string}
 */
function human (bytes) {
  let size = bytes + ' bytes'
  // notações comuns
  const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let multiple = 0, approximation = bytes / 1024
  // vai calculando os múltiplos até chegar na unidade mais adequada
  for (; approximation > 1; approximation /= 1024, multiple++) {
    size = approximation.toFixed(3) + ' ' + units[multiple]
  }
  return size
}

/**
 * Convert um arquivo em base64
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
 * Finaliza o processo
 * @param {Array} data
 */
function process (data) {
  console.log('~> data ' , data)
  window.alert('Process ' + data.length + ' files!')
}
