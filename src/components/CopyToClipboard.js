import React, {Fragment} from 'react';
import styled from 'styled-jss';
import PropTypes from 'prop-types';
import { CopyToClipboard as Copy} from 'react-copy-to-clipboard';
import FontAwesome from 'react-fontawesome';
import ReactTooltip from 'react-tooltip'

const COPY_REVERT_DURATION = 1000;
const COPY_TEXT = ['copied!', 'copy details'];

const CopyBlock = styled('small')({
  cursor: 'pointer',
  fontSize: '1em',
  '& span': {
    transition: 'color 200ms'
  },
  '& .copied': {
    color: 'rgba(185, 233, 212, 1)'
  }
});

class CopyToClipboard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          copied: false
      };
    }
    onCopy () {
      this.setState({copied: true})
      setTimeout(() => {
        this.setState({copied: false})
      }, COPY_REVERT_DURATION)
    }
    render() {
      const { value, text, icon, children } = this.props;
      const id = 'copy' + value.toString().replace(' ', '-');
      const { copied } = this.state
      const [textCopied, textCopy] = COPY_TEXT

      return (
          <CopyBlock>
              <ReactTooltip
                  id={id}
                  className='small-tooltip'
                  effect='solid'
                  getContent={() => copied ? textCopied : text || textCopy }
              />
              <Copy
                  text={value}
                  data-for={id}
                data-tip
                  onCopy={this.onCopy.bind(this)}
              >
                {children}
              </Copy>
          </CopyBlock>
      );
    }
}

CopyToClipboard.propTypes = {
    value: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.string
};

export default CopyToClipboard
