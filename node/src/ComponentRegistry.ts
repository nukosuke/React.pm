import * as React from "react";

export default class ComponentRegistry {
  private registry: Map<string, React.ComponentClass<any>>;

  constructor() {
    this.registry = new Map();
  }

  register(components: {[key: string]: React.ComponentClass<any>}) {
    Object.keys(components).forEach(name => {
      if (this.registry.has(name)) {
        console.warn("Called register for component that is already registered", name);
      }
      this.registry.set(name, components[name]);
    });
  }

  get(name: string): React.ComponentClass<any> {
    return this.registry.get(name);
  }
}
