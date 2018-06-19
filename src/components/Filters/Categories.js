import React from "react";
import { Tree, Icon } from "antd";
import brain from "../../public/img/brain.svg";
import paw from "../../public/img/pawprint.svg";
import mouse from "../../public/img/mouse.svg";
import experiment from "../../public/img/test.svg";
import person from "../../public/img/user.svg";
import SVG from "react-svg";
import Facets from "./Facets";

const { TreeNode } = Tree;

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const MyTree = () => {
  return (
    <Tree showIcon>
      <TreeNode
        icon={
          <SVG
            path={brain}
            onInjected={svg => {
            }}
            svgClassName="svg-class-name"
            className="tree"
            onClick={() => {
            }}
          />
        }
        title="Brain Regions"
        key={uuidv4()}
      >
        <TreeNode icon={<Icon type="meh-o" />} title="Thalamus" key="0-0-0" />
        <TreeNode
          icon={({ selected }) => (
            <Icon type={selected ? "frown" : "frown-o"} />
          )}
          title="Hippocampus"
          key={uuidv4()}
        />
      </TreeNode>
      <TreeNode
        icon={
          <SVG
            path={mouse}
            onInjected={svg => {
              console.log("onInjected", svg);
            }}
            svgClassName="svg-class-name"
            className="tree"
            onClick={() => {
              console.log("wrapper onClick");
            }}
          />
        }
        title="Subjects"
        key={uuidv4()}
      />

      <TreeNode
        icon={
          <SVG
            path={person}
            onInjected={svg => {
            }}
            svgClassName="svg-class-name"
            className="tree"
            onClick={() => {
            }}
          />
        }
        title="People"
        key={uuidv4()}
      />
      <TreeNode
        icon={
          <SVG
            path={experiment}
            onInjected={svg => {
            }}
            svgClassName="svg-class-name"
            className="tree"
            onClick={() => {
            }}
          />
        }
        title="Activities"
        key={uuidv4()}
      />
      <TreeNode
        icon={
          <SVG
            path={paw}
            onInjected={svg => {
            }}
            svgClassName="svg-class-name"
            className="tree"
            onClick={() => {
            }}
          />
        }
        title="Species"
        key={uuidv4()}
      />
    </Tree>
  );
};

const Categories = () => (
  <div className="categories">
    <div className="center grow">
      <MyTree />
    </div>
    <Facets />
  </div>
);

export default Categories;
