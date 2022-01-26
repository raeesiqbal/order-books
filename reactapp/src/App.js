import Styles from './App.css';
import {useRoutes} from 'hookrouter';
import IndexPage from './pages/IndexPage.js';
import CanvasPage from './pages/CanvasPage.js';
import BooksPage from './pages/BooksPage.js';
import ReorderPage from './pages/ReorderPage.js';
import ViewPage from './pages/ViewPage.js';
import PageNotFound from './pages/PageNotFound.js';

const routes = {
  '/': () => <IndexPage/>,
  '/pages/:id': (id) => <ReorderPage id={id}/>,
  '/edit/:id': (id) => <CanvasPage id={id}/>,
  '/books': () => <BooksPage />,
  '/view/:id': (id) => <ViewPage id={id}/>,
};


export default function App() {
  const routeResult = useRoutes(routes);

  return (
      <> 
        {routeResult || <PageNotFound />}
      </>
  );
}