import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { deleteEducation } from '../../redux/actions/profile';

const Education = ({ education, deleteEducationConnect }) => {
  const educations = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td className="hide-sm">
        {moment(edu.from).format('YYYY/MM/DD')} - {' '}
        {edu.to === null ? (
          ' Now'
        ) : (
          moment(edu.from).format('YYYY/MM/DD')
        )}
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => deleteEducationConnect(edu._id)}
        >Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { educations }
        </tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducationConnect: PropTypes.func.isRequired,
};

export default connect(
  null,
  { deleteEducationConnect: deleteEducation },
)(Education);
