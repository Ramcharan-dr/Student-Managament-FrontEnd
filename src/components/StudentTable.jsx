export default function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return <p className="empty">No students found.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Department</th>
            <th aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.course}</td>
              <td>{s.department}</td>
              <td className="row-actions">
                <button className="btn small" onClick={() => onEdit(s)}>
                  Edit
                </button>
                <button className="btn small danger" onClick={() => onDelete(s)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
