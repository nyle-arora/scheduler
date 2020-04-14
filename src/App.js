import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button, Container, Title } from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "....",
  messagingSenderId: "...",
  appId: "..."
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const schedule = {
  "title": "CS Courses for 2018-2019",
  "courses": [
    {
      "id": "F101",
      "title": "Computer Science: Concepts, Philosophy, and Connections",
      "meets": "MWF 11:00-11:50"
    },
    {
      "id": "F110",
      "title": "Intro Programming for non-majors",
      "meets": "MWF 10:00-10:50"
    },
    {
      "id": "F111",
      "title": "Fundamentals of Computer Programming I",
      "meets": "MWF 13:00-13:50"
    },
    {
      "id": "F211",
      "title": "Fundamentals of Computer Programming II",
      "meets": "TuTh 12:30-13:50"
    }
  ]
};

const Banner = ({ title }) => (
    <Title>{ title || '[loading...]' }</Title>
);

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

const getCourseTerm = course => (
    terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
    course.id.slice(1, 4)
)

const buttonState = selected => (
    selected ? `button is-success is-selected` : 'button'
);

const TermSelector = ({ state }) => (
    <div className="field has-addons">
      { Object.values(terms)
          .map(value =>
              <button key={value}
                      className={ buttonState(value === state.term) }
                      onClick={ () => state.setTerm(value) }
              >
                { value }
              </button>
          )
      }
    </div>
);

const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({meets})
      .catch(error => alert(error));
};

const moveCourse = course => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if (!meets) return;
  const {days} = timeParts(meets);
  if (days) saveCourse(course, meets);
  else moveCourse(course);
};

const Course = ({ course, state }) => (
    <Button color={ buttonColor(state.selected.includes(course)) }
            onClick={ () => state.toggle(course) }
            onDoubleClick={ () => moveCourse(course) }
            disabled={ hasConflict(course, state.selected) }
    >
      { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
    </Button>
);

const CourseList = ({ courses }) => {
  const [term, setTerm] = React.useState('Fall');
  const termCourses = courses.filter(course => term === getCourseTerm(course));

  return (
      <React.Fragment>
        <TermSelector state={ { term, setTerm } } />
        <div className="buttons">
          { termCourses.map(course =>
              <Course key={ course.id } course={ course }  />) }
        </div>
      </React.Fragment>
  );
};

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: Object.values(schedule.courses).map(addCourseTimes)
});

db.on('value', snap => {
  if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
}, error => alert(error));

const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  return (
      <Container>
        <Banner title={ schedule.title } />
        <CourseList courses={ schedule.courses } />
      </Container>
  );
};

export default App;