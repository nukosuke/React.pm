import * as React          from "react";
import * as ReactDOM       from "react-dom";
import * as ReactDOMServer from "react-dom/server";
import ComponentRegistry   from "./ComponentRegistry";


export default class PerlReact {
  private context: NodeJS.Global | Window | Object;
  private components: ComponentRegistry;

  constructor(context) {
    this.context = context || global || window;
    this.components = new ComponentRegistry();
  }

  register(components: {[key: string]: React.ComponentClass<any>}) {
    this.components.register(components);
  }

  render(name: string, props: React.Props<any>, domNodeId) {
    const component = this.components.get(name);
    return ReactDOM.render(React.createElement(component, props), document.getElementById(domNodeId));
  }


  serverRender(options) {
    const { name, domNodeId, props } = options;
    let html = "";
    // let console_replay;
    let has_errors = false;

    try {
      const componentObject = React.createElement(this.components.get(name), props); // TODO
      html = ReactDOMServer.renderToString(componentObject);
    }
    catch (e) {
      has_errors = true;
      html = "<p>error occured on PerlReact.js</p>";
    }

    return JSON.stringify({
      html,
      // TODO: console_replay,
      has_errors,
    });
  }
}
