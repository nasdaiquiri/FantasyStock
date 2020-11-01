/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableCell,
  TableRow,
  TextField
} from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../../features/userSlice.js';

function WaiversList({ row, index }) {
  const user = useSelector(selectUser);

  const [open, setOpen] = useState(false);
  const [waiver, setWaiver] = useState({});
  const [sharesInput, setSharesInput] = useState(0);
  // const [bankBalance, setBankBalance] = useState(0);

  // useEffect(() => {
  //   async function fetchLeagueInfo() {
  //     const response = await axios.get(`/user/league/user/=${user.id}`);
  //     setBankBalance(response.data.bank_balance);
  //     console.log(response);

  //     return response;
  //   }
  //   fetchLeagueInfo();
  // }, []);

  const onSubmit = () => {
    axios.post('/stock/waivers', {
      id_stock: row.id,
      id_league: user.leagueInfo[0].id_league,
      id_user: user.leagueInfo[0].id_user,
      portfolio: {
        price_per_share_at_purchase: row.current_price_per_share,
        shares: sharesInput
      }
    })
      .then((response) => response.data)
      .catch((err) => console.error(err));

    setOpen(false);
    setTimeout(() => setSharesInput(''), 1000);
  };

  const handleOpen = () => {
    setWaiver(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSharesInput(''), 1000);
  };

  const handleSharesSubmit = (e) => {
    setSharesInput(e.target.value);
  };

  return (
    <>
      <TableRow
        onClick={handleOpen}
        className='basicTable_row'
        hover
        role='checkbox'
        tabIndex={-1}
        key={index}
      >
        <TableCell padding='checkbox' />
        <TableCell component='th' id={index} scope='row' padding='none'>
          {row.ticker}
        </TableCell>
        <TableCell align='right'>{row.company_name}</TableCell>
        <TableCell align='right'>
          $
          {((1 / 100) * row.current_price_per_share).toFixed(2)}
        </TableCell>
        <TableCell align='right'>{row.sharesRemaining}</TableCell>
      </TableRow>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>{waiver.company_name}</DialogTitle>
        Bank Balance:  $
        {' '}
        {
          user.leagueInfo[0].bank_balance * 0.01 - (((1 / 100)
            * row.current_price_per_share) * sharesInput).toFixed(2)
        }
        <DialogContent>
          <DialogContentText>
            {row.ticker}
          </DialogContentText>
          <p>
            shares owned:
            {' '}
            {row.sharesRemaining - sharesInput}
          </p>
          <p>
            Price per Share: $
            {((1 / 100) * row.current_price_per_share).toFixed(2)}
          </p>
          <p>
            Total: $
            {(((1 / 100) * row.current_price_per_share) * sharesInput).toFixed(2)}
          </p>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='shares'
            type='number'
            fullWidth
            onChange={(e) => handleSharesSubmit(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={onSubmit} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WaiversList;
