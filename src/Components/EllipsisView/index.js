

import React, { Component } from "react";
import styles from './index.less';
import {
  Icon
} from 'antd';
import { highlight, clearHighlight, highlightKeyword } from '@/utils/highlight';


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
    const { lines, content, keywords } = this.props;
  
    // ivan 20200729 ts511
    if(keywords && keywords.length > 0){
      // console.log(content.includes(keyword))
      let keywordInContent = false;
      keywords.forEach((word) => {
        if(content.toLowerCase().includes(word.toLowerCase().trim())){
          keywordInContent = true;
          return;
        }
      })
      if(keywordInContent) return;
    }
  // ivan 20200723
    // if(keywords && content && content.toLowerCase().includes(keyword.toLowerCase().trim())){
    //   return;
    // }
    
    //ivan 20200315 
    if (lines && content ) {
      this.computeLine();
    }
  }

  componentWillReceiveProps(nextProps) {
    const preContent = this.props.content;
    const preLines = this.props.lines;
    const { lines, content, keyword } = nextProps;
    // ivan 20200723
    // if(keyword) return;
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
    const { content, lines, keyword } = this.props;
    // ivan 20200723
    if(!content) return;
    // ivan 20200611 
    // if(!content) return;

    
    if (content !== preProps.content || lines !== preProps.lines) {
      // console.log('================')
      // console.log(content)
      // console.log(preProps.content)
      // console.log(content  ===  preProps.content)
      // console.log('===========didupdate')
      // console.log("重新计算")
      this.computeLine();
    }
  }

  computeSuffix = () => {
    const { suffix } = this.props;
    if (!suffix) return '...More123';
    const totalWidth = this.suffixShow.offsetWidth;
    const suffixShowNode = this.suffixShow;
    let str = '1';
    // console.log(totalWidth);
    const strLen = this.findAlternative(totalWidth, str, suffixShowNode);
    // console.log(strLen);
    return strLen;
  }

  findAlternative = (totalWidth, str, suffixShowNode) => {
    suffixShowNode.innerHTML = str;
    let suffixRealWidth = suffixShowNode.offsetWidth;
    if (suffixRealWidth <= totalWidth) {
      return this.findAlternative(totalWidth, str + '1', suffixShowNode)
    }
    return str;
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

      // ivan 20200413
      // const suf = this.props.suffix ? '11111' : '...More123';
      const suf = this.computeSuffix();
      // console.log('***biseciont start')
      // this.shadow.style.height = `${targetHeight}px`;
      const count = this.bisection(targetHeight, mid, 0, len, content, shadowNode, suf);
     
      this.setState({
        expanded: false,
        targetCount: count,
        hideContent: true
      });
    }
  };

  // ivan 20200413, suffix
  bisection = (th, m, b, e, text, shadowNode, suffix) => {

    // const suffix = '...More123';
    
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
      return this.bisection(th, mid, begin, end, text, shadowNode, suffix);
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
    return this.bisection(th, mid, begin, end, text, shadowNode, suffix);
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

  // ivan 20200413 
  // handleSuffix = (node) => {
  //   this.suffix = node;
  // }

  handleSuffixShadow = (node) => {
    this.suffixShow = node;
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
    // ivan 20200413, suffix, collapseSuffix
    const { content, lines, suffix, collapseSuffix } = this.props;
    const { targetCount, expanded, hideContent, } = this.state;
    // console.log(targetCount, expanded)
    // console.log(content.length)
    return (
      !expanded ? (
        targetCount === content.length ? (
          <span>{content}</span>
        ) : (
            suffix ? (
              <span>{content.substring(0, targetCount)}
                <a className={styles.suffixStyle} onClick={this.handleExpand}>&nbsp;&nbsp;{suffix}
                {/* < Icon type="down" ></Icon> */}
                 </a >
              </span >
            ) : (
                <span>{content.substring(0, targetCount)}
                  ...<a onClick={this.handleExpand} className={styles.suffixStyle}> More < Icon type="down" ></Icon></a >
                </span >
              )
          )
      ) : (
          targetCount === content.length ? (
            <span>{content}</span>
          ) : (
              collapseSuffix ? (
                <span>{content}<a className={styles.suffixStyle} onClick={this.handleFold}>&nbsp; {collapseSuffix}</a></span>
              ) : (
                  <span>{content}<a className={styles.suffixStyle} onClick={this.handleFold}>&nbsp; Collapse <Icon type="up"></Icon></a></span>
                )

            )
        )
    )
  }

  highlightKeyword = (content) => {
    const { keyword } = this.props;
    content = clearHighlight(content);
    // console.log(searchKeyword)
    if (keyword) {
      content = highlight({ str: content, keyword: keyword.trim() });
    }
    return content;
  }

  render() {
    const { content, lines, keywords } = this.props;
    const { targetCount, expanded, hideContent, showEllipsisText } = this.state;
    // console.log(targetCount, content.length, hideContent)

    //ivan 20200315
    if (!content) {
      return null;
    }

    // ivan 20200413 
    const { suffix } = this.props;
    // console.log(this.props.suffix);

    // ivan 20200723 ts486
    // console.log(keyword)
    let keywordInContent =false
    if(keywords && keywords.length>0){
      // console.log(content.includes(keyword))
      keywords.forEach((word) => {
        if(content.toLowerCase().includes(word.toLowerCase().trim())){
          keywordInContent = true;
          return;
        }
      })
    }

    return (
      
        <div ref={this.handleRoot} className={styles.ellipsis}>
          {/* ivan 20200318 */}
          <div ref={this.handleContent}
             className={styles.contentContainer}
          >
            <div ref={this.handleShadow}>
              <span>{content}</span>
            </div>
          </div>  
          {
            suffix ? (
              // <div ref={this.handleSuffix} className={styles.suffixContainer}>
              //   <div ref={this.handleSuffixShadow}>
              <span ref={this.handleSuffixShadow} 
              className={styles.suffixContainer}
              >
                &nbsp;&nbsp;{suffix}</span>
              //   </div>
              // </div>
            ) : null
          }
     
         
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
              keywordInContent ? (
                <span dangerouslySetInnerHTML={{__html: highlightKeyword(content, keywords)}}></span>
              ) : lines ? (
                this.displayText()
              ) : (
                  <span>{content}</span>
                )
            }
            {/* {
              lines ? (
                this.displayText()
              ) : (
                  <span>{content}</span>
                )
            } */}

          </div>
          {/* <span>{this.props.suffix}</span> */}
        </div>
      

    )
  }

}


export default EllipsisView;