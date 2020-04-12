import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button, Container, Title } from 'rbx';

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

const Course = ({ course }) => (
    <Button>
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

const App = () => {
  const [schedule, setSchedule] = React.useState({ title: '', courses: [] });
  const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';

  React.useEffect(() => {

    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(json);
    }

    fetchSchedule();
  }, []);

  return (
      <div className="container">
        <Banner title={ schedule.title } />
        <CourseList courses={ schedule.courses } />
      </div>
  );
};

export default App;