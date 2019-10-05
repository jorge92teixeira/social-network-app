import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProfileItem = ({ profile }) => (
  <div className="profile bg-light">
    <img className="round-img" alt="" src={profile.user.avatar} />
    <div>
      <h2>{profile.user.name}</h2>
      <p>{profile.status} {profile.company && <span> at {profile.company}</span>}</p>
      <p className="my-1">{profile.location && <span>{profile.location}</span>}</p>
      <Link to={`/profile/${profile.user._id}`} className="btn btn-primary">
        View Profile
      </Link>
    </div>
    {/* <ul>
      {profile.skills.slice(0, 4).map((skill, index) => (
        <li key={index} className="text-primary">
          <i className="fas fa-check">{skill}</i>
        </li>
      ))}
    </ul> */}
    {/* TODO - add bio/social media */}
  </div>
);

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileItem;
