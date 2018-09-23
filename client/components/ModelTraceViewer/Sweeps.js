import React, { Component } from "react";
import { connect } from "react-redux";
import PlayIterable from "./PlayIterable";
import { findIndex } from "underscore";

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
    console.log(sweeps, selectedSweep)
    return (
      <div className="sweeps">
        {sweeps && !!sweeps.length &&
          <PlayIterable
          className="sweep-container"
          iterables={sweeps}
          interval={700}
          startIndex={findIndex(sweeps, sweep => sweep.key === "selectedSweep")}
          onIterate={iterable => onSelectSweep(iterable.sweepKey)}
          renderIterable={iterable => {
            return (
              <li
                key={iterable.sweepKey}
                className={setSweepClass(iterable.sweepKey, selectedSweep)}
                style={{ backgroundColor: iterable.color }}
                onClick={() => onSelectSweep(iterable.sweepKey)}
                // onMouseEnter={() => onSelectSweep(sweep.sweepKey)}
                // onMouseLeave={() => onSelectSweep()}
              />
            );
          }}
        />
        }
        <div>
          {selectedSweep && (
            <div>
              <span>sweep: {selectedSweep}</span>
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
