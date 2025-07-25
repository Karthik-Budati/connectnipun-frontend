import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterWorker from './pages/RegisterWorker';
import WorkerDashboard from './pages/WorkerDashboard';
import Layout from './components/Layout';
import WorkerList from './pages/WorkerList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterWorker />} />
        {/* <Route path="/workers" element={<WorkerList />} />*/}
         <Route path="/worker/:id" element={<WorkerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
