import React from "react";
import { isEmpty } from "lodash";
import Helmet from "react-helmet";
import Loading from '../Loading';
import PythonEditor from '../PythonEditor';
import styles from './styles.module.css';
import "brace/mode/python";
import "brace/theme/monokai";

const Highlight = 
({ 
  python = "", 
  setPython = () => {}, 
  testParser = "", 
  loadingTest = false,
  testParserError,
  pythonError
}) => {
  const handleChangePython = (e) => {
    const { value } = e.target;
    setPython(value);
  }
  
  return (
    <>
      <div className={styles.parserCode}>
        <h2 className={styles.parserTitle}>Parser code (Auto generated)</h2>
        {/* <textarea className={styles.parserOutput} onChange={handleChangePython} value={!isEmpty(pythonError) ? pythonError : python}></textarea> */}
        <Helmet>
          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.7.1/brython.min.js"
          />
          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.7.1/brython_stdlib.js"
          />
        </Helmet>
        <PythonEditor 
          className={styles.parserOutput} 
          theme="monokai" 
          mode="python" 
          onChange={handleChangePython} 
          python={!isEmpty(pythonError) ? pythonError : python} 
          width="100%"
          height="300px"
        />
      </div>
      <div className={styles.testParser}>
        <h2 className={styles.testTitle}>Test parser output</h2>
        <textarea className={styles.testOutput} value={!isEmpty(testParserError) ? testParserError : testParser}></textarea>
        {loadingTest && (<Loading />)}
      </div>
    </>
  );
}

export default Highlight;