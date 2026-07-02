import { useEffect, useState } from "react";
import { api } from "../api";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [classroomStudents, setClassroomStudents] = useState<any[]>([]);

  const load = () => {
    api.getStudents().then(setStudents).catch(() => {});
    api.getClassroomStudents().then(setClassroomStudents).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const isInClassroom = (id: number) => classroomStudents.some(s => s.id === id);

  const handleToggle = async (student: any) => {
    if (isInClassroom(student.id)) {
      await api.removeStudentFromClassroom(student.id);
    } else {
      await api.addStudentToClassroom(student.id);
    }
    load();
  };

  const enrolled = students.filter(s => isInClassroom(s.id));
  const notEnrolled = students.filter(s => !isInClassroom(s.id));

  return (
    <div>
      <h2>Students</h2>

      <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "0.9rem" }}>
        Manage which students are enrolled in your classroom. Students can register themselves through the sign-up page.
      </p>

      {students.length === 0 && <p className="empty">No registered students yet. Students can create accounts on the sign-up page.</p>}

      {enrolled.length > 0 && (
        <>
          <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", marginBottom: "12px" }}>Enrolled ({enrolled.length})</h3>
          {enrolled.map(student => (
            <div className="card" key={student.id}>
              <div className="card-info">
                <h3>{student.name}</h3>
                <p>{student.email}</p>
              </div>
              <button className="btn btn-danger" onClick={() => handleToggle(student)}>Remove</button>
            </div>
          ))}
        </>
      )}

      {notEnrolled.length > 0 && (
        <>
          <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", marginTop: "32px", marginBottom: "12px" }}>Available to enroll ({notEnrolled.length})</h3>
          {notEnrolled.map(student => (
            <div className="card" key={student.id}>
              <div className="card-info">
                <h3>{student.name}</h3>
                <p>{student.email}</p>
              </div>
              <button className="btn btn-success" onClick={() => handleToggle(student)}>Enroll</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}