import React, { Component } from "react";
import { connect } from "react-redux";

class SweepsContainer extends Component {
  render() {
    const { sweeps, selectedSweep, onSelectSweep } = this.props;
    return (
      <div className="sweeps">
        {sweeps &&
          !!sweeps.length && (
            <ol className="sweep-container">
              {sweeps.map(sweep => {
                return (
                  <li
                    key={sweep.sweepKey}
                    className="sweep"
                    style={{ backgroundColor: sweep.color }}
                    onClick={() => onSelectSweep(sweep.sweepKey)}
                    // onMouseEnter={() => onSelectSweep(sweep.sweepKey)}
                    // onMouseLeave={() => onSelectSweep()}
                  />
                );
              })}
            </ol>
          )}{" "}
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
