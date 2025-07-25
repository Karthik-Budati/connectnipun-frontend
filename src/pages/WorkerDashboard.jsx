
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPhone,
  faWrench,
  faMapMarkerAlt,
  faLocationPin,
  faUpload,
  faImage,
  faDownload,
  faQrcode
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import './WorkerDashboard.css';

function WorkerDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [workImage, setWorkImage] = useState(null);

  useEffect(() => {
    const isVerified = localStorage.getItem("isVerified");

    // If not verified, redirect
    if (!isVerified || isVerified !== "true") {
      setTimeout(() => {
        alert("You must verify your mobile number first.");
        navigate("/register");
      }, 100);
      return;
    }

    const fetchWorker = async () => {
      try {
        const res = await fetch(`https://connectnipun-backend.onrender.com/api/workers/${id}`, {
          headers: {
            "x-verified": "true"
          }
        });

        if (res.status === 401) {
          alert("Access denied! Please verify your mobile number.");
          navigate("/register");
          return;
        }

        const data = await res.json();
        setWorker(data);
      } catch (err) {
        console.error('Error fetching worker:', err);
        alert("Failed to fetch worker data.");
      }
    };

    fetchWorker();
  }, [id, navigate]);

   const handleLogout = () => {
    localStorage.removeItem("isVerified");
    navigate("/register");
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!workImage) return alert('Select an image first');

    const formData = new FormData();
    formData.append('workImage', workImage);

    try {
      const res = await fetch(`https://connectnipun-backend.onrender.com/api/workers/${id}/upload-work-image`, {
        method: 'POST',
        headers: {
          "x-verified": "true"
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setWorker(prev =>
          prev ? { ...prev, workImages: [...(prev.workImages || []), data.imagePath] } : prev
        );
        setWorkImage(null);
        alert('Image uploaded');
      } else {
        alert(data.error || 'Failed to upload');
      }
    } catch (err) {
      alert('Upload failed');
    }
  };

  if (!worker) return <p>Loading...</p>;

  return (
    <>
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        Connect Nipun | Worker Dashboard
         <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-top">
          <div className="user-info">
            <h2><FontAwesomeIcon icon={faUser} /> Welcome, {worker.name}</h2>
            <p><FontAwesomeIcon icon={faPhone} /> {worker.mobile}</p>
            <p><FontAwesomeIcon icon={faWrench} /> {worker.skill}</p>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {worker.district}, {worker.mandal}, {worker.village}</p>
            <p><FontAwesomeIcon icon={faLocationPin} /> {worker.pincode}</p>
           
          </div>

          {worker.image && (
            <img
              src={worker.image}
              alt="Profile"
              className="profile-image"
            />
          )}
        </div>

        <div className="middle-section">
          <div className="qr-section">
            <h3><FontAwesomeIcon icon={faQrcode} /> QR Code</h3>
            {worker.qrUrl ? (
              <>
                <img
                  src={worker.qrUrl}
                  alt="QR Code"
                  className="qr-image"
                />
                <a
                className="btn"
                href={worker.qrUrl}
                download={`${worker.name}-QR.png`}
              >
                <FontAwesomeIcon icon={faDownload} /> Download QR
              </a>

              </>
            ) : (
              <p>QR Code not generated.</p>
            )}
          </div>

          <div className="upload-section">
            <h3><FontAwesomeIcon icon={faUpload} /> Upload Work Sample</h3>
            <form onSubmit={handleImageUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setWorkImage(e.target.files[0])}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faUpload} /> Upload
              </button>
            </form>
          </div>
        </div>

        <div className="slider-container">
          <h3><FontAwesomeIcon icon={faImage} /> Work Samples</h3>
          {worker.workImages?.length > 0 ? (
            <div className="slider-wrapper">
              <div className="slider-images">
                {worker.workImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Work ${i}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No images uploaded.</p>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 Connect Nipun. All rights reserved.</p>
        <p>Contact us: connect.helpdesk@gmail.com</p>
        <p>Made with 💙 for India’s workforce</p>
      </footer>
    </>
  );
}

export default WorkerDashboard;
