const reader = new FileReader
const fn = document.querySelector('.filename span')
const bgdrag = document.getElementById('bgdrag')
let handles = [], fs = true

const options = {
    types: [{
        description: 'index数据库文件',
        accept: { 'application/json': ['.indb', '.json'] }
    }],
    excludeAcceptAllOption: true,
    multiple: false
}
reader.onload = () => {
    db.type = null
    try {
        db = JSON.parse(reader.result)
    } catch (error) {
        alert('不是数据库文件')
        return
    }
    if (db.type != 'database' || !db.data) {
        alert('不是数据库文件')
        return
    }
    showlist(db.data)
    window.onresize()
}
if (!('showOpenFilePicker' in window)) {
    fs = false
    buttons[1].style.display = 'none'
}
buttons[0].onclick = async () => {
    if (unsaved.checked) {
        if (confirm('是否保存后再打开新文件？\n一个窗口只能打开一个文件，不保存将丢失所作的修改\n点击确定保存文件，点击取消继续打开')) {
            buttons[1].click()
        }
    }
    if (fs) {
        const [handle] = await showOpenFilePicker(options)
        const file = await handle.getFile()
        reader.readAsText(file)
        fn.textContent = file.name
        handles.push(handle)
    } else {
        const oldsel = document.createElement('input')
        oldsel.type = 'file'
        oldsel.accept = '.json,.indb'
        oldsel.onchange = () => {
            const file = oldsel.files[0]
            reader.readAsText(file)
            fn.textContent = file.name
        }
        oldsel.click()
    }
    if (unsaved.checked) unsaved.click()
}
buttons[1].onclick = async () => {
    if (handles.length == 0) buttons[2].onclick()
    const handle = handles[0]
    const wb = await handle.createWritable()
    await wb.write(JSON.stringify(db))
    await wb.close()
    if (unsaved.checked) unsaved.click()
}
buttons[2].onclick = async () => {
    if (fs) {
        const handle = await showSaveFilePicker(options)
        const wb = await handle.createWritable()
        await wb.write(JSON.stringify(db))
        await wb.close()
        fn.textContent = handle.name
        handles.push(handle)
        if (unsaved.checked) unsaved.click()
    } else {
        const link = document.createElement('a')
        link.href = 'data:application/json,' + JSON.stringify(db)
        link.download = 'db.json'
        link.click()
    }
}

explorer.addEventListener('dragenter', event => {
    event.preventDefault()
    bgdrag.style.display = 'block'
})
explorer.addEventListener('dragover', async event => {
    event.preventDefault()
})
explorer.addEventListener('drop', async event => {
    event.preventDefault()
    if (fs) {
        if (unsaved.checked) {
            if (confirm('是否保存后再打开新文件？\n一个窗口只能打开一个文件，不保存将丢失所作的修改\n点击确定保存文件，点击取消继续打开')) {
                buttons[1].click()
                bgdrag.style.display = 'none'
            }
        }
        const draghandle = await event.dataTransfer.items[0].getAsFileSystemHandle()
        const file = await draghandle.getFile()
        reader.readAsText(file)
        fn.textContent = file.name
        handles.push(draghandle)
    } else {
        const file = event.dataTransfer.items[0].getAsFile()
        reader.readAsText(file)
        fn.textContent = file.name
    }
    bgdrag.style.display = 'none'
})
explorer.addEventListener('dragleave', () => {
    bgdrag.style.display = 'none'
})