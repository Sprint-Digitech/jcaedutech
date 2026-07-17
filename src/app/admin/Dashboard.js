'use client';

import { useState } from 'react';
import styles from './admin.module.css';
import ContactSubmissions from './ContactSubmissions';
import RegistrationSubmissions from './RegistrationSubmissions';
import CourseManagement from './CourseManagement';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('courses');

  const renderContent = () => {
    switch (activeTab) {
      case 'contact':
        return <ContactSubmissions />;
      case 'registration':
        return <RegistrationSubmissions />;
      case 'courses':
        return <CourseManagement />;
      default:
        return <CourseManagement />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'contact': return 'Contact Us Submissions';
      case 'registration': return 'Registration Submissions';
      case 'courses': return 'Course Management';
      default: return 'Dashboard';
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          JCA Admin
        </div>
        <div className={styles.sidebarNav}>
          <div 
            className={`${styles.navItem} ${activeTab === 'courses' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            📚 Courses
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'registration' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('registration')}
          >
            📝 Registrations
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'contact' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            ✉️ Contact Submissions
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>{getTitle()}</h1>
        </div>
        <div className={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
