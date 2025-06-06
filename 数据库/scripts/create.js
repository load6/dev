const shadow = document.getElementById('shadow')
const box = document.getElementById('create')
const cre_clo = box.querySelector('.clo')
const select = box.querySelector('select')
const inputs_box = box.querySelectorAll('input')

const datas = []
const namelist = []
const gen = {}
buttons[4].onclick = () => {
    shadow.style.display = 'block'
    box.style.display = 'block'
    inputs_box[0].value = ''
}
function setCreation(obj) {
    inputs_box[0].onkeydown = e => {
        if (e.keyCode == 13) {
            if (obj[inputs_box[0].value]) {
                alert("存在同名项，请先删除或者返回修改。")
                return
            }
            if (select.value == 'dir') {
                obj[inputs_box[0].value] = {
                    type: select.value,
                    data: {}
                }
            } else {
                obj[inputs_box[0].value] = { type: select.value, content: inputs_box[2].value }
            }
            cre_clo.click()
            showlist(obj)
            if (!unsaved.checked) unsaved.click()
        }
    }
    let data = false
    inputs_box[1].onclick = e => {
        switch (select.value) {
            case 'dir':
                e.preventDefault()
                alert('不能将文件转化为存储库')
                return
            case 'image':
                data = true
                inputs_box[1].accept = 'image/*'
                break
            case 'media':
                data = true
                inputs_box[1].accept = 'video/*,audio/*'
                break
            case 'text':
                data = false
                inputs_box[1].accept = 'text/*'
                break
            default:
                inputs_box[1].accept = '*'
                break
        }
    }
    inputs_box[1].onchange = async () => {
        datas.length = 0
        const files = inputs_box[1].files
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const reader = new FileReader
            reader.onload = () => {
                datas.push(reader.result)
                namelist.push(file.name)
            }
            reader.readAsDataURL(file)
        }
        cre_clo.click()
        setTimeout(() => {
            for (let i = 0; i < datas.length; i++) {
                inputs_box[2].value = datas[i];
                inputs_box[0].value = namelist[i]
                inputs_box[0].onkeydown({ keyCode: 13 })
            }
        }, 500)
        inputs_box[2].value = ''
        inputs_box[0].value=''
        if (!unsaved.checked) unsaved.click()
    }
}
cre_clo.onclick = () => {
    box.style.display = 'none'
    shadow.style.display = 'none'
}

showlist(db.data)