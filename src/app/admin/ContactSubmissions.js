'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import styles from './admin.module.css';

export default function ContactSubmissions() {
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
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching contact submissions:', err.message);
      // Fallback mock data if table doesn't exist yet
      if (err.message.includes('does not exist') || err.message.includes('schema cache')) {
        setSubmissions([
          { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', message: 'I want to learn trading.', created_at: new Date().toISOString() },
        ]);
        setError('Table "contact_submissions" not found in Supabase. Showing mock data.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading submissions...</div>;

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
              <th className={styles.th}>Phone</th>
              <th className={styles.th}>Message</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyState}>No contact submissions found.</td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub.id} className={styles.tr}>
                  <td className={styles.td}>{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td className={styles.td}>{sub.name}</td>
                  <td className={styles.td}>{sub.email}</td>
                  <td className={styles.td}>{sub.phone || '-'}</td>
                  <td className={styles.td}>{sub.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
