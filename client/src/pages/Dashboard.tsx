import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classroom, setClassroom] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);

  const role = localStorage.getItem("role");

  useEffect(() => {
    api.getStudents().then(d => Array.isArray(d) ? setStudents(d) : {}).catch(() => {});
    api.getTeachers().then(d => Array.isArray(d) ? setTeachers(d) : {}).catch(() => {});
    api.getClassroom().then(setClassroom).catch(() => {});
    api.getAssignments().then(d => Array.isArray(d) ? setAssignments(d) : {}).catch(() => {});
  }, []);

  return (
    <div>
      <h2>Overview</h2>

      <div className="stats">
        {role === "teacher" && (
          <>
            <div className="stat-card">
              <span>{students.length}</span>
              <p>Students</p>
            </div>
            <div className="stat-card">
              <span>{teachers.length}</span>
              <p>Teachers</p>
            </div>
          </>
        )}
        <div className="stat-card">
          <span>{assignments.length}</span>
          <p>Assignments</p>
        </div>
      </div>

      {role === "teacher" && classroom && (
        <div className="card">
          <div className="card-info">
            <h3>Your classroom</h3>
            <p>{classroom.name}</p>
          </div>
        </div>
      )}

      {role === "teacher" && !classroom && (
        <div className="card">
          <div className="card-info">
            <h3>No classroom yet</h3>
            <p>Head to the Classroom page to create one</p>
          </div>
        </div>
      )}

      {assignments.length > 0 && (
        <div className="card">
          <div className="card-info">
            <h3>Latest assignments</h3>
            <p>{assignments.slice(0, 3).map((a: any) => a.task).join(" · ")}</p>
          </div>
        </div>
      )}

      {role === "teacher" && students.length > 0 && (
        <div className="card">
          <div className="card-info">
            <h3>Your students</h3>
            <p>{students.slice(0, 4).map((s: any) => s.name).join(" · ")}{students.length > 4 ? ` +${students.length - 4} more` : ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}