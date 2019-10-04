import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const ProfileEducation = ({
  education: {
    school,
    degree,
    fieldOfStudy,
    to,
    from,
    description,
  },
}) => (
  <div className="profile-edu">
    <h3 className="text-dark">{school}</h3>
    <p>
      {moment(from).format('YYYY/MM/DD')}
      {' - '}
      {!to ? ' Now' : moment(to).format('YYYY/MM/DD')}
    </p>
    <p>
      <strong>Degree: </strong> {degree}
    </p>
    <p>
      <strong>Field of Study: </strong> {fieldOfStudy}
    </p>
    <p>
      <strong>Description: </strong> {description}
    </p>
  </div>
);


ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
