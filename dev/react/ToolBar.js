import React from 'react'
import {Input, message, Modal, Button} from 'antd'
import AddArticle from './AddArticle'
import EditTags from './editTags'
import ConfigItem from './Config'
import moment from 'moment'

class ToolBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: null,
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

  openConfig = () => {
    this.setState({
      modal: 'config'
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
    const hugoCli = window.localStorage.cliPath
    if (!hugoCli) {
      message.error('请先配置hugo命令行位置')
      return false
    }
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
    app.once('execCommandCallback', function (event, data) {
      _this.gen = false
      console.log(data)
      load()
      if (!data.err) {
        message.success('生成成功！')
      } else {
        message.error("生成失败，请确认hugo命令行位置配置正确")
      }
    })
    app.once('getSystemKeyCallback', (event, data) => {
      console.log(data)
      app.send('execCommand', {
        command: 'cd ' + _this.props.rootDir + ' && ' + hugoCli + ' -F --buildFuture',
        options: {
          cwd: _this.props.rootDir,
          env: null,
          windowsHide: false,
          maxBuffer: 200 * 1024
        },
        systemKey: data,
        callback: 'execCommandCallback'
      })
    })

    app.send('getSystemKey', {
      callback: 'getSystemKeyCallback'
    })
    let load = message.loading('正在部署中，请稍等……')
  }

  render() {
    return (<div className="tool-bar">
      <div className="tools">
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
        <span onClick={this.openConfig}>
          <i className="fa fa-cog" aria-hidden="true" title="生成静态文件"></i>
          <span>系统设置</span>
        </span>
      </div>
      <ConfigItem show={this.state.modal === 'config'}
                  closeModal={this.closeModal}
                  changeRootDir={this.props.changeRootDir}
      />
      <AddArticle ref="groupModal"
                  onOk={this.handleOk}
                  hexoRoot={this.props.rootDir}
                  show={this.state.modal === 'addA'}
                  closeModal={this.closeModal} modalName="新增文章"
                  tagsArr={this.state.tagsArr}
                  sortArr={this.state.sortArr}
                  keywordsArr={this.state.keywordsArr}
                  placeholder="文章标题" key="modal"/>
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