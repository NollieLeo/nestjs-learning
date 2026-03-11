import { RouterProvider } from 'react-router';
import router from './router';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
