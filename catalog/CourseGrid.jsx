import { CourseCard } from './CourseCard';

export function CourseGrid({ courses, enrolmentsByCourseId = {}, label }) {
  return (
    <ul className="course-grid" aria-label={label}>
      {courses.map((course) => (
        <li key={course.id} style={{ display: 'flex' }}>
          <CourseCard course={course} enrolment={enrolmentsByCourseId[course.id]} />
        </li>
      ))}
    </ul>
  );
}
