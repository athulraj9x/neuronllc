import React, { useState, useMemo } from 'react';
import { UserListProps, User } from './types';
import { ROLE_PERMISSIONS } from './permissions';
import './UserList.css';

export const UserList: React.FC<UserListProps> = ({
  users,
  role,
  onEdit,
  onView,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const permissions = ROLE_PERMISSIONS[role];

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeClass = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'role-badge admin';
      case 'supervisor':
        return 'role-badge supervisor';
      case 'associate':
        return 'role-badge associate';
      default:
        return 'role-badge';
    }
  };

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Users ({filteredUsers.length})</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-results">
          <p>No users found matching your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Addresses</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-name">
                        <strong>{user.fullName}</strong>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="addresses-info">
                        {user.addresses.length} address{user.addresses.length !== 1 ? 'es' : ''}
                      </div>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        {permissions.canView && (
                          <button
                            onClick={() => onView(user)}
                            className="action-btn view-btn"
                            title="View User"
                          >
                            👁️
                          </button>
                        )}
                        {permissions.canEdit && (
                          <button
                            onClick={() => onEdit(user)}
                            className="action-btn edit-btn"
                            title="Edit User"
                          >
                            ✏️
                          </button>
                        )}
                        {permissions.canEdit && onDelete && role === 'admin' && (
                          <button
                            onClick={() => onDelete(user.id)}
                            className="action-btn delete-btn"
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
