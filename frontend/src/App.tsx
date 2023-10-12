import { RouterProvider } from 'react-router-dom';
import router from './router';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { profile } from './store/actions/auth.action';

function App() {
  useEffect(() => {
    store.dispatch(profile());
  }, []);
  return (
    <SnackbarProvider maxSnack={5}>
      <Provider store={store}>
        <div className="min-h-screen bg-background font-sans antialiased">
          <RouterProvider router={router} />
        </div>
      </Provider>
    </SnackbarProvider>
  );
}

export default App;
