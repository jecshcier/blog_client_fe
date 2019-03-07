import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';

class ArticleList extends React.Component{
  constructor(props){
    super(props)
  }
  changeArticle = (e)=>{
    this.props.changeCurrentArticle(e.target.getAttribute('data-path'),e.target.getAttribute('data-name'))
  }

  componentDidMount(){
    this.props.changeArticleArr(this.props.rootDir)
  }

  render(){
    console.log("articleList ----------------------------")
    console.log(this.props.articleArr)
    return (<ul className="articleList">
      {this.props.articleArr ? Object.values(this.props.articleArr).map((el,index)=>{
        return <li key={index} data-path={el.path} data-name={el.fileName} onClick={this.changeArticle}>{el.fileName}</li>
      }):<li>暂无文章</li>}
    </ul>)
  }
}

export default ArticleList