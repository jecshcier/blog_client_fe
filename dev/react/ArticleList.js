import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';

class ArticleList extends React.Component{
  constructor(props){
    super(props)
  }
  changeArticle = (index)=>{
    let arr = Object.values(this.props.articleArr)
    window.localStorage.setItem("currentArtileName",arr[index].fileName)
    this.props.changeCurrentArticle(arr[index].path,arr[index].fileName)
  }

  componentDidMount(){
    this.props.changeArticleArr(this.props.rootDir)
  }

  render(){
    console.log("articleList ----------------------------")
    console.log(this.props.articleArr)
    return (<ul className="articleList">
      {this.props.articleArr ? Object.values(this.props.articleArr).map((el,index)=>{
        const cls = this.props.currentAticle === el.fileName ? 'article-active':''
        return <li key={`article-${index}`} className={cls} onClick={()=>{
          this.changeArticle(index)
        }}><span>{el.fileName}</span></li>
      }):<li>暂无文章</li>}
    </ul>)
  }
}

export default ArticleList