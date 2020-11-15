import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableCell,
  TableRow,
  TextField,
  FormControl,
  Select,
  InputLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { setWaivers } from '../../features/waiversSlice.js';
import { setYourStock } from '../../features/yourStockSlice.js';
import { selectLeague } from '../../features/leagueSlice.js';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

function StocksList({
  row, user, index, bankBalance, setBankBalance
}) {
  StocksList.propTypes = {
    row: PropTypes.shape({
      id: PropTypes.number,
      company_name: PropTypes.string,
      current_price_per_share: PropTypes.number,
      price_per_share_at_purchase: PropTypes.number,
      shares: PropTypes.number,
      ticker: PropTypes.string
    }).isRequired,
    user: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    index: PropTypes.number.isRequired,
    bankBalance: PropTypes.number.isRequired,
    setBankBalance: PropTypes.func.isRequired
  };
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [myStocks, setMyStocks] = useState({});
  const [sharesInput, setSharesInput] = useState(0);
  const [action, setAction] = useState('Buy');
  const classes = useStyles();
  const handleChange = (event) => {
    setAction(event.target.value);
  };

  const league = useSelector(selectLeague);

  const onSubmit = async () => {
    axios.post('/stock/waivers', {
      id_stock: row.id,
      id_league: league,
      id_user: user.id,
      portfolio: {
        price_per_share_at_purchase: row.current_price_per_share,
        shares: (action === 'Buy') ? -(-sharesInput) : -sharesInput
      }
    }).then(() => axios.get(`/stock/waivers/${league}`)
      .then((waivers) => dispatch(setWaivers(waivers.data))))
      .then(() => axios.get(`/stock/portfolio/${user.id}`)
        .then((stocks) => dispatch(setYourStock(stocks.data))))
      .then(() => axios.get(`/stock/bank/${user.id}/${league}`)
        .then((response) => setBankBalance(response.data.bank_balance)));
    setOpen(false);
    setTimeout(() => setSharesInput(''), 1000);
  };

  const handleOpen = () => {
    setMyStocks(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSharesInput(''), 1000);
  };

  const handleSharesSubmit = ((e) => {
    setSharesInput(e.target.value);
  });
  const sharesCount = ((shares, shareInput) => {
    if (action === 'Buy') {
      return (shares - (-shareInput));
    }
    return (shares + (-shareInput));
  });

  const calcBankBalance = (cpps) => {
    if (action === 'Buy') {
      return (bankBalance
      - (cpps * sharesInput)) * 0.01;
    }
    return (bankBalance
      + (cpps * sharesInput)) * 0.01;
  };

  const disableSubmit = (shares) => {
    if (sharesInput <= 0) {
      return 'disabled';
    }
    if (action === 'Buy' && (sharesCount(shares, sharesInput) > 100 || calcBankBalance(row.current_price_per_share).toFixed(2) < 0)) {
      return 'disabled';
    }
    if (action === 'Sell' && (sharesCount(shares, sharesInput) < 0 || calcBankBalance().toFixed(2) > 0)) {
      return 'disabled';
    }
    return '';
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
        <TableCell align='right'>{(0.01 * row.price_per_share_at_purchase).toFixed(2)}</TableCell>
        <TableCell align='right'>{row.shares}</TableCell>
        <TableCell align='right'>{(row.current_price_per_share * 0.01).toFixed(2)}</TableCell>
      </TableRow>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'><strong>{myStocks.company_name}</strong></DialogTitle>
        <DialogContent>
          <strong>Bank Balance: </strong>
          $
          {
            calcBankBalance(row.current_price_per_share).toFixed(2)
          }
          <DialogContentText>
            <br />
            {row.ticker}
          </DialogContentText>
          <div className='waiversList_dialogBox'>
            <p className='waiversList_dialogBox'>
              <strong>Shares Available:</strong>
              {' '}
              {sharesCount(row.shares, sharesInput)}
            </p>
            <p className='waiversList_dialogBox'>
              <strong> Price per Share: </strong>
              $
              {(0.01 * row.current_price_per_share).toFixed(2)}
            </p>
            <p>
              <strong>Total: </strong>
              $
              {((0.01 * row.current_price_per_share) * sharesInput).toFixed(2)}
            </p>
          </div>
          <FormControl variant='outlined' className={classes.formControl}>
            <InputLabel htmlFor='outlined-age-native-simple'>{action}</InputLabel>
            <Select
              native
              value={action}
              onChange={handleChange}
              label={action}
              inputProps={{
                name: 'buy/sell',
                id: 'outlined-age-native-simple'
              }}
            >
              <option value='Buy'>Buy</option>
              <option value='Sell'>Sell</option>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin='dense'
            id='outlined-number'
            label={action}
            type='number'
            variant='outlined'
            onChange={(e) => handleSharesSubmit(e, sharesCount(row.shares, sharesInput), row.id)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button
            disabled={disableSubmit(row.shares, sharesInput)}
            onClick={() => onSubmit(sharesCount(row.shares, sharesInput), row.id)}
            color='primary'
            value={row.id}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StocksList;
