import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';

const studentInfo = {
  fullName: 'Nguyễn Văn Ngân',
  studentId: '2251220089',
  className: '22CT1',
};

const initialFormState = {
  fullName: '',
  studentCode: '',
  className: '',
  email: '',
};

function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <h1>Student Manager</h1>
        </div>
        <nav className="nav-links">
          <Link to="/">Students</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<StudentsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [status, setStatus] = useState({ loading: true, error: '', submitting: false });

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setStatus((current) => ({ ...current, loading: true, error: '' }));

    try {
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu sinh viên');
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    } finally {
      setStatus((current) => ({ ...current, loading: false }));
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus((current) => ({ ...current, submitting: true, error: '' }));

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Không thể thêm sinh viên');
      }

      setFormState(initialFormState);
      await loadStudents();
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    } finally {
      setStatus((current) => ({ ...current, submitting: false }));
    }
  }

  return (
    <section className="grid-layout">
      <article className="hero-card">
        <p className="eyebrow">Backend + Frontend + MongoDB</p>
        <h2>Quản lý sinh viên cơ bản</h2>
        <p>
          Ứng dụng hiển thị danh sách từ backend, cho phép thêm sinh viên mới bằng form và đồng bộ dữ liệu vào MongoDB.
        </p>
        <div className="metric-row">
          <div>
            <strong>{students.length}</strong>
            <span>Sinh viên</span>
          </div>
          <div>
            <strong>/health</strong>
            <span>Endpoint kiểm tra</span>
          </div>
        </div>
      </article>

      <section className="panel">
        <div className="panel-header">
          <h3>Thêm sinh viên</h3>
          <button type="button" className="ghost-button" onClick={loadStudents}>
            Tải lại
          </button>
        </div>

        <form className="student-form" onSubmit={handleSubmit}>
          <label>
            Họ và tên
            <input name="fullName" value={formState.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" />
          </label>
          <label>
            Mã sinh viên
            <input name="studentCode" value={formState.studentCode} onChange={handleChange} placeholder="SV001" />
          </label>
          <label>
            Lớp
            <input name="className" value={formState.className} onChange={handleChange} placeholder="22CT1" />
          </label>
          <label>
            Email
            <input name="email" type="email" value={formState.email} onChange={handleChange} placeholder="student@example.com" />
          </label>
          <button className="primary-button" type="submit" disabled={status.submitting}>
            {status.submitting ? 'Đang lưu...' : 'Lưu sinh viên'}
          </button>
        </form>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <h3>Danh sách sinh viên</h3>
          <p>{status.loading ? 'Đang tải dữ liệu...' : '...'}</p>
        </div>

        {status.error ? <p className="alert error">{status.error}</p> : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Mã SV</th>
                <th>Lớp</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    Chưa có dữ liệu. Hãy thêm sinh viên bằng form bên trên.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.fullName}</td>
                    <td>{student.studentCode}</td>
                    <td>{student.className}</td>
                    <td>{student.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function AboutPage() {
  const location = useLocation();

  return (
    <section className="panel about-panel">
      <p className="eyebrow">Trang thông tin cá nhân</p>
      <h2>{studentInfo.fullName}</h2>
      <div className="about-grid">
        <div>
          <span>Mã số sinh viên</span>
          <strong>{studentInfo.studentId}</strong>
        </div>
        <div>
          <span>Lớp</span>
          <strong>{studentInfo.className}</strong>
        </div>
        <div>
          <span>Route</span>
          <strong>{location.pathname}</strong>
        </div>
      </div>
    </section>
  );
}

export default App;
