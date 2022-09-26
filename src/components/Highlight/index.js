import React from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

import styles from './styles.module.css';

const Highlight = ({ python = "", setPython = () => {}, testParser = "" }) => {
  const handleChangePython = (e) => {
    const { value } = e.target;
    setPython(value);
  }

  return (
    <>
      <div className={styles.parserCode}>
        <h2 className={styles.parserTitle}>Parser code (Auto generated)</h2>
        <CodeEditor   
          className={styles.parserOutput}
          onChange={handleChangePython}
          value={python}
          language="python"
          minHeight={300}
        />
      </div>
      <div className={styles.testParser}>
        <h2 className={styles.testTitle}>Test parser output</h2>
        <textarea className={styles.testOutput} value={testParser}></textarea>
      </div>
    </>
  );
}

export default Highlight;