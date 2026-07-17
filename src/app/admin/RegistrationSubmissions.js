'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import styles from './admin.module.css';

export default function RegistrationSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('registration_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching registration submissions:', err.message);
      // Fallback mock data if table doesn't exist yet
      if (err.message.includes('does not exist') || err.message.includes('schema cache')) {
        setSubmissions([
          { id: 1, name: 'Jane Smith', email: 'jane@example.com', course: 'Advanced Options Trading', status: 'Pending', created_at: new Date().toISOString() },
        ]);
        setError('Table "registration_submissions" not found in Supabase. Showing mock data.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;
    
    try {
      const { error } = await supabase
        .from('registration_submissions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSubmissions(submissions.filter(sub => sub.id !== id));
    } catch (err) {
      console.error('Error deleting submission:', err.message);
      alert('Failed to delete submission: ' + err.message);
    }
  };

  return (
    <div>
      {error && <div className={styles.error} style={{textAlign: 'left'}}>{error}</div>}
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Course</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className={styles.emptyState}>Loading...</td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyState}>No registration submissions found.</td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub.id} className={styles.tr}>
                  <td className={styles.td}>{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td className={styles.td}>{sub.name}</td>
                  <td className={styles.td}>{sub.email}</td>
                  <td className={styles.td}>{sub.course}</td>
                  <td className={styles.td}>
                    <span style={{
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: sub.status === 'Completed' ? '#dcfce7' : '#fef9c3',
                      color: sub.status === 'Completed' ? '#166534' : '#854d0e',
                      fontSize: '0.85rem'
                    }}>
                      {sub.status || 'Pending'}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <button 
                      onClick={() => handleDelete(sub.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
