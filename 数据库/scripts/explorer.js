const list = document.querySelector('.output');
const path = document.getElementById('path');
const buttons = document.querySelectorAll('.titlebar button');
const foln = document.querySelector('.titlebar input')

const prv = document.getElementById('preview');
const clo = prv.querySelector('.close');
const view = prv.querySelector('.view');
const vietit = prv.querySelector('.t');
const prfuls = prv.querySelector('.fulsc');
const prb = prv.querySelectorAll("button")
const dnam = document.getElementById('dname')

const cmp = document.querySelector('.comprom');
const url = cmp.querySelector("input")
const cmb = cmp.querySelector("button")

const explorer = document.getElementById('explorer');
const unsaved = document.getElementById('uns');
let readpath, db = {
    type: 'database', data: {}
}
buttons[3].onclick = () => {
    const pathText = path.textContent;
    if (pathText == '根目录 > ') {
        return;
    }
    const indexes = pathText.split(' > ');
    path.textContent = ''
    for (let i = 0; i < indexes.length - 2; i++) {
        path.textContent += indexes[i] + ' > ';
    }
    let obj = db;
    for (let i = 1; i < indexes.length - 2; i++) {
        obj = obj.data[indexes[i]];
    }
    showlist(obj.data);
}
clo.onclick = () => prv.style.display = 'none';
prfuls.onclick = () => {
    if (prv.style.width == '100%') {
        prv.style.width = '300px';
        prfuls.innerHTML = '全屏编辑';
    } else {
        prv.style.width = '100%';
        prfuls.innerHTML = '取消全屏';
    }
}
function showlist(object) {
    list.innerHTML = '';
    if (object == db.data) {
        buttons[5].disabled = foln.disabled = true
    } else {
        buttons[5].disabled = foln.disabled = false;
    }
    buttons[5].onclick = () => {
        if (confirm('确定要删除吗？\n删除将不可恢复！')) {
            console.log(object);
            delete object;
            console.log(object);
            buttons[3].click()
        }
    }
    setCreation(object)
    for (const sub in object) {
        const div = document.createElement('div');
        const span = document.createElement('span')
        span.textContent = sub;
        const img = document.createElement('img')
        div.appendChild(img);
        div.appendChild(span);
        img.src = "./icons/" + object[sub].type + '.png';
        if (object[sub].type == 'dir') {
            div.onclick = () => {
                path.textContent += sub + ' > ';
                foln.value = sub
                foln.onchange = () => {
                    object[foln.value] = object[sub]
                    delete object[sub]
                    const dirs = path.textContent.split(' > ')
                    dirs[dirs.length - 2] = foln.value
                    path.textContent = ''
                    for (let i = 0; i < dirs.length - 1; i++) {
                        path.textContent += dirs[i] + ' > '
                    }
                    showlist(object[foln.value].data)
                }
                showlist(object[sub].data);
            }
        } else {
            div.onclick = () => preview(object, sub);
        }
        list.appendChild(div);
    }
}
function preview(subj, index) {
    view.innerHTML = '';
    prv.style.display = 'block';
    vietit.innerHTML = '编辑--' + index;
    const data = subj[index];
    prb[0].onclick = () => {
        if (confirm('确定要删除吗？\n删除将不可恢复！')) {
            delete subj[index];
            prv.style.display = 'none';
            showlist(subj);
            if (!unsaved.checked) unsaved.click()
        }
    }
    prb[1].onclick = () => changeContent(subj, index, data.type)
    dnam.value = index;
    dnam.onchange = () => {
        subj[dnam.value] = subj[index];
        delete subj[index];
        preview(subj, dnam.value);
        showlist(subj);
    }
    if (data.type == 'text') {
        const text = document.createElement('textarea');
        text.style.height = text.style.width = '100%';
        text.style.border = text.style.outline = text.style.resize = 'none';
        text.value = data.content;
        text.focus();
        text.oninput = () => {
            subj[index].content = text.value;
            if (!unsaved.checked) unsaved.click()
        }
        view.appendChild(text);
    } else if (data.type == 'image') {
        const img = document.createElement('img');
        img.src = data.content;
        img.style.maxWidth = '100%';
        view.appendChild(img);
    } else if (data.type == 'media') {
        const video = document.createElement('video');
        video.src = data.content;
        video.controls = true;
        video.style.maxWidth = '100%';
        view.appendChild(video);
    }else if (data.type=='storage') {
        const a=document.createElement("a")
        a.href=data.content
        a.download=index
        a.innerHTML="点我释放文件"
        view.appendChild(a)
    }
    readpath = path.textContent + index;
}
function changeContent(obj, index, type) {
    cmp.style.display = 'block'
    url.onchange = () => {
        obj[index].content = url.value
        cmp.style.display = 'none'
        preview(obj, index)
        if (!unsaved.checked) unsaved.click()
    }
    cmb.onclick = () => {
        const picker = document.createElement('input')
        picker.type = 'file'
        picker.onchange = () => {
            if (picker.files) {
                if (type == 'text') {
                    reader.readAsText(picker.files[0])
                } else {
                    reader.readAsDataURL(picker.files[0])
                }
            }
        }
        picker.click()
        const reader = new FileReader
        reader.onload = () => {
            obj[index].content = reader.result
            cmp.style.display = 'none'
            preview(obj, index)
            if (!unsaved.checked) unsaved.click()
        }
    }
}
unsaved.onchange = () => {
    if (unsaved.checked) {
        fn.style.color = 'red';
        if (fn.textContent=='未打开文件') {
            fn.textContent='未保存'
        }
    } else {
        fn.style.color = 'black';
    }
}
window.onresize = () => {
    explorer.style.width = (window.innerWidth - 29) + 'px';
    explorer.style.height = (window.innerHeight - 69) + 'px';
    if (window.innerWidth < 602) {
        explorer.style.top = '94px';
        explorer.style.height = (window.innerHeight - 94) + 'px';
    } else {
        explorer.style.top = '59px';
        explorer.style.height = (window.innerHeight - 59) + 'px';
    }
}
window.onresize()
window.onkeydown = e => {
    if (e.altKey) {
        if (e.keyCode == 37) {
            e.preventDefault();
            buttons[3].click();
        }
        if (e.keyCode == 78) {
            buttons[4].click()
        }
    }
    if (e.key == 'Backspace' && e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA' && e.target.contentEditable != 'true') {
        buttons[3].click();
    }
    if (e.ctrlKey) {
        if (e.key == 'o') {
            e.preventDefault();
            buttons[0].click();
        }
        if (e.key == 's') {
            e.preventDefault();
            buttons[1].click();
        }
        if (e.shiftKey) {
            if (e.key == 's') {
                e.preventDefault();
                buttons[2].click();
            }
        }
    }
}