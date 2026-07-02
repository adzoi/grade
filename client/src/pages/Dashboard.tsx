import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classroom, setClassroom] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);

  const role = localStorage.getItem("role");
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    api.getStudents().then(d => Array.isArray(d) ? setStudents(d) : {}).catch(() => {});
    api.getTeachers().then(d => Array.isArray(d) ? setTeachers(d) : {}).catch(() => {});
    api.getClassroom().then(setClassroom).catch(() => {});
    api.getAssignments().then(d => Array.isArray(d) ? setAssignments(d) : {}).catch(() => {});
  }, []);

  const pendingAssignments = assignments.filter(a => new Date(a.deadline) > new Date());
  const upcomingDeadline = pendingAssignments.length > 0 
    ? pendingAssignments.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0]
    : null;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>{getGreeting()}</h2>
        <p className="dashboard-subtitle">
          {role === "teacher" 
            ? "Here's what's happening in your classroom today."
            : "Here's what you need to work on."}
        </p>
      </div>

      {role === "teacher" ? (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-main">
              {classroom ? (
                <div className="highlight-card">
                  <div className="highlight-icon icon-classroom"></div>
                  <div className="highlight-content">
                    <span className="highlight-label">Your classroom</span>
                    <h3>{classroom.name}</h3>
                    <p>{students.length} student{students.length !== 1 ? "s" : ""} enrolled</p>
                  </div>
                  <Link to="/classroom" className="highlight-link">Manage →</Link>
                </div>
              ) : (
                <div className="highlight-card highlight-card-empty">
                  <div className="highlight-icon icon-spark"></div>
                  <div className="highlight-content">
                    <h3>Create your first classroom</h3>
                    <p>Get started by setting up a space for your students.</p>
                  </div>
                  <Link to="/classroom" className="btn btn-primary">Create classroom</Link>
                </div>
              )}

              {upcomingDeadline && (
                <div className="upcoming-card">
                  <span className="upcoming-label">Next deadline</span>
                  <h4>{upcomingDeadline.task}</h4>
                  <p>Due {new Date(upcomingDeadline.deadline).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                </div>
              )}
            </div>

            <div className="dashboard-sidebar">
              <div className="quick-stats">
                <div className="quick-stat">
                  <span className="quick-stat-number">{students.length}</span>
                  <span className="quick-stat-label">Students</span>
                </div>
                <div className="quick-stat">
                  <span className="quick-stat-number">{assignments.length}</span>
                  <span className="quick-stat-label">Assignments</span>
                </div>
                <div className="quick-stat">
                  <span className="quick-stat-number">{teachers.length}</span>
                  <span className="quick-stat-label">Teachers</span>
                </div>
              </div>

              <div className="quick-actions">
                <h4>Quick actions</h4>
                <Link to="/assignments" className="quick-action-btn">+ New assignment</Link>
                <Link to="/students" className="quick-action-btn">+ Add students</Link>
              </div>
            </div>
          </div>

          {students.length > 0 && (
            <div className="recent-section">
              <h4>Recent students</h4>
              <div className="avatar-row">
                {students.slice(0, 5).map((s: any) => (
                  <div key={s.id} className="avatar" title={s.name}>
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {students.length > 5 && (
                  <div className="avatar avatar-more">+{students.length - 5}</div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="student-dashboard">
            {upcomingDeadline ? (
              <div className="highlight-card">
                <div className="highlight-icon icon-assignment"></div>
                <div className="highlight-content">
                  <span className="highlight-label">Due soon</span>
                  <h3>{upcomingDeadline.task}</h3>
                  <p>Due {new Date(upcomingDeadline.deadline).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                </div>
                <Link to="/assignments" className="btn btn-primary">View assignment</Link>
              </div>
            ) : (
              <div className="highlight-card highlight-card-empty">
                <div className="highlight-icon icon-check"></div>
                <div className="highlight-content">
                  <h3>You're all caught up!</h3>
                  <p>No assignments due. Enjoy your free time.</p>
                </div>
              </div>
            )}

            <div className="student-stats">
              <div className="student-stat-card">
                <span>{assignments.length}</span>
                <p>Total assignments</p>
              </div>
              <div className="student-stat-card">
                <span>{pendingAssignments.length}</span>
                <p>Pending</p>
              </div>
            </div>

            {assignments.length > 0 && (
              <div className="assignments-preview">
                <h4>All assignments</h4>
                {assignments.slice(0, 4).map((a: any) => (
                  <div key={a.id} className="assignment-row">
                    <div>
                      <strong>{a.task}</strong>
                      <span>Due {new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
                {assignments.length > 4 && (
                  <Link to="/assignments" className="see-all-link">See all {assignments.length} assignments →</Link>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}