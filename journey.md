## Adding Static Assets
When adding static assets I had to do a couple things to get it to work:

### Make sure that webpack can load my asset (a png)
https://webpack.js.org/guides/asset-management/

*Rationale*
By using webpack's `file-loader` I'm able to bundle my assets and resolve their names to content hashes. If an image changes, the content hash changes. This allows us to take advantage of the browser cache without manually renaming images that change. However, the hash obfuscates the location of the image which makes it more difficult to debug if we're trying to change an image.

*What worked*
By default, `file-loader` emits the content hash of the file as the file name. This is what we want in production so I went aheaded and added it to our webpack prod client config (`webpack.prod.client.js`). For the dev environment, we added an option to the loader that emits `[path][name].[ext]?[contenthash]`. This way we'll know where the file is located while still maintaining the advantages of cacheing.

### Typescript doesn't know what to do with *.png files
https://github.com/webpack-contrib/raw-loader/issues/56
https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations

*Rationale*
Typescript did not like that it was trying to resolve a *.png module and would spit out errors when building or testing. By default, the Typescript compiler only cares about *.ts files. After doing the initial setup of this website to allow Typescript to work with React, Webpack, and Jest along with some common use cases (json modules) it was able to resolve (\*.ts, *.tsx, *.json) extensions and play nicely with Webpack. Yup, I totally forgot that Typescript doesn't know what to do with other files like assets.

*What worked*
Tell Typescript what it is. We created a declaration file (`client.d.ts`) that declared that the structure of modules that ended in `*.png` would default export a string (as in what `file-loader` would spit out) and Typescript was happy to eat that up. In general when Typescript "can't find a module" it means either I mispelled the path (has happened more than once D:) or we need to tell Typescript how to recognize those files and imports (either with configuration options or declaration files).

### Jest doesn't like my assets
https://stackoverflow.com/questions/46898638/importing-images-breaks-jest-test
https://jestjs.io/docs/en/webpack.html
https://jestjs.io/docs/en/configuration#modulenamemapper-object-string-string

*Rationale*
When trying to build the client the Jest tests continued to fail. The Jest resolver was unable to find our image file and kept asking us to check that `moduleFileExtensions` were correct. From the Stack Overflow comment, it seems that Jest is trying to read the image as JavaScript. So, instead we told Jest that if you find any modules that end in one of the many asset formats, use the specified mock file (which happens to return a string, the same thing file-loader would have done). Just for good measure we also included a mock for CSS files.

*What worked*
We modified the `jest.config.js` to map any asset extensions (e.g. `png, jpg, woff`) to a mock file we created called `<rootDir>/__mocks__/fileMock.js`. The mock file contained the code that mimicked what `file-loader` would have returned. `<rootDir>` is the root of the directory containing the Jest config file and is something resolved by Jest. We did something similar for CSS as it seemed like it would be a common use case.

## Testing with React Router Components
When using `react-router` inside Jest theres something special we need to do:

### Can't use Link without Router
https://reacttraining.com/react-router/web/guides/testing
*Rationale*
When trying to use our test renderer (`react-test-renderer`) on a component that contained a `Link`, it failed. The reason for that is because `react-router` relies on the React context API to function properly (much like `styled-components` and theming).

*What worked*
Wrap the component in a `MemoryRouter` or `StaticRouter`. These routers provide specific utilities for testing (per the docs). I didn't try to use a `BrowserRouter` because it wasn't specified in the docs and I figured sticking a browser context in a server environment would lead to bad times. So far so good, we'll see whether this method is scalable or causes other downstream issues.