import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai'
import styles from './style.module.css';

const Tooltip = 
({ 
  info = {}, 
  handleChangePopup = () => {}, 
  handleSubmitTooltip = () => {}, 
  removeHighlightTextSelected = () => {},
  onClosePopup = () => {},
  values,
  isDisabled
}) => {
  const { id = "", lineNum = "", group = "", value = "", start = "", end = "" } = info;
  return (
    <div className={styles.tooltip} id="tooltip">
      <div className={styles.tooltipClose}>
        <Link to="#" onClick={onClosePopup}><AiOutlineClose style={{ color: "#000000" }} /></Link>
      </div>
      <div className={styles.tooltipInfo}>
        <h3 className={styles.tooltipTitle}>Selected Info</h3>
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
        <form className={styles.formWrapper} onSubmit={handleSubmitTooltip}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name</label>
            <input 
              type="text"
              placeholder=" "
              name="name"
              id={id}
              value={values.name}
              onChange={handleChangePopup} 
              className={styles.formControl} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Group</label>
            <input 
              type="text" 
              placeholder=" "
              name="group" 
              id={id} 
              value={values.group} 
              onChange={handleChangePopup} 
              className={styles.formControl} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Regex</label>
            <input 
              type="text"
              placeholder=" "
              name="regex" 
              id={id} 
              value={values.regex} 
              onChange={handleChangePopup} 
              className={styles.formControl} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <input 
              type="text" 
              placeholder=" "
              name="desc" 
              id={id} 
              value={values.desc} 
              onChange={handleChangePopup} 
              className={styles.formControl} 
            />
          </div>

          <div className={styles.formGroup}>
            <label for="type" className={styles.formLabel}>Type </label>
            <select className={styles.formSelect} value={values.type} name="type" id={id} onChange={handleChangePopup}>
              <option value="">Select type</option>
              <option value="IP Address">IP Address</option>
              <option value="Integer">Integer</option>
              <option value="Mac Address">Mac Address</option>
              <option value="String">String</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label for="optional" className={styles.formLabel}>Optional </label>
            <select className={styles.formSelect} value={values.optional} name="optional" id={id} onChange={handleChangePopup}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label for="ignore" className={styles.formLabel}>Ignore </label>
            <select className={styles.formSelect} value={values.ignore} name="ignore" id={id} onChange={handleChangePopup}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className={styles.btnGroup}>
            <button className={styles.btnSave} disabled={!isDisabled} onClick={(e) => handleSubmitTooltip(e, lineNum)}>Save</button>
            <button className={styles.btnUnselect} onClick={(e) => removeHighlightTextSelected(e, lineNum, id, false, group)}>Unselect</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Tooltip;
