
import React from 'react';
import {
  Descriptions,
  Button,
  Collapse,
  List,
  Row,
  Col,
  Icon

} from 'antd';

import styles from './index.less';
import {dateStringToTime} from '@/utils/dateUtils';

const { Panel } = Collapse;

class TableRow extends React.PureComponent {


  renderItem = (product, index) => {
    const {data} = this.props;
    const isLast = (index + 1) === data.products.length;
    // console.log(isLast)

    return (
      <div className={styles.productListItem} key={index} style={isLast ? {marginBottom: 0, border: 'none'} : {}}>
        <Row>
          <Col span={3}>
            <strong>Product {index + 1}</strong>
          </Col>
          <Col span={21}>
            <div>Name: {product.name}</div>
            <div>
              Bought count: {product.count}  &nbsp; &nbsp; Left quantity: {product.quantity}
            </div>
          </Col>
        </Row>

      </div>
    )
  }

  renderDetail = () => {
    const { data } = this.props;
    // console.log(data);
    // return null

    return (
      <div className={styles.orderDetail}>
        <Descriptions
          // title={data.name}
        >
          <Descriptions.Item label="Status">{data.status}</Descriptions.Item>
          <Descriptions.Item label="Created at">{dateStringToTime(data.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="Updated at">{dateStringToTime(data.updatedAt)}</Descriptions.Item>

          <Descriptions.Item label="Amount $">{data.amount}</Descriptions.Item>
          <Descriptions.Item label="Email">{data.user.email}</Descriptions.Item>
          <Descriptions.Item label="Name ">{data.addressInfo.fullName}</Descriptions.Item>
          <Descriptions.Item label="Telephone">{data.addressInfo.telephone}</Descriptions.Item>
          <Descriptions.Item label="Address">{data.addressInfo.address}</Descriptions.Item>
        </Descriptions>
        <Collapse
          expandIcon={({ isActive }) => <Icon style={{ color: "#003DA5" }} type="caret-right" rotate={isActive ? 90 : 0} />}
          bordered={false}
        >
          <Panel header="Bought products" style={{ border: "none"}}>
            {
              data.products.map((item, index) => {
                return this.renderItem(item, index)
              })
            }
          </Panel>
        </Collapse>
      </div>
    )
  }


  renderDetailWithButton = () => {
    const { data, handleDelete, handleUpdate } = this.props;
    return (
      <div className={styles.rowContainer}>
        <div className={styles.detailContainer}>
          {this.renderDetail()}
        </div>
        <div className={styles.btnContainer}>
          <Button onClick={() => handleUpdate(data)} className={styles.blueButton} style={{ marginTop: 10 }}>Update</Button>
        </div>
      </div>
    )
  }



  render() {
    const {data} = this.props;
    // console.log(data);
    

    return (
      // <div className={styles.hello}>hello</div>
      <div className={styles.rowContent}>
        {/* {this.renderDetail()} */}
        {this.renderDetailWithButton()}
      </div>
    )
  }

}

export default TableRow;