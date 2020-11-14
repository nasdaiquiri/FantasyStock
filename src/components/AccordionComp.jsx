import {
  Accordion, AccordionDetails, AccordionSummary, Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import propTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles({
  icon: {
    color: 'white'
  }
});

function AccordionComp({ Component, title }) {
  AccordionComp.propTypes = {
    Component: propTypes.func.isRequired,
    title: propTypes.string.isRequired
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
        {Component()}
      </AccordionDetails>
    </Accordion>
  );
}

export default AccordionComp;
