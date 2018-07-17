
# Nexus search webapp extension

## Development

install your dependencies
```npm install```

run the webserver so you can develop the extension independently!
```npm run serve```

### Link with Search App

You can use linking to develop the extension in tandem with Search
```npm link```

then in the Search App directory, run
```npm link @bbp/nexus-search-extensions-example ```

this will tell the Search App where to find this package

now you can make changes here and they'll show in your search app

you may need to use ```npm run build``` before the search app can properly use your exported extension.

## Publish

package the app with
```npm run build```
