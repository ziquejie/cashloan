//主表
import React from 'react'
import {
  Table,
  Modal
} from 'antd';
import AddWin from './AddWin'
var confirm = Modal.confirm;
const objectAssign = require('object-assign');
export default React.createClass({
  getInitialState() {
    return {
      selectedRowKeys: [], // 这里配置默认勾选列
      loading: false,
      data: [],
      pagination: {
        pageSize: 10,
        current: 1
      },
      canEdit: true,
      visible: false,
      condition: [],
      record: ''
    };
  },
  componentWillReceiveProps(nextProps, nextState) {
    this.fetch(nextProps.params);
  },
  hideModal() {
    this.setState({
      visible: false,
    });
    this.refreshList();
    var pagination = this.state.pagination;

  },
  //新增跟编辑弹窗
  showModal(title, record, canEdit) {
    // console.log(canEdit);
    this.setState({
      canEdit: !canEdit,
      title: title,
      record: record,
      visible: true,
    });
    Utils.ajaxData({
      url: '/modules/manage/user/appVersion/find.htm',
      method: 'post',
      data:{id:record.id},
      callback: (result) => {
        // console.log(result);
        this.refs.AddWin.setFieldsValue(result.data);
        this.setState({
          condition: result.data,
        });
      }
    })
  },
  rowKey(record) {
    return record.id;
  },
  //选择
  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedRowKeys
    });
  },
  //分页
  handleTableChange(pagination, filters, sorter) {
    //console.log(pagination)
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.refreshList();
  },
  componentDidMount() {

    this.fetch(this.props.params);
  },
  fetch(params = {}) {
    this.setState({
      loading: true
    });
    if (!params.pageSize) {
      var params = {};
      params = {
        pageSize: 10,
        current: 1,
      }
    }
    Utils.ajaxData({
      url: '/modules/manage/user/appVersion/list.htm',
      data: params,
      method: 'post',
      callback: (result) => {
        // console.log(result);
        // const pagination = this.state.pagination;
        // pagination.current = params.current;
        // pagination.total = result.page.total;
        // if (!pagination.current) {
        //   pagination.current = 1
        // };
        this.setState({
          loading: false,
          data: result.data,
          // pagination,
        });
        this.clearList();
      }
    });
  },
  clearList() {
    this.setState({
      selectedRowKeys: [],
    });
  },
  refreshList() {
    var pagination = this.state.pagination;
    var params = objectAssign({}, this.props.params, {
      current: pagination.current,
      pageSize: pagination.pageSize
    });
    //console.log("params",params)
    this.fetch(params);
  },
  // changeStatus(title, record) {
  //   //console.log(record)
  //   var me = this;
  //   var url;
  //   var data = {};
  //   if (title == "禁用") {
  //     data = {
  //       id: record.id,
  //     }
  //     url = "/modules/manage/user/accessCode/disable.htm";
  //   } else {
  //     data = {
  //       id: record.id,
  //     }
  //     url = "/modules/manage/user/accessCode/enable.htm";
  //   }
  //   confirm({
  //     title: '是否确认',
  //     onOk: function () {
  //       Utils.ajaxData({
  //         url: url,
  //         data: data,
  //         method: 'post',
  //         callback: (result) => {
  //           Modal.success({
  //             title: result.msg,
  //           });
  //           me.refreshList();
  //         }
  //       });
  //     },
  //     onCancel: function () { }
  //   });
  // },
  onRowClick(record) {
    this.setState({
      selectedRowKeys: [record.id]
    });
  },
  render() {
    var me = this;
    const {
      loading,
      selectedRowKeys
    } = this.state;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    var columns = [{
      title: 'App code',
      dataIndex: 'appCode'
    }, {
      title: 'App type',
      dataIndex: "appType",
      render:(index,text)=>{
        if(index==10){
          return 'Android'
        }
        else if(index==11){
          return 'Android Pad'
        }
        else if(index==20){
          return 'IOS'
        }
        else if(index==21){
          return 'IOS Pad'
        }
      }
    }, {
      title: 'Version code',
      dataIndex: 'versionCode'
    }, {
      title: 'Version name',
      dataIndex: "versionName"
    }, {
      title: 'Force flag',
      dataIndex: 'forceFlag',
      render:(index,text)=>{
        if(index==0){
          return '不强制'
        }
        else if(index==1){
          return '强制'
        }
      }
    }, {
      title: 'Down url',
      dataIndex: 'downUrl'
    }, {
      title: 'Google down url',
      dataIndex: "googleDownUrl"
    }, {
      title: 'Spread url',
      dataIndex: "spreadUrl"
    }, {
      title: 'Publish uid',
      dataIndex: "publishUid"
    }, {
      title: 'Publish time',
      dataIndex: "publishTime"
    }, 
    {
      title: 'App classification',
      dataIndex: "appClassification"
    }, {
      title: 'Status',
      dataIndex: "status",
      render: (text, record) => {
        // console.log(text);
        // console.log(record.status);        
        if (record.status == '1') {
          return '正常'
        }
        else if (record.status == '-1') {
          return '删除'
        }
      }
    },
    {
      title: '操作',
      dataIndex: "",
      render:(text,record) => {
        return(
          <div style={{ textAlign: "left" }}>
                  <a href="#" onClick={me.showModal.bind(me, 'Update',record, false)}>Update{/*更新数据*/}</a></div>
          )
    } 
    }
    ];
    var state = this.state;
    return (
      <div className="block-panel">
        {/* <div className="actionBtns" style={{ marginBottom: 16 }}>
          <button className="ant-btn" onClick={this.showModal.bind(this, '新增', null, true)}>
            新增
          </button>
        </div> */}
        {/* <Table columns={columns} rowKey={this.rowKey} ref="table" 
                       onRowClick={this.onRowClick}
                       dataSource={this.state.data}
                       rowClassName={this.rowClassName}
                       pagination={this.state.pagination}
                       onChange={this.handleTableChange}
                /> */}
        <Table
          columns={columns}
          rowKey={this.rowKey}
          size="middle"
          // params={this.props.params}
          dataSource={this.state.data}
          onRowClick={this.onRowClick}
          // pagination={this.state.pagination}
          pagination={false}
          // loading={this.state.loading}
          onChange={this.handleTableChange} />
        <AddWin ref="AddWin" visible={state.visible} condition={state.condition} title={state.title} hideModal={me.hideModal} record={state.record}
          canEdit={state.canEdit} />
      </div>
    );
  }
})
