import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setSubmitting(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      navigate("/", { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      setError(
        data?.message ||
          (err.response ? "Signup failed." : "Could not reach the server. Is the backend running?")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, type = "text", autoComplete) => (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={form[name]}
        onChange={handleChange}
        required
        minLength={type === "password" ? 6 : undefined}
      />
      {fieldErrors[name] && <small className="error">{fieldErrors[name]}</small>}
    </label>
  );

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p className="auth-sub">Sign up to start managing students.</p>

        {error && <div className="banner error" role="alert">{error}</div>}

        {field("name", "Full name", "text", "name")}
        {field("email", "Email", "email", "email")}
        {field("password", "Password (min. 6 characters)", "password", "new-password")}
        {field("confirmPassword", "Confirm password", "password", "new-password")}

        <button type="submit" className="btn primary block" disabled={submitting}>
          {submitting ? "Creating account…" : "Sign up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
