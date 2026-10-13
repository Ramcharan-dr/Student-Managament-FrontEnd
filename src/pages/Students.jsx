import { useCallback, useEffect, useState } from "react";
import {
  createStudent,
  deleteStudent,
  fetchStudents,
  updateStudent,
} from "../api";
import { useAuth } from "../context/AuthContext";
import StudentForm from "../components/StudentForm";
import StudentTable from "../components/StudentTable";

export default function Students() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (keyword) => {
    setLoading(true);
    try {
      setStudents(await fetchStudents(keyword));
    } catch (err) {
      // 401 is handled globally (redirect to login)
      if (err.response?.status !== 401) {
        setMessage({ type: "error", text: "Could not reach the server. Is the backend running?" });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search: reloads shortly after the user stops typing
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  const handleSubmit = async (form) => {
    setFieldErrors({});
    try {
      if (editing) {
        await updateStudent(editing.id, form);
        setMessage({ type: "success", text: "Student updated." });
      } else {
        await createStudent(form);
        setMessage({ type: "success", text: "Student added." });
      }
      setEditing(null);
      load(search);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      setMessage({ type: "error", text: data?.message || "Something went wrong." });
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    try {
      await deleteStudent(student.id);
      setMessage({ type: "success", text: "Student deleted." });
      if (editing?.id === student.id) setEditing(null);
      load(search);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Delete failed." });
    }
  };

  return (
    <div className="container">
      <div className="topbar">
        <div>
          <h1>Student Management System</h1>
          <p>Add, view, update, delete and search student records.</p>
        </div>
        <div className="user-box">
          <span>Hi, {user?.name}</span>
          <button className="btn small" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      {message && (
        <div className={`banner ${message.type}`} role="status" onClick={() => setMessage(null)}>
          {message.text}
        </div>
      )}

      <StudentForm
        editing={editing}
        errors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => {
          setEditing(null);
          setFieldErrors({});
        }}
      />

      <section className="card">
        <div className="list-header">
          <h2>Students ({students.length})</h2>
          <input
            className="search"
            type="search"
            placeholder="Search by name, email, course, department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="empty">Loading…</p>
        ) : (
          <StudentTable
            students={students}
            onEdit={(s) => {
              setEditing(s);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}
