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
            reject(data.message)
          }
        })
        app.send('loadFile', {
          callback: 'loadFileCallback',
          url: this.props.rootDir + '/blog.config.js'
        })
      } else {
        reject("请选择正确的hexo博客路径！")
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
    app.once('getFilesUrlCallback', (event, data) => {
      this.props.changeRootDir(data[0])
    })
    app.send('getFilesUrl', {
      callback: 'getFilesUrlCallback'
    })
  }

  handleOk = (data) => {
    let articleContent = `---\ntitle: ${data.value}\ncategories: ${data.currentSort}\ndate: ${moment().format("YYYY-MM-DD HH:mm:ss")}\ntags: [${data.currentTag}]\nkeywords: [${data.currentKeywords}]\n---\n\n\n<!-- more -->`
    app.once('createFileCallback', (event, data) => {
      if (data) {
        alert(data.message)
      } else {
        this.props.reloadArticleArr(this.props.rootDir)
      }
    })
    app.send('createFile', {
      url: this.props.rootDir + '/content/post/' + moment().format('YYYY-MM-DD') + '-' + data.value + '.md',
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
    if (this.gen) {
      return false
    }
    this.gen = true
    app.once('getSystemKeyCallback', (event, data) => {
      console.log(data)
      app.send('execCommand', {
        command: 'cd ' + this.props.rootDir + ' && /usr/local/bin/hugo',
        options: {
          cwd: this.props.rootDir,
          env: null,
          windowsHide: false,
          maxBuffer: 200 * 1024
        },
        systemKey: data,
        callback: 'execCommandCallback'
      })
    })
    app.once('execCommandCallback', function (event, data) {
      this.gen = false
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