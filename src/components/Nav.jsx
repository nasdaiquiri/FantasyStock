import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer
} from '@material-ui/core';
import { ChevronLeft, Menu } from '@material-ui/icons';
import '../css/Nav.css';
import { useSelector } from 'react-redux';
import { selectLogIn, selectUser } from '../features/userSlice.js';
import logo from '../logo/logo.png';

function Nav() {
  const [open, setOpen] = useState(false);

  const user = useSelector(selectUser);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const views = [
    {
      option: 'Home',
      path: '/'
    },
    {
      option: 'League Info',
      path: '/leagueinfo'
    },
    {
      option: 'Your Stocks',
      path: '/yourstocks'
    },
    {
      option: 'Waivers',
      path: '/waivers'
    },
    {
      option: 'Scoreboard',
      path: '/scoreboard'
    },
    {
      option: 'Schedule',
      path: '/schedule'
    },
    {
      option: 'Chat',
      path: '/messageboard'
    },
    {
      option: 'Settings',
      path: '/settings'
    }
  ];

  const logIn = useSelector(selectLogIn);

  return (
    <nav className='nav'>
      <AppBar className='nav_bar' position='sticky'>
        <Toolbar>
          <IconButton
            onClick={handleDrawerOpen}
            edge='start'
            color='inherit'
            aria-label='menu'
          >
            <Menu />
          </IconButton>
          <Typography className='nav_logo' variant='body1'>
            {user?.username}
          </Typography>

          <Button color='inherit'>
            {(!logIn)
              ? <a className='a' href='/auth/google'>Log In </a>
              : (
                <a className='a' href='/auth/logout'>Log out </a>
              )}
          </Button>
          <Link key='home' className='nav_folio' to='/'>
            <Button color='inherit'>Folio</Button>
          </Link>
          <Link key='home' className='nav_link' to='/'>
            <Button color='inherit'>
              <img className='nav_logo' src={logo} alt='logo' />
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor='left'
        variant='temporary'
        open={open}
        onClose={() => setOpen(false)}
      >
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeft className='nav_close' />
        </IconButton>
        {(!logIn)
          ? (
            <ul className='nav_navigation'>
              <Link key='home' className='nav_link' to='/'>
                <option
                  onClick={handleDrawerClose}
                  className='nav_options'
                >
                  Home
                </option>
              </Link>
            </ul>
          )
          : (
            <ul className='nav_navigation'>
              {views.map((view) => (
                <Link key={view.option} className='nav_link' to={view.path}>
                  <option
                    onClick={handleDrawerClose}
                    className='nav_options'
                  >
                    {view.option}
                  </option>
                </Link>
              ))}
            </ul>
          )}

      </Drawer>
    </nav>
  );
}

export default Nav;
