import { useEffect, useState } from "react";

const emptyForm = { name: "", email: "", phone: "", course: "", department: "" };

export default function StudentForm({ editing, onSubmit, onCancel, errors }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(editing ? { ...emptyForm, ...editing } : emptyForm);
  }, [editing]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const field = (name, label, type = "text") => (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={form[name] || ""}
        onChange={handleChange}
        required={name === "name" || name === "email"}
      />
      {errors?.[name] && <small className="error">{errors[name]}</small>}
    </label>
  );

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{editing ? "Edit Student" : "Add Student"}</h2>
      <div className="grid">
        {field("name", "Full name")}
        {field("email", "Email", "email")}
        {field("phone", "Phone")}
        {field("course", "Course")}
        {field("department", "Department")}
      </div>
      <div className="actions">
        <button type="submit" className="btn primary">
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
