
import React from 'react';
import {
  Descriptions,
  Button,
} from 'antd';

import styles from './index.less';

class TableRow extends React.PureComponent {


  renderDetail = () => {
    const { data } = this.props;
    // console.log(data);

    return (
      <div className={styles.orderDetail}>
        <Descriptions
          title={data.name}
        >
          <Descriptions.Item label="Quantity">{data.quantity}</Descriptions.Item>
          <Descriptions.Item label="Price $">{data.price}</Descriptions.Item>
          <Descriptions.Item label="Created at">{data.createdAt}</Descriptions.Item>
          <Descriptions.Item label="Sold" >
            {data.sold}
          </Descriptions.Item>
          <Descriptions.Item label="Category" span={2}>{data.category && data.category.name}</Descriptions.Item>

          <Descriptions.Item label="Descriptions">
            {data.description}
          </Descriptions.Item>
        </Descriptions>
      </div>
    )
  }


  renderDetailWithButton = () => {
    const {data, handleDelete, handleUpdate} = this.props;
    return (
      <div className={styles.rowContainer}>
        <div className={styles.detailContainer}>
          {this.renderDetail()}
        </div>
        <div className={styles.btnContainer}>
          <Button onClick={() => handleUpdate(data)} className={styles.blueButton} style={{marginTop: 10}}>Update</Button>
          <Button  onClick={() => handleDelete(data)} className={styles.whiteButton} style={{marginTop: 10}}>Delete</Button>
        </div>
      </div>
    )
  }



  render() {
    // const {data} = this.props;
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