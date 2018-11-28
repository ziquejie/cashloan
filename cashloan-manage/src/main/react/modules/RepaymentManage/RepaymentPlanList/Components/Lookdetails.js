import React from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Col,
  Select,
  Checkbox,
  Radio,
  message,
  DatePicker,
  Switch,

} from 'antd';

const CheckboxGroup = Checkbox.Group
const createForm = Form.create;
const FormItem = Form.Item;
var confirm = Modal.confirm;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const objectAssign = require('object-assign');
var Lookdetails = React.createClass({
  getInitialState() {
    return {
      value: 1,
      startValue: null
    };
  },
  handleCancel() {
    this.state.value = 1;
    this.state.startValue = null;
    this.props.form.resetFields();
    this.props.hideModal();
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      record: nextProps.record
    })
  },
  disabledStartDate(startValue) {
    var today = new Date();
    var loanDay = new Date(this.props.record.borrowTime);
    return startValue.getTime() > today.getTime() || startValue.getTime() < loanDay.getTime();
  },
  handleOk() {
    var me = this;
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var re1 = /^(\d|[1-9]\d+)(\.\d+)?$/;
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        //console.log('Errors in form!!!');
        return;
      }
      if (values.amount > this.props.record.repayAmount) {
        Modal.error({
          title: "Too much repayment amount",//还款金额过多
        });
        return;
      }
      if (values.amount && !re1.test(values.amount)) {
        Modal.error({
          title: "The repayment amount must be a number greater than or equal to zero",//还款金额必须是大于等于零的数
        });
        return;
      }
      if (values.penaltyAmout1 && !re1.test(values.penaltyAmout1)) {
        Modal.error({
          title: "Overdue fines must be greater than or equal to zero",//逾期罚金必须是大于等于零的数
        });
        return;
      }
      if (values.penaltyAmout1 > this.props.record.penaltyAmout) {
        Modal.error({
          title: "Overdue fines",//逾期罚金过多
        });
        return;
      }
      if (re.test(values.repayAccount) && values.repayWay != '30') {
        Modal.error({
          title: "The account number does not match the method. Please check",//账号与方式不符,请核对
        });
        return;
      }
      var tips = "Are you sure to submit";//您是否确定提交
      if(this.props.title == "Manual Transfer"){//手动划款
          console.log("commit:"+values);
          if (values.repayMoney <= 1000) {
              Modal.error({
                  title: "Batch repayment does not take manual payment",//分批还款不走手动划款
              });
              return;
          }
          confirm({
              title: tips,
              onOk: function () {
                  Utils.ajaxData({
                          url: "/arsenal/repayment.htm?borrowIdIn="+values.borrowId+"&amountIn="+values.repayMoney,
              });
                  me.handleCancel();
                  let resType = 'success';
                  Modal[resType]({
                      title: "The operation is successful, please go to the loan progress inquiry result!",//操作成功,请到借款进度查询结果!
                  });
              },
              onCancel: function () { }
          })
      }else {
          confirm({
              title: tips,
              onOk: function () {

                  Utils.ajaxData({
                          url: "/modules/manage/borrow/repay/confirmRepay.htm",
                          data: {
                              id: values.id,
                              repayTime: DateFormat.formatDate(values.repayTimes),
                              repayAccount: values.repayAccount,
                              repayWay: values.repayWay,
                              actualbackAmt:values.actualbackAmt,
                              serialNumber: values.serialNumber,
                              amount: me.state.value == 1 ? me.props.record.balance : values.amount,
                              penaltyAmout: me.state.value == 1 ? me.props.record.overdueFee : values.penaltyAmout1,
                              state: me.state.value == 1 ? values.status == 5 ? 6 : 21 : 22,
                          },
                          callback: (result) => {
                          if (result.code == 200) {
                      me.handleCancel();
                  };
                  let resType = result.code == 200 ? 'success' : 'warning';
                  Modal[resType]({
                      title: result.msg,
                  });
              }
              });
              },
              onCancel: function () { }
          })
      }
    })
  },
  onChange1(e) {
    this.setState({
      value: e.target.value,
    });
  },
  render() {
    const {
      getFieldProps
    } = this.props.form;
    var props = this.props;
    var state = this.state;
    console.log(props.title);
    const formItemLayout = {
      labelCol: {
        span:0
      },
      wrapperCol: {
        span: 24
      },
    };
    var modalBtns = [
      <Button key="back" className="ant-btn" onClick={this.handleCancel}>Back{/*返 回*/}</Button>,
      <Button key="button" className="ant-btn ant-btn-primary" onClick={this.handleOk}>
        {/*提 交*/}Submit
            </Button>
    ];
    return (
      <Modal title={props.title} visible={props.visible} onCancel={this.handleCancel} width="500" footer={modalBtns} maskClosable={false} >{/*手动划款*/}
      {props.title == "Manual Transfer" ? (
      <Form horizontal form={this.props.form}>
  <Input  {...getFieldProps('id', { initialValue: '' }) } type="hidden" />
  <Input  {...getFieldProps('borrowId', { initialValue: '' }) } type="hidden" />
          <Row>
          <Col span="24">
          <FormItem {...formItemLayout} label="Amount Of Payment:">{/*划款金额*/}
          <Input type="text" placeholder="Please enter the amount of the transfer"{...getFieldProps('repayMoney', { rules: [{ required: true, message: "Too much input or not lost", max: 20 }] }) } /> {/*请输入划款金额     输入过多或者未输*/}
  </FormItem>
          </Col>
          </Row></Form>)

  :

      (<Form horizontal form={this.props.form}>
  <Input  {...getFieldProps('id', { initialValue: '' }) } type="hidden" />
  <Input  {...getFieldProps('status', { initialValue: '' }) } type="hidden" />
          <Row>
          <Col span="24">
          <FormItem {...formItemLayout} label="Repayment Option:">{/*还款选择*/}
          <RadioGroup onChange={this.onChange1} value={this.state.value}>
  <Radio key="a" value={1}>Normal repayment{/*正常还款*/}</Radio>
          <Radio key="b" value={2}>Amount reduction{/*金额减免*/}</Radio>
          </RadioGroup>
          </FormItem>
          </Col>
          </Row>
          <Row>
          <Col span="24">
          <FormItem {...formItemLayout} label="Repayment Account:">{/*还款账号*/}
          <Input type="text" placeholder="Please enter your bank card number or Alipay account number" {...getFieldProps('repayAccount', { rules: [{ required: true, message: "Too much input or not lost", max: 20 }] }) } />{/*请输入银行卡号或者支付宝账号   输入过多或者未输*/}
  </FormItem>
      </Col>
      </Row>
      <Row>
      <Col span="24">
          <FormItem {...formItemLayout} label="Repayment method:">{/*还款方式*/}
          <Select placeholder="Please Choose" {...getFieldProps('repayWay', { rules: [{ required: true, message: '必填', type: 'string' }] }) } >{/*请选择*/}
  <Option value="20">Bank card transfer</Option>{/*银行卡转账*/}
          </Select>
          </FormItem>
          </Col>
          </Row>
          <Row>
          <Col span="24">
          <FormItem {...formItemLayout} label="Actual amount of repayment:">{/*实际还款金额*/}
          <Input type="text" placeholder="Please enter the actual amount of repayment" {...getFieldProps('actualbackAmt', { rules: [{ required: true, message: "Too much input or not lost", max: 50 }] }) } />{/*请输入实际还款金额    输入过多或者未输*/}
  </FormItem>
      </Col>
      </Row>
          <Row>
          <Col span="24">
          <FormItem {...formItemLayout} label="Serial Number:">{/*流水号*/}
          <Input type="text" placeholder="Please enter the serial number" {...getFieldProps('serialNumber', { rules: [{ required: true, message: "Too much input or not lost", max: 50 }] }) } />{/*请输入流水号    输入过多或者未输*/}
  </FormItem>
      </Col>
      </Row>
      <Row>
      <Col span="24">
          <FormItem {...formItemLayout} label="Repayment Time:">{/*还款时间*/}
          <DatePicker format="yyyy-MM-dd HH:mm:ss" disabledDate={this.disabledStartDate} value={this.state.startValue} {...getFieldProps('repayTimes', { rules: [{ required: true, message: 'Required', type: 'date' }], onChange: (value) => { this.setState({ startValue: value }) } }) } />{/*必填*/}
  </FormItem>
      </Col>
      </Row>
      {state.value == 1 ? "" :
  <div>
      <Row>
      <Col span="24">
          <FormItem {...formItemLayout} label="Repayment Amount:">{/*还款金额*/}
          <Input type="text" placeholder="Please enter the repayment amount" {...getFieldProps('amount', { rules: [{ required: true, message: 'Required' }] }) } />{/*请输入还款金额   必填*/}
  </FormItem>
      </Col>
      </Row>
      {this.state.startValue && DateFormat.formatDate(this.state.startValue).substring(0, 10) > this.props.record.repayTime.substring(0, 10) ? <Row>
      <Col span="24">
          <FormItem {...formItemLayout} label="Overdue fine:">{/*逾期罚金*/}
          <Input type="text" placeholder="Please enter an overdue penalty" {...getFieldProps('penaltyAmout1') } />{/*请输入逾期罚金*/}
  </FormItem>
      </Col>
      </Row> : ''}
  </div>
  }
  </Form>

  )
  }

      </Modal>
    );
  }
});
Lookdetails = createForm()(Lookdetails);
export default Lookdetails;