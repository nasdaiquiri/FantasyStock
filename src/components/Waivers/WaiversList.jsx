import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
  TextField
} from '@material-ui/core';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { setWaivers } from '../../features/waiversSlice.js';
import { setYourStock } from '../../features/yourStockSlice.js';
import { selectLeague } from '../../features/leagueSlice.js';
import '../../css/WaiversList.css';

function WaiversList({
  row, index, user, bankBalance, setBankBalance
}) {
  WaiversList.propTypes = {
    row: PropTypes.shape({
      id: PropTypes.number,
      company_name: PropTypes.string,
      current_price_per_share: PropTypes.number,
      sharesRemaining: PropTypes.number,
      ticker: PropTypes.string
    }).isRequired,
    index: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    bankBalance: PropTypes.number.isRequired,
    setBankBalance: PropTypes.func.isRequired
  };

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [waiver, setWaiver] = useState({});
  const [sharesInput, setSharesInput] = useState(0);

  const league = useSelector(selectLeague);

  const onSubmit = () => {
    axios
      .post('/stock/waivers', {
        id_stock: row.id,
        id_league: league,
        id_user: user.id,
        portfolio: {
          price_per_share_at_purchase: row.current_price_per_share,
          shares: Number(sharesInput)
        }
      })
      .then(() => axios
        .get(`/stock/waivers/${league}`)
        .then((waivers) => dispatch(setWaivers(waivers.data))))
      .then(() => axios
        .get(`/stock/portfolio/${user.id}`)
        .then((stocks) => dispatch(setYourStock(stocks.data))))
      .then(() => axios
        .get(`/stock/bank/${user.id}/${league}`)
        .then((response) => setBankBalance(response.data.bank_balance)))
      .catch((err) => console.warn(err));

    setOpen(false);
    setSharesInput(0);
  };

  const handleOpen = () => {
    setWaiver(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSharesInput(0), 1000);
  };

  const handleSharesSubmit = (e) => {
    setSharesInput(e.target.value);
  };
  const calcBankBalance = bankBalance * 0.01 - row.current_price_per_share * 0.01 * sharesInput;

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
          {(0.01 * row.current_price_per_share).toFixed(2)}
        </TableCell>
        <TableCell align='right'>{row.sharesRemaining}</TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          {waiver.company_name}
          (
          {row.ticker}
          )
        </DialogTitle>
        <DialogContent>
          <div>
            <h1>Bank Balance:</h1>
            $
            {calcBankBalance.toFixed(2)}
          </div>
          <div className='waiversList_dialogBox'>
            <div className='waiversList_dialogBox'>
              <h1>Shares Available:</h1>
              {' '}
              {row.sharesRemaining - sharesInput}
            </div>
            <div className='waiversList_dialogBox'>
              <h1>Price per Share: </h1>
              $
              {(0.01 * row.current_price_per_share).toFixed(2)}
            </div>
            <div>
              <h1>Total:</h1>
              $
              {(0.01 * row.current_price_per_share * sharesInput).toFixed(2)}
            </div>
          </div>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='buy/sell stocks'
            type='number'
            onChange={(e) => handleSharesSubmit(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button
            disabled={
              calcBankBalance.toFixed(2) > 0
              && row.sharesRemaining - sharesInput <= row.sharesRemaining
              && row.sharesRemaining - sharesInput >= 0
                ? ''
                : 'disabled'
            }
            onClick={onSubmit}
            color='primary'
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WaiversList;
