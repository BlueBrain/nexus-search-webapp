import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import FontAwesome from "react-fontawesome";

const DEFAULT_INTERVAL = 1000;

class PlayIterableContainer extends Component {
  state = {
    index: this.props.startIndex || 0,
    playing: false
  }
  componentWillUnmount () {
    clearInterval(this.interval);
  }
  handlePlay () {
    this.iterate();
    this.interval = setInterval(this.iterate.bind(this), this.props.interval || DEFAULT_INTERVAL);
  }
  handlePause () {
    clearInterval(this.interval);
    this.setState({ playing: false });
  }
  iterate () {
    const { index } = this.state;
    const { iterables, onIterate } = this.props;
    let newIndex = index + 1;
    if (newIndex >= iterables.length) {
      newIndex = 0;
    }
    this.setState({ index: newIndex, playing: true }, () => onIterate(iterables[newIndex]));
  }
  render() {
    const { className, iterables, renderIterable } = this.props;
    const { playing } = this.state;
    const handlePlay = this.handlePlay.bind(this);
    const handlePause = this.handlePause.bind(this);
    return (
      <ol className={"play-iterable" + " " + className}>
        {function () {
          if (playing) {
            return <Button type="primary" shape="circle" size="small" className="playing" onClick={handlePause} ><FontAwesome name={"pause"} /></Button>
          } else {
            return<Button type="primary" shape="circle" size="small" onClick={handlePlay}><FontAwesome name={"play"} /></Button>
          }
        }()}
        {iterables.map(renderIterable)}
      </ol>
    )
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(PlayIterableContainer);
