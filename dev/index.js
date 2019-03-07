import React from 'react'
import ReactDOM from 'react-dom'
import {message} from 'antd'
import ArticleList from './react/ArticleList'
import Editor from './react/Editor'
import ToolBar from "./react/ToolBar"

import './css/style.css'

class Main extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      current: null,
      content: '',
      hexoRoot: window.localStorage.hexoRoot,
      articleArr: null
    }
  }

  componentDidMount() {
    app.once('getSystemCodeCallback', function(event, data) {
      window.os = data
    })
    app.send('getSystemCode', {
      callback: 'getSystemCodeCallback'
    })
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 123) {
        app.send('addWebviewDevTools', {
          id: 'mainWebview'
        })
      }
    })
  }

  changeArticleArr = (hexoRoot) => {
    console.log("================change================")
    if (!hexoRoot) {
      message.error("请选择hexo博客路径！")
      return false
    }
    app.once('getFolderCallback', (event, data) => {
      console.log("---okokkok---")
      if (!data.err) {
        console.log(data)
        const articleArr = []
        for (let i = 0; i < data.length; i++) {
          let fileNameArr = data[i].split('.')
          if (fileNameArr[fileNameArr.length - 1] === 'md') {
            articleArr.push({
              path: hexoRoot + '/content/post/' + data[i],
              fileName:data[i],
            })
          }
        }
        this.setState({
          articleArr: articleArr
        })
      } else {
        message.error("请选择正确的hexo博客路径！")
        this.setState({
          hexoRoot: '',
          articleArr: null
        })
      }
    })
    app.send('getFolder', {
      callback: 'getFolderCallback',
      url: hexoRoot + '/content/post'
    })
  }

  changeCurrentArticle = (article, name) => {
    console.log("===============文章名称================")
    console.log(name)
    app.once('loadFileCallback', (event, data) => {
      if(!data.err){
        this.setState({
          current: article,
          currentName: name,
          content: data.toString()
        })
      }else{
        console.log(data)
      }
    })
    app.send('loadFile', {
      url: article,
      callback: 'loadFileCallback'
    })
  }

  changeRootDir = (hexoRoot) => {
    console.log(hexoRoot)
    this.setState({
      hexoRoot: hexoRoot
    })
    window.localStorage.hexoRoot = hexoRoot
    this.changeArticleArr(hexoRoot)
  }

  changeEditorContent = (editor, data, value) => {
    this.setState({
      content: value
    })
  }

  render() {

    return [
      <ToolBar key="toolBar" rootDir={this.state.hexoRoot} changeRootDir={this.changeRootDir}
               reloadArticleArr={this.changeArticleArr}/>,
      <div className="user-view" key="userView">
        <ArticleList key="list" rootDir={this.state.hexoRoot} changeCurrentArticle={this.changeCurrentArticle}
                     articleArr={this.state.articleArr} changeArticleArr={this.changeArticleArr}/>
        <Editor key="edit" name={this.state.current} article={this.state.currentName} rootDir={this.state.hexoRoot}
                content={this.state.content}
                changeContent={this.changeEditorContent}/>
      </div>
    ]
  }

}


ReactDOM.render(
  <Main/>,
  document.getElementById('main')
)