import React from 'react';
import {
  Input
} from 'antd';
import styles from './index.less';

const { TextArea } = Input;
// const DEFAULT_COUNT = 1000;

class CountableTextArea extends React.PureComponent {

  constructor(props) {
    super(props);
    // const { value, maxLength } = props;
    this.state = {
      content: '',
      inputLength: 0,
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    // ivan noformdecorator, it is used as a normal TextArea
    const { value, maxLength, onChange } = nextProps;
    const { content, } = preState;

    if (value) {
      if (value === content) {
        return null;
      }
      if (maxLength && typeof maxLength === 'number') {
        const leftContent = value.length > maxLength ? value.substring(0, maxLength) : value;
        // this is called when the the length of initial value is greater than maxlength, 
        if (value.length > maxLength) {
          onChange(leftContent)
        }
        return {
          content: leftContent,
          inputLength: leftContent.length,
        }
      }
      return {
        content: value,
        inputLength: value.length,
      }
    }
    return {
      content: '',
      inputLength: 0,
    }
  }

  handleChange = (e) => {
    const { onChange, maxLength } = this.props;
    const { target: { value } } = e;
    // console.log('handle change')
    if (typeof onChange === 'function') {
      let leftContent = '';
      if (maxLength && typeof maxLength === 'number' && value.length > maxLength) {
        leftContent = value.substring(0, maxLength);
      } else {
        leftContent = value;
      }
      this.setState({
        content: leftContent,
        inputLength: leftContent.length
      })
      onChange(leftContent)
    }
  }

  render() {
    const { rows, placeholder, maxLength, textRef } = this.props;
    const { inputLength, content } = this.state;
    // console.log(placeholder)
    return (
      <div>
        <TextArea
          rows={rows || 3}
          placeholder={placeholder || ''}
          onChange={this.handleChange}
          value={content}
          ref={textRef || undefined}
        />
        {
          maxLength && typeof maxLength === 'number' ? (
            <div className={styles.counterContainer} style={inputLength >= maxLength ? { color: 'red' } : {}}>
              {inputLength}/{maxLength}
            </div>
          ) : null
        }
      </div>
    )
  }
}

export default CountableTextArea;