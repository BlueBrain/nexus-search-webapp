import React, { PureComponent } from "react";
import { find } from "underscore";
import { getProp } from "../../../libs/utils";
import { getDistributionFromInstance } from "../../../libs/distributions";
import PrivateImage from "../../PrivateImage";
import WithNexusInstance from "../../WithNexusInstance";

const STIMULUS_TYPES = [
  "IDthresh", "IDRest", "APWaveform", "SpikeRec", "IV"
]

const BEST_TRACE = "IDrest";

function getBestTrace(traces) {
  let best = find(
    traces,
    trace => trace.stimulus && trace.stimulus.label === BEST_TRACE
  );
  if (best) {
    return best;
  }
  let [head, ...tail] = traces;
  return head;
}

function getStimulusTypeFromTrace (trace) {
  let fileName = getProp(trace, "name", "");
  let name
  STIMULUS_TYPES.forEach(stimulus => {
    if (fileName.toLowerCase().indexOf(stimulus.toLowerCase()) >= 0) {
      name = stimulus;
      return false;
    }
  });
  return name;
}

function getPreviewEntityFromTrace(trace) {
  return getProp(trace, "image.@id");
}

class EphysPreview extends PureComponent {
  render() {
    let trace = getBestTrace(this.props.traces);
    let instanceID = getPreviewEntityFromTrace(trace);
    let { disabled } = this.props;
    return (
      <div className="ephys" style={{ zIndex: 1 }}>
        {instanceID &&
          <WithNexusInstance
          instanceID={instanceID}
          render={({ instance }) => (
            <div className={`stimulus fade ${disabled ? "" : "in"}`}>
              <div className="label">
                {getStimulusTypeFromTrace(trace)}
              </div>
              <PrivateImage src={getDistributionFromInstance(instance)} makeClassName={loaded => "fade " + (loaded ? "in slow" : "")} />
            </div>
          )}
        />
        }
      </div>
    );
  }
}

export default EphysPreview;
