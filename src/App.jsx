// src/App.jsx
import { RouterProvider } from 'react-router-dom';
import RecoveryModal from './components/RecoveryModal';
import { router } from './routes';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <RecoveryModal />
    </>
  );
}

export default App;
