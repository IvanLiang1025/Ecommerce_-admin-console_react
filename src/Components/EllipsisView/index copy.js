

import React, { Component } from "react";
import styles from './index.less';
import {
  Icon
} from 'antd';


// export const cutStrByFullLength = (str = '', maxLength) => {
//   let showLength = 0;
//   return str.split('').reduce((pre, cur) => {
//     const charCode = cur.charCodeAt(0);
//     if (charCode >= 0 && charCode <= 128) {
//       showLength += 1;
//     } else {
//       showLength += 2;
//     }
//     if (showLength <= maxLength) {
//       return pre + cur;
//     }
//     return pre;
//   }, '');
// };


// const getStrFullLength = (str = "") => {
//   return (
//     str.split('').reduce((pre, cur) => {
//       const charCode = cur.charCodeAt(0);
//       if (charCode >= 0 && charCode <= 128) {
//         return pre + 1;
//       }
//       return pre + 2;
//     }, 0)
//   )
// }



class EllipsisView extends Component {

  state = {
    targetCount: 0,
    expanded: true,
    hideContent: false,
    // ivan 20200317
    // contentCopy: '',
    // showEllipsisText: false
  }

  //ivan 20200318, 
  // static getDerivedStateFromProps(nextProps, preState) {
  //   const { contentCopy } = preState;
  //   const { lines, content } = nextProps;

  //   if (content !== contentCopy) {
  //     return {
  //       targetCount: 0,
  //       expanded: true,
  //       hideContent: false,
  //       // ivan 20200317
  //       contentCopy: content
  //     }
  //   }
  //   return null
  // }

  componentDidMount() {
    const { lines, content } = this.props;
    //ivan 20200315 
    if (lines && content) {
      this.computeLine();
    }
  }

  componentWillReceiveProps(nextProps) {
      const preContent = this.props.content;
      const preLines = this.props.lines;
      const { lines, content } = nextProps;
      // console.log(preContent);
      // console.log(content);
      // console.log(preContent === content)
      // console.log('************ receive new props')
      if (content !== preContent || preLines !== lines) {
       
        this.setState({
          targetCount: 0,
          expanded: true,
          hideContent: false,
          
        })
      }
  }

  componentDidUpdate(preProps) {
    const { content, lines } = this.props;
    if (content !== preProps.content || lines !== preProps.lines) {
      // console.log('===========didupdate')
      // console.log("重新计算")
      this.computeLine();
    }
  }

  computeLine = () => {
    const { lines, content } = this.props;
    const { expanded } = this.state;
    // let content = text + "... Flod";
    // console.log(lines);
    if (lines) {
      const eleLineHeight = parseInt(getComputedStyle(this.root).lineHeight, 10);
      const targetHeight = lines * eleLineHeight;
      this.content.style.height = `${targetHeight}px`;
      // console.log("target： ", targetHeight);
      const totalHeight = this.shadow.offsetHeight;
      const shadowNode = this.shadow.firstChild;

      // console.log(shadowNode)
      // console.log(totalHeight);
      // console.log(targetHeight)
      if (totalHeight <= targetHeight) {
        this.setState({
          targetCount: content.length,
          hideContent: true,
        });
        return;
      }

      // bisection
      const len = content.length;
      const mid = Math.ceil(len / 2);

      const count = this.bisection(targetHeight, mid, 0, len, content, shadowNode);

      this.setState({
        expanded: false,
        targetCount: count,
        hideContent: true
      });
    }
  };

  bisection = (th, m, b, e, text, shadowNode) => {

    const suffix = '...<a>More123</a>';
    // console.log(suffix.length);
    let mid = m;
    let end = e;
    let begin = b;
    shadowNode.innerHTML = text.substring(0, mid) + suffix;
    let sh = shadowNode.offsetHeight;
    // console.log("shadowheight: ", sh)

    if (sh <= th) {
      shadowNode.innerHTML = text.substring(0, mid + 1) + suffix;
      sh = shadowNode.offsetHeight;
      if (sh > th || mid === begin) {
        return mid;
      }
      begin = mid;
      if (end - begin === 1) {
        mid = 1 + begin;
      } else {
        mid = Math.floor((end - begin) / 2) + begin;
      }
      return this.bisection(th, mid, begin, end, text, shadowNode);
    }
    if (mid - 1 < 0) {
      return mid;
    }
    shadowNode.innerHTML = `${text.substring(0, mid - 1) + suffix}`;
    sh = shadowNode.offsetHeight;
    if (sh <= th) {
      return mid - 1;
    }
    end = mid;
    mid = Math.floor((end - begin) / 2) + begin;
    return this.bisection(th, mid, begin, end, text, shadowNode);
  };

  handleRoot = (node) => {
    this.root = node;
  }

  handleShadowChildren = (node) => {
    this.shadowChildren = node;
  }

  handleContent = (node) => {
    this.content = node;
  }

  handleShadow = (node) => {
    this.shadow = node;
  }

  handleExpand = () => {
    this.setState({
      expanded: true
    })
  }

  handleFold = () => {
    this.setState({
      expanded: false
    })
  }
  displayText = () => {
    const { content, lines } = this.props;
    const { targetCount, expanded, hideContent, } = this.state;
    // console.log(targetCount, expanded)
    // console.log(content.length)
    return (
      !expanded ? (
        targetCount === content.length ? (
          <span>{content}</span>
        ) : (
            <span>{content.substring(0, targetCount)}...<a onClick={this.handleExpand}>More <Icon type="down"></Icon></a> </span>
          )
      ) : (
          targetCount === content.length ? (
            <span>{content}</span>
          ) : (
              <span>{content}<a onClick={this.handleFold}>&nbsp; Collapse <Icon type="up"></Icon></a></span>
            )
        )
    )
  }

  render() {
    const { content, lines } = this.props;
    const { targetCount, expanded, hideContent, showEllipsisText } = this.state;
    // console.log(targetCount, content.length, hideContent)

    // console.log('render')
    // console.log(content);

    //ivan 20200315
    if (!content) {
      return null;
    }

    return (
      <div ref={this.handleRoot} className={styles.ellipsis}>
        {/* ivan 20200318 */}
        <div ref={this.handleContent} className={styles.contentContainer}>
          <div ref={this.handleShadow}>
            <span>{content}</span>
          </div>
        </div>
        {/* ivan 20200313, this div block is used to calculate the number of characters fit in required lines */}
        {/* {
          lines ? (
            !hideContent ? (
              <div ref={this.handleContent}>
                <div ref={this.handleShadow}>
                  <span>{content}</span>
                </div>
              </div>
            ) : (
                null
              )
          ) : (
              null
            )
        } */}
        {/* ivan 20200313, this is used to display according to the result of calculation */}
        <div>
          {
            lines ? (
              this.displayText()
            ) : (
                <span>{content}</span>
              )
          }
          {/* {
            !expanded ? (
              targetCount === content.length ? (
                <span>{content}</span>
              ) : (
                  <span>{content.substring(0, targetCount)}...<a onClick={this.handleExpand}>Expand</a> </span>
                )

            ) : (
                lines ? (
                    targetCount === content.length ? (
                      <span>
                        {content}
                      </span>
                    ) : (
                      <span>
                        {content}<a onClick={this.handleFold}>&nbsp; Fold</a>
                      </span>
                    )
                  
                ) : (
                    <span>{content}</span>
                  )
              )
          } */}
        </div>
      </div>
    )
  }

}


export default EllipsisView;