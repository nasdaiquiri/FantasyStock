import React, { useState } from 'react';
import {
  TableCell,
  TableRow
} from '@material-ui/core';

function StandingsList({
  username,
  wins,
  losses,
  ties,
  index
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
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
      />
      <TableCell padding='checkbox' />
      <TableCell component='th' id={index} scope='row' padding='none'>
        {username}
      </TableCell>
      <TableCell align='right'>{wins}</TableCell>
      <TableCell align='right'>{losses}</TableCell>
      <TableCell align='right'>{ties}</TableCell>
    </>
  );
}

export default StandingsList;
