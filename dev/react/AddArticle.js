import React from "react";
import {message, Button, Radio, Icon, Tag, Modal, Input, Select} from 'antd';
import _ from 'lodash'

import 'antd/lib/modal/style/css'
import 'antd/lib/input/style/css'
import 'antd/lib/select/style/css'
import 'antd/lib/tag/style/css'
import 'antd/lib/message/style/css'



const Option = Select.Option

class AddArticle extends React.Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
    this.state = {
      value: '',
      currentSort: null,
      currentTag: [],
      currentKeywords:[]
    }
    this.tagColorArr = ["pink", "red", "orange", "green", "cyan", "blue", "purple"]
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    console.log("render")
    let _this = this
    window.requestAnimationFrame(function () {
      if (_this.props.show === true) {
        _this.textInput.current.input.focus()
      }
    })
  }

  modalHandleOk = () => {
    if(this.state.currentSort && this.state.currentTag.length && this.state.value){
      this.props.onOk({
        value: this.state.value,
        currentSort: this.state.currentSort,
        currentTag: this.state.currentTag,
        currentKeywords:this.state.currentKeywords
      })
      this.setState({
        value: '',
        currentSort: null,
        currentTag: [],
        currentKeywords:[]
      })
    }
    else{
      message.warning("信息不完整")
    }
  }

  modalHandleCancel = () => {
    this.setState({
      value: '',
      currentSort: null,
      currentTag: [],
      currentKeywords:[]
    })
    this.props.closeModal()
  }

  changeInputValue = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  addTags = (e) => {
    console.log("添加tag")
    let currentTag = this.state.currentTag
    currentTag.push(e.target.getAttribute('data-name'))
    this.setState({
      currentTag: Array.from(new Set(currentTag))
    })
  }

  delTag = (tagName) => {
    console.log("删除tag")
    let tags = this.state.currentTag.filter(tag=>tag !== tagName)
    this.setState({
      currentTag:tags
    })
  }

  addKeywords = (e)=>{
    let currentKeywords = this.state.currentKeywords
    currentKeywords.push(e.target.getAttribute('data-name'))
    this.setState({
      currentKeywords: Array.from(new Set(currentKeywords))
    })
  }

  delKeywords = (keyword) => {
    console.log("删除tag")
    let keywords = this.state.currentKeywords.filter(tag=>tag !== keyword)
    this.setState({
      currentKeywords:keywords
    },()=>{
      console.log(this.state.currentKeywords)
    })
  }

  chooseSort = (value,option)=>{
    this.setState({
      currentSort:value
    })
  }


  render() {
    console.log(this.props)
    return <Modal
      title={this.props.modalName}
      visible={this.props.show}
      onOk={this.modalHandleOk}
      onCancel={this.modalHandleCancel}
    >
      <Input ref={this.textInput} type="text" onChange={this.changeInputValue} value={this.state.value}
             placeholder={this.props.placeholder}/>
      <Select defaultValue="请选择分类" style={{marginTop:'10px'}} onSelect={this.chooseSort}>
        {
          this.props.sortArr.length ? Object.values(this.props.sortArr).map((el, index) => {
            return <Option key={el} value={el}>{el}</Option>
          }) : null
        }
      </Select>
      <div style={{marginTop:'10px'}}>
        <div>
          <span>标签</span>
          {
            this.state.currentTag.length ? this.state.currentTag.map((el, index) => {
              return <Tag style={index === 0 ? {marginLeft:'5px'}:null} closable data-name={el} afterClose={()=>{this.delTag(el)}} key={el} value={el}>{el}</Tag>
            }) : null
          }
        </div>
        <div style={{marginTop:'10px'}}>
          {
            this.props.tagsArr.length ? Object.values(this.props.tagsArr).map((el, index) => {
              let colorNum = index % 7
              return <Tag color={this.tagColorArr[colorNum]} data-name={el} key={el}
                          onClick={this.addTags} value={el}>{el}</Tag>
            }) : null
          }
        </div>
        <div style={{marginTop:'10px'}}>
          <span>关键词</span>
          {
            this.state.currentKeywords.length ? this.state.currentKeywords.map((el, index) => {
              return <Tag style={index === 0 ? {marginLeft:'5px'}:null} closable data-name={el} afterClose={()=>{this.delKeywords(el)}} key={el} value={el}>{el}</Tag>
            }) : null
          }
        </div>
        <div style={{marginTop:'10px'}}>
          {
            this.props.keywordsArr.length ? Object.values(this.props.keywordsArr).map((el, index) => {
              let colorNum = index % 7
              return <Tag color={this.tagColorArr[colorNum]} data-name={el} key={el}
                          onClick={this.addKeywords} value={el}>{el}</Tag>
            }) : null
          }
        </div>
      </div>
    </Modal>
  }
}

export default AddArticle