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
    app.once('getSystemCodeCallback', function (event, data) {
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

  changeArticleArr = (hexoRoot, activeArticleName) => {
    activeArticleName = activeArticleName ? activeArticleName : window.localStorage.getItem("currentArtileName") || null
    console.log("================change================")
    console.log(activeArticleName)
    if (!hexoRoot) {
      message.error("请选择hugo博客路径！")
      return false
    }
    app.once('getFolderCallback', (event, data) => {
      console.log("---okokkok---")
      if (!data.err) {
        console.log(data)
        const articleArr = []
        for (let i = 0; i < data.length; i++) {
          let fileNameArr = data[i].split('.')
          if (fileNameArr[fileNameArr.length - 1] === 'md' && data[i] !== '_index.md') {
            articleArr.push({
              path: hexoRoot + '/content/post/' + data[i],
              fileName: data[i],
            })
          }
        }
        this.setState({
          articleArr: articleArr,
          current: activeArticleName ? hexoRoot + '/content/post/' + activeArticleName : articleArr[0].path,
          currentName: activeArticleName ? activeArticleName : articleArr[0].fileName
        }, () => {
          let currentPath = activeArticleName ? hexoRoot + '/content/post/' + activeArticleName : articleArr[0].path
          let currentName = activeArticleName ? activeArticleName : articleArr[0].fileName
          console.log(currentName)
          console.log(currentPath)
          this.changeCurrentArticle(currentPath, currentName)
        })
      } else {
        message.error("请选择正确的hugo博客路径！")
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
    console.log("===============文章路径================")
    console.log(article)

    app.once('loadFileCallback', (event, data) => {
      if (!data.err) {
        this.setState({
          current: article,
          currentName: name,
          content: data.toString()
        })
      } else {
        message.error('找不到上次打开的文章')
        window.localStorage.removeItem('currentArtileName')
        this.changeArticleArr(this.state.hexoRoot)
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
                     articleArr={this.state.articleArr}
                     currentAticle={this.state.currentName}
                     changeArticleArr={this.changeArticleArr}/>
        <Editor key="edit" name={this.state.current} article={this.state.currentName} rootDir={this.state.hexoRoot}
                content={this.state.content}
                changeContent={this.changeEditorContent}
                changeRootDir={this.changeRootDir}
                reloadArticleArr={this.changeArticleArr}
        />
      </div>
    ]
  }

}


ReactDOM.render(
  <Main/>,
  document.getElementById('main')
)