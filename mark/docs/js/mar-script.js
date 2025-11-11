// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 获取要加载的文档
const docFile = getUrlParameter('doc') || 'vilasr.md';
const docPath = `./docs/story/${docFile}`;

// 获取并渲染markdown文件
fetch(docPath)
    .then(response => {
        if (!response.ok) {
            throw new Error('文档未找到');
        }
        return response.text();
    })
    .then(text => {
        document.getElementById('markdown-content').innerHTML = marked.parse(text);
    })
    .catch(error => {
        document.getElementById('markdown-content').innerHTML = 
            `<h2>错误</h2><p>无法加载文档: ${error.message}</p><p>请确认文件是否存在: ${docPath}</p>`;
    });