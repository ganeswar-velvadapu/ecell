// Sidebar.jsx
import React, { useState } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onClose, companies = [], onFilterChange }) => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const handleCompanyChange = (company) => {
    setSelectedCompanies(prevSelected => {
      const isCurrentlySelected = prevSelected.includes(company);
      const updatedSelection = isCurrentlySelected
        ? prevSelected.filter(c => c !== company)
        : [...prevSelected, company];
      
      if (onFilterChange) {
        onFilterChange(updatedSelection);
      }
      
      return updatedSelection;
    });
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarContainer}>
        {/* Header Section */}
        <div className={styles.sidebarHeader}>
          <h3 className={styles.filterTitle}>Filter by Company</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Filter Section */}
        <div className={styles.filterSection}>
          {companies.length > 0 ? (
            companies.map(company => (
              <label 
                key={company}
                className={styles.filterItem}
              >
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(company)}
                  onChange={() => handleCompanyChange(company)}
                  className={styles.checkbox}
                />
                <span className={styles.checkmark}></span>
                <span className={styles.companyName}>{company}</span>
              </label>
            ))
          ) : (
            <p className={styles.noCompanies}>No companies available</p>
          )}
        </div>

        {/* Footer Section */}
        <div className={styles.sidebarFooter}>
          <button
            className={styles.clearButton}
            onClick={() => setSelectedCompanies([])}
            disabled={selectedCompanies.length === 0}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;