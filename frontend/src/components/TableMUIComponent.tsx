import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

interface TableMUIProps {
  titleRow: string[];
  //här har jag any då jag vill kunna ha vilken typ som helst? en card komponent, en bild, text osv?
  cellRows: any[];
  datacy: string;
}

const TableMUI: React.FC<TableMUIProps> = ({ titleRow, cellRows, datacy }) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table aria-label="simple table">
        <TableHead data-cy="product-form">
          <TableRow>
            {titleRow.map((title) => (
              <TableCell
                sx={{
                  backgroundColor: "#c9c7c7",
                  padding: 1.5,
                }}
                key={title}
              >
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {cellRows.map((row, rowIndex) => (
            <TableRow key={rowIndex} data-cy={datacy}>
              {row.map(
                (cell: { property: ""; datacyCell: "" }, cellIndex: number) => (
                  <TableCell
                    key={cellIndex}
                    data-cy={cell.datacyCell}
                    sx={{ fontSize: "12px", whiteSpace: "nowrap" }}
                  >
                    {cell.property}
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableMUI;
