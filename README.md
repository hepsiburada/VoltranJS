# VoltranJS

[![Hepsiburada](./src/assets/hepsiburada.png)](https://www.hepsiburada.com)
[![Hepsitech](./src/assets/hepsitech.png)](https://www.hepsiburada.com)

### What is Voltran and why you should use it?

Voltran is a micro frontend framework which is developed by Hepsiburada Technology Team. [Micro frontends](https://micro-frontends.org/) help cross functional teams to make end-to-end and independent developments and deployments.

You can use Voltran if you need a micro frontend framework that provides following features:

  - Ligthweight and fast API
  - Serves single and multiple components
  - Preview (to visaulize components)
  - SEO friendly (if needed)
  - CSS & SCSS support
  - Supports only React (for now)

### Installation

Voltran requires [Node.js](https://nodejs.org/) v10.15.0+ to run.

Install the Voltran.

#### Yarn
```sh
$ yarn add voltran 
```

#### Npm
```sh
$ npm install voltran
```

Run the scripts for development...

```sh
$ voltran start --dev
```

For Production...

```sh
$ voltran serve
```

### Usage

This is an example component.

First of all, you should import 'require('@voltran/core');'.

After that we can write the component's code.


**HelloWorld.js**


```

const voltran = require('@voltran/core');

import React from 'react';

const ROUTE_PATHS = {
  HELLOWORLDPAGE: '/HelloWorld',
};

const HelloWorld = ({initialState}) => {

    return (
        <>
            Hello World!
        </>
    );
};

const component = voltran.default.withBaseComponent(HelloWorld, ROUTE_PATHS.HELLOWORLDPAGE);

export default component;


```

If you want to fetch data from server side, you should add 'getInitialState'.


**./conf/local.config.js**


```

const port = 3578;

module.exports = {
  port: port,
  baseUrl: `http://localhost:${port}`,
  mediaUrl: '',
  baseUrl: `http://localhost:${port}`,
  services: {
    'voltranapi': {
      'clientUrl': 'http://voltran-api.qa.hepsiburada.com',
      'serverUrl': 'http://voltran-api.qa.hepsiburada.com' 
    }
  },
  timeouts: {
    clientApiManager: 20 * 1000,
    serverApiManager: 20 * 1000  
  }
};


```


**HelloWorld.js**


```

const voltran = require('@voltran/core');

import React from 'react';
import appConfig from '../appConfig';

const ROUTE_PATHS = {
  HELLOWORLDPAGE: '/HelloWorld',
};

const HelloWorld = ({initialState}) => {
    HelloWorld.services = [appConfig.services.voltranApi];
    
    HelloWorld.getInitialState = (voltranApiClientManager, context) => {
      const config = { headers: context.headers };
      const params = {...};
      
      return getName({ params }, voltranApiClientManager, config);
    };
    
    return (
        <>
            Hello World. My name is {initialState.name}!
        </>
    );
};

const component = voltran.default.withBaseComponent(HelloWorld, ROUTE_PATHS.HELLOWORLDPAGE);

export default component;


```


**Output For Preview**

```
Hello World. My Name is Volkan!

```

**Output For Api**

```
{
    html: ...,
    scripts: [...],
    style: [...],
    activeComponent: {
        resultPath: "/HelloWorld",
        componentName: "HelloWorld",
        url: "/HelloWorld"
    },
}

```


### Configs

Voltran requires following configurations:

| **Config** | **Type** |
| ------ | ------ |
| [appConfigFile](#appConfigFile) | Object |
| [dev](#dev) | Boolean |
| [distFolder](#distFolder) | String |
| [publicDistFolder](#publicDistFolder) | String |
| [inputFolder](#inputFolder) | String  * `required` |
| [monitoring](#monitoring) | Object |
| [port](#port) | Number - String |
| [prefix](#prefix) | String * `required` |
| [ssr](#ssr) | String |
| [styles](#styles) | Array |
| [output](#output) | Object |
| [staticProps](#staticProps) | Array |
| [routing](#routing) | Object |
| [webpackConfiguration](#webpackConfiguration) | Object |


### appConfigFile

It should contains environment specific configurations (test, production ...).
```
appConfigFile: {
  entry: path.resolve(__dirname, './yourConfigFolder/'),
  output: {
    path: path.resolve(__dirname, './yourOutputFolder/'),
    name: 'yourFileName',
  }
}
```
### dev
Development mode. Set to `true` if you need to debug.

`Default`: `false`

### distFolder
The path to the folder where bundled scripts will be placed after the build.

`Default`: `./dist`

### publicDistFolder
The path to the folder where asset files will be placed after the build.

`Default`: `./dist/assets`

### inputFolder
The path to the folder that contains script files. It's required.

Passes this config to Babel Loader where it reads all js files under this folder.

'Voltran' converts your files to the appropriate format and optimizes them.

### monitoring
For now, only prometheus is supported.
```
monitoring: {
  prometheus: false
}
```
> or you can set your custom js file.

```
monitoring: {
    prometheus: path.resolve(__dirname, './src/tools/prometheus.js')
}
```

### port
`Default`: `3578`
> If you want to change the port
> you may need to change the port in appConfigFiles

### prefix
`It is required.`

There may be different components owned by different teams using voltrans on the same page. Voltran needs to use a prefix in order to avoid conflicts issues.
This prefix is prepended to initial states and CSS class names.
> We recommend that each team use their own acronyms/prefixes.

### ssr
`Default`: `true`
Voltran supports server side rendering.
Applications that need 'SEO' features needs to set this parameter to `true`.

### styles
This field's value should be array of strings. Array values should be the paths to the global CSS files.

```
styles: [
    path.resolve(__dirname, './some-css-file.scss'),
    path.resolve(__dirname, './node_modules/carousel/carousel.css')
]
```

### output
```
output: {
  client: {
    path: path.resolve(__dirname, './build/public/project/assets'),
    publicPath: path.resolve(__dirname, './src/assets'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  server: {
    path: path.resolve(__dirname, './build/server'),
    filename: '[name].js'
  },
},
```

### staticProps
You can pass static props to all components at the same time.

```
staticProps: [
  {'key': value}
]
```

### routing
Voltran need two files to set routing.

```
routing: {
  components: path.resolve(__dirname, './src/appRoute/components.js'),
  dictionary: path.resolve(__dirname, './src/appRoute/dictionary.js')
}
```

Example files can be found here:
   - [components.js](https://github.com/hepsiburada/VoltranJS-Starter-Kit/blob/master/src/appRoute/components.js)
   - [directory.js](https://github.com/hepsiburada/VoltranJS-Starter-Kit/blob/master/src/appRoute/dictionary.js) 
   
### webpackConfiguration

You can add your webpack configuration. They will be merged with the voltran configs.

You can access the starter kit we created from the [link](https://github.com/hepsiburada/VoltranJS-Starter-Kit).

### Tech

Voltran uses a number of open source projects to work properly:

* [ReactJS] - A JavaScript library for building user interfaces!
* [Webpack] - Module bundler
* [babel] - The compiler for next generation JavaScript.
* [node.js] - evented I/O for the backend
* [hiddie] - fast node.js network app framework (friendly fork of [middie](https://github.com/fastify/middie))
* [Yarn] - the streaming build system


## contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D