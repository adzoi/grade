import { useEffect, useState } from "react";
import { api } from "../api";

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submitContent, setSubmitContent] = useState("");
  const [gradeInputs, setGradeInputs] = useState<{ [key: number]: string }>({});

  const role = localStorage.getItem("role");

  const load = () => {
    api.getAssignments().then(d => Array.isArray(d) ? setAssignments(d) : {}).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!task || !deadline) return setMessage("Please fill in all fields.");
    const classroom = await api.getClassroom().catch(() => null);
    if (!classroom) return setMessage("No classroom found.");
    const res = await api.createAssignment({ task, deadline, classroomId: classroom.id });
    if (res.message === "Assignment created successfully") {
      setTask("");
      setDeadline("");
      setMessage("Assignment created!");
      load();
    } else {
      setMessage(res.message || "Failed to create assignment.");
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteAssignment(id);
    load();
  };

  const handleViewSubmissions = async (assignment: any) => {
    setSelectedAssignment(assignment);
    const subs = await api.getSubmissions(assignment.id);
    Array.isArray(subs) ? setSubmissions(subs) : setSubmissions([]);
  };

  const handleSubmit = async (assignmentId: number) => {
    const res = await api.submitAssignment(assignmentId, submitContent);
    setMessage(res.message || "Submitted!");
    setSubmitContent("");
    load();
  };

  const handleGrade = async (assignmentId: number, submissionId: number) => {
    const grade = Number(gradeInputs[submissionId]);
    if (isNaN(grade) || grade < 0 || grade > 10) return setMessage("Grade must be 0-10.");
    const res = await api.gradeSubmission(assignmentId, submissionId, grade);
    setMessage(res.message || "Graded!");
    handleViewSubmissions(selectedAssignment);
  };

  return (
    <div>
      <h2>Assignments</h2>

      {role === "teacher" && (
        <div className="form">
          <label>What's the assignment?</label>
          <input value={task} onChange={e => setTask(e.target.value)} placeholder="e.g. Write a book report, Solve problems 1-10" />
          <label>Due date</label>
          <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
          {message && <p className="success">{message}</p>}
          <button className="btn btn-primary" onClick={handleCreate}>Create assignment</button>
        </div>
      )}

      {assignments.length === 0 && <p className="empty">{role === "teacher" ? "No assignments created yet. Create one above." : "No assignments available yet."}</p>}

      {assignments.map(a => (
        <div key={a.id} style={{ marginBottom: "16px" }}>
          <div className="card">
            <div className="card-info">
              <h3>{a.task}</h3>
              <p>Due {new Date(a.deadline).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {role === "teacher" && (
                <>
                  <button className="btn btn-primary" onClick={() => handleViewSubmissions(a)}>View submissions</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                </>
              )}
              {role === "student" && (
                <button className="btn btn-success" onClick={() => setSelectedAssignment(a)}>Submit work</button>
              )}
            </div>
          </div>

          {selectedAssignment?.id === a.id && role === "student" && (
            <div className="card" style={{ flexDirection: "column", alignItems: "flex-start", marginTop: "8px" }}>
              <label style={{ marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>Your work</label>
              <textarea value={submitContent} onChange={e => setSubmitContent(e.target.value)} placeholder="Type or paste your answer here..." style={{ width: "100%", marginBottom: "12px" }} />
              {message && <p className="success">{message}</p>}
              <button className="btn btn-primary" onClick={() => handleSubmit(a.id)}>Turn in</button>
            </div>
          )}

          {selectedAssignment?.id === a.id && role === "teacher" && (
            <div style={{ paddingLeft: "16px", marginTop: "8px" }}>
              {submissions.length === 0 && <p className="empty">No submissions yet for this assignment.</p>}
              {submissions.map(s => (
                <div className="card" key={s.id} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                  <div className="card-info" style={{ marginBottom: "12px", width: "100%" }}>
                    <h3>{s.student?.name || "Unknown student"}</h3>
                    <p style={{ marginTop: "4px" }}>{s.content || "No content submitted"}</p>
                    <p style={{ marginTop: "8px" }}>
                      Grade: <span className={`tag ${s.grade != null ? "tag-green" : ""}`}>{s.grade != null ? `${s.grade}/10` : "Pending"}</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      style={{ width: "80px", marginBottom: 0 }}
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0-10"
                      value={gradeInputs[s.id] || ""}
                      onChange={e => setGradeInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                    />
                    <button className="btn btn-primary" onClick={() => handleGrade(a.id, s.id)}>Save grade</button>
                  </div>
                </div>
              ))}
              {message && <p className="success" style={{ marginTop: "12px" }}>{message}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}