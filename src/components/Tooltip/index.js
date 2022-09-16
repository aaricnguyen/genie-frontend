import React from 'react';

import styles from './style.module.css';

const Tooltip = ({ info = {}, handleChangePopup = () => {}, values }) => {
  const { id = "", lineNum = "", group = "", value = "", start = "", end = "" } = info;
  return (
    <div className={styles.tooltip} id="tooltip">
      <div className={styles.tooltipInfo}>
        <div className={styles.tooltipGroup}>
          <p className={styles.tooltipText}>Line number:</p>
          <span>{lineNum}</span>
        </div>
        <div className={styles.tooltipGroup}>
          <p className={styles.tooltipText}>Value:</p>
          <span>{value}</span>
        </div>
        <div className={styles.tooltipGroup}>
          <p className={styles.tooltipText}>Group:</p>
          <span>{group}</span>
        </div>
        <div className={styles.tooltipGroup}>
          <p className={styles.tooltipText}>Start position:</p>
          <span>{start}</span>
        </div>
        <div className={styles.tooltipGroup}>
          <p className={styles.tooltipText}>End position:</p>
          <span>{end}</span>
        </div>
        <form className={styles.formWrapper}>
          <div className={styles.formGroup}>
            <div className={styles.inputField}>
              <input 
                type="text"
                placeholder=" "
                name="name"
                id={id}
                value={values.name}
                onChange={(e) => handleChangePopup(e, lineNum)} 
                className={styles.formControl} 
              />
              <label className={styles.formLabel}>Name</label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <select className={styles.selectField} value={values.type} name="type" id={id} onChange={(e) => handleChangePopup(e, lineNum)}>
              <option>Select type</option>
              <option value="One Word">One Word</option>
              <option value="Complete line">Complete line</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputField}>
              <input 
                type="text"
                placeholder=" "
                name="regex" 
                id={id} 
                value={values.regex} 
                onChange={(e) => handleChangePopup(e, lineNum)} 
                className={styles.formControl} 
              />
              <label className={styles.formLabel}>Regex</label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputField}>
              <input 
                type="text" 
                placeholder=" "
                name="desc" 
                id={id} 
                value={values.desc} 
                onChange={(e) => handleChangePopup(e, lineNum)} 
                className={styles.formControl} 
              />
              <label className={styles.formLabel}>Description</label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <select className={styles.selectField} value={values.optional} name="optional" id={id} onChange={(e) => handleChangePopup(e, lineNum)}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <select className={styles.selectField} value={values.ignore} name="ignore" id={id} onChange={(e) => handleChangePopup(e, lineNum)}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Tooltip;
