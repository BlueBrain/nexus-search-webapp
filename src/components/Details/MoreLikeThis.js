import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Spin } from "antd";
import SearchSnippet from "../Cards/Cell";

function getMoreLikeThis(api, id) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/more/${id}`)
      .then(response => {
        if (response.status < 400) {
          return response.json();
        } else {
          throw new Error("failed to more like this");
        }
      })
      .then(resolve)
      .catch(reject);
  });
}

class MoreLikeThis extends PureComponent {
  state = { items: [], pending: true }
  async componentDidMount () {
    try {
      let items = await getMoreLikeThis(this.props.api, this.props.id);
      console.log({items})
      this.setState({ items, pending: false });
    } catch (error) {
      console.error(error);
    }
  }
  render () {
    const { pending, items } = this.state;
    return (
      <Spin spinning={pending} delay={300}>
        <div id="search-results" className="grid" style={{ height: 400 }}>
          {items.map((item, index) =>
              <SearchSnippet
                key={`${item._source["@id"]}-${index}`}
                value={item._source}
                id={item._id}
                openVisualizer={() => {}}
            />
          )}
        </div>
      </Spin>
    );
  }

};

function mapStateToProps({ config }) {
  return {
    api: config.elasticSearchAPI
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MoreLikeThis);