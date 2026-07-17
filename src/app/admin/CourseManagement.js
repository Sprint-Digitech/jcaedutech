'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabase';
import styles from './admin.module.css';

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      if (err.message.includes('does not exist') || err.message.includes('schema cache')) {
        setCourses([
          { id: 1, title: 'Stock Market Basics', description: 'Learn the fundamentals of stock trading.', price: '₹4,999', image_url: null, created_at: new Date().toISOString() },
        ]);
        setError('Table "courses" not found in Supabase. Showing mock data.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a local preview URL
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setImageFile(null);
    setImagePreview('');
    setEditingCourse(null);
    setIsFormOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setImagePreview(course.image_url || '');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In a real scenario, you'd upload the imageFile to Supabase Storage first,
    // get the public URL, and then insert/update the course record.
    
    const courseData = {
      title,
      description,
      price,
      // For mock purposes, if there is a local preview, we just use it, 
      // but normally we would save the Supabase storage URL here.
      image_url: imagePreview,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingCourse) {
        // Mock update
        const updatedCourses = courses.map(c => c.id === editingCourse.id ? { ...c, ...courseData } : c);
        setCourses(updatedCourses);
      } else {
        // Mock insert
        const newCourse = {
          id: Date.now(),
          ...courseData,
          created_at: new Date().toISOString()
        };
        setCourses([newCourse, ...courses]);
      }
      resetForm();
    } catch (err) {
      alert('Error saving course: ' + err.message);
    }
  };

  if (isFormOpen) {
    return (
      <div className={styles.tableContainer} style={{ padding: '20px' }}>
        <div className={styles.flexBetween}>
          <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
          <button className={styles.logoutBtn} style={{ color: 'var(--admin-text)', borderColor: 'var(--admin-border)', margin: 0 }} onClick={resetForm}>
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Course Title</label>
            <input 
              className={styles.input} 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Price</label>
            <input 
              className={styles.input} 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="e.g. ₹4,999"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea 
              className={styles.textarea} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Course Image</label>
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Course Preview" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              ref={fileInputRef}
              className={styles.input}
              style={{ padding: '8px' }}
            />
            <small style={{ color: '#6b7280', display: 'block', marginTop: '5px' }}>
              Upload from your gallery/laptop. (Currently previews locally until Supabase Storage is configured)
            </small>
          </div>

          <button type="submit" className={styles.button}>
            {editingCourse ? 'Update Course' : 'Save Course'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.flexBetween}>
        {error ? <div className={styles.error} style={{marginBottom: 0}}>{error}</div> : <div></div>}
        <button className={styles.button} style={{ width: 'auto' }} onClick={() => setIsFormOpen(true)}>
          + Add New Course
        </button>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Image</th>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className={styles.emptyState}>Loading...</td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.emptyState}>No courses found.</td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className={styles.tr}>
                  <td className={styles.td}>
                    {course.image_url ? (
                      <img src={course.image_url} alt={course.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>No Img</div>
                    )}
                  </td>
                  <td className={styles.td}>{course.title}</td>
                  <td className={styles.td}>{course.price}</td>
                  <td className={styles.td}>
                    <button 
                      onClick={() => handleEdit(course)}
                      style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    >
                      Edit
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
