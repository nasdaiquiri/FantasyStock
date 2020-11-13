import {
  Accordion, AccordionDetails, AccordionSummary, Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import propTypes from 'prop-types';
import HomeAway from './Schedule/HomeAway.jsx';

function AccordionTwo({ title, games }) {
  AccordionTwo.propTypes = {
    title: propTypes.string.isRequired,
    games: propTypes.string.isRequired
  };

  const [expanded, setExpanded] = useState(false);

  const handleAccordion = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <Accordion
      square
      expanded={expanded === 'leagueSettings'}
      onChange={handleAccordion('leagueSettings')}
    >
      <AccordionSummary
        aria-controls='panel1d-content'
        id='panel1d-header'
      >
        <Typography className='leagueInfo_members'>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <HomeAway games={games} />
      </AccordionDetails>
    </Accordion>
  );
}

export default AccordionTwo;
