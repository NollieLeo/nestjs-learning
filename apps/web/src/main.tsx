import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';

if (process.env.NODE_ENV === 'development') {
  import('@locator/runtime').then((locator) => {
    // locator.default 是给 CJS 或 babel 的后备，如果是 ESM 或 SWC 直接调 setup() 或者默认导出就是函数
    if (typeof locator.default === 'function') {
      locator.default();
    } else if (typeof locator.setup === 'function') {
      locator.setup();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
);
