import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input, message} from 'antd'

const {confirm} = Modal
import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/monokai.css'
import 'codemirror/lib/codemirror.css'


const imgArr = ['png', 'jpg', 'gif', 'jpeg']

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: null
    }
  }

  componentDidMount = () => {
    console.log("============cm=============")
    console.log(this.props.content)
  }

  changeContent = (editor, data, value) => {
    this.props.changeContent(editor, data, value)
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps)
    console.log(this.props.name)
    return true
  }

  saveArticle = () => {
    if (this.saveFlag) {
      return message.warning('保存中……请不要重复保存～')
    }
    if (!this.props.name) {
      return message.warning('没有选择文件，不能保存')
    }
    this.saveFlag = true
    app.once('createFileCallback', (event, data) => {
      this.saveFlag = false
      if (!data) {
        message.success('保存成功')
      } else {
        message.error(data.message)
      }
    })
    app.send('createFile', {
      url: this.props.name,
      content: this.props.content,
      base64: false,
      callback: 'createFileCallback'
    })

  }

  closeModal = () => {
    this.setState({
      modal: null
    })
  }

  loadClipboardImg = () => {
    this.setState({
      modal: null
    })
    let _this = this
    console.log(this.state.clipboardImg)
    let reader = new FileReader()
    reader.onload = function (evt) {
      const fileName = Math.floor(Math.random() * 90000 + 10000) + +Date.now() + '.png'
      app.once('createFileCallback', (event, data) => {
        console.log(data)
        if (!data) {
          let url = `${window.localStorage.domain}/images/${_this.props.article}/${fileName}`
          _this.cm.replaceSelection(`![${fileName}](${url})\n`)
        } else {
          message.error("图片储存失败！")
        }
      })
      app.send('createFile', {
        url: _this.props.rootDir + '/static/images/' + _this.props.article + '/' + fileName,
        content: evt.target.result.replace(/^data:image\/\w+;base64,/, ""),
        base64: true,
        callback: 'createFileCallback'
      })
    }
    reader.readAsDataURL(this.state.clipboardImg)
  }

  chooseHexoRoot = () => {
    app.once('getFilesUrlCallback', (event, data) => {
      this.props.changeRootDir(data[0])
    })
    app.send('getFilesUrl', {
      callback: 'getFilesUrlCallback'
    })
  }

  insertCode() {
    this.cm.replaceSelection('```javascript\n\n```')
  }

  insertImage() {
    if (!window.localStorage.domain) {
      message.error("请先配置域名！")
      return false
    }
    app.once('getFilesUrlCallback', (event, data) => {
      if (data.length) {
        data.forEach((el, index) => {
          let name = el.split('.')
          let pos = name[name.length - 1]
          let fileName = +new Date() + index + '.' + pos
          pos = pos.toLowerCase()
          if (imgArr.indexOf(pos) !== -1) {
            console.log(el)
            app.once('copyFileCallback', (event, data) => {
              if (!data) {
                let url = `${window.localStorage.domain}/images/${this.props.article}/${el}`
                this.cm.replaceSelection(`![${el}](${url})\n`)
              } else {
                message.error(data.message)
              }
            })
            app.send('copyFile', {
              url: el,
              targetUrl: `${this.props.rootDir}/static/images/${this.props.article}/${fileName}`,
              overwirte: true,
              callback: 'copyFileCallback'
            })
          }
        })
      }
    })
    app.send('getFilesUrl', {
      callback: 'getFilesUrlCallback'
    })
  }

  deleteArticle() {
    let _this = this
    confirm({
      title: `你确定要删除这篇文章${_this.props.article}吗？`,
      content: `文章地址为${_this.props.name}`,
      onOk() {
        app.once('deleteFileCallback', (event, data) => {
          if(data){
            if (data.err) {
              message.error(`删除失败，如需要删除请手动前往${_this.props.name}删除`)
            }
          }else{
            message.success('删除成功')
          }
          _this.props.reloadArticleArr(_this.props.rootDir)
        })
        app.send('deleteFile', {
          url: _this.props.name,
          callback: 'deleteFileCallback'
        })
      },
      onCancel() {
      },
    })
  }

  // preview = () => {
  //   console.log(this.lock)
  //   if (this.lock) {
  //     return false
  //   }
  //   if (!this.state.prevPid) {
  //     this.lock = true
  //     const loading = message.loading('预览服务启动中……', 0)
  //     app.once('previewCallback', (event, data) => {
  //       console.log(data)
  //       loading()
  //       this.lock = false
  //       if (data.flag) {
  //         this.setState({
  //           prevPid: data.data
  //         })
  //         message.success(data.message)
  //       } else {
  //         message.error('预览失败')
  //       }
  //     })
  //     app.send('preview', {
  //       callback: 'previewCallback',
  //       url: this.props.rootDir
  //     })
  //   } else {
  //     this.lock = true
  //     app.send('cancel_preview', {})
  //     this.setState({
  //       prevPid: null
  //     }, () => {
  //       this.lock = false
  //     })
  //     message.success('取消预览成功！')
  //   }
  //
  // }

  render() {
    let _this = this
    return (<div className="editor-view">
      {
        this.props.rootDir ? <div>
          <CodeMirror
            width="100%"
            height="100%"
            value={this.props.content}
            onCopy={(editor, event) => {
              console.log('okok')
            }}
            editorDidMount={editor => {
              _this.cm = editor
            }}
            options={{
              mode: "markdown",
              theme: "monokai",
              lineWrapping: true
            }}
            ref="editor"
            onBeforeChange={(editor, data, value) => {
              this.changeContent(editor, data, value)
            }}
            onChange={(editor, data, value) => {
              // this.changeContent(editor, data, value)
            }}
            onKeyUp={(editor, event) => {
              this.saved = false
              if (window.os !== 'darwin') {
                if (event.ctrlKey && event.keyCode === 83) {
                  this.saveArticle()
                }
              }
            }}
            onKeyDown={(editor, event) => {
              if (event.metaKey && event.keyCode === 83) {
                if (this.saved) {
                  return false
                }
                this.saveArticle()
                this.saved = true
              }
            }}
            onPaste={(editor, e) => {
              e.preventDefault()
              let cbd = e.clipboardData
              let item = cbd.items[0]
              if (item.kind === "file") {
                if (!window.localStorage.domain) {
                  message.error("请先配置域名！")
                  return false
                }
                let blob = item.getAsFile()
                console.log(blob)
                if (!blob) {
                  return false
                }
                window.URL = window.URL || window.webkitURL
                let blobUrl = window.URL.createObjectURL(blob)
                this.setState({
                  modal: 'loadC',
                  clipboardImgUrl: blobUrl,
                  clipboardImg: blob
                })
              } else if (item.kind === "string") {
                editor.replaceSelection(cbd.getData('Text'))
              }
            }}
            onDrop={(editor, event) => {
              if (!window.localStorage.domain || !this.props.article) {
                message.error("请先配置域名或选择文章！")
                return false
              }
              console.log("=================drop==============")
              console.log(event.dataTransfer.files)
              event.preventDefault()
              let files = Array.from(event.dataTransfer.files)
              files.forEach((el, index) => {
                let name = el.name.split('.')
                let pos = name[name.length - 1]
                pos = pos.toLowerCase()
                if (imgArr.indexOf(pos) !== -1) {
                  console.log(el)
                  app.once('copyFileCallback', (event, data) => {
                    if (!data) {
                      let url = `${window.localStorage.domain}/images/${this.props.article}/${el.name}`
                      editor.replaceSelection(`![${el.name}](${url})\n`)
                    } else {
                      message.error(data.message)
                    }
                  })
                  app.send('copyFile', {
                    url: el.path,
                    targetUrl: `${this.props.rootDir}/static/images/${this.props.article}/${el.name}`,
                    overwirte: true,
                    callback: 'copyFileCallback'
                  })
                }
              })
            }}
          />
          <div className="editor-bar">
            <span onClick={this.saveArticle}>
              <i className="fa fa-floppy-o" aria-hidden="true"></i>
            </span>
            <span onClick={this.insertCode.bind(this)}>
              <i className="fa fa-code" aria-hidden="true"></i>
            </span>
            <span onClick={this.insertImage.bind(this)}>
              <i className="fa fa-picture-o" aria-hidden="true"></i>
            </span>
            <span onClick={this.deleteArticle.bind(this)}>
              <i className="fa fa-minus-circle" aria-hidden="true"></i>
            </span>
          </div>
        </div> : <div className="editor-pre-view">
          <Button icon="search" onClick={() => {
            this.chooseHexoRoot()
          }}>选择博客根目录</Button>
        </div>
      }

      <Modal onOk={this.loadClipboardImg}
             title="插入图片"
             visible={this.state.modal === 'loadC'}
             onCancel={this.closeModal}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <img src={this.state.clipboardImgUrl} alt="" style={{maxWidth: '100%', maxHeight: '300px'}}/>
        </div>
      </Modal>
    </div>)
  }
}

export default Editor