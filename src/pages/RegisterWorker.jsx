import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterWorker.css';
import logo from '../assets/logo.png';

function RegisterWorker() {
  const [step, setStep] = useState('otp');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    skill: '',
    district: '',
    mandal: '',
    village: '',
    pincode: '',
    image: null,
  });
  const [qrPath, setQrPath] = useState('');
  const qrUrl = qrPath;
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const sendOtp = async () => {
    setError('');
    setMessage('');
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      const res = await fetch('https://connectnipun-backend.onrender.com/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setMessage('OTP sent successfully!');
      } else {
        setError(data.error || 'Failed to send OTP.');
      }
    } catch {
      setError('Network/server error while sending OTP.');
    }
  };

const verifyOtp = async () => {
  setError('');
  setMessage('');
  if (!/^\d{6}$/.test(otp)) {
    setError('Enter a valid 6-digit OTP');
    return;
  }
  try {
    const res = await fetch('https://connectnipun-backend.onrender.com/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp }),
    });
    const data = await res.json();
    if (res.ok) {
      const check = await fetch(`https://connectnipun-backend.onrender.com/api/workers/check/${mobile}`);
      const exists = await check.json();
      if (check.ok && exists.exists) {
        localStorage.setItem("isVerified", "true");
      navigate(`/worker/${exists.id}`);
      } else {
        setStep('form');
      }
    } else {
      setError(data.error || 'Invalid OTP');
    }
  } catch {
    setError('Server error while verifying OTP');
  }
};


  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append('mobile', mobile);
    try {
      const res = await fetch('https://connectnipun-backend.onrender.com/api/workers/register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStep('done');
        setQrPath(data.qrPath);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Server error during registration');
    }
  };

 const downloadQR = async () => {
  try {
    const response = await fetch(qrUrl, {
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error('Image not found or permission denied');
    }

    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
      throw new Error("Downloaded content is not an image");
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `connectnipun-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error.message);
    alert("QR download failed. Please try again or check the image URL.");
  }
};




  return (
    <div className="register-page">
      <header className="register-header">
        <img src={logo} alt="Connect Nipun Logo" />
        <h2>Connect Nipun</h2>
      </header>

      <main className="form-section">
        {step === 'otp' && (
          <div className="step-section">
            <h3>Verify Mobile Number</h3>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="input-field">
              <i className="fa fa-phone" />
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={mobile}
                maxLength={10}
                onChange={(e) => setMobile(e.target.value.trim())}
              />
            </div>

            {otpSent && (
              <div className="input-field">
                <i className="fa fa-key" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value.trim())}
                />
              </div>
            )}
            <button className="btn" onClick={otpSent ? verifyOtp : sendOtp}>
              {otpSent ? 'Verify OTP' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'form' && (
          <form className="step-section" onSubmit={handleSubmit} encType="multipart/form-data">
            <h3>Worker Registration</h3>
            {error && <div className="error-message">{error}</div>}

            {[
              { name: 'name', icon: 'user', placeholder: 'Full Name' },
              { name: 'skill', icon: 'wrench', placeholder: 'Skill (e.g. Plumber)' },
              { name: 'district', icon: 'map-marker', placeholder: 'District' },
              { name: 'mandal', icon: 'location-arrow', placeholder: 'Mandal' },
              { name: 'village', icon: 'home', placeholder: 'Village' },
              { name: 'pincode', icon: 'hashtag', placeholder: 'Pincode' },
            ].map((f) => (
              <div className="input-field" key={f.name}>
                <i className={`fa fa-${f.icon}`} />
                <input
                  name={f.name}
                  placeholder={f.placeholder}
                  required
                  onChange={handleFormChange}
                />
              </div>
            ))}

            <div className="input-field file-upload">
              <i className="fa fa-image" />
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                onChange={handleFormChange}
              />
            </div>

            <button className="btn" type="submit">Submit</button>
          </form>
        )}

{step === 'done' && (
  <div className="step-section qr-section">
    <h3>🎉 Registered Successfully!</h3>
    <p>Here’s your QR Code:</p>
    
    {qrPath && (
      <>
          <img
          src={qrUrl}
          alt="Worker QR Code"
          className="qr-preview"
        />
        <button
          className="btn"
          onClick={downloadQR}
          style={{ marginTop: '10px', display: 'inline-block' }}
        >
          ⬇️ Download QR
        </button>

      </>
    )}
  </div>
)}

      </main>

      <footer className="footer">
        <p>© 2025 Connect Nipun. All rights reserved.</p>
        <p>Contact us: connect.helpdesk@gmail.com</p>
        <p>Made with 💙 for India’s workforce</p>
      </footer>
    </div>
  );
}

export default RegisterWorker;

