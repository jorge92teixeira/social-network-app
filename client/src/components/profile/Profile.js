import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';

const Profile = (props) => {
  useEffect(() => {
    props.getProfileById(props.match.params.id);
  }, []);

  return (
    <Fragment>
      {props.profile.profile === null || props.profile.loading
        ? <Spinner />
        : <Fragment>
          <Link to='/profiles' className="btn btn-light">
            Back to Profiles
          </Link>
          {
            props.auth.isAuthenticated
            && props.auth.loading === false
            && props.auth.user._id === props.profile.profile.user._id
            && (<Link to='/edit-profile' className="btn btn-dark">Edit Profile</Link>)
          }
          <div className="profile-grid my-1">
            <ProfileTop profile={props.profile.profile} />
            <ProfileAbout profile={props.profile.profile} />
          </div>
        </Fragment>
      }
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => (
  {
    profile: state.profile,
    auth: state.auth,
  }
);

export default connect(mapStateToProps, { getProfileById })(Profile);
