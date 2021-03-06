import React from 'react';
import '../css/TickerBar.css';
import Ticker from 'react-ticker';
import { useSelector } from 'react-redux';
import { selectLogIn } from '../features/userSlice.js';
import { selectYourStock } from '../features/yourStockSlice.js';

function TickerBar() {
  const ticker = useSelector(selectYourStock);
  const logIn = useSelector(selectLogIn);

  function tickerColor(a, b) {
    let color = '';
    if (a > b) {
      color = 'green';
    } else if (a === b) {
      color = 'gray';
    } else {
      color = 'red';
    }
    return color;
  }

  function tickerDisplay(a, b) {
    let result = '';
    if (a > b) {
      result = `⬆️ ${(a * 0.01).toFixed(2)}`;
    } else if (a === b) {
      result = `${(a * 0.01).toFixed(2)}`;
    } else {
      result = `⬇️ ${(a * 0.01).toFixed(2)}`;
    }
    return result;
  }

  return (
    (!logIn) ? <div />
      : (ticker.length > 0
        && (
          <div className='tickerBar'>
            <Ticker mode='smooth' className='tickerBar_ticker'>
              {() => (
                <>
                  {ticker.map((example) => (
                    <div key={example.stock.ticker} className='tickerBar_line'>
                      <p>
                        {example.stock.ticker}
                        <span
                          className={
                            tickerColor(example.stock.current_price_per_share,
                              example.portfolio.price_per_share_at_purchase)
                          }
                        >
                          {tickerDisplay(example.stock.current_price_per_share,
                            example.portfolio.price_per_share_at_purchase)}
                        </span>
                      </p>
                    </div>
                  ))}
                </>
              )}
            </Ticker>
          </div>
        )

      )

  );
}

export default TickerBar;
