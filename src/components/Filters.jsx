import React, { useState } from 'react';
import styles from './Filters.module.css';

function Filters({ onFilterChange }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [minDiscount, setMinDiscount] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        onFilterChange({ nume: e.target.value, minim_reducere: minDiscount, ridicare: pickupTime, tags: selectedTag });
    };

    const handleDiscountChange = (e) => {
        setMinDiscount(e.target.value);
        onFilterChange({ nume: searchTerm, minim_reducere: e.target.value, ridicare: pickupTime, tags: selectedTag });
    };

    const handlePickupChange = (e) => {
        setPickupTime(e.target.value);
        onFilterChange({ nume: searchTerm, minim_reducere: minDiscount, ridicare: e.target.value, tags: selectedTag });
    };

    const handleTagChange = (e) => {
        setSelectedTag(e.target.value);
        onFilterChange({ nume: searchTerm, minim_reducere: minDiscount, ridicare: pickupTime, tags: e.target.value });
    };

    return (
        <div className={styles.filtersContainer}>
            <input 
                type="text" 
                placeholder="cauta oferte..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            
            <div className={styles.selectGroup}>
                <select value={selectedTag} onChange={handleTagChange} className={styles.select}>
                    <option value="">toate categoriile</option>
                    <option value="patiserie">patiserie</option>
                    <option value="vegetarian">vegetarian</option>
                    <option value="pizza">pizza</option>
                    <option value="dulce">dulce</option>
                    <option value="mancare gatita">mancare gatita</option>
                    <option value="brutarie">brutarie</option>
                </select>

                <select value={minDiscount} onChange={handleDiscountChange} className={styles.select}>
                    <option value="">toate reducerile</option>
                    <option value="20">minim 20%</option>
                    <option value="50">minim 50%</option>
                </select>

                <select value={pickupTime} onChange={handlePickupChange} className={styles.select}>
                    <option value="">orice moment</option>
                    <option value="dimineata">dimineata</option>
                    <option value="pranz">pranz</option>
                    <option value="seara">seara</option>
                </select>
            </div>
        </div>
    );
}

export default Filters;