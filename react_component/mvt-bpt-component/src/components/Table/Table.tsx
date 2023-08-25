import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';

// CSV parser
import Papa from 'papaparse';

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
  rowCount?: number,
  filename?: string,
  header: string[],
  data: (string | number)[][]
}

const BasicTable: React.FC<BasicTableProps> = ({ 
    minWidth=350, 
    rowCount=5, 
    filename="", 
    header, 
    data 
  }) => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(rowCount);
  const [headerRow, setHeaderRow] = React.useState<string[]>(header);
  const [dataRows, setDataRows] = React.useState<(string | number)[][]>(data);

  React.useEffect(() => {
    if (filename) {
      let parsed_csv_file_data: (string | number)[][] = []

      fetch('market_data/' + filename + '.csv')
        .then((response) => response.text())
        .then((text) => {
          Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
              results.data.map((d) => {
                parsed_csv_file_data.push(Object.values(d!));
              });
              setHeaderRow(() => results.meta.fields!);
              setDataRows(() => parsed_csv_file_data!);
            },
          });
        });
    }
  }, []);

  const visibleRows = React.useMemo(
    () =>
      dataRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [page, rowsPerPage],
  );
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataRows.length) : 0;

  return (
    <>
    <TableContainer component={Paper}>
      <Table 
        sx={{ minWidth: minWidth }} 
        aria-label="simple table">
        {/* Table header */}
        <TableHead>
          <TableRow>
            {
              headerRow.map((cell, cIndex) => (
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
          {visibleRows.map((row, rIndex) => (
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
          {emptyRows > 0 && (
            <StyledTableRow
              style={{
                height: 53 * emptyRows,
              }}>
              <TableCell />
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={dataRows.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
    </>
  );
}

export default BasicTable;
