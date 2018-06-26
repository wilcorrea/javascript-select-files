/**
 * @type {number}
 */
const APP_MAX_INPUT_FILE = 10 * 1024 * 1024

/**
 * @type {boolean}
 */
const APP_UNIT_SI = true

/**
 * @type {HTMLElement}
 * noinspection JSValidateTypes
 */
let $LOADER = null

/**
 * @type {HTMLElement}
 * noinspection JSValidateTypes
 */
let $PROGRESS = null

/**
 * Lida com o drop dos arquivos
 * @param {DragEvent} $event
 */
function dropHandler ($event) {
  let i

  // evita o comportamento padrão
  preventDefault($event)

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
 * @param {Event} $event
 */
function preventDefault ($event) {
  // evita o comportamento padrão
  $event.preventDefault()
}

/**
 * @param {boolean} visible
 */
function loader (visible) {
  if (!$LOADER) {
    $LOADER = document.getElementById('fileLoader')
  }
  $LOADER.style.display = visible ? 'block' : 'none'
}

/**
 * @param {Number} width
 */
function progress (width) {
  if (!$PROGRESS) {
    $PROGRESS = document.getElementById('fileProgress')
  }
  $PROGRESS.style.width = width + '%'
}

/**
 * Processa os arquivos que estão sendo manipulados
 * @param {Array} [files]
 */
function parseFiles (files) {
  loader(true)
  const parse = () => {
    const $fileInput = document.getElementById('fileInput')
    const accept = String($fileInput.accept).split(',')

    // se não tiver sido enviado por parâmetros o files é pego do input
    if (!files) {
      files = $fileInput.files
    }

    let count = files.length,
      list = [],
      data = [],
      bytes = 0
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
      if (!accept.includes(files[index].type)) {
        continue
      }

      // soma o total de bytes
      bytes = bytes + files[index].size

      // add o arquivo na lista de válidos
      list.push(files[index])
    }

    const total = list.length
    for (let index = 0; index < total; index++) {
      let file = list[index]
      // converte o arquivo para base64
      parseBase64(file, function (content) {
        data.push({
          name: file.name,
          content: content
        })

        // atualiza a barra de progresso
        progress((data.length / total) * 100)

        // se este for o último processado finaliza o processo
        if (data.length === total) {
          process(data, bytes)
        }
      })
    }

    if (!total) {
      loader(false)
    }

    // exibe as tr na table
    updateFileList(list)
  }
  window.setTimeout(parse, 1)
}

/**
 * Atualiza a lista no grid
 * @param {Array} files
 */
function updateFileList (files) {
  const map = file => {
    return '<tr class="">' +
      '<td><p class="name">' + file.name + '</p></td>' +
      '<td><p class="size text-right">' + human(file.size) + '</p></td>' +
      '</tr>'
  }
  document.getElementById('fileList').innerHTML = files.map(map).join('')
}

/**
 * Converte bytes em uma unidade mais amigável
 * @param {Number} bytes
 * @returns {string}
 */
function human (bytes) {
  const thresh = APP_UNIT_SI ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  const units = APP_UNIT_SI
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
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
 * @param {Number} bytes
 */
function process (data, bytes) {
  console.log('~> data ', data)

  if (bytes > APP_MAX_INPUT_FILE) {
    updateFileList([])
    loader(false)

    return window.alert('Você informou ' +
      '`' + human(bytes) + '` e o máximo de dados permitido é ' +
      '`' + human(APP_MAX_INPUT_FILE) + '`'
    )
  }

  try {
    ajaxRequest(MainForm.uniMemo1, 'evTeste', ['param1=' + JSON.stringify(data)])
    window.alert('Os ' + data.length + ' foram salvos com sucesso!')
  } catch (e) {
    window.alert(e.toString())
  } finally {
    loader(false)
  }
}
