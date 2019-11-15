import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../redux/actions/auth';
import NavMenu from './NavMenu';

const NavBar = ({ auth: { isAuthenticated, loading } }) => {
  const authLinks = (
    <NavMenu />
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
