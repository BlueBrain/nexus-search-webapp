import React, { Component } from "react";
import { connect } from "react-redux";
import PlayIterable from "./PlayIterable";
import { findIndex, sortBy } from "underscore";
import { getProp } from "@libs/utils";
import { Tooltip, Affix } from "antd";

function setSweepClass(key, selectedSweep) {
  if (key === selectedSweep) {
    return "sweep selected";
  } else {
    return "sweep";
  }
}

class SweepsContainer extends Component {
  state={
    affixed: false
  }
  handleAffixed (affixed) {
    this.setState({affixed});
  }
  render() {
    const { sweeps, selectedSweep, onSelectSweep } = this.props;
    const { affixed } = this.state;
    const sweepIndex = findIndex(
      sweeps,
      sweep => sweep.sweepKey === selectedSweep
    );
    const selectedSweepObj = sweeps[sweepIndex];
    const currents = getProp(selectedSweepObj, "current.i_segments");
    const maxCurrent = sortBy(currents || [], "amp");
    const selectedMaxCurrent = getProp(maxCurrent.pop(), "amp");
    return (
      <Affix offsetTop={0} onChange={this.handleAffixed.bind(this)}>
      <div className={affixed ? "sweeps affixed" : "sweeps"}>
        {sweeps &&
          !!sweeps.length && (
            <PlayIterable
              className="sweep-container"
              iterables={sweeps}
              interval={700}
              startIndex={sweepIndex}
              onIterate={iterable => onSelectSweep(iterable.sweepKey)}
              renderIterable={iterable => {
                // experimental traces don't have maxCurrent
                const toolTipText = !!iterable.maxCurrent
                  ? `sweep ${iterable.sweepKey} (${iterable.maxCurrent.toFixed(
                      2
                    )} pA)`
                  : `sweep ${iterable.sweepKey} `;

                return (
                  <Tooltip title={toolTipText} key={iterable.sweepKey}>
                    <li
                      className={setSweepClass(
                        iterable.sweepKey,
                        selectedSweep
                      )}
                      style={{ backgroundColor: iterable.color }}
                      onClick={() => onSelectSweep(iterable.sweepKey)}
                    />
                  </Tooltip>
                );
              }}
            />
          )}
        <div>
          {selectedSweep && (
            <div className="sweep-label">
              <span>
                sweep <em>{selectedSweep}</em>
              </span>
            </div>
          )}
          {selectedMaxCurrent && (
            <div className="sweep-label">
              <span>
                current <em>{selectedMaxCurrent.toFixed(2)} pA</em>
              </span>
            </div>
          )}
        </div>
      </div>
      </Affix>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(SweepsContainer);
