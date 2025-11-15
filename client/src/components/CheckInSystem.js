import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const CheckInSystem = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [stats, setStats] = useState(null);
  const [scanInput, setScanInput] = useState('');

  const handleGenerateQR = async () => {
    if (!selectedEvent) return;
    
    try {
      const response = await axiosInstance.get(`/api/checkin/generate/${selectedEvent}`);
      setQrCode(response.data.qrCode);
      loadStats();
    } catch (error) {
      alert('Failed to generate QR code: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleScanQR = async () => {
    if (!scanInput.trim()) return;
    
    try {
      const userId = '507f1f77bcf86cd799439011';
      await axiosInstance.post('/api/checkin/process', { qrData: scanInput, userId });
      alert('Check-in successful!');
      setScanInput('');
      loadStats();
    } catch (error) {
      alert('Check-in failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const loadStats = async () => {
    if (!selectedEvent) return;
    
    try {
      const response = await axiosInstance.get(`/api/checkin/stats/${selectedEvent}`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      loadStats();
    }
  }, [selectedEvent]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">QR Code Check-in System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Generate QR Code</h4>
            <select 
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full p-3 border rounded mb-3"
            >
              <option value="">Select Event</option>
              {events.map(event => (
                <option key={event._id} value={event._id}>{event.title}</option>
              ))}
            </select>
            <button 
              onClick={handleGenerateQR}
              disabled={!selectedEvent}
              className="w-full bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600 disabled:bg-gray-400"
            >
              Generate QR Code
            </button>
            
            {qrCode && (
              <div className="mt-4 text-center">
                <img src={qrCode} alt="QR Code" className="mx-auto border rounded" />
                <p className="text-sm text-gray-600 mt-2">Show this QR code at event entrance</p>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Manual Check-in</h4>
            <input
              type="text"
              placeholder="Paste QR data or enter manually"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="w-full p-3 border rounded mb-3"
            />
            <button 
              onClick={handleScanQR}
              disabled={!scanInput.trim()}
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Process Check-in
            </button>
          </div>
        </div>
      </div>
      
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Check-in Statistics - {stats.eventTitle}</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalRegistered}</div>
              <div className="text-sm text-gray-600">Total Registered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
              <div className="text-sm text-gray-600">Checked In</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.checkInRate}%</div>
              <div className="text-sm text-gray-600">Check-in Rate</div>
            </div>
          </div>
          
          <h4 className="font-medium mb-3">Recent Check-ins</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {stats.checkedInUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{user.username}</span>
                  <span className="text-sm text-gray-600 ml-2">({user.email})</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(user.checkInTime).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInSystem;