import Extension from "./index.js";

const EXTENSION_ELEMENT = window.extension;

const extension = new Extension(EXTENSION_ELEMENT, { data: "hello" });
extension.show();
