import { useEffect, useState } from 'react';
import './WorkerList.css';

function WorkerList() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    fetch('https://connectnipun-backend.onrender.com/api/workers')
      .then(res => res.json())
      .then(data => setWorkers(data))
      .catch(err => console.error('Error fetching workers:', err));
  }, []);

  return (
    <div className="worker-list-container">
      <h2>Registered Workers</h2>
      <div className="worker-cards">
        {workers.map(worker => (
          <div className="worker-card" key={worker._id}>
            <img
              src={`https://connectnipun-backend.onrender.com/uploads/${worker.image}`}
              alt={worker.name}
              className="worker-image"
            />
            <h3>{worker.name}</h3>
            <p><strong>Skill:</strong> {worker.skill}</p>
            <p><strong>District:</strong> {worker.district}</p>
            <p><strong>Pincode:</strong> {worker.pincode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkerList;
