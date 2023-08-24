import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface BasicTableProps {
  minWidth?: number,
  header: string[],
  rows: (string | number)[][]
}

const BasicTable: React.FC<BasicTableProps> = ({ minWidth=350, header, rows }) => {
  return (
    <TableContainer component={Paper}>
      <Table 
        sx={{ minWidth: minWidth }} 
        aria-label="simple table">
        {/* Table header */}
        <TableHead>
          <TableRow>
            {
              header.map((cell, cIndex) => (
                <StyledTableCell
                  key={cIndex}
                  align={cIndex == 0? undefined: 'right'}>
                  {cell}
                </StyledTableCell>
              ))
            }
          </TableRow>
        </TableHead>

        {/* Table rows */}
        <TableBody>
          {rows.map((row, rIndex) => (
            <StyledTableRow
              key={rIndex}
            >
              {
                row.map((cell, cIndex) => (
                  <TableCell 
                  key={cIndex}
                    component={cIndex == 0? "th": undefined} 
                    align={cIndex == 0? undefined: 'right'}
                    scope="row">
                    {cell}
                  </TableCell>
                ))
              }
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasicTable;
