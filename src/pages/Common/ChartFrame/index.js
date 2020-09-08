
import React from 'react';
import {
  Card
} from 'antd';


export default class ChartFrame extends React.PureComponent{

  render (){
    const {title, renderContent} = this.props;
    return (
      <Card
        title={title || 'Card title'}
      >
        <div>
          {renderContent}
        </div>
        
      </Card>
    )
  }
}