import React from "react";

import styles from './styles.module.css';

const Highlight = ({ json = "", python = "" }) => {
  return (
    <>
      <div className={styles.parserCode}>
        <h2 className={styles.parserTitle}>Parser code (Auto generated)</h2>
        <textarea className={styles.parserOutput} value={python}></textarea>
      </div>
      <div className={styles.testParser}>
        <h2 className={styles.testTitle}>Test parser output</h2>
        <textarea className={styles.testOutput}></textarea>
      </div>
    </>
  );
}

export default Highlight;