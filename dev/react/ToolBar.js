import React from 'react'
import {Input, message, Modal} from 'antd'
import AddArticle from './AddArticle'
import EditTags from './editTags'
import moment from 'moment'

class ToolBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: null,
      domain: window.localStorage.domain ? window.localStorage.domain : '',
      sortArr: [],
      tagsArr: [],
      keywordsArr: []
    }
  }

  loadTags = () => {
    return new Promise((resolve, reject) => {
      if (this.props.rootDir) {
        app.once('loadFileCallback', (event, data) => {
          if (!data.err) {
            resolve(data.toString())
          } else {
            reject(("找不到blog.config.js文件,请重新选择hugo根目录，或者手动前往hugo根目录创建！"))
          }
        })
        app.send('loadFile', {
          callback: 'loadFileCallback',
          url: this.props.rootDir + '/blog.config.js'
        })
      } else {
        reject("请选择正确的hugo博客路径！")
      }
    })

  }

  addArticle = async () => {
    let tagsArr = []
    let sortArr = []
    let keywordsArr = []
    let data
    try {
      data = await this.loadTags()
    } catch (err) {
      return message.error(err)
    }
    if (data) {
      try {
        let result = JSON.parse(data)
        sortArr = result.categories
        tagsArr = result.tags
        keywordsArr = result.keywords
        this.setState({
          sortArr: sortArr,
          tagsArr: tagsArr,
          keywordsArr: keywordsArr,
          modal: 'addA'
        })
      } catch (err) {
        console.log(err)
        message.error("数据解析错误")
      }
    } else {
      message.warning("未发现标签，请先编辑标签")
      this.setState({
        sortArr: sortArr,
        tagsArr: tagsArr,
        keywordsArr: keywordsArr,
        modal: 'addA'
      })
    }
  }

  chooseHexoRoot = () => {
    //获取选择的文件地址
    const _this = this
    app.removeAllListeners('getFilesUrlCallback')
    app.once('getFilesUrlCallback', (event, filesUrl) => {
      // this.props.changeRootDir(filesUrl[0])
      console.log("=================hugo=====================")
      let hugoRoot = filesUrl[0]
      //判断选择的文件地址是否为hugo目录
      app.once('urlIsExistCallback', function(event, fileFlag) {
        console.log("=================判断是否为hugo目录=====================")
        if(fileFlag){
          //如果hugo目录下没有blog.config.js文件，创建一个
          app.once('urlIsExistCallback', function(event, fileFlag2) {
            console.log("=================判断blog.config.js=====================")
            console.log(fileFlag2)
            if(!fileFlag2){
              app.once('createFileCallback', function(event, data) {
                console.log(data)
                if(!data){
                  console.log("blog.config.js创建成功~")
                  _this.props.changeRootDir(hugoRoot)
                }else{
                  message.error("blog.config.js创建失败，请前往hugo根目录手动创建blog.config.js!")
                }
              })
              app.send('createFile', {
                url: `${hugoRoot}/blog.config.js`,
                content: "",
                base64: false,
                callback: 'createFileCallback'
              })
            }else{
              _this.props.changeRootDir(hugoRoot)
            }
          })
          app.send('urlIsExist', {
            url: `${hugoRoot}/blog.config.js`,
            callback: 'urlIsExistCallback'
          })
        }else{
          message.error("请选择正确的hugo根目录！")
        }
      })
      app.send('urlIsExist', {
        url: `${hugoRoot}/content/post`,
        callback: 'urlIsExistCallback'
      })
    })
    app.send('getFilesUrl', {
      success: 'getFilesUrlCallback',
      type:'dir'
    })

  }

  handleOk = (data) => {
    let articleContent = `---\ntitle: ${data.value}\ncategories: \n - ${data.currentSort}\ndate: ${moment().format("YYYY-MM-DD HH:mm:ss")}\ntags: [${data.currentTag}]\nkeywords: [${data.currentKeywords}]\n---\n\n\n<!-- more -->`
    let articleName = moment().format('YYYY-MM-DD') + '-' + data.value + '.md'
    app.once('createFileCallback', (event, data) => {
      if (data) {
        alert(data.message)
      } else {
        this.props.reloadArticleArr(this.props.rootDir, articleName)
      }
    })
    app.send('createFile', {
      url: this.props.rootDir + '/content/post/' + articleName,
      content: articleContent,
      base64: false,
      callback: 'createFileCallback'
    })
    this.setState({
      modal: null
    })
  }

  closeModal = () => {
    this.setState({
      modal: null
    })
  }

  domainConfig = () => {
    this.setState({
      modal: 'addD'
    })
  }


  setDomain = () => {
    window.localStorage.domain = this.state.domain
    this.setState({
      modal: null
    })
  }

  domainChange = (e) => {
    this.setState({
      domain: e.target.value
    })
  }

  editTags = async () => {
    let tagsArr = []
    let sortArr = []
    let keywordsArr = []
    let data
    try {
      data = await this.loadTags()
    } catch (err) {
      return message.error(err)
    }
    if (data) {
      try {
        let result = JSON.parse(data)
        sortArr = result.categories
        tagsArr = result.tags
        keywordsArr = result.keywords
        this.setState({
          sortArr: sortArr,
          tagsArr: tagsArr,
          keywordsArr: keywordsArr,
          modal: 'editT'
        })
      } catch (err) {
        console.log(err)
        message.error("数据解析错误")
      }
    } else {
      message.warning("未发现标签，请先编辑标签")
      this.setState({
        sortArr: sortArr,
        tagsArr: tagsArr,
        keywordsArr: keywordsArr,
        modal: 'editT'
      })
    }
  }

  changeArr = (type, data) => {
    switch (type) {
      case 'sortArr':
        this.setState({
          sortArr: data
        })
        break
      case 'tagsArr':
        this.setState({
          tagsArr: data
        })
        break
      case 'keywordsArr':
        this.setState({
          keywordsArr: data
        })
        break
      default:
        break
    }
    this.setState({
      type: data
    })
  }

  generator = () => {
    console.log(this.gen)
    const _this = this
    if (this.gen) {
      message.error('操作过于频繁！')
      return false
    }
    if (!_this.props.rootDir) {
      message.error('请选择正确的hugo博客路径')
      this.gen = true
      return false
    }
    this.gen = true
    app.once('getSystemKeyCallback', (event, data) => {
      console.log(data)
      if(window.os === "win32"){
        app.send('execCommand', {
          command: 'cd ' + _this.props.rootDir + ' && hugo -F --buildFuture',
          options: {
            cwd: _this.props.rootDir,
            env: null,
            windowsHide: false,
            maxBuffer: 200 * 1024
          },
          systemKey: data,
          callback: 'execCommandCallback'
        })
      }else{
        app.send('execCommand', {
          command: 'cd ' + _this.props.rootDir + ' && /usr/local/bin/hugo -F --buildFuture',
          options: {
            cwd: _this.props.rootDir,
            env: null,
            windowsHide: false,
            maxBuffer: 200 * 1024
          },
          systemKey: data,
          callback: 'execCommandCallback'
        })
      }
    })
    app.once('execCommandCallback', function (event, data) {
      _this.gen = false
      console.log(data)
      load()
      if (!data.err) {
        message.success('生成成功！')
      } else {
        message.error(data.message)
      }
    })
    app.send('getSystemKey', {
      callback: 'getSystemKeyCallback'
    })
    let load = message.loading('正在部署中，请稍等……')
  }

  render() {
    return (<div className="tool-bar">
      <div className="tools">
        <span onClick={this.chooseHexoRoot}>
          <i className="fa fa-folder-open-o" aria-hidden="true"></i>
          <span>博客路径</span>
        </span>
        <span onClick={this.domainConfig}>
        <i className="fa fa-link" aria-hidden="true"></i>
        <span>配置域名</span>
        </span>
        <span onClick={this.addArticle}>
          <i className="fa fa-plus" aria-hidden="true" title="新建文章"></i>
          <span>新建文章</span>
        </span>
        <span onClick={this.editTags}>
          <i className="fa fa-tags" aria-hidden="true" title="标签管理"></i>
          <span>标签管理</span>
        </span>
        <span onClick={this.generator}>
          <i className="fa fa-cloud-upload" aria-hidden="true" title="生成静态文件"></i>
          <span>生成静态文件</span>
        </span>
      </div>
      <span title={this.props.rootDir ? this.props.rootDir : null} style={{
        maxWidth: '400px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        当前博客路径：{this.props.rootDir ? this.props.rootDir : null}
      </span>
      <AddArticle ref="groupModal"
                  onOk={this.handleOk}
                  hexoRoot={this.props.rootDir}
                  show={this.state.modal === 'addA'}
                  closeModal={this.closeModal} modalName="新增文章"
                  tagsArr={this.state.tagsArr}
                  sortArr={this.state.sortArr}
                  keywordsArr={this.state.keywordsArr}
                  placeholder="文章标题" key="modal"/>
      <Modal onOk={this.setDomain}
             title="配置域名"
             visible={this.state.modal === 'addD'}
             onCancel={this.closeModal}>
        <Input type="text" onChange={this.domainChange} value={this.state.domain}/>
      </Modal>
      <EditTags hexoRoot={this.props.rootDir}
                show={this.state.modal === 'editT'}
                closeModal={this.closeModal} modalName="编辑标签"
                tagsArr={this.state.tagsArr}
                sortArr={this.state.sortArr}
                keywordsArr={this.state.keywordsArr}
                changeArr={this.changeArr}
                key="tags_modal"/>
    </div>)
  }
}

export default ToolBar