import React from "react";
import {Input, Modal} from "antd";
import 'antd/lib/Modal/style/css'
import 'antd/lib/Input/style/css'

class InputDialogModal extends React.Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
    this.state = {
      value: ''
    }
  }

  componentDidUpdate(){
    let _this = this
    window.requestAnimationFrame(function() {
      if (_this.props.show === true){
        _this.textInput.current.input.focus()
      }
    })
  }

  modalHandleOk = () => {
    this.setState({
      value: ''
    })
    this.props.onOk(this.state.value)
  }

  modalHandleCancel = () => {
    this.setState({
      value: ''
    })
    this.props.closeModal()
  }

  changeInputValue = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  render() {
    return <Modal
      title={this.props.modalName}
      visible={this.props.show}
      onOk={this.modalHandleOk}
      onCancel={this.modalHandleCancel}
    >
      <Input ref={this.textInput} type="text" onChange={this.changeInputValue} value={this.state.value}
             placeholder={this.props.placeholder}/>
    </Modal>
  }
}

export default InputDialogModal