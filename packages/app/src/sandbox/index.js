import { camelizeKeys } from 'humps';
import { isStandalone, listen, dispatch } from 'codesandbox-api';

import _debug from 'app/utils/debug';

import registerServiceWorker from 'common/registerServiceWorker';
import requirePolyfills from 'common/load-dynamic-polyfills';
import { getModulePath } from 'common/sandbox/modules';
import { generateFileFromSandbox } from 'common/templates/configuration/package-json';
import setupConsole from 'sandbox-hooks/console';
import setupHistoryListeners from 'sandbox-hooks/url-listeners';
import Peer from 'simple-peer';

import compile, { getCurrentManager } from './compile';

const host = process.env.CODESANDBOX_HOST;
const debug = _debug('cs:sandbox');

export const SCRIPT_VERSION =
  document.currentScript && document.currentScript.src;

debug('Booting sandbox');

function getId() {
  if (!process.env.LOCAL_SERVER) {
    return document.location.hash.replace('#', '');
  }

  if (process.env.STAGING) {
    const segments = host.split('//')[1].split('.');
    const first = segments.shift();
    const re = RegExp(`${first}-(.*)\\.${segments.join('\\.')}`);
    return document.location.host.match(re)[1];
  }

  const hostRegex = host.replace(/https?:\/\//, '').replace(/\./g, '\\.');
  const sandboxRegex = new RegExp(`(.*)\\.${hostRegex}`);
  return document.location.host.match(sandboxRegex)[1];
}

requirePolyfills().then(() => {
  registerServiceWorker('/sandbox-service-worker.js', {});

  function sendReady() {
    dispatch({ type: 'initialized' });
  }

  async function handleMessage(data, source) {
    if (source) {
      if (data.type === 'compile') {
        if (data.version === 3) {
          debug(data);
          compile(data);
        } else {
          const compileOld = await import('./compile-old').then(x => x.default);
          compileOld(data);
        }
      } else if (data.type === 'get-transpiler-context') {
        const manager = getCurrentManager();

        if (manager) {
          const context = await manager.getTranspilerContext();
          dispatch({
            type: 'transpiler-context',
            data: context,
          });
        } else {
          dispatch({
            type: 'transpiler-context',
            data: {},
          });
        }
      }
    }
  }

  if (!isStandalone) {
    listen(handleMessage);

    sendReady();

    setupHistoryListeners();
    setupConsole();
  }
  window.addEventListener(
    'message',
    function(event) {
      // var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
      // if (origin !== /*the container's domain url*/)
      //     return;
      const peer = new Peer({ trickle: false });

      peer.on('error', function(err) {
        console.log('error', err);
      });

      window.parent.postMessage(
        { data: { call: 'initializePeerConnection' } },
        'http://localhost:8080'
      );

      peer.on('signal', function(data) {
        debug('SIGNAL', JSON.stringify(data));
        window.parent.postMessage(
          { call: 'establishPeerConnection', value: JSON.stringify(data) },
          'http://localhost:8080'
        );
      });

      peer.on('data', function(data) {
        debug('frame: ' + data);
      });

      if (
        typeof event.data == 'object' &&
        event.data.call == 'establishPeerConnection'
      ) {
        peer.signal(JSON.parse(event.data.value));
        debug(event.data.value);
      }
    },
    false
  );
  const x = {
    data: {
      view_count: 1642976,
      version: 52,
      user_liked: false,
      updated_at: '2018-10-02T17:27:53.960118',
      title: null,
      template: 'create-react-app',
      team: null,
      tags: [],
      source_id: '6bd39aa7-9800-45fb-9487-c915634d8d4f',
      privacy: 0,
      owned: false,
      original_git_commit_sha: null,
      original_git: null,
      npm_dependencies: { 'react-dom': '16.0.0', react: '16.0.0' },
      modules: [
        {
          title: 'package.json',
          source_id: '6bd39aa7-9800-45fb-9487-c915634d8d4f',
          shortid: 'ZGQK6',
          is_binary: false,
          id: 'dd3f0f6a-4555-457f-b2af-963bf00f9172',
          directory_shortid: null,
          code:
            '{\n  "name": "new",\n  "version": "1.0.0",\n  "description": "",\n  "keywords": [],\n  "main": "src/index.js",\n  "dependencies": {\n    "react": "16.5.2",\n    "react-dom": "16.5.2",\n    "react-scripts": "2.0.3"\n  },\n  "devDependencies": {},\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test --env=jsdom",\n    "eject": "react-scripts eject"\n  },\n  "browserslist": [\n    ">0.2%",\n    "not dead",\n    "not ie <= 11",\n    "not op_mini all"\n  ]\n}',
        },
        {
          title: 'index.js',
          source_id: '6bd39aa7-9800-45fb-9487-c915634d8d4f',
          shortid: 'wRo98',
          is_binary: false,
          id: '928871a1-bbdc-425c-ace2-0b302b14a58a',
          directory_shortid: 'GXOoy',
          code:
            'import React from "react";\nimport ReactDOM from "react-dom";\n\nimport "./styles.css";\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello CodeSandbox</h1>\n      <h2>Start editing to see some magic happen with!</h2>\n    </div>\n  );\n}\n\nconst rootElement = document.getElementById("root");\nReactDOM.render(<App />, rootElement);\n',
        },
        {
          title: 'styles.css',
          source_id: '6bd39aa7-9800-45fb-9487-c915634d8d4f',
          shortid: 'qZyB7',
          is_binary: false,
          id: '9224aee8-b579-4f68-8a8c-e647098f50cc',
          directory_shortid: 'GXOoy',
          code:
            '.App {\n  font-family: sans-serif;\n  text-align: center;\n}\n',
        },
        {
          title: 'index.html',
          source_id: '6bd39aa7-9800-45fb-9487-c915634d8d4f',
          shortid: 'BA1N',
          is_binary: false,
          id: '9c54d8d0-5a0e-4e5f-8794-3092757733ee',
          directory_shortid: 'rgkK4',
          code:
            '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n\t<meta charset="utf-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n\t<meta name="theme-color" content="#000000">\n\t<!--\n      manifest.json provides metadata used when your web app is added to the\n      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/\n    -->\n\t<link rel="manifest" href="%PUBLIC_URL%/manifest.json">\n\t<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">\n\t<!--\n      Notice the use of %PUBLIC_URL% in the tags above.\n      It will be replaced with the URL of the `public` folder during the build.\n      Only files inside the `public` folder can be referenced from the HTML.\n\n      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will\n      work correctly both with client-side routing and a non-root public URL.\n      Learn how to configure a non-root public URL by running `npm run build`.\n    -->\n\t<title>React App</title>\n</head>\n\n<body>\n\t<noscript>\n\t\tYou need to enable JavaScript to run this app.\n\t</noscript>\n\t<div id="root"></div>\n\t<!--\n      This HTML file is a template.\n      If you open it directly in the browser, you will see an empty page.\n\n      You can add webfonts, meta tags, or analytics to this file.\n      The build step will place the bundled scripts into the <body> tag.\n\n      To begin the development, run `npm start` or `yarn start`.\n      To create a production bundle, use `npm run build` or `yarn build`.\n    -->\n</body>\n\n</html>',
        },
      ],
      like_count: 429,
      is_sse: false,
      is_frozen: false,
      id: 'new',
      git: null,
      forked_from_sandbox: null,
      fork_count: 0,
      external_resources: [],
      entry: 'src/index.js',
      directories: [
        {
          title: 'src',
          source_id: '6bd39aa7-9800-45fb-9487-c915634d8d4f',
          shortid: 'GXOoy',
          id: 'd27aefca-c15c-41a1-b9d5-bd362fdd7f19',
          directory_shortid: null,
        },
        {
          title: 'public',
          source_id: '6bd39aa7-9800-45fb-9487-c915634d8d4f',
          shortid: 'rgkK4',
          id: '859f77fe-8e09-4efb-bd44-f66ea4f949e4',
          directory_shortid: null,
        },
      ],
      description: null,
      author: null,
    },
  };
  const id = getId();
  const moduleObject = {};

  // We convert the modules to a format the manager understands
  x.data.modules.forEach(m => {
    const path = getModulePath(x.data.modules, x.data.directories, m.id);
    moduleObject[path] = {
      path,
      code: m.code,
    };
  });

  if (!moduleObject['/package.json']) {
    moduleObject['/package.json'] = {
      code: generateFileFromSandbox(x.data),
      path: '/package.json',
    };
  }

  const data = {
    sandboxId: id,
    modules: moduleObject,
    entry: '/' + x.data.entry,
    externalResources: x.data.externalResources || [],
    dependencies: x.data.npmDependencies,
    hasActions: false,
    template: x.data.template,
    version: 3,
  };

  return compile(data);
  if (process.env.NODE_ENV === 'test' || isStandalone) {
    // We need to fetch the sandbox ourselves...
    const id = getId();
    window
      .fetch(host + `/api/v1/sandboxes/new`, {
        credentials: 'include',
      })
      .then(res => res.json())
      .then(res => {
        const camelized = camelizeKeys(res);
        camelized.data.npmDependencies = res.data.npm_dependencies;

        return camelized;
      })
      .then(x => {
        const moduleObject = {};

        // We convert the modules to a format the manager understands
        x.data.modules.forEach(m => {
          const path = getModulePath(x.data.modules, x.data.directories, m.id);
          moduleObject[path] = {
            path,
            code: m.code,
          };
        });

        if (!moduleObject['/package.json']) {
          moduleObject['/package.json'] = {
            code: generateFileFromSandbox(x.data),
            path: '/package.json',
          };
        }

        const data = {
          sandboxId: id,
          modules: moduleObject,
          entry: '/' + x.data.entry,
          externalResources: x.data.externalResources,
          dependencies: x.data.npmDependencies,
          hasActions: false,
          template: x.data.template,
          version: 3,
        };

        compile(data);
      });
  }
});
