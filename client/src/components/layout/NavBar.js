import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const NavBar = ({ auth: { isAuthenticated, loading, user }, logoutConnect }) => {
  const authLinks = (
    <ul>
      <li><Link to='/profiles'>Users</Link></li>
      <li>
        {!loading && user !== null
          ? <Link to={`/profile/${user._id}`}>Profile</Link>
          : <span>Profile</span>
        }
      </li>
      <li><Link to='/posts'>Posts</Link></li>
      <li>
        <Link to='/dashboard'>
          <i className="fas fa-user" />{' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logoutConnect} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li><Link to='/profiles'>Users</Link></li>
      <li><Link to='/register'>Register</Link></li>
      <li><Link to='/login'>Login</Link></li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-users"></i>
          {' '}SocialNetwork
        </Link>
      </h1>
      {
        !loading && (
          <Fragment>
            { isAuthenticated ? authLinks : guestLinks}
          </Fragment>
        )
      }
    </nav>
  );
};

NavBar.propTypes = {
  logoutConnect: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => (
  {
    auth: state.auth,
  }
);

export default connect(
  mapStateToProps,
  { logoutConnect: logout },
)(NavBar);
