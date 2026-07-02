import { useEffect, useState } from "react";
import { api } from "../api";

export default function Classroom() {
  const [classroom, setClassroom] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classroomName, setClassroomName] = useState("");
  const [message, setMessage] = useState("");

  const load = () => {
    api.getClassroom().then(setClassroom).catch(() => setClassroom(null));
    api.getClassroomStudents().then(setStudents).catch(() => {});
    api.getClassroomTeachers().then(setTeachers).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!classroomName) return setMessage("Please enter a classroom name.");
    await api.createClassroom(classroomName);
    setClassroomName("");
    setMessage("Classroom created!");
    load();
  };

  return (
    <div>
      <h2>Classroom</h2>

      {!classroom ? (
        <div className="form">
          <p className="empty" style={{ marginBottom: "16px", padding: 0 }}>You haven't created a classroom yet.</p>
          <label>Classroom name</label>
          <input value={classroomName} onChange={e => setClassroomName(e.target.value)} placeholder="e.g. Biology 101, History A" />
          {message && <p className="success">{message}</p>}
          <button className="btn btn-primary" onClick={handleCreate}>Create classroom</button>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="card-info">
              <h3>{classroom.name}</h3>
              <p>Classroom ID #{classroom.id}</p>
            </div>
          </div>

          <h2 style={{ marginTop: "40px", fontSize: "1.25rem" }}>Teachers in this class</h2>
          {teachers.length === 0 && <p className="empty">No teachers assigned. Go to Teachers to assign someone.</p>}
          {teachers.map(t => (
            <div className="card" key={t.id}>
              <div className="card-info">
                <h3>{t.name}</h3>
                <p>{t.email}</p>
              </div>
            </div>
          ))}

          <h2 style={{ marginTop: "40px", fontSize: "1.25rem" }}>Students enrolled</h2>
          {students.length === 0 && <p className="empty">No students enrolled. Go to Students to add some.</p>}
          {students.map(s => (
            <div className="card" key={s.id}>
              <div className="card-info">
                <h3>{s.name}</h3>
                <p>{s.email}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}