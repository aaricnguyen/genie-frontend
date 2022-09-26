import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

import styles from './styles.module.css';

const ParserForm = ({ python = "", setPython = () => {} }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    setPython(value);
  }

  return (
    <div className={styles.parserCode}>
      <h2 className={styles.parserTitle}>Parser code (Auto generated)</h2>
      <CodeEditor   
        className={styles.parserOutput}
        onChange={handleChange}
        value={python}
        language="python"
      />
    </div>
  )
}

export default ParserForm;