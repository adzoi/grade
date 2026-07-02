import { useEffect, useState } from "react";
import { api } from "../api";

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classroomTeachers, setClassroomTeachers] = useState<any[]>([]);

  const load = () => {
    api.getTeachers().then(setTeachers).catch(() => {});
    api.getClassroomTeachers().then(setClassroomTeachers).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const isInClassroom = (id: number) => classroomTeachers.some(t => t.id === id);

  const handleToggle = async (teacher: any) => {
    if (isInClassroom(teacher.id)) {
      await api.removeTeacherFromClassroom(teacher.id);
    } else {
      await api.addTeacherToClassroom(teacher.id);
    }
    load();
  };

  const assigned = teachers.filter(t => isInClassroom(t.id));
  const available = teachers.filter(t => !isInClassroom(t.id));

  return (
    <div>
      <h2>Teachers</h2>

      <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "0.9rem" }}>
        Assign teachers to help manage your classroom. Teachers can register themselves through the sign-up page.
      </p>

      {teachers.length === 0 && <p className="empty">No registered teachers yet. Teachers can create accounts on the sign-up page.</p>}

      {assigned.length > 0 && (
        <>
          <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", marginBottom: "12px" }}>Assigned to classroom ({assigned.length})</h3>
          {assigned.map(teacher => (
            <div className="card" key={teacher.id}>
              <div className="card-info">
                <h3>{teacher.name}</h3>
                <p>{teacher.email}</p>
              </div>
              <button className="btn btn-danger" onClick={() => handleToggle(teacher)}>Remove</button>
            </div>
          ))}
        </>
      )}

      {available.length > 0 && (
        <>
          <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", marginTop: "32px", marginBottom: "12px" }}>Available ({available.length})</h3>
          {available.map(teacher => (
            <div className="card" key={teacher.id}>
              <div className="card-info">
                <h3>{teacher.name}</h3>
                <p>{teacher.email}</p>
              </div>
              <button className="btn btn-success" onClick={() => handleToggle(teacher)}>Assign</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}