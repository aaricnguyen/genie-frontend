import React from 'react';

import styles from './style.module.css';

const GroupTooltip = 
({ 
  info = {}, 
  handleGroupChangePopup = () => {}, 
  handleSubmitGroupTooltip = () => {}, 
  removeHighlightTextSelected = () => {},
  values
}) => {
  const { id = "", lineNum = "", group = "" } = info;
  return (
    <div className={styles.tooltip} id="grouptooltip">
      <div className={styles.tooltipInfo}>
        <form className={styles.formWrapper} onSubmit={handleSubmitGroupTooltip}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Group Name</label>
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
            <button className={styles.btnSave} onClick={handleSubmitGroupTooltip}>Save</button>
            <button className={styles.btnUngroup} onClick={(e) => {removeHighlightTextSelected(e, lineNum, id, true, group)}}>Ungroup</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GroupTooltip;
