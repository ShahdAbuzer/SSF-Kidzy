export default function CourseDetails({ loading, error, course }) {
    if (loading) return <p>⏳ Loading course...</p>;
    if (error) return <p style={{ color: "red" }}>❌ {error}</p>;
    if (!course) return <p>🚫 Course not found.</p>;
  
    return (
      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
        <p><strong>ID:</strong> {course.courseId}</p>
        <p><strong>Title:</strong> {course.title}</p>
        <p><strong>Description:</strong> {course.description}</p>
      </div>
    );
  }
  