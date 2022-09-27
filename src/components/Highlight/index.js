import React from "react";
import Loading from '../Loading';
import styles from './styles.module.css';

const Highlight = ({ python = "", setPython = () => {}, testParser = "", loadingTest = false }) => {
  const handleChangePython = (e) => {
    const { value } = e.target;
    setPython(value);
  }
  
  return (
    <>
      <div className={styles.parserCode}>
        <h2 className={styles.parserTitle}>Parser code (Auto generated)</h2>
        <textarea className={styles.parserOutput} onChange={handleChangePython} value={python}></textarea>
      </div>
      <div className={styles.testParser}>
        <h2 className={styles.testTitle}>Test parser output</h2>
        <textarea className={styles.testOutput} value={testParser}></textarea>
        {loadingTest && (<Loading />)}
      </div>
    </>
  );
}

export default Highlight;