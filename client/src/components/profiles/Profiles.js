import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';

const Profiles = (props) => {
  useEffect(() => {
    props.getProfiles();
  }, [props.getProfiles]);

  return (
    <Fragment>
      { props.profile.loading
        ? <Spinner />
        : <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i>
            Browse and connect with developers
          </p>
          <div>
            { props.profile.profiles.length > 0
              ? (props.profile.profiles.map((p) => (
                <ProfileItem key={p._id} profile={p} />
              ))
              ) : <h4>No profiles found...</h4>
            }
          </div>
        </Fragment>
      }
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => (
  {
    profile: state.profile,
  }
);

export default connect(mapStateToProps, { getProfiles })(Profiles);
