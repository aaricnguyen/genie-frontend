import React from 'react';

import styles from './styles.module.css';

const TestForm = ({ testParser = "" }) => {
  return (
    <div className={styles.testParser}>
      <h2 className={styles.testTitle}>Test parser output</h2>
      <textarea className={styles.testOutput} value={testParser}></textarea>
    </div>
  )
}

export default TestForm;