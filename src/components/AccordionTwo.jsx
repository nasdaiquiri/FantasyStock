import {
  Accordion, AccordionDetails, AccordionSummary, Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import propTypes from 'prop-types';
import HomeAway from './Schedule/HomeAway.jsx';

const useStyles = makeStyles({
  icon: {
    color: 'white'
  }
});

function AccordionTwo({ title, games }) {
  AccordionTwo.propTypes = {
    title: propTypes.string.isRequired,
    games: propTypes.string.isRequired
  };
  const classes = useStyles();
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
        expandIcon={<ExpandMoreIcon className={classes.icon} />}
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
