import React from "react"
import {Button, Input, message, Modal} from "antd"

class ConfigItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: this.props.modal,
      domain: window.localStorage.domain ? window.localStorage.domain : '',
      cliPath: window.localStorage.cliPath ? window.localStorage.cliPath : '',
      blogPath: window.localStorage.hexoRoot ? window.localStorage.hexoRoot : '',
      postPath: window.localStorage.postPath ? window.localStorage.postPath : '',
    }
    console.log(this.state)
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
      app.once('urlIsExistCallback', function (event, fileFlag) {
        console.log("=================判断是否为hugo目录=====================")
        if (fileFlag) {
          _this.setState({
            blogPath: hugoRoot
          })
        } else {
          message.error("请选择正确的hugo根目录！")
        }
      })
      app.send('urlIsExist', {
        url: `${hugoRoot}/content`,
        callback: 'urlIsExistCallback'
      })
    })
    app.send('getFilesUrl', {
      success: 'getFilesUrlCallback',
      type: 'dir'
    })

  }

  inputOnchange = (e, type) => {
    this.setState({
      [type]: e.target.value
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    //props - show产生改变时执行
    //当模态框加载完成时
    if (nextProps.show) {
      this.setState({
        domain: window.localStorage.domain || '',
        cliPath: window.localStorage.cliPath || '',
        blogPath: window.localStorage.hexoRoot || '',
        postPath: window.localStorage.postPath || ''
      })
    }
  }

  initHugoPath = (hugoRoot) => {
    const _this = this
    //如果hugo目录下没有blog.config.js文件，创建一个
    app.once('urlIsExistCallback', function (event, fileFlag2) {
      console.log("=================判断blog.config.js=====================")
      console.log(fileFlag2)
      if (!fileFlag2) {
        app.once('createFileCallback', function (event, data) {
          console.log(data)
          if (!data) {
            console.log("blog.config.js创建成功~")
          } else {
            message.error("blog.config.js创建失败，请前往hugo根目录手动创建blog.config.js!")
          }
          _this.props.changeRootDir(_this.state.blogPath)
        })
        app.send('createFile', {
          url: `${hugoRoot}/blog.config.js`,
          content: "",
          base64: false,
          callback: 'createFileCallback'
        })
      } else {
        _this.props.changeRootDir(_this.state.blogPath)
      }
    })
    app.send('urlIsExist', {
      url: `${hugoRoot}/blog.config.js`,
      callback: 'urlIsExistCallback'
    })
  }

  setConfig = () => {
    window.localStorage.domain = this.state.domain
    window.localStorage.cliPath = this.state.cliPath
    if (!this.state.blogPath) {
      message.error('请选择正确的博客目录！')
      return false
    }
    if (this.state.blogPath !== window.localStorage.hexoRoot) {
      window.localStorage.hexoRoot = this.state.blogPath
      this.initHugoPath(this.state.blogPath)
    }
    if(this.state.postPath !== window.localStorage.postPath){
      window.localStorage.postPath = this.state.postPath
      this.initHugoPath(this.state.blogPath)
    }
    message.success('设置已保存')
    this.props.closeModal()
  }

  closeModal = () => {
    this.props.closeModal()
  }

  render() {
    return (
      <Modal onOk={this.setConfig} key={'item-modal'}
             title="系统设置"
             visible={this.props.show}
             onCancel={this.closeModal}>
        <div>
          <span>博客路径:</span>
          <span>&nbsp;{this.state.blogPath ? this.state.blogPath : ''}&nbsp;</span>
          <Button type="default" onClick={this.chooseHexoRoot} size={'small'}>设置</Button>
        </div>
        <div>
          <span>文章目录:</span>
          <Input type="text" onChange={(e) => {
            this.inputOnchange(e, 'postPath')
          }} value={this.state.postPath}/>
        </div>
        <div>
          <span>配置域名:</span>
          <Input type="text" onChange={(e) => {
            this.inputOnchange(e, 'domain')
          }} value={this.state.domain}/>
        </div>
        <div>
          <span>hugo命令根目录:</span>
          <Input type="text" onChange={(e) => {
            this.inputOnchange(e, 'cliPath')
          }} value={this.state.cliPath}/>
        </div>
      </Modal>
    )
  }
}

export default ConfigItem