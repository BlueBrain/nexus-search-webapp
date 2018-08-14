
Usage example:

```
import extensions from '@bbp/nexus-search-webapp-extensions';

// Element to mount extensions
const containerEl = ...;

// Params to pass to extension instance
const extParams = {...};

const entityId = 'https://domain.com/api/org/domain/memodel/ver/uuid';
const Extensions = extensions.getByEntityId(entityId);

// Access Extension attributes via .attrs
const extensionNames = Extensions.map(Extension => Extension.attrs.name);
const extensionIconTypes = Extensions.map(Extension => Extension.attrs.iconType);

// Create extension instances
const extInstances = Extensions
    .forEach(Extension => new Extension(containerEl, extParams));

// Dispose when they are not needed anymore
function destroyAll() {
    extInstances.forEach(extInstance => extInstance.destroy());
}
```
