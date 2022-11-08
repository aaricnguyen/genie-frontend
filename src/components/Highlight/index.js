import React from "react";
import { isEmpty } from "lodash";
import Loading from '../Loading';
import styles from './styles.module.css';
import Helmet from 'react-helmet';
import PythonEditor from "../PythonEditor";
import 'brace/mode/python';
const Highlight = 
({ 
  python = "", 
  setPython = () => {}, 
  testParser = "", 
  loadingTest = false,
  testParserError,
  pythonError
}) => {

  // function handleChangePython(e){
  //   const { value } = e.target;
  //   console.log(value)
  //   setPython(value);
  // }
  
  function onChange(newValue) {
    setPython(newValue);
  }
  return (
    <>
      <div className={styles.parserCode}>
        <h2 className={styles.parserTitle}>Parser code (Auto generated)</h2>
        {/* <textarea className={styles.parserOutput}  value={!isEmpty(pythonError) ? pythonError : python}></textarea> */}
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
          onChange={onChange}     
          python={!isEmpty(pythonError) ? pythonError : python} 
          width="100%"
          height="300px"
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        
        {/* <textarea className={styles.parserOutput} onChange={handleChangePython} value={!isEmpty(pythonError) ? pythonError : python}></textarea> */}
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