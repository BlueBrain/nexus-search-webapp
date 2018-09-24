import React, { Component } from "react";
import { connect } from "react-redux";
import PlayIterable from "./PlayIterable";
import { findIndex, sortBy } from "underscore";
import { getProp } from "@libs/utils";
import { Tooltip } from "antd";

function setSweepClass (key, selectedSweep) {
  if (key === selectedSweep) {
    return "sweep selected"
  } else {
    return "sweep";
  }
}

class SweepsContainer extends Component {
  render() {
    const { sweeps, selectedSweep, onSelectSweep } = this.props;
    const sweepIndex = findIndex(sweeps, sweep => sweep.sweepKey === selectedSweep);
    const selectedSweepObj = sweeps[sweepIndex]
    const currents = getProp(selectedSweepObj, "current.i_segments");
    const maxCurrent = sortBy(currents || [], "amp");
    return (
      <div className="sweeps">
        {sweeps && !!sweeps.length &&
          <PlayIterable
          className="sweep-container"
          iterables={sweeps}
          interval={700}
          startIndex={sweepIndex}
          onIterate={iterable => onSelectSweep(iterable.sweepKey)}
          renderIterable={iterable => {
            return (
              <Tooltip title={`sweep ${iterable.sweepKey} (${iterable.maxCurrent.toFixed(2)} pA)`}>
              <li
                key={iterable.sweepKey}
                className={setSweepClass(iterable.sweepKey, selectedSweep)}
                style={{ backgroundColor: iterable.color }}
                onClick={() => onSelectSweep(iterable.sweepKey)}
              />
              </Tooltip>
            );
          }}
        />
        }
        <div>
          {selectedSweep && (
            <div className="sweep-label">
              <span>sweep <em>{selectedSweep}</em></span>
            </div>
          )}
          {maxCurrent && !!maxCurrent.length && (
            <div className="sweep-label">
              <span>current <em>{maxCurrent.pop().amp.toFixed(2)} pA</em></span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(SweepsContainer);
