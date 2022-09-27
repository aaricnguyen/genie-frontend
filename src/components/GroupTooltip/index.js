import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai'
import styles from './style.module.css';

const GroupTooltip = 
({ 
  info = {}, 
  handleGroupChangePopup = () => {}, 
  handleSubmitGroupTooltip = () => {}, 
  removeHighlightTextSelected = () => {},
  onCloseGroupPopup = () => {},
  values,
  isDisabled
}) => {
  const { id = "", lineNum = "", group = "" } = info;
  return (
    <div className={styles.tooltip} id="grouptooltip">
      <div className={styles.tooltipClose}>
        <Link to="#" onClick={onCloseGroupPopup}><AiOutlineClose style={{ color: "#000000" }} /></Link>
      </div>
      <div className={styles.tooltipInfo}>
        <h3 className={styles.tooltipTitle}>Group Selected Info</h3>
        <form className={styles.formWrapper} onSubmit={handleSubmitGroupTooltip}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">Group Name</label>
            <input 
              type="text"
              placeholder=" "
              name="name"
              id={id}
              value={values.name}
              onChange={handleGroupChangePopup} 
              className={styles.formControl} 
            />
          </div>

          <div className={styles.btnGroup}>
            <button className={styles.btnSave} disabled={!isDisabled} onClick={handleSubmitGroupTooltip}>Save</button>
            <button className={styles.btnUngroup} onClick={(e) => {removeHighlightTextSelected(e, lineNum, id, true, group)}}>Ungroup</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GroupTooltip;
