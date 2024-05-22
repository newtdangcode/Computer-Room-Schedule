import React, { useEffect, useState } from "react";

import { IconPrevious, IconNext } from "../icon";
import styles from "./styles.module.css";
import Pagination from "../Pagination";
function DataTableUseId({
  columnData,
  rowData = [],
  select = false,
  isSelectAll = false,
  isSelected = [],
  handleSelected,
  handleSelectAll,
  currentPage,
  setCurrentPage,
  nextPage,
  prevPage,
  totalPageCount,
  limitPerPage,
  setLimitPerPage,
}) {
  
  return (

    <React.Fragment>
      {rowData.length === 0 ? (
        <h1 className="text-center">Không có dữ liệu</h1>
      ) : (
        <div className="w-full overflow-hidden border border-gray-200 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 rounded-b-lg">
          <div className="w-full overflow-x-scroll">
            <table className="w-full whitespace-nowrap ">
              <thead className="text-xs font-semibold tracking-wide text-left text-white uppercase border-b border-gray-20 bg-primary">
                <tr>
                  {select ? (
                    <td className="px-4 py-3">
                      <input
                        className="h-[16px] w-[16px]"
                        id="selectAll"
                        name="selectAll"
                        type="checkbox"
                        checked={isSelectAll}
                        onChange={handleSelectAll}
                        disabled={rowData.length === 0}
                      />
                    </td>
                  ) : null}
                  <td className="px-4 py-3 text-center">STT</td>
                  {columnData.map((columnItem) => (
                    <td
                      key={columnItem.field}
                      className={`px-4 py-3 ${columnItem.customClassName ? columnItem.customClassName : ""}`}
                    >
                      {columnItem.headerName}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-10 text-gray-700">
                {rowData.map((rowItem, index) => (
                  <tr key={rowItem.id}>
                    {select? (
                      
                      <td className="px-4 py-3">
                        <input
                          className="h-[16px] w-[16px]"
                          id={rowItem.id}
                          name={rowItem.name}
                          type="checkbox"
                          onChange={(event) => handleSelected(event)}
                          checked={isSelected.includes(rowItem.id)}
                        />
                      </td>
                    ) : null}
                    <td className="px-4 py-3 text-sm text-center">{index + 1}</td>
                    {columnData.map((columnItem) => (
                      <td key={columnItem.field} className="px-4 py-3">
                        {columnItem.renderCell ? (
                          columnItem.renderCell(rowItem)
                        ) : (
                          <span className="text-sm">{rowItem[columnItem.field]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPageCount={totalPageCount}
            limitPerPage={limitPerPage}
            nextPage={nextPage}
            prevPage={prevPage}
            setLimitPerPage={setLimitPerPage}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default React.memo(DataTableUseId);
