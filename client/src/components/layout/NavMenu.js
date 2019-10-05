import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';


const NavMenu = ({ auth: { loading, user }, logoutConnect }) => {
  const [menu, setMenu] = useState(false);

  const showMenu = useCallback(() => {
    setMenu(true);
  }, [setMenu]);
  const hideMenu = useCallback(() => {
    setMenu(false);
  }, [setMenu]);

  useEffect(() => {
    if (menu) {
      document.addEventListener('click', hideMenu);
    }
    return () => {
      document.removeEventListener('click', hideMenu);
    };
  }, [menu, hideMenu]);

  return (
    <div className="dropdown">
      {!loading && user !== null
        ? <span className="dropdown-btn" onClick={() => showMenu()}>
          Welcome, {user.name}{' '}
          <i className="fas fa-bars"></i>
         </span>
        : <span>
            Welcome{' '}<i className="fas fa-bars"></i>
          </span>
      }

      {menu && (
        <div className="dropdown-content">
          <Link to='/profiles'>
            <i className="fas fa-user"></i>{' '}
            Users
          </Link>
          {!loading && user !== null
            ? <Link to={`/profile/${user._id}`}>
                <i className="fas fa-user-circle"></i>{' '}
                Profile
              </Link>
            : <span>
                <i className="fas fa-user-circle"></i>{' '}
                Profile
              </span>
          }
          <Link to='/posts'>
            <i className="fas fa-blog"></i>{' '}
            Posts
          </Link>
          <Link to='/dashboard'>
            <i className="fas fa-user" />{' '}
            <span className="hide-sm">Dashboard</span>
          </Link>
          <a onClick={logoutConnect} href="#!">
            <i className="fas fa-sign-out-alt"></i>{' '}
            <span className="hide-sm">Logout</span>
          </a>
        </div>
      )}
    </div>
  );
};

NavMenu.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutConnect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => (
  {
    auth: state.auth,
  }
);

export default connect(
  mapStateToProps,
  { logoutConnect: logout },
)(NavMenu);
