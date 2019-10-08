import React, { Fragment, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = ({
  getProfileByIdConnect,
  profile,
  auth,
  match,
}) => {
  useEffect(() => {
    getProfileByIdConnect(match.params.id);
  }, [getProfileByIdConnect, match.params.id]);

  const whatToRender = () => {
    console.log(match.params.id);
    if (profile.profile === null || profile.loading) {
      return <Spinner />;
    }
    return (
      <Fragment>
        <Link to='/profiles' className="btn btn-light">
          Back to Profiles
        </Link>
        {
          auth.isAuthenticated
          && auth.loading === false
          && auth.user._id === profile.profile.user._id
          && (<Link to='/edit-profile' className="btn btn-dark">Edit Profile</Link>)
        }
        <div className="profile-grid my-1">
          <ProfileTop profile={profile.profile} />
          <ProfileAbout profile={profile.profile} />
          <div className="profile-exp bg-white p-2">
            <h2 className="text-primary">Experience</h2>
            {profile.profile.experience.length > 0 ? (<Fragment>
              {profile.profile.experience.map((exp) => (
                <ProfileExperience key={exp._id} experience={exp}/>
              ))}
            </Fragment>) : (<h4>No experience credentials</h4>)}
          </div>
          <div className="profile-edu bg-white p-2">
            <h2 className="text-primary">Education</h2>
            {profile.profile.education.length > 0 ? (<Fragment>
              {profile.profile.education.map((exp) => (
                <ProfileEducation key={exp._id} education={exp}/>
              ))}
            </Fragment>) : (<h4>No education credentials</h4>)}
          </div>
          {profile.profile.githubUsername && (
            <ProfileGithub username={profile.profile.githubUsername}/>
          )}
        </div>
      </Fragment>
    )
  };

  return (
    <Fragment>
      {whatToRender()}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileByIdConnect: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => (
  {
    profile: state.profile,
    auth: state.auth,
  }
);

export default connect(
  mapStateToProps,
  { getProfileByIdConnect: getProfileById },
)(Profile);
