
Usage example:

```
import extensions from '@bbp/nexus-search-webapp-extensions';

// Element to mount extensions
const containerEl = ...;

// Params to pass to extension instance
const extParams = {...};

const entityType = 'nsg:Morphology';
const Extensions = extensions.getByEntityType(entityType);

// Access Extension attributes via .attrs
const extensionNames = Extensions.map(Extension => Extension.attrs.name);

// Create extension instances
const extInstances = Extensions
    .forEach(Extension => new Extension(containerEl, extParams));

// Dispose when they are not needed anymore
function destroyAll() {
    extInstances.forEach(extInstance => extInstance.destroy());
}
```
