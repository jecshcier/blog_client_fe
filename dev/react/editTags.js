import React from "react";
import {message, Button, Radio, Icon, Tag, Modal, Input, Select} from 'antd';
import _ from 'lodash'
import AddArticle from "./AddArticle";
import moment from "moment";

class EditTags extends React.Component {
  constructor(props) {
    super(props);
    this.tagColorArr = ["pink", "red", "orange", "green", "cyan", "blue", "purple"]
    this.addCategoriesInput = React.createRef()
    this.addTagsInput = React.createRef()
    this.addKeywordsInput = React.createRef()
    this.tags = {
      categoriesArr: [],
      tagsArr: [],
      keywordsArr: []
    }
    this.state = {
      addCategoriesInput: false,
      addTagsInput: false,
      addKeywordsInput: false,
      addCategoriesInputValue: '',
      addTagsInputValue: '',
      addKeywordsInputValue: ''
    }
  }

  modalHandleOk = () => {

    let json = {
      "categories": _.xor(this.props.sortArr, this.tags.categoriesArr),
      "tags": _.xor(this.props.tagsArr, this.tags.tagsArr),
      "keywords": _.xor(this.props.keywordsArr, this.tags.keywordsArr)
    }
    console.log(JSON.stringify(json))
    app.once('createFileCallback', (event, data) => {
      if (!data) {
        message.success('标签编辑成功！')
      }
      else {
        message.error('标签编辑错误！')
      }
    })
    app.send('createFile', {
      url: this.props.hexoRoot + '/blog.config.js',
      content: JSON.stringify(json),
      base64: false,
      callback: 'createFileCallback'
    })
    console.log(this.props.sortArr)
    console.log(this.tags.categoriesArr)
    this.tags.categoriesArr = []
    this.tags.tagsArr = []
    this.tags.keywordsArr = []
    this.props.closeModal()
  }

  delCategories = (key) => {
    this.tags.categoriesArr.push(key)
    console.log(this.tags)
  }

  delTags = (key) => {
    this.tags.tagsArr.push(key)
    console.log(this.tags)
  }

  delKeywords = (key) => {
    this.tags.keywordsArr.push(key)
    console.log(this.tags)
  }

  componentDidMount() {
    console.log(this.props)
  }

  showInput = (e) => {
    switch (e.target.getAttribute('data-type')) {
      case 'categories':
        this.setState({
          addCategoriesInput: true
        }, () => {
          this.addCategoriesInput.current.input.focus()
        })
        break
      case 'tags':
        this.setState({
          addTagsInput: true
        }, () => {
          this.addTagsInput.current.input.focus()
        })
        break
      case 'keywords':
        this.setState({
          addKeywordsInput: true
        }, () => {
          this.addKeywordsInput.current.input.focus()
        })
        break
      default:
        break
    }
  }

  handleInputChange = (e) => {
    switch (e.target.getAttribute('data-type')) {
      case 'categories':
        this.setState({
          addCategoriesInputValue: e.target.value
        })
        break
      case 'tags':
        this.setState({
          addTagsInputValue: e.target.value
        })
        break
      case 'keywords':
        this.setState({
          addKeywordsInputValue: e.target.value
        })
        break
      default:
        break
    }
  }

  handleInputConfirm = (e) => {
    if (!e.target.value || (e.target.value === '')) {
      this.setState({
        addCategoriesInput: false,
        addCategoriesInputValue: '',
        addTagsInput: false,
        addTagsInputValue: '',
        addKeywordsInput: false,
        addKeywordsInputValue: ''
      })
      return false
    }
    switch (e.target.getAttribute('data-type')) {
      case 'categories':
        let categoriesArr = this.props.sortArr
        categoriesArr.push(e.target.value)
        this.props.changeArr('sortArr', categoriesArr)
        this.setState({
          addCategoriesInput: false,
          addCategoriesInputValue: ''
        })
        break
      case 'tags':
        let tagsArr = this.props.tagsArr
        tagsArr.push(e.target.value)
        this.props.changeArr('tagsArr', tagsArr)
        this.setState({
          addTagsInput: false,
          addTagsInputValue: ''
        })
        break
      case 'keywords':
        let keywordsArr = this.props.keywordsArr
        keywordsArr.push(e.target.value)
        this.props.changeArr('keywordsArr', keywordsArr)
        this.setState({
          addKeywordsInput: false,
          addKeywordsInputValue: ''
        })
        break
      default:
        break
    }
  }

  modalHandleCancel = () => {
    this.props.closeModal()
  }

  render() {
    return <Modal
      title={this.props.modalName}
      visible={this.props.show}
      onOk={this.modalHandleOk}
      onCancel={this.modalHandleCancel}
    >
      <div>
        <div>分类</div>
        <div style={{marginTop:'10px'}}>
          {
            this.props.sortArr.length ? this.props.sortArr.map((el, index) => {
              let colorNum = index % 7
              return <Tag color={this.tagColorArr[colorNum]} style={index === 0 ? {marginLeft: '5px'} : null} closable data-name={el} afterClose={() => {
                this.delCategories(el)
              }} key={el+index} value={el}>{el}</Tag>
            }) : null
          }
          {this.state.addCategoriesInput && (
            <Input
              ref={this.addCategoriesInput}
              type="text"
              size="small"
              style={{width: 78}}
              value={this.state.addCategoriesInputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
              data-type="categories"
            />
          )}
          {!this.state.addCategoriesInput && (
            <Tag
              onClick={this.showInput}
              style={{background: '#fff', borderStyle: 'dashed'}}
              data-type="categories"
            >
              <Icon type="plus"/> 添加分类
            </Tag>
          )}
        </div>
      </div>
      <div>
        <div style={{marginTop:'10px'}}>标签</div>
        <div style={{marginTop:'10px'}}>
          {
            this.props.tagsArr.length ? this.props.tagsArr.map((el, index) => {
              let colorNum = index % 7
              return <Tag color={this.tagColorArr[colorNum]} style={index === 0 ? {marginLeft: '5px'} : null} closable data-name={el} afterClose={() => {
                this.delTags(el)
              }} key={el+index} value={el}>{el}</Tag>
            }) : null
          }
          {this.state.addTagsInput && (
            <Input
              ref={this.addTagsInput}
              type="text"
              size="small"
              style={{width: 78}}
              value={this.state.addTagsInputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
              data-type="tags"
            />
          )}
          {!this.state.addTagsInput && (
            <Tag
              onClick={this.showInput}
              style={{background: '#fff', borderStyle: 'dashed'}}
              data-type="tags"
            >
              <Icon type="plus"/> 添加标签
            </Tag>
          )}
        </div>
      </div>
      <div>
        <div style={{marginTop:'10px'}}>关键词</div>
        <div style={{marginTop:'10px'}}>
          {
            this.props.keywordsArr.length ? this.props.keywordsArr.map((el, index) => {
              let colorNum = index % 7
              return <Tag color={this.tagColorArr[colorNum]} style={index === 0 ? {marginLeft: '5px'} : null} closable data-name={el} afterClose={() => {
                this.delKeywords(el)
              }} key={el+index} value={el}>{el}</Tag>
            }) : null
          }
          {this.state.addKeywordsInput && (
            <Input
              ref={this.addKeywordsInput}
              type="text"
              size="small"
              style={{width: 78}}
              value={this.state.addKeywordsInputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
              data-type="keywords"
            />
          )}
          {!this.state.addKeywordsInput && (
            <Tag
              onClick={this.showInput}
              style={{background: '#fff', borderStyle: 'dashed'}}
              data-type="keywords"
            >
              <Icon type="plus"/> 添加关键词
            </Tag>
          )}
        </div>
      </div>
    </Modal>
  }

}

export default EditTags