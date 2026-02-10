import React, { useState } from 'react';
import './UserCreationTool.css';

export default function UserCreationTool({ darkMode }) {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    studentNumber: '',
    email: '',
    program: 'Computer Science',
    faculty: 'SOIT - School of Information Technology'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const programs = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Data Science',
    'Biotechnology',
    'Chemical Engineering',
    'Architecture',
    'Accounting and Management',
    'Actuarial Science',
    'Advertising Management',
    'Applied Psychology',
    'Architecture',
    'Business Administration',
    'Management'
  ];

  const faculties = [
    'SOIT - School of Information Technology',
    'SCEGE - School of Civil, Environmental, and Geological Engineering',
    'SEECE - School of Electrical, Electronics, and Computer Engineering',
    'SMME - School of Mechanical and Manufacturing Engineering',
    'SARIDBE - School of Architecture, Industrial Design, and the Built Environment',
    'SCBMS - School of Chemical, Biological, and Materials Engineering and Sciences',
    'SMDA - School of Multimedia and Digital Arts',
    'SFSE - School of Foundational Studies and Education',
    'SHS - School of Health Sciences',
    'SN - School of Nursing',
    'ETYSB - E.T. Yuchengo School of Business'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (!formData.studentNumber.trim()) {
      setMessage(userType === 'student' ? 'Student number is required' : 'Employee/ID number is required');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (!formData.firstName.trim()) {
      setMessage('First name is required');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (!formData.surname.trim()) {
      setMessage('Surname is required');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setMessage('Valid email is required');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      // Simulated API call - in a real app, this would send data to backend
      const userData = {
        id: Date.now(),
        userType: userType,
        firstName: formData.firstName,
        middleName: formData.middleName,
        surname: formData.surname,
        studentNumber: formData.studentNumber,
        email: formData.email,
        ...(userType === 'student' ? { program: formData.program } : { faculty: formData.faculty }),
        createdAt: new Date().toISOString()
      };

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Here you would normally send to your backend
      console.log('Creating user:', userData);

      const typeLabel = userType === 'student' ? 'Student' : 'Faculty Member';
      setMessage(
        `${typeLabel} account created successfully! ${formData.firstName} ${formData.surname} (${formData.studentNumber})`
      );
      setMessageType('success');

      // Reset form
      setFormData({
        firstName: '',
        middleName: '',
        surname: '',
        studentNumber: '',
        email: '',
        program: 'Computer Science',
        faculty: 'SOIT - School of Information Technology'
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error creating user. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      middleName: '',
      surname: '',
      studentNumber: '',
      email: '',
      program: 'Computer Science',
      faculty: 'SOIT - School of Information Technology'
    });
    setMessage('');
  };

  return (
    <div className={`user-creation-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="user-creation-card">
        <div className="form-header">
          <h2>{userType === 'student' ? 'Create Student Account' : 'Create Faculty Account'}</h2>
          <p className="form-subtitle">
            {userType === 'student' 
              ? 'Add a new student to the system' 
              : 'Add a new faculty member to the system'}
          </p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            <span className="message-icon">
              {messageType === 'success' ? '✓' : '✕'}
            </span>
            <span className="message-text">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Reyes"
                />
              </div>

              <div className="form-group">
                <label htmlFor="surname">Surname *</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Dela Cruz"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Account Type</h3>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="userType-student"
                  name="userType"
                  value="student"
                  checked={userType === 'student'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <label htmlFor="userType-student">Student</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="userType-faculty"
                  name="userType"
                  value="faculty"
                  checked={userType === 'faculty'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <label htmlFor="userType-faculty">Faculty Member</label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentNumber">
                  {userType === 'student' ? 'Student Number *' : 'Employee ID *'}
                </label>
                <input
                  type="text"
                  id="studentNumber"
                  name="studentNumber"
                  value={formData.studentNumber}
                  onChange={handleChange}
                  placeholder={userType === 'student' ? "e.g., 2023-001234" : "e.g., EMP-001234"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={userType === 'student' ? "student@mapua.edu.ph" : "faculty@mapua.edu.ph"}
                  required
                />
              </div>
            </div>
          </div>

          {userType === 'student' ? (
            <div className="form-section">
              <h3>Academic Information</h3>
              
              <div className="form-group full-width">
                <label htmlFor="program">Program *</label>
                <select
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a program</option>
                  {programs.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="form-section">
              <h3>Faculty Information</h3>
              
              <div className="form-group full-width">
                <label htmlFor="faculty">Faculty/College *</label>
                <select
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a faculty</option>
                  {faculties.map((fac) => (
                    <option key={fac} value={fac}>
                      {fac}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <button
              type="button"
              className="btn-reset"
              onClick={handleReset}
              disabled={loading}
            >
              Clear Form
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p>* Required fields</p>
        </div>
      </div>
    </div>
  );
}
