import React, { useState, useEffect } from "react";
import "./Table.css";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const Table = ({ members, searchTerm }) => {
  const [membersState, setMembersState] = useState(members);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    setMembersState(members);
  }, [members]);

  useEffect(() => {
    // Apply search filter
    const filtered = membersState.filter((member) =>
      Object.values(member).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredMembers(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [membersState, searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!membersState || membersState.length === 0) {
    return <p>No data available.</p>; // Add a message when there's no data
  }

  const headers = Object.keys(membersState[0]);

  const handleRowClick = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  const handleEditClick = (id) => {
    setMembersState(
      membersState.map((member) =>
        member.id === id ? { ...member, isEditing: !member.isEditing } : member
      )
    );
  };
  const handleDeleteClick = (id) => {
    setMembersState(membersState.filter((member) => member.id !== id));
  };

  const handleInputChange = (e, id) => {
    const value = e.target.value;
    console.log(e.target);
    setMembersState(
      membersState.map((member) =>
        member.id === id
          ? { ...member, [e.target.name]: e.target.value }
          : member
      )
    );
  };

  const handleDeleteSelected = () => {
    setMembersState(
      membersState.filter((member) => !selectedRows.includes(member.id))
    );
    setSelectedRows([]); // Clear selection
  };

  const handleSelectAllClick = () => {
    const allIds = membersState.map((member) => member.id);
    const areAllSelected = selectedRows.length === allIds.length;

    if (areAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allIds);
    }
  };
  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === membersState.length}
                onChange={handleSelectAllClick}
              />
            </th>

            {headers.map(
              (header) =>
                header !== "isEditing" && <th key={header}>{header}</th>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map(
              (member) =>
                member.isEditing !== "isEditing" && (
                  <tr
                    key={member.id}
                    style={{
                      background: selectedRows.includes(member.id)
                        ? "#ccc"
                        : "transparent",
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(member.id)}
                        onChange={() => handleRowClick(member.id)}
                      />
                    </td>
                    {headers.map(
                      (header, index) =>
                        // Exclude isEditing field from rendering
                        header !== "isEditing" && (
                          <td key={index}>
                            {member.isEditing ? (
                              <input
                                type="text"
                                name={header}
                                value={member[header]}
                                onChange={(e) =>
                                  handleInputChange(e, member.id)
                                }
                              />
                            ) : (
                              member[header]
                            )}
                          </td>
                        )
                    )}
                    <td>
                      <button
                        onClick={() => handleEditClick(member.id)}
                        style={{
                          backgroundColor: "black",
                          borderRadius: 5,
                          margin: 2,
                        }}
                      >
                        {member.isEditing ? (
                          <FaCheck color="green" />
                        ) : (
                          <MdEdit color="white" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(member.id)}
                        style={{
                          backgroundColor: "black",
                          borderRadius: 5,
                          margin: 2,
                        }}
                      >
                        <MdDelete color="red" />
                      </button>
                    </td>
                  </tr>
                )
            )}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={headers.length + 2}>
              <button
                onClick={() => handleDeleteSelected(selectedRows)}
                style={{ color: "white", backgroundColor: "red" ,padding:10}}
              >
                Delete Selected
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(1)}>First Page</button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        {generatePageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next Page
        </button>
        <button onClick={() => handlePageChange(totalPages)}>Last Page</button>
      </div>
    </>
  );
};

export default Table;
