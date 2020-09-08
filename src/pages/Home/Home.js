import React, { PureComponent, Fragment } from 'react';
import {
  Card,
  Col,
  Row,
} from 'antd';


import MyBarChart from './MyBarChart';
// import ChartFrame from '@/pages/Common/ChartFrame';
import MyPieChart from './MyPieChart';

import { fetchProductList, getOrderStatistics } from '@/pages/api';
import { parseResList, parseResSubmit, parseResDetail } from '../../services/requestApi';



export default class Home extends PureComponent {

  state = {
    orderList: [],
    productList: []
  }

  componentDidMount() {
    this.fetchProducts();
    this.fetchOrders()
  }

  fetchProducts = async () => {

    const response = await fetchProductList({});

    const result = parseResList(response);
    if (result) {
      this.setState({
        productList: result.list
      })
    }
  }

  fetchOrders = async () => {
    const response = await getOrderStatistics();
    const result = parseResDetail(response);
    // console.log(result);
    if (result) {
      this.setState({
        orderList: result
      })
    }
  }

  render() {
    const { orderList, productList } = this.state;
    console.log(productList);

    return (
      <div>

        <div style={{ backgroundColor: '#F0F2F5' }}>
          <Row gutter={24}>
            <Col span={12}>
              <Card
                title='Orders in different status'
              // style={{ width: 550 }}
              >
                <MyPieChart data={orderList}></MyPieChart>
              </Card>
            </Col>

            <Col span={12}>
              <Card
                title='Sales volumn'
              >
                <MyBarChart
                  data={productList}
                ></MyBarChart>
              </Card>
            </Col>

          </Row>



        </div>

        {/* <MyChart></MyChart> */}

      </div>

    );
  }
}





// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 },
// ];

// const renderActiveShape = (props) => {
//   const RADIAN = Math.PI / 180;
//   const {
//     cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
//     fill, payload, percent, value,
//   } = props;
//   const sin = Math.sin(-RADIAN * midAngle);
//   const cos = Math.cos(-RADIAN * midAngle);
//   const sx = cx + (outerRadius + 10) * cos;
//   const sy = cy + (outerRadius + 10) * sin;
//   const mx = cx + (outerRadius + 30) * cos;
//   const my = cy + (outerRadius + 30) * sin;
//   const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//   const ey = my;
//   const textAnchor = cos >= 0 ? 'start' : 'end';

//   return (
//     <g>
//       <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <Sector
//         cx={cx}
//         cy={cy}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         innerRadius={outerRadius + 6}
//         outerRadius={outerRadius + 10}
//         fill={fill}
//       />
//       <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
//       <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//       <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
//       <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
//         {`(Rate ${(percent * 100).toFixed(2)}%)`}
//       </text>
//     </g>
//   );
// };


// export default class Example extends PureComponent {
//   static jsfiddleUrl = 'https://jsfiddle.net/alidingling/hqnrgxpj/';

//   state = {
//     activeIndex: 0,
//   };

//   onPieEnter = (data, index) => {
//     this.setState({
//       activeIndex: index,
//     });
//   };

//   render() {
//     return (
//       <PieChart width={400} height={400}>
//         <Pie
//           activeIndex={this.state.activeIndex}
//           activeShape={renderActiveShape}
//           data={data}
//           cx={200}
//           cy={200}
//           innerRadius={60}
//           outerRadius={80}
//           fill="#8884d8"
//           dataKey="value"
//           onMouseEnter={this.onPieEnter}
//         />
//       </PieChart>
//     );
//   }
// }

