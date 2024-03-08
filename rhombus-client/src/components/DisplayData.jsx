import React from "react";
import { useSelector } from "react-redux";
import "../Global.css";
import "./DisplayData.css"; // Import your new styles

export default function DisplayData() {
  const dataString = useSelector((state) => state.data.data);

  if (!dataString || dataString.length === 0) {
    return <p> </p>;
  }

  const data = JSON.parse(dataString);
  const columnNames = Object.keys(data);

  const rowData = columnNames.map((columnName) => data[columnName]);
  const tableheadings = columnNames.map(
    (columnName) => data[columnName].data_type
  );

  return (
    <div className="flex-col algn-cent display-data-container">
      <h1>File Data</h1>
      <table className="display-data-table">
        <thead>
          <tr>
            {columnNames.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
          <tr>
            {tableheadings.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowData.length > 0 &&
            rowData[0].content.map((_, rowIndex) => (
              <tr key={rowIndex}>
                {columnNames.map((col, colIndex) => (
                  <td key={colIndex}>{rowData[colIndex].content[rowIndex]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
