import React from 'react';

import styles from './style.module.css';

const GroupTooltip = ({ info = {}, handleGroupChangePopup = () => {}, values}) => {
  const { id = ""} = info;
  return (
    <div className={styles.tooltip} id="grouptooltip">
      <div className={styles.tooltipInfo}>
        <form className={styles.formWrapper}>
          <div className={styles.formGroup}>
            <div className={styles.inputField}>
              <input 
                type="text"
                placeholder=" "
                name="name"
                id={id}
                value={values.name}
                onChange={(e) => handleGroupChangePopup(e)} 
                className={styles.formControl} 
              />
              <label className={styles.formLabel}>Group Name</label>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GroupTooltip;
